<?php
/**
 * Century Adventures – Inbound Email Parser (Webhook)
 * ─────────────────────────────────────────────────────────────────────────────
 * Receives incoming customer email replies and automatically appends them 
 * to the corresponding ticket based on Threading Headers or Subject Ticket ID.
 */

require_once __DIR__ . '/ticket-system.php';

// Log for debugging
$rawInput = file_get_contents('php://input');
file_put_contents(__DIR__ . '/inbound_email_log.txt', "[" . date('Y-m-d H:i:s') . "] Received Inbound Email webhook\n", FILE_APPEND);

// 1. Determine payload format
$contentType = $_SERVER['CONTENT_TYPE'] ?? '';
$data = [];
if (str_contains($contentType, 'application/json')) {
    $data = json_decode($rawInput, true) ?? [];
} else {
    // Standard form-data/urlencoded
    $data = $_POST;
}

// 2. Extract sender, subject, and text content
$fromEmail = '';
$fromName  = 'Customer';
$subject   = '';
$body      = '';
$inReplyTo = '';
$references= '';

// Check headers block if present
if (isset($data['headers'])) {
    $headers = is_array($data['headers']) ? $data['headers'] : parseHeadersString($data['headers']);
    $inReplyTo  = $headers['In-Reply-To'] ?? $headers['in-reply-to'] ?? '';
    $references = $headers['References']  ?? $headers['references']  ?? '';
}

// Extract email from 'from' header or direct field
$fromHeader = $data['from'] ?? $data['sender'] ?? '';
if (preg_match('/(.*?)<(.*?)>/', $fromHeader, $matches)) {
    $fromName  = trim($matches[1], " \"'");
    $fromEmail = trim($matches[2]);
} else {
    $fromEmail = trim($fromHeader);
}

$subject = $data['subject'] ?? '';
$body    = $data['plain'] ?? $data['text'] ?? $data['body'] ?? '';

// If raw MIME input received
if (empty($fromEmail) && !empty($rawInput)) {
    $parsed = parseRawEmail($rawInput);
    $fromEmail  = $parsed['from_email'];
    $fromName   = $parsed['from_name'];
    $subject    = $parsed['subject'];
    $body       = $parsed['body'];
    $inReplyTo  = $parsed['in_reply_to'];
    $references = $parsed['references'];
}

// 3. Find matching Ticket ID
$ticketId = null;

// Search Method A: Parse In-Reply-To Header
if ($inReplyTo) {
    $ticketId = parseTicketIdFromMessageId($inReplyTo);
}
// Search Method B: Parse References Header
if (!$ticketId && $references) {
    $ticketId = parseTicketIdFromMessageId($references);
}
// Search Method C: Parse Subject Line
if (!$ticketId && $subject) {
    $ticketId = parseTicketIdFromSubject($subject);
}

if (!$ticketId) {
    file_put_contents(__DIR__ . '/inbound_email_log.txt', "[-] Warning: No matching ticket ID found in subject: \"$subject\" or headers.\n", FILE_APPEND);
    http_response_code(200);
    exit;
}

// 4. Retrieve original ticket
$ticket = getTicketById($ticketId);
if (!$ticket) {
    file_put_contents(__DIR__ . '/inbound_email_log.txt', "[-] Warning: Ticket ID $ticketId not found in database.\n", FILE_APPEND);
    http_response_code(200);
    exit;
}

// 5. Clean message body
$cleanBody = stripEmailHistory($body);
if (empty($cleanBody)) {
    $cleanBody = trim($body);
}

// 6. Append message to ticket conversation
$convId = $ticket['conv_id'];
$now = time();
$msgEntry = [
    'id'        => 'msg-' . $now . '-reply-visitor',
    'sender'    => 'visitor',
    'text'      => $cleanBody,
    'timestamp' => $now * 1000,
];

appendTicketMessage($convId, $msgEntry, $fromName, $fromEmail, $ticket['form_type']);
updateTicketStatus($ticketId, 'open');

// Log success
file_put_contents(__DIR__ . '/inbound_email_log.txt', "[+] Success: Appended email reply to Ticket $ticketId (from: $fromEmail)\n", FILE_APPEND);
echo json_encode(['success' => true, 'message' => "Appended reply to Ticket $ticketId"]);
exit;

// Helpers
function parseHeadersString($str) {
    $headers = [];
    $lines = explode("\n", $str);
    foreach ($lines as $line) {
        if (str_contains($line, ':')) {
            list($key, $val) = explode(':', $line, 2);
            $headers[trim($key)] = trim($val);
        }
    }
    return $headers;
}

function parseRawEmail($raw) {
    $parts = explode("\r\n\r\n", $raw, 2);
    $headerStr = $parts[0] ?? '';
    $bodyStr   = $parts[1] ?? '';

    $headers = parseHeadersString($headerStr);
    $fromHeader = $headers['From'] ?? $headers['from'] ?? '';
    $fromEmail = '';
    $fromName = '';
    if (preg_match('/(.*?)<(.*?)>/', $fromHeader, $matches)) {
        $fromName  = trim($matches[1], " \"'");
        $fromEmail = trim($matches[2]);
    } else {
        $fromEmail = trim($fromHeader);
    }

    $body = $bodyStr;
    if (isset($headers['Content-Type']) && str_contains($headers['Content-Type'], 'boundary')) {
        preg_match('/boundary="?(.*?)"?(\s|$)/i', $headers['Content-Type'], $bMatch);
        $boundary = $bMatch[1] ?? '';
        if ($boundary) {
            $multiparts = explode('--' . $boundary, $bodyStr);
            foreach ($multiparts as $part) {
                if (str_contains($part, 'Content-Type: text/plain')) {
                    $subparts = explode("\r\n\r\n", $part, 2);
                    $body = $subparts[1] ?? $part;
                    break;
                }
            }
        }
    }

    return [
        'from_email'  => $fromEmail,
        'from_name'   => $fromName,
        'subject'     => $headers['Subject'] ?? $headers['subject'] ?? '',
        'body'        => trim($body),
        'in_reply_to' => $headers['In-Reply-To'] ?? $headers['in-reply-to'] ?? '',
        'references'  => $headers['References'] ?? $headers['references'] ?? '',
    ];
}
