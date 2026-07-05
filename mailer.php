<?php
/**
 * Century Adventures – Pure PHP SMTP Mailer
 * ─────────────────────────────────────────────────────────────────────────────
 * No external dependencies. Uses raw sockets for SSL/TLS handshake.
 * Works with Zoho Mail SMTP on port 465 (SSL) or 587 (STARTTLS).
 */

require_once __DIR__ . '/smtp-config.php';

class Mailer {

    private $socket;
    private $log = [];
    private $errors = [];

    /**
     * Send an email via Zoho SMTP.
     *
     * @param string       $toEmail     Recipient email address
     * @param string       $toName      Recipient display name
     * @param string       $subject     Email subject line
     * @param string       $htmlBody    Full HTML body content
     * @param string|null  $replyTo     Reply-To address (user's email)
     * @param string|null  $ccEmail     CC address (e.g. admin@)
     * @param array        $threading   Optional: ['message_id'=>'...','in_reply_to'=>'...','references'=>'...']
     * @return array ['success' => bool, 'log' => array, 'error' => string]
     */
    public function send(
        string $toEmail,
        string $toName,
        string $subject,
        string $htmlBody,
        ?string $replyTo = null,
        ?string $ccEmail = null,
        array $threading = [],
        ?string $fromEmail = null,
        ?string $fromName = null
    ): array {

        try {
            $this->connect();
            $this->authenticate();
            $this->sendMail($toEmail, $toName, $subject, $htmlBody, $replyTo, $ccEmail, $threading, $fromEmail, $fromName);
            $this->quit();
            return ['success' => true, 'log' => $this->log, 'error' => ''];
        } catch (Exception $e) {
            $this->errors[] = $e->getMessage();
            return ['success' => false, 'log' => $this->log, 'error' => $e->getMessage()];
        } finally {
            if (is_resource($this->socket)) {
                fclose($this->socket);
            }
        }
    }

    // ── Connection ────────────────────────────────────────────────────────────

