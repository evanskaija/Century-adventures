<?php
/**
 * Century Adventures – Admin Sync Endpoint
 * ─────────────────────────────────────────────────────────────────────────────
 * Allows the admin panel to push localStorage conversation/booking data
 * into the database and pull updates back.
 *
 * POST /sync-data.php
 * Body (JSON):
 *   {
 *     "passcode":      "centuryadmin",
 *     "action":        "push_conversations" | "push_bookings" | "update_status" | "mark_read",
 *     "conversations": [...],   // for push_conversations
 *     "bookings":      [...],   // for push_bookings
 *     "id":            123,     // for update_status / mark_read
 *     "status":        "resolved"
 *   }
 */

require_once __DIR__ . '/smtp-config.php';

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

// ── Auth ──────────────────────────────────────────────────────────────────────
$ADMIN_PASSCODE = 'centuryadmin';

$raw  = file_get_contents('php://input');
$body = json_decode($raw, true) ?? [];

$passcode = $body['passcode'] ?? $_SERVER['HTTP_X_ADMIN_PASSCODE'] ?? '';
if ($passcode !== $ADMIN_PASSCODE) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

// ── Database ──────────────────────────────────────────────────────────────────
function getDb(): PDO {
    $pdo = new PDO('sqlite:' . DB_PATH);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $pdo->exec("
        CREATE TABLE IF NOT EXISTS submissions (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            form_type   TEXT NOT NULL,
            name        TEXT,
            email       TEXT,
            phone       TEXT,
            subject     TEXT,
            message     TEXT,
            extra_data  TEXT,
            ip          TEXT,
            created_at  TEXT DEFAULT (datetime('now')),
            status      TEXT DEFAULT 'new'
        );
        CREATE TABLE IF NOT EXISTS conversations (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            conv_id     TEXT UNIQUE,
            visitor_id  TEXT,
            category_id TEXT,
            messages    TEXT,
            status      TEXT DEFAULT 'open',
            created_at  TEXT DEFAULT (datetime('now')),
            updated_at  TEXT DEFAULT (datetime('now'))
        );
    ");

    return $pdo;
}

$action = $body['action'] ?? '';

switch ($action) {

    // ── Push conversations from localStorage to DB (DEPRECATED - Single Source of Truth Enabled) ──
    case 'push_conversations':
        jsonSuccess("Sync push ignored. Server database is the single source of truth.");
        break;

    // ── Push bookings from localStorage to DB (DEPRECATED - Single Source of Truth Enabled) ──
    case 'push_bookings':
        jsonSuccess("Sync push ignored. Server database is the single source of truth.");
        break;

    // ── Update submission status (e.g. open → resolved) ──────────────────────
    case 'update_status':
        $id     = intval($body['id'] ?? 0);
        $status = preg_replace('/[^a-z_]/', '', strtolower($body['status'] ?? 'new'));
        if (!$id) jsonError('id required.');
        $db = getDb();
        $db->prepare("UPDATE submissions SET status = :status WHERE id = :id")
           ->execute([':status' => $status, ':id' => $id]);
        jsonSuccess("Submission #$id updated to '$status'.");
        break;

    // ── Update conversation status ────────────────────────────────────────────
    case 'update_conv_status':
        $convId = $body['conv_id'] ?? '';
        $status = preg_replace('/[^a-z_]/', '', strtolower($body['status'] ?? 'open'));
        if (!$convId) jsonError('conv_id required.');
        $db = getDb();
        $db->prepare("UPDATE conversations SET status = :status, updated_at = datetime('now') WHERE conv_id = :id")
           ->execute([':status' => $status, ':id' => $convId]);
        jsonSuccess("Conversation $convId updated to '$status'.");
        break;

    // ── Add admin reply to a conversation ─────────────────────────────────────
    case 'add_reply':
        $convId = $body['conv_id'] ?? '';
        $text   = trim($body['text'] ?? '');
        if (!$convId || !$text) jsonError('conv_id and text required.');

        $db = getDb();
        $stmt = $db->prepare("SELECT messages FROM conversations WHERE conv_id = :id");
        $stmt->execute([':id' => $convId]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$row) jsonError("Conversation not found: $convId", 404);

        $msgs   = json_decode($row['messages'], true) ?? [];
        $msgs[] = [
            'id'        => 'msg-' . time() . '-' . rand(100, 999),
            'sender'    => 'staff',
            'text'      => $text,
            'timestamp' => time() * 1000,
        ];
        $db->prepare("
            UPDATE conversations
            SET messages = :msgs, updated_at = datetime('now'), status = 'open'
            WHERE conv_id = :id
        ")->execute([':msgs' => json_encode($msgs, JSON_UNESCAPED_UNICODE), ':id' => $convId]);

        jsonSuccess('Reply added.');
        break;

    // ── Mark submission as read ───────────────────────────────────────────────
    case 'mark_read':
        $id = intval($body['id'] ?? 0);
        if (!$id) jsonError('id required.');
        $db = getDb();
        $db->prepare("UPDATE submissions SET status = 'read' WHERE id = :id AND status = 'new'")
           ->execute([':id' => $id]);
        jsonSuccess("Marked as read.");
        break;

    // ── Pull latest conversations back to localStorage format ─────────────────
    case 'pull_conversations':
        $db    = getDb();
        $stmt  = $db->query("SELECT * FROM conversations ORDER BY updated_at DESC LIMIT 500");
        $convs = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $out   = [];
        foreach ($convs as $c) {
            $out[] = [
                'id'         => $c['conv_id'],
                'visitorId'  => $c['visitor_id'],
                'categoryId' => $c['category_id'],
                'messages'   => json_decode($c['messages'] ?? '[]', true) ?? [],
                'status'     => $c['status'],
                'createdAt'  => strtotime($c['created_at']) * 1000,
                'updatedAt'  => strtotime($c['updated_at']) * 1000,
            ];
        }
        echo json_encode(['success' => true, 'conversations' => $out]);
        break;

    default:
        jsonError("Unknown action. Use: push_conversations, push_bookings, update_status, update_conv_status, add_reply, mark_read, pull_conversations.");
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function jsonSuccess(string $msg): never {
    echo json_encode(['success' => true, 'message' => $msg]);
    exit;
}
function jsonError(string $msg, int $code = 400): never {
    http_response_code($code);
    echo json_encode(['success' => false, 'message' => $msg]);
    exit;
}
