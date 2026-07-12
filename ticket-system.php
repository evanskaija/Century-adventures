<?php
/**
 * Century Adventures – Ticket System Core
 * ─────────────────────────────────────────────────────────────────────────────
 * Handles ticket ID generation, threading headers, and DB ticket management.
 * Synchronizes conversations to standard tables for compatibility with admin dashboard.
 */

require_once __DIR__ . '/smtp-config.php';

// ── Ticket ID Generation ──────────────────────────────────────────────────────

/**
 * Generate a deterministic CA-XXXX ticket ID from a conversation or submission ID.
 * Format: CA-1024 (always numeric, always 4+ digits)
 */
function generateTicketId(string $convId): string {
    $db = getTicketDb();
    // Check if this conv already has a ticket
    $stmt = $db->prepare("SELECT ticket_id FROM tickets WHERE conv_id = :conv_id");
    $stmt->execute([':conv_id' => $convId]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($row) return $row['ticket_id'];

    // Create new sequential ticket
    $last = $db->query("SELECT MAX(CAST(SUBSTR(ticket_id, 4) AS INTEGER)) AS n FROM tickets")->fetchColumn();
    $next = ($last ? intval($last) : 1023) + 1;
    return 'CA-' . $next;
}

/**
 * Create or update a ticket record in the database.
 */
function ensureTicket(
    string $convId,
    string $name,
    string $email,
    string $subject,
    string $formType,
    string $status = 'open',
    string $phone = '',
    string $department = '',
    string $assignedEmail = ''
): string {
    $db = getTicketDb();
    $ticketId = generateTicketId($convId);

    // Resolve routing info to record metadata
    $routing = getDepartmentRouting($subject, $formType);
    $finalDept = $department ?: ($routing['dept'] ?? 'GENERAL CONTACT');
    $finalAssignedEmail = $assignedEmail ?: ($routing['to'] ?? 'admin@century-adventures.com');

    $db->prepare("
        INSERT INTO tickets (ticket_id, conv_id, customer_name, customer_email, customer_phone, department, assigned_email, subject, form_type, status, created_at, updated_at)
        VALUES (:tid, :conv, :name, :email, :phone, :dept, :assigned_email, :subject, :form_type, :status, datetime('now'), datetime('now'))
        ON CONFLICT(conv_id) DO UPDATE SET
            customer_name  = excluded.customer_name,
            customer_email = excluded.customer_email,
            customer_phone = CASE WHEN excluded.customer_phone != '' THEN excluded.customer_phone ELSE customer_phone END,
            department     = excluded.department,
            assigned_email = excluded.assigned_email,
            subject        = excluded.subject,
            updated_at     = datetime('now')
    ")->execute([
        ':tid'            => $ticketId,
        ':conv'           => $convId,
        ':name'           => $name,
        ':email'          => $email,
        ':phone'          => $phone,
        ':dept'           => $finalDept,
        ':assigned_email' => $finalAssignedEmail,
        ':subject'        => $subject,
        ':form_type'      => $formType,
        ':status'         => $status,
    ]);

    return $ticketId;
}

/**
 * Lookup a ticket ID by conv_id.
 */
function getTicketByConvId(string $convId): ?array {
    $db   = getTicketDb();
    $stmt = $db->prepare("SELECT * FROM tickets WHERE conv_id = :id");
    $stmt->execute([':id' => $convId]);
    $row  = $stmt->fetch(PDO::FETCH_ASSOC);
    return $row ?: null;
}

/**
 * Lookup a ticket by the CA-XXXX ticket ID string.
 */
function getTicketById(string $ticketId): ?array {
    $db   = getTicketDb();
    $stmt = $db->prepare("SELECT * FROM tickets WHERE ticket_id = :id");
    $stmt->execute([':id' => $ticketId]);
    $row  = $stmt->fetch(PDO::FETCH_ASSOC);
    return $row ?: null;
}

/**
 * Update ticket status.
 */
function updateTicketStatus(string $ticketId, string $status): void {
    $db = getTicketDb();
    $db->prepare("UPDATE tickets SET status = :s, updated_at = datetime('now') WHERE ticket_id = :id")
       ->execute([':s' => $status, ':id' => $ticketId]);
}