    private function connect(): void {
        $host = SMTP_SECURE === 'ssl' ? 'ssl://' . SMTP_HOST : SMTP_HOST;
        $port = SMTP_PORT;

        $context = stream_context_create([
            'ssl' => [
                'verify_peer'       => false,
                'verify_peer_name'  => false,
                'allow_self_signed' => true,
            ]
        ]);

        $this->socket = stream_socket_client(
            "$host:$port",
            $errno,
            $errstr,
            30,
            STREAM_CLIENT_CONNECT,
            $context
        );

        if (!$this->socket) {
            throw new Exception("Connection failed: [$errno] $errstr");
        }

        stream_set_timeout($this->socket, 30);
        $this->read('220');

        // Send EHLO
        $this->write('EHLO ' . gethostname());
        $this->read('250');

        // If STARTTLS, upgrade the connection
        if (SMTP_SECURE === 'tls') {
            $this->write('STARTTLS');
            $this->read('220');
            if (!stream_socket_enable_crypto($this->socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
                throw new Exception('STARTTLS negotiation failed.');
            }
            $this->write('EHLO ' . gethostname());
            $this->read('250');
        }
    }

    // ── Authentication ────────────────────────────────────────────────────────

    private function authenticate(): void {
        $this->write('AUTH LOGIN');
        $this->read('334');

        $this->write(base64_encode(SMTP_USER));
        $this->read('334');

        $this->write(base64_encode(SMTP_PASS));
        $this->read('235'); // 235 = Authentication successful
    }

    // ── Build & Send Message ──────────────────────────────────────────────────

    private function sendMail(
        string $toEmail,
        string $toName,
        string $subject,
        string $htmlBody,
        ?string $replyTo,
        ?string $ccEmail,
        array $threading = [],
        ?string $fromEmail = null,
        ?string $fromName = null
    ): void {

        // Envelope sender MUST remain the authenticated Zoho email address (SMTP_FROM)
        $envelopeFrom = SMTP_FROM;

        // Custom display headers
        $headerFrom = $fromEmail ?: SMTP_FROM;
        $headerFromName = $fromName ?: SMTP_FROM_NAME;

        $fromEnc = $this->encodeHeader($headerFromName);
        $toEnc   = $this->encodeHeader($toName);

        // MAIL FROM
        $this->write("MAIL FROM:<$envelopeFrom>");
        $this->read('250');

        // RCPT TO (primary recipient)
        $this->write("RCPT TO:<$toEmail>");
        $this->read('250');

        // RCPT TO (CC)
        if ($ccEmail) {
            $this->write("RCPT TO:<$ccEmail>");
            $this->read('250');
        }

        // DATA
        $this->write('DATA');
        $this->read('354');

        // Build headers + body
        $boundary  = '----=_Part_' . md5(uniqid());
        $plainText = strip_tags(str_replace(['<br>', '<br/>', '<br />'], "\n", $htmlBody));
        $plainText = html_entity_decode($plainText, ENT_QUOTES, 'UTF-8');

        $headers  = "From: $fromEnc <$headerFrom>\r\n";
        $headers .= "To: $toEnc <$toEmail>\r\n";
        if ($ccEmail) {
            $headers .= "Cc: $ccEmail\r\n";
        }
        // Use custom replyTo if provided, otherwise default to the headerFrom
        $actualReplyTo = $replyTo ?: $headerFrom;
        $headers .= "Reply-To: <$actualReplyTo>\r\n";
        if (!empty($threading['message_id'])) {
            $headers .= "Message-ID: " . $threading['message_id'] . "\r\n";
        }
        if (!empty($threading['in_reply_to'])) {
            $headers .= "In-Reply-To: " . $threading['in_reply_to'] . "\r\n";
        }
        if (!empty($threading['references'])) {
            $headers .= "References: " . $threading['references'] . "\r\n";
        }
        $headers .= "Subject: " . $this->encodeHeader($subject) . "\r\n";
        $headers .= "MIME-Version: 1.0\r\n";
        $headers .= "Content-Type: multipart/alternative; boundary=\"$boundary\"\r\n";
        $headers .= "X-Mailer: CenturyAdventures-PHP-Mailer/1.0\r\n";
        $headers .= "Date: " . date('r') . "\r\n";

        $body  = "--$boundary\r\n";
        $body .= "Content-Type: text/plain; charset=UTF-8\r\n";
        $body .= "Content-Transfer-Encoding: quoted-printable\r\n\r\n";
        $body .= $this->quotedPrintableEncode($plainText) . "\r\n\r\n";

        $body .= "--$boundary\r\n";
        $body .= "Content-Type: text/html; charset=UTF-8\r\n";
        $body .= "Content-Transfer-Encoding: quoted-printable\r\n\r\n";
        $body .= $this->quotedPrintableEncode($htmlBody) . "\r\n\r\n";

        $body .= "--$boundary--\r\n";

        $this->write($headers . "\r\n" . $body);
        $this->write('.');
        $this->read('250');
    }

    // ── SMTP Session End ──────────────────────────────────────────────────────

    private function quit(): void {
        $this->write('QUIT');
        $this->read('221');
    }

    // ── I/O Helpers ───────────────────────────────────────────────────────────

    private function write(string $cmd): void {
        $line = $cmd . "\r\n";
        // Mask password in logs
        $logLine = (strpos($cmd, base64_encode(SMTP_PASS)) !== false) ? '****PASS****' : rtrim($cmd);
        $this->log[] = ">> $logLine";
        fwrite($this->socket, $line);
    }

    private function read(string $expectedCode): string {
        $response = '';
        while ($line = fgets($this->socket, 512)) {
            $response .= $line;
            $this->log[] = '<< ' . rtrim($line);
            // Multi-line responses have '-' after the code; single-line has ' '
            if (strlen($line) >= 4 && $line[3] === ' ') {
                break;
            }
        }
        $code = substr($response, 0, 3);
        if ($code !== $expectedCode) {
            throw new Exception("Expected $expectedCode, got $code: $response");
        }
        return $response;
    }

    // ── Encoding Utilities ────────────────────────────────────────────────────

    private function encodeHeader(string $text): string {
        if (preg_match('/[^\x20-\x7E]/', $text)) {
            return '=?UTF-8?B?' . base64_encode($text) . '?=';
        }
        return $text;
    }

    private function quotedPrintableEncode(string $str): string {
        return quoted_printable_encode($str);
    }
}

// ── Email Template Builder ────────────────────────────────────────────────────

function buildEmailTemplate(string $title, string $preheader, string $body): string {
    $year = date('Y');
    return <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{$title}</title>
<style>
  body { margin:0; padding:0; background:#f4f4f4; font-family: 'Helvetica Neue', Arial, sans-serif; }
  .wrapper { max-width:620px; margin:30px auto; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 24px rgba(0,0,0,0.08); }
  .header { background:linear-gradient(135deg,#004225 0%,#006837 100%); padding:36px 40px; text-align:center; }
  .header h1 { color:#ffffff; font-size:22px; margin:0; letter-spacing:1px; }
  .header .gold { color:#c5a044; }
  .content { padding:40px; color:#333; font-size:15px; line-height:1.7; }
  .content h2 { color:#004225; font-size:18px; margin-top:0; }
  .field-row { margin-bottom:16px; border-bottom:1px solid #f0f0f0; padding-bottom:16px; }
  .field-label { font-size:11px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:#888; margin-bottom:4px; }
  .field-value { color:#222; font-size:15px; }
  .badge { display:inline-block; background:#004225; color:#fff; font-size:11px; font-weight:700; padding:4px 12px; border-radius:20px; letter-spacing:1px; text-transform:uppercase; margin-bottom:24px; }
  .footer { background:#f9f9f9; border-top:1px solid #eee; padding:24px 40px; text-align:center; font-size:12px; color:#aaa; }
  .footer a { color:#c5a044; text-decoration:none; }
</style>
</head>
<body>
<span style="display:none;font-size:1px;color:#f4f4f4">{$preheader}</span>
<div class="wrapper">
  <div class="header">
    <h1>🦁 <span class="gold">CENTURY</span> ADVENTURES</h1>
  </div>
  <div class="content">
    {$body}
  </div>
  <div class="footer">
    &copy; {$year} Century Adventures Tanzania. All rights reserved.<br>
    Ohio Street, Dar es Salaam, Tanzania |
    <a href="https://century-adventures.com">century-adventures.com</a>
  </div>
</div>
</body>
</html>
HTML;
}
