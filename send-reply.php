<?php
/**
 * Century Adventures – Admin Reply Endpoint
 * ─────────────────────────────────────────────────────────────────────────────
 * Sends a staff reply email to the customer and saves it to the database.
 * Threaded using Message-ID and In-Reply-To headers.
 *
 * POST /send-reply.php
 */

require_once __DIR__ . '/smtp-config.php';
require_once __DIR__ . '/mailer.php';
require_once __DIR__ . '/ticket-system.php';

// ── CORS & Headers ────────────────────────────────────────────────────────────
header('Content-Type: application/json; charset=utf-8');

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, ALLOWED_ORIGINS, true)) {
    header("Access-Control-Allow-Origin: $origin");
    header('Access-Control-Allow-Credentials: true');
}
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Admin-Passcode');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// ── Parse & Auth ──────────────────────────────────────────────────────────────
$raw  = file_get_contents('php://input');
$body = json_decode($raw, true) ?? [];

$ADMIN_PASSCODE = 'centuryadmin';
$passcode = $body['passcode'] ?? $_SERVER['HTTP_X_ADMIN_PASSCODE'] ?? '';
if ($passcode !== $ADMIN_PASSCODE) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

// ── Validate & Database Fallback for Email ─────────────────────────────────────
$convId         = trim($body['conv_id'] ?? '');
$customerEmail  = filter_var(trim($body['customer_email'] ?? ''), FILTER_VALIDATE_EMAIL);
$customerName   = trim(strip_tags($body['customer_name'] ?? 'Valued Guest'));
$replyText      = trim($body['reply_text'] ?? '');
$formType       = trim($body['form_type'] ?? 'contact');
$submissionId   = intval($body['submission_id'] ?? 0);
$ticketRef      = trim($body['ticket_ref'] ?? '');

// ── Prioritize Database Lookup for Customer Email ─────────────────────────────
if ($convId) {
    $ticket = getTicketByConvId($convId);
    if ($ticket && !empty($ticket['customer_email'])) {
        $customerEmail = filter_var(trim($ticket['customer_email']), FILTER_VALIDATE_EMAIL);
        if (!empty($ticket['customer_name'])) {
            $customerName = trim($ticket['customer_name']);
        }
        if (!empty($ticket['form_type'])) {
            $formType = trim($ticket['form_type']);
        }
    }
}

// Fallback to request parameters if DB did not yield email
if (!$customerEmail) {
    $customerEmail = filter_var(trim($body['customer_email'] ?? ''), FILTER_VALIDATE_EMAIL);
}

// 5. Verify customer_email exists. If missing: return explicit JSON error message
if (!$customerEmail) {
    echo json_encode([
        'success' => false,
        'message' => 'Cannot send reply. Customer email not found.'
    ]);
    exit;
}

if (!$replyText) {
    echo json_encode([
        'success' => false,
        'message' => 'Reply text cannot be empty.'
    ]);
    exit;
}

// ── Ticket Lookup / Initialization ────────────────────────────────────────────
try {
    if ($convId) {
        $ticket = getTicketByConvId($convId);
        if ($ticket) {
            $ticketId = $ticket['ticket_id'];
        } else {
            $ticketId = ensureTicket($convId, $customerName, $customerEmail, 'Inquiry Reply', $formType, 'replied');
        }
    } else {
        $convId = 'conv-' . time() . '-' . rand(1000, 9999);
        $ticketId = ensureTicket($convId, $customerName, $customerEmail, 'Inquiry Reply', $formType, 'replied');
    }
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Database Connection Failed',
        'error_detail' => $e->getMessage()
    ]);
    exit;
}

// ── Determine Department and Force Sender Email to Admin ─────────────────────
$deptCode = 'info';
if (isset($ticket['form_type'])) {
    $deptCode = $ticket['form_type'];
} else {
    $deptCode = $formType;
}

// Canonical department mapping
$canonicalDept = match(strtolower(trim($deptCode))) {
    'booking', 'bookings', 'quote' => 'booking',
    'safari_inquiry', 'destination_inquiry', 'enquiry', 'visit', 'planner' => 'visit',
    'support', 'support_request', 'live_chat_offline', 'chat_offline' => 'support',
    'report', 'admin', 'website', 'issue', 'feedback' => 'admin',
    default => 'info'
};

$deptLabels = [
    'booking' => 'Bookings & Reservations',
    'visit'   => 'Destination & Trip Planning',
    'support' => 'Customer Support',
    'info'    => 'General Contact',
    'admin'   => 'Website Administration'
];
$friendlyDeptLabel = $deptLabels[$canonicalDept] ?? 'General Inquiries';

$fromEmail = match($canonicalDept) {
    'booking' => 'bookings@century-adventures.com',
    'visit'   => 'visit@century-adventures.com',
    'support' => 'support@century-adventures.com',
    'admin'   => 'admin@century-adventures.com',
    default   => 'admin@century-adventures.com'
};

$fromLabel = 'Century Adventures ' . $friendlyDeptLabel;

// ── Build Subject Line ─────────────────────────────────────────────────────────
$subject = "Re: Your Inquiry #$ticketId";