/**
 * Append a message to a ticket's conversation in the DB and synchronize compatibility tables.
 */
function appendTicketMessage(string $convId, array $msg, string $customerName, string $customerEmail, string $categoryId = 'general'): void {
    $db   = getTicketDb();
    $stmt = $db->prepare("SELECT messages FROM ticket_messages WHERE conv_id = :id");
    $stmt->execute([':id' => $convId]);
    $row  = $stmt->fetch(PDO::FETCH_ASSOC);

    $messages = $row ? (json_decode($row['messages'], true) ?? []) : [];
    
    // Avoid duplicates
    $exists = false;
    foreach ($messages as $existingMsg) {
        if (isset($existingMsg['id']) && $existingMsg['id'] === $msg['id']) {
            $exists = true;
            break;
        }
    }
    
    if (!$exists) {
        $messages[] = $msg;
    }

    if ($row) {
        $db->prepare("UPDATE ticket_messages SET messages = :msgs, updated_at = datetime('now') WHERE conv_id = :id")
           ->execute([':msgs' => json_encode($messages, JSON_UNESCAPED_UNICODE), ':id' => $convId]);
    } else {
        $db->prepare("INSERT INTO ticket_messages (conv_id, messages) VALUES (:id, :msgs)")
           ->execute([':id' => $convId, ':msgs' => json_encode($messages, JSON_UNESCAPED_UNICODE)]);
    }

    // Synchronize to the standard `conversations` compatibility table
    syncToConversationsTable($convId, $customerName, $customerEmail, $categoryId, $msg);
}

/**
 * Sync logic with Standard Compatibility Table (conversations)
 */
function syncToConversationsTable(string $convId, string $customerName, string $customerEmail, string $categoryId, array $msg): void {
    $db = getTicketDb();
    
    $stmt = $db->prepare("SELECT messages, status FROM conversations WHERE conv_id = :id");
    $stmt->execute([':id' => $convId]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    
    $messages = $row ? (json_decode($row['messages'] ?? '[]', true) ?? []) : [];
    
    // Avoid duplicate message IDs
    $exists = false;
    foreach ($messages as $existingMsg) {
        if (isset($existingMsg['id']) && $existingMsg['id'] === $msg['id']) {
            $exists = true;
            break;
        }
    }
    
    if (!$exists) {
        $messages[] = $msg;
    }
    
    $visitorId = $customerName;
    if ($customerEmail) {
        $visitorId .= " ($customerEmail)";
    }
    
    $status = $row ? $row['status'] : 'open';
    if ($msg['sender'] === 'visitor') {
        $status = 'open'; // Reopen on customer response
    } else {
        $status = 'replied'; // Mark replied on staff response
    }
    
    $db->prepare("
        INSERT INTO conversations (conv_id, visitor_id, category_id, messages, status, created_at, updated_at)
        VALUES (:conv, :visitor, :cat, :msgs, :status, datetime('now'), datetime('now'))
        ON CONFLICT(conv_id) DO UPDATE SET
            visitor_id = excluded.visitor_id,
            messages   = excluded.messages,
            status     = excluded.status,
            updated_at = datetime('now')
    ")->execute([
        ':conv'    => $convId,
        ':visitor' => $visitorId,
        ':cat'     => $categoryId,
        ':msgs'    => json_encode($messages, JSON_UNESCAPED_UNICODE),
        ':status'  => $status
    ]);
}

/**
 * Get all messages for a ticket.
 */
function getTicketMessages(string $convId): array {
    $db   = getTicketDb();
    $stmt = $db->prepare("SELECT messages FROM ticket_messages WHERE conv_id = :id");
    $stmt->execute([':id' => $convId]);
    $row  = $stmt->fetch(PDO::FETCH_ASSOC);
    return $row ? (json_decode($row['messages'], true) ?? []) : [];
}


// ── Email Threading Helpers ───────────────────────────────────────────────────

/**
 * Build the canonical Message-ID for the first email of a ticket.
 * e.g. <CA-1024.initial@century-adventures.com>
 */
function buildInitialMessageId(string $ticketId): string {
    return "<{$ticketId}.initial@century-adventures.com>";
}

