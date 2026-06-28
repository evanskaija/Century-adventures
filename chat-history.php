<?php
/**
 * Century Adventures – Chat History Endpoint (Public)
 * Allows visitors to fetch the latest messages for their conversation.
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
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(204);
}

$convId = trim($_GET['conv_id'] ?? '');

if (!$convId) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'conv_id is required.']);
    exit;
}

try {
    $db = getTicketDb();
    $stmt = $db->prepare("SELECT messages FROM conversations WHERE conv_id = :id");
    $stmt->execute([':id' => $convId]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($row) {
        $messages = json_decode($row['messages'], true) ?? [];
        echo json_encode(['success' => true, 'messages' => $messages]);
    } else {
        echo json_encode(['success' => true, 'messages' => []]);
    }
} catch (Exception $e) {
    error_log('[CenturyAdv] Public chat history error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to fetch history.']);
}
