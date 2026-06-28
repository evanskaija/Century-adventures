<?php
/**
 * Century Adventures – Chat Message Endpoint (Public)
 * Allows visitors to send follow-up messages in their active chat session.
 */

require_once __DIR__ . '/smtp-config.php';
require_once __DIR__ . '/ticket-system.php';

header('Content-Type: application/json; charset=utf-8');

// CORS
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, ALLOWED_ORIGINS, true)) {
    header("Access-Control-Allow-Origin: $origin");
    header('Access-Control-Allow-Credentials: true');
}
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(204);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit;
}

$raw = file_get_contents('php://input');
$body = json_decode($raw, true) ?? [];

$convId = trim($body['conv_id'] ?? '');
$text = trim($body['text'] ?? '');
$name = trim($body['name'] ?? 'Valued Guest');
$email = filter_var(trim($body['email'] ?? ''), FILTER_VALIDATE_EMAIL);

if (!$convId || !$text) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Conversation ID and message text are required.']);
    exit;
}

// Lookup ticket to confirm details
$ticket = getTicketByConvId($convId);
if ($ticket) {
    if (!$email && !empty($ticket['customer_email'])) {
        $email = $ticket['customer_email'];
    }
    if ($name === 'Valued Guest' && !empty($ticket['customer_name'])) {
        $name = $ticket['customer_name'];
    }
    $dept = $ticket['form_type'] ?? 'info';
} else {
    $dept = 'info';
}

$msgEntry = [
    'id' => 'msg-' . time() . '-visitor',
    'sender' => 'visitor',
    'text' => $text,
    'timestamp' => time() * 1000
];

try {
    appendTicketMessage($convId, $msgEntry, $name, $email, $dept);
    echo json_encode(['success' => true, 'message' => 'Message saved.']);
} catch (Exception $e) {
    error_log('[CenturyAdv] Public chat message error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to save message.']);
}