/**
 * Build the Message-ID for a specific reply.
 * e.g. <CA-1024.reply.1688547600@century-adventures.com>
 */
function buildReplyMessageId(string $ticketId, int $ts = 0): string {
    $ts = $ts ?: time();
    return "<{$ticketId}.reply.{$ts}@century-adventures.com>";
}

/**
 * Parse ticket ID from email subject.
 * Supports: "[#CA-1024]", "#CA-1024", "Re: ... [Ticket #CA-1024]"
 */
function parseTicketIdFromSubject(string $subject): ?string {
    if (preg_match('/CA[-–]\d{4,}/i', $subject, $m)) {
        return strtoupper(str_replace('–', '-', $m[0]));
    }
    return null;
}

/**
 * Parse ticket ID from In-Reply-To or References header.
 * e.g. <CA-1024.initial@century-adventures.com>
 */
function parseTicketIdFromMessageId(string $header): ?string {
    if (preg_match('/<(CA-\d{4,})\.[^>]+@century-adventures\.com>/i', $header, $m)) {
        return strtoupper($m[1]);
    }
    return null;
}


/**
 * Map standard subjects to specific department identifier strings.
 */
function getDepartmentFromSubject(string $subject, string $default = 'info'): string {
    $sub = trim(strtolower($subject));
    if (str_contains($sub, 'safari bookings') || str_contains($sub, 'booking')) {
        return 'booking';
    }
    if (str_contains($sub, 'destinations') || str_contains($sub, 'volunteer')) {
        return 'info';
    }
    if (str_contains($sub, 'travel plans') || str_contains($sub, 'accommodation') || str_contains($sub, 'visit')) {
        return 'visit';
    }
    if (str_contains($sub, 'website issues') || str_contains($sub, 'admin')) {
        return 'admin';
    }
    return $default;
}

/**
 * Map standard subjects to specific category identifier strings.
 */
function getCategoryFromSubject(string $subject, string $default = 'general'): string {
    $sub = trim(strtolower($subject));
    if (str_contains($sub, 'safari bookings') || str_contains($sub, 'booking')) {
        return 'safari';
    }
    if (str_contains($sub, 'accommodation')) {
        return 'accommodation';
    }
    if (str_contains($sub, 'travel plans') || str_contains($sub, 'visit')) {
        return 'travel';
    }
    if (str_contains($sub, 'website issues') || str_contains($sub, 'admin')) {
        return 'problem';
    }
    return $default;
}

/**
 * Return the correct TO email and Reply-To based on form type.
 */
function getDepartmentRouting(string $subject, string $formType = ''): array {
    $sub = strtolower(trim($subject));
    $type = strtolower(trim($formType));

    // 1. Booking Enquiries -> bookings@century-adventures.com
    $bookings = ['book now', 'reserve safari', 'package booking', 'request quote'];
    foreach ($bookings as $b) {
        if (str_contains($sub, $b) || $type === 'booking' || $type === 'quote' || $type === 'planner') {
            return [
                'to'       => EMAIL_BOOKINGS,
                'label'    => 'Century Adventures Bookings',
                'reply_to' => 'bookings@century-adventures.com',
                'dept'     => 'BOOKINGS & RESERVATIONS',
            ];
        }
    }

    // 2. Destination Enquiries -> visit@century-adventures.com
    $destinations = ['serengeti', 'ngorongoro', 'tarangire', 'lake manyara', 'manyara', 'zanzibar', 'kilimanjaro'];
    foreach ($destinations as $dest) {
        if (str_contains($sub, $dest) || str_contains($type, $dest)) {
            return [
                'to'       => EMAIL_VISIT,
                'label'    => 'Century Adventures Trip Planning',
                'reply_to' => 'visit@century-adventures.com',
                'dept'     => 'DESTINATION & TRIP PLANNING',
            ];
        }
    }

    // 3. Support Requests -> support@century-adventures.com
    $support = ['existing booking support', 'customer assistance', 'help center requests'];
    foreach ($support as $s) {
        if (str_contains($sub, $s) || $type === 'support') {
            return [
                'to'       => EMAIL_SUPPORT,
                'label'    => 'Century Adventures Support',
                'reply_to' => 'support@century-adventures.com',
                'dept'     => 'CUSTOMER SUPPORT',
            ];
        }
    }

    // 4. Website Issues -> admin@century-adventures.com
    $admin = ['report problem', 'technical issue', 'website feedback', 'report', 'admin'];
    foreach ($admin as $a) {
        if (str_contains($sub, $a) || $type === 'report') {
            return [
                'to'       => EMAIL_ADMIN,
                'label'    => 'Century Adventures Administration',
                'reply_to' => 'admin@century-adventures.com',
                'dept'     => 'WEBSITE ADMINISTRATION',
            ];
        }
    }

    // 5. General Contact Enquiries -> admin@century-adventures.com
    // Default fallback
    return [
        'to'       => EMAIL_INFO,
        'label'    => 'Century Adventures General Contact',
        'reply_to' => 'admin@century-adventures.com',
        'dept'     => 'GENERAL CONTACT',
    ];
}


