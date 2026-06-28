<?php
/**
 * Century Adventures – Admin Data API
 * ─────────────────────────────────────────────────────────────────────────────
 * Returns submissions and conversations from the SQLite database.
 * Requires the admin passcode header or query param for access.
 *
 * Usage:
 *   GET /get-submissions.php?type=all&passcode=centuryadmin
 *   GET /get-submissions.php?type=conversations&passcode=centuryadmin
 *   GET /get-submissions.php?type=bookings&passcode=centuryadmin
 *   GET /get-submissions.php?type=contacts&passcode=centuryadmin
 */

require_once __DIR__ . '/smtp-config.php';

header('Content-Type: application/json; charset=utf-8');

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, ALLOWED_ORIGINS, true)) {
    header("Access-Control-Allow-Origin: $origin");
    header('Access-Control-Allow-Credentials: true');
}
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Admin-Passcode');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// ── Auth ──────────────────────────────────────────────────────────────────────
$ADMIN_PASSCODE = 'centuryadmin';
$passcode = $_GET['passcode'] ?? $_SERVER['HTTP_X_ADMIN_PASSCODE'] ?? '';
if ($passcode !== $ADMIN_PASSCODE) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

// ── Database ──────────────────────────────────────────────────────────────────
function getDb(): PDO {
    if (!file_exists(DB_PATH)) {
        echo json_encode(['success' => true, 'data' => [], 'message' => 'No database yet']);
        exit;
    }
    $pdo = new PDO('sqlite:' . DB_PATH);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    return $pdo;
}

$type  = $_GET['type']  ?? 'all';
$limit = intval($_GET['limit'] ?? 200);
$page  = max(1, intval($_GET['page'] ?? 1));
$offset = ($page - 1) * $limit;

$db = getDb();

switch ($type) {
    // ── All submissions ───────────────────────────────────────────────────────
    case 'all':
        $stmt = $db->prepare("
            SELECT * FROM submissions
            ORDER BY created_at DESC
            LIMIT :limit OFFSET :offset
        ");
        $stmt->bindValue(':limit',  $limit,  PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $countStmt = $db->query("SELECT COUNT(*) FROM submissions");
        $total = (int)$countStmt->fetchColumn();
        echo json_encode([
            'success' => true,
            'type'    => 'all',
            'total'   => $total,
            'page'    => $page,
            'limit'   => $limit,
            'data'    => decodeExtras($rows),
        ]);
        break;

    // ── Bookings only ─────────────────────────────────────────────────────────
    case 'bookings':
        $stmt = $db->prepare("
            SELECT * FROM submissions
            WHERE form_type IN ('booking','planner','enquiry')
            ORDER BY created_at DESC
            LIMIT :limit OFFSET :offset
        ");
        $stmt->bindValue(':limit',  $limit,  PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $countStmt = $db->prepare("SELECT COUNT(*) FROM submissions WHERE form_type IN ('booking','planner','enquiry')");
        $countStmt->execute();
        $total = (int)$countStmt->fetchColumn();
        echo json_encode(['success' => true, 'type' => 'bookings', 'total' => $total, 'data' => decodeExtras($rows)]);
        break;

    // ── Contact messages only ─────────────────────────────────────────────────
    case 'contacts':
        $stmt = $db->prepare("
            SELECT * FROM submissions
            WHERE form_type IN ('contact','support','quote','report')
            ORDER BY created_at DESC
            LIMIT :limit OFFSET :offset
        ");
        $stmt->bindValue(':limit',  $limit,  PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(['success' => true, 'type' => 'contacts', 'data' => decodeExtras($rows)]);
        break;

    // ── Conversations (chat widget) ───────────────────────────────────────────
    case 'conversations':
        if ($db->query("SELECT name FROM sqlite_master WHERE type='table' AND name='conversations'")->fetchColumn()) {
            $stmt = $db->prepare("
                SELECT * FROM conversations
                ORDER BY updated_at DESC
                LIMIT :limit OFFSET :offset
            ");
            $stmt->bindValue(':limit',  $limit,  PDO::PARAM_INT);
            $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
            $stmt->execute();
            $convs = $stmt->fetchAll(PDO::FETCH_ASSOC);
            // Decode JSON messages column
            foreach ($convs as &$c) {
                $c['messages'] = json_decode($c['messages'] ?? '[]', true) ?? [];
            }
            echo json_encode(['success' => true, 'type' => 'conversations', 'data' => $convs]);
        } else {
            echo json_encode(['success' => true, 'type' => 'conversations', 'data' => []]);
        }
        break;

    // ── Dashboard stats ───────────────────────────────────────────────────────
    case 'stats':
        $stats = [];

        // Total submissions
        $stats['total_submissions'] = (int)$db->query("SELECT COUNT(*) FROM submissions")->fetchColumn();

        // Bookings this month
        $stats['bookings_this_month'] = (int)$db->query("
            SELECT COUNT(*) FROM submissions
            WHERE form_type IN ('booking','planner','enquiry')
            AND strftime('%Y-%m', created_at) = strftime('%Y-%m','now')
        ")->fetchColumn();

        // New (unread) submissions
        $stats['new_submissions'] = (int)$db->query("
            SELECT COUNT(*) FROM submissions WHERE status = 'new'
        ")->fetchColumn();

        // Contacts by type
        $stmt = $db->query("
            SELECT form_type, COUNT(*) as cnt FROM submissions GROUP BY form_type
        ");
        $stats['by_type'] = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $stats['by_type'][$row['form_type']] = $row['cnt'];
        }

        // Recent 5 submissions
        $stmt = $db->query("
            SELECT id, form_type, name, email, subject, created_at, status
            FROM submissions ORDER BY created_at DESC LIMIT 5
        ");
        $stats['recent'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode(['success' => true, 'type' => 'stats', 'data' => $stats]);
        break;

    default:
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Unknown type. Use: all, bookings, contacts, conversations, stats']);
}

// ── Helper ────────────────────────────────────────────────────────────────────
function decodeExtras(array $rows): array {
    foreach ($rows as &$row) {
        $row['extra'] = json_decode($row['extra_data'] ?? '{}', true) ?? [];
        unset($row['extra_data']);
    }
    return $rows;
}