// ── Build Beautiful Reply Email ───────────────────────────────────────────────
$htmlReply = nl2br(htmlspecialchars($replyText));
$emailBody = buildEmailTemplate(
    $subject,
    "Reply from Century Adventures regarding your inquiry $ticketId",
    "
    <h2 style='color:#004225; margin-top:0;'>Reply to Your Inquiry</h2>
    <p>Hello <strong>$customerName</strong>,</p>
    <div style='background:#f8fffe; border-left:4px solid #004225; padding:18px 22px; border-radius:0 12px 12px 0; margin:24px 0; font-size:15px; line-height:1.7; color:#1e293b;'>
        $htmlReply
    </div>
    <p style='font-size:13px; color:#888; margin-top:24px; border-top:1px solid #eee; padding-top:16px;'>
        This is a reply to your inquiry <strong>$ticketId</strong> submitted through Century Adventures.
        <br>To respond, simply reply to this email or contact us at
        <a href='mailto:$fromEmail' style='color:#c5a044;'>$fromEmail</a>.
    </p>
    <p>Best regards,<br><strong>$fromLabel</strong><br>
       <span style='color:#c5a044;'>🦁 Century Adventures Tanzania</span><br>
       📞 +255 747 115 390 | 🌐 century-adventures.com
    </p>"
);

// ── Build Threading Headers ───────────────────────────────────────────────────
$initialMsgId = buildInitialMessageId($ticketId);
$replyMsgId   = buildReplyMessageId($ticketId);
$threading = [
    'message_id'  => $replyMsgId,
    'in_reply_to' => $initialMsgId,
    'references'  => $initialMsgId,
];

// ── Save Reply to Database FIRST (Always save to portal) ─────────────────────
$msgEntry = [
    'id'        => 'msg-' . time() . '-staff',
    'sender'    => 'staff',
    'text'      => $replyText,
    'timestamp' => time() * 1000,
    'from'      => $deptCode,
];

$dbSaved = false;
try {
    // Append to ticket tables and sync conversations
    appendTicketMessage($convId, $msgEntry, $customerName, $customerEmail);
    updateTicketStatus($ticketId, 'replied');

    // Also update submission status if ID provided
    if ($submissionId > 0) {
        $db = getTicketDb();
        $db->prepare("UPDATE submissions SET status = 'replied' WHERE id = :id")
           ->execute([':id' => $submissionId]);
    }

    // Save reply in dedicated replies log table
    $db = getTicketDb();
    ensureRepliesTable($db);
    $db->prepare("
        INSERT INTO replies (conv_id, submission_id, customer_email, customer_name, reply_text, from_email, sent_at)
        VALUES (:conv_id, :sub_id, :email, :name, :text, :from_email, datetime('now'))
    ")->execute([
        ':conv_id'    => $convId,
        ':sub_id'     => $submissionId ?: null,
        ':email'      => $customerEmail,
        ':name'       => $customerName,
        ':text'       => $replyText,
        ':from_email' => $fromEmail,
    ]);
    $dbSaved = true;
} catch (Exception $e) {
    error_log('[CenturyAdv] DB save reply error: ' . $e->getMessage());
}

// ── Send the Email ────────────────────────────────────────────────────────────
$mailer = new Mailer();
$emailSent = false;
$emailError = '';

try {
    $result = $mailer->send($customerEmail, $customerName, $subject, $emailBody, $fromEmail, EMAIL_ADMIN, $threading, $fromEmail, $fromLabel);
    if ($result['success']) {
        $emailSent = true;
    } else {
        $emailError = $result['error'];
        error_log('[CenturyAdv] Reply mail error: ' . $emailError);
        if (!empty($result['log'])) {
            error_log("[CenturyAdv] SMTP SESSION LOG:\n" . implode("\n", $result['log']));
        }
    }
} catch (Exception $ex) {
    $emailError = $ex->getMessage();
    error_log('[CenturyAdv] Reply mail exception: ' . $emailError);
}

if ($emailSent) {
    echo json_encode([
        'success' => true,
        'message' => "Reply sent successfully to $customerEmail",
        'from'    => $fromEmail,
        'msg'     => $msgEntry,
    ]);
} else {
    $friendlyError = 'SMTP Connection Failed';
    $errLower = strtolower($emailError);
    if (str_contains($errLower, 'auth') || str_contains($errLower, '235') || str_contains($errLower, '535') || str_contains($errLower, 'password')) {
        $friendlyError = 'SMTP Authentication Failed';
    } elseif (str_contains($errLower, 'timeout') || str_contains($errLower, 'timed out') || str_contains($errLower, 'timedout')) {
        $friendlyError = 'SMTP Connection Timed Out';
    } elseif ($emailError) {
        $friendlyError = $emailError;
    }
    
    echo json_encode([
        'success' => false,
        'email_failed' => true,
        'message' => $friendlyError,
        'error_detail' => $emailError,
        'from'    => $fromEmail,
        'msg'     => $msgEntry,
    ]);
}
exit;


// ════════════════════════════════════════════════════════════════════════════
// HELPERS
// ════════════════════════════════════════════════════════════════════════════

function ensureRepliesTable(PDO $db): void {
    $db->exec("
        CREATE TABLE IF NOT EXISTS replies (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            conv_id         TEXT,
            submission_id   INTEGER,
            customer_email  TEXT,
            customer_name   TEXT,
            reply_text      TEXT,
            from_email      TEXT,
            sent_at         TEXT DEFAULT (datetime('now'))
        );
    ");
}