// ── Database ──────────────────────────────────────────────────────────────────

function getTicketDb(): PDO {
    static $pdo = null;
    if ($pdo !== null) return $pdo;

    $pdo = new PDO('sqlite:' . DB_PATH);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->exec("PRAGMA journal_mode=WAL;");

    // Run schema migrations for pre-existing tables
    try {
        $pdo->exec("ALTER TABLE tickets ADD COLUMN customer_phone TEXT;");
    } catch (Exception $e) {}
    try {
        $pdo->exec("ALTER TABLE tickets ADD COLUMN department TEXT;");
    } catch (Exception $e) {}
    try {
        $pdo->exec("ALTER TABLE tickets ADD COLUMN assigned_email TEXT;");
    } catch (Exception $e) {}

    $pdo->exec("
        CREATE TABLE IF NOT EXISTS tickets (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            ticket_id       TEXT UNIQUE,
            conv_id         TEXT UNIQUE,
            customer_name   TEXT,
            customer_email  TEXT,
            customer_phone  TEXT,
            department      TEXT,
            assigned_email  TEXT,
            subject         TEXT,
            form_type       TEXT DEFAULT 'contact',
            status          TEXT DEFAULT 'open',
            created_at      TEXT DEFAULT (datetime('now')),
            updated_at      TEXT DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS ticket_messages (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            conv_id     TEXT UNIQUE,
            messages    TEXT DEFAULT '[]',
            created_at  TEXT DEFAULT (datetime('now')),
            updated_at  TEXT DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS conversations (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            conv_id     TEXT UNIQUE,
            visitor_id  TEXT,
            category_id TEXT,
            messages    TEXT DEFAULT '[]',
            status      TEXT DEFAULT 'open',
            created_at  TEXT DEFAULT (datetime('now')),
            updated_at  TEXT DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS submissions (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            form_type   TEXT NOT NULL,
            name        TEXT, email TEXT, phone TEXT,
            subject     TEXT, message TEXT,
            extra_data  TEXT, ip TEXT,
            created_at  TEXT DEFAULT (datetime('now')),
            status      TEXT DEFAULT 'new'
        );

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

    return $pdo;
}

// ── Email Cleaner ─────────────────────────────────────────────────────────────

function stripEmailHistory(string $text): string {
    $lines = explode("\n", $text);
    $cleanLines = [];
    foreach ($lines as $line) {
        $trimmed = trim($line);
        // Stop at common signature/reply separators
        if (preg_match('/^--\s*$/', $trimmed) || // Standard signature dash
            preg_match('/^On\s+.*\s+wrote:$/i', $trimmed) || 
            preg_match('/^From:\s+/i', $trimmed) ||
            preg_match('/^-+\s*Original Message\s*-+/i', $trimmed) ||
            preg_match('/^Weka nafasi kwa/i', $trimmed) ||
            strpos($trimmed, '🦁 CENTURY ADVENTURES') !== false ||
            strpos($trimmed, 'century-adventures.com') !== false
        ) {
            break;
        }
        // Skip quoted lines starting with >
        if (str_starts_with($trimmed, '>')) {
            continue;
        }
        $cleanLines[] = $line;
    }
    return trim(implode("\n", $cleanLines));
}
