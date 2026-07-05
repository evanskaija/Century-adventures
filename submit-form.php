<?php
/**
 * Century Adventures – Universal Form Submission Endpoint
 * ─────────────────────────────────────────────────────────────────────────────
 * Handles:
 *   - contact     → Contact page form   → info@ + cc admin@
 *   - booking     → Book Now form        → bookings@ + cc admin@
 *   - enquiry     → Enquire form         → info@ + cc admin@
 *   - support     → Widget support form  → info@ + cc admin@
 *   - quote       → Widget quote form    → bookings@ + cc admin@
 *   - report      → Widget report form   → visit@ + cc admin@
 *   - planner     → Safari planner form  → bookings@ + cc admin@
 *
 * Responses: JSON  { "success": true, "message": "..." }
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
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonError('Method not allowed.', 405);
}

// ── Rate Limit Check (simple file-based, 10 req/min per IP) ──────────────────
rateLimitCheck();

// ── Parse Input ───────────────────────────────────────────────────────────────
$contentType = $_SERVER['CONTENT_TYPE'] ?? '';
if (str_contains($contentType, 'application/json')) {
    $raw  = file_get_contents('php://input');
    $data = json_decode($raw, true) ?? [];
} else {
    $data = $_POST;
}

// ── Spam Protection ───────────────────────────────────────────────────────────
// 1. Honeypot
if (!empty($data[HONEYPOT_FIELD])) {
    jsonSuccess('Thank you! Your message has been received.'); // Silent drop
}

// 2. Time-based check
$elapsed = intval($data['_elapsed'] ?? 99);
if ($elapsed < MIN_SUBMIT_TIME) {
    jsonSuccess('Thank you! Your message has been received.'); // Silent drop
}

// ── Determine Form Type ───────────────────────────────────────────────────────
$formType = sanitize($data['form_type'] ?? 'contact');
$allowed  = ['contact','booking','enquiry','support','quote','report','planner'];
if (!in_array($formType, $allowed, true)) {
    jsonError('Unknown form type.');
}

// ── Sanitize Common Fields ───────────────────────────────────────────────────
$name    = sanitize($data['name']    ?? $data['full_name'] ?? '');
$email   = filterEmail($data['email'] ?? $data['email_address'] ?? '');
$phone   = sanitize($data['phone']   ?? $data['phone_number']   ?? '');
$message = sanitize($data['message'] ?? $data['details'] ?? $data['description'] ?? '');

if (!$name || !$email) {
    jsonError('Name and email are required.');
}

// ── Route to correct handler ──────────────────────────────────────────────────
switch ($formType) {
    case 'contact':
        handleContact($data, $name, $email, $phone, $message);
        break;
    case 'booking':
        handleBooking($data, $name, $email, $phone, $message);
        break;
    case 'enquiry':
        handleEnquiry($data, $name, $email, $phone, $message);
        break;
    case 'support':
        handleSupport($data, $name, $email, $phone, $message);
        break;
    case 'quote':
        handleQuote($data, $name, $email, $phone, $message);
        break;
    case 'report':
        handleReport($data, $name, $email, $phone, $message);
        break;
    case 'planner':
        handlePlanner($data, $name, $email, $phone, $message);
        break;
}


// ════════════════════════════════════════════════════════════════════════════
// FORM HANDLERS
// ════════════════════════════════════════════════════════════════════════════

function handleContact(array $d, string $name, string $email, string $phone, string $message): void {
    $subject = sanitize($d['subject'] ?? 'General Inquiry');
    $convId  = sanitize($d['conv_id'] ?? 'conv-' . time() . '-' . rand(1000, 9999));
    
    // Automatically route based on selected subject
    $dept = getDepartmentFromSubject($subject, 'info');
    $cat  = getCategoryFromSubject($subject, 'general');

    // Save submission under routed department
    saveSubmission($dept, [
        'name' => $name, 'email' => $email, 'phone' => $phone,
        'subject' => $subject, 'message' => $message,
    ]);

    // Ticket System Core Initialization
    $ticketId = ensureTicket($convId, $name, $email, $subject, $dept, 'open', $phone);
    $msgText  = "Subject: $subject\nMessage: $message\nPhone: $phone";
    $msgEntry = [
        'id'        => 'msg-' . time() . '-visitor',
        'sender'    => 'visitor',
        'text'      => $msgText,
        'timestamp' => time() * 1000,
    ];
    appendTicketMessage($convId, $msgEntry, $name, $email, $cat);

    $routing = getDepartmentRouting($dept);
    $initialMsgId = buildInitialMessageId($ticketId);

    // Staff notification email
    $staffBody = buildFieldsTable("New Contact Form Submission ($ticketId)", 'Contact Page', [
        'Ticket ID'  => "<strong>$ticketId</strong>",
        'Full Name'  => $name,
        'Email'      => "<a href='mailto:$email'>$email</a>",
        'Phone'      => $phone ?: 'Not provided',
        'Subject'    => $subject,
        'Message'    => nl2br(htmlspecialchars($message)),
    ]);
    $staffHtml = buildEmailTemplate(
        "New Contact Inquiry [$ticketId] – Century Adventures",
        "New contact from $name about \"$subject\"",
        $staffBody
    );
    sendMailWithHeaders($routing['to'], 'Century Adventures Team', "📩 New Contact [$ticketId]: $subject", $staffHtml, $email, EMAIL_ADMIN, ['message_id' => $initialMsgId]);

    // Confirmation email to sender
    $confirmHtml = buildEmailTemplate(
        "We received your message [$ticketId] – Century Adventures",
        "Thank you $name, we will get back to you shortly.",
        buildConfirmation($name, "Thank you for contacting us! (Ticket $ticketId)", "We've received your message regarding <strong>$subject</strong>. Your inquiry has been registered under ticket number <strong>$ticketId</strong>. One of our team members will respond within 24 hours.")
    );
    sendMailWithHeaders($email, $name, "✅ We received your message [$ticketId] – Century Adventures", $confirmHtml, $routing['reply_to'], null, [
        'message_id'  => buildReplyMessageId($ticketId),
        'in_reply_to' => $initialMsgId,
        'references'  => $initialMsgId
    ]);

    jsonSuccess("Thank you! Your message has been sent. Reference: $ticketId.");
}

function handleBooking(array $d, string $name, string $email, string $phone, string $message): void {
    $safari    = sanitize($d['safari']    ?? $d['tour']         ?? 'Not specified');
    $country   = sanitize($d['country']   ?? '');
    $arrDate   = sanitize($d['arrival_date'] ?? $d['date']      ?? '');
    $depDate   = sanitize($d['departure_date'] ?? '');
    $adults    = sanitize($d['adults']    ?? '');
    $children  = sanitize($d['children']  ?? '0');
    $lodging   = sanitize($d['lodging']   ?? $d['accommodation'] ?? '');
    $convId    = sanitize($d['conv_id'] ?? 'conv-' . time() . '-' . rand(1000, 9999));

    saveSubmission('booking', [
        'name' => $name, 'email' => $email, 'phone' => $phone,
        'safari' => $safari, 'country' => $country, 'arrival_date' => $arrDate,
        'departure_date' => $depDate, 'adults' => $adults, 'children' => $children,
        'lodging' => $lodging, 'message' => $message,
    ]);

    // Ticket System Core Initialization
    $subject  = "Safari Booking: $safari";
    $ticketId = ensureTicket($convId, $name, $email, $subject, 'booking', 'open', $phone);
    
    $msgText  = "Safari Package: $safari\nArrival: $arrDate\nDeparture: $depDate\nAdults: $adults\nChildren: $children\nLodging: $lodging\nSpecial Requests: $message\nPhone: $phone";
    $msgEntry = [
        'id'        => 'msg-' . time() . '-visitor',
        'sender'    => 'visitor',
        'text'      => $msgText,
        'timestamp' => time() * 1000,
    ];
    appendTicketMessage($convId, $msgEntry, $name, $email, 'safari');

    $routing = getDepartmentRouting('booking');
    $initialMsgId = buildInitialMessageId($ticketId);

    $staffBody = buildFieldsTable("New Safari Booking Request ($ticketId)", 'Book Now Form', [
        'Ticket ID'        => "<strong>$ticketId</strong>",
        'Full Name'        => $name,
        'Email'            => "<a href='mailto:$email'>$email</a>",
        'Phone'            => $phone ?: 'Not provided',
        'Country'          => $country ?: 'Not provided',
        'Safari Package'   => $safari,
        'Arrival Date'     => $arrDate ?: 'TBD',
        'Departure Date'   => $depDate ?: 'TBD',
        'Adults'           => $adults ?: 'Not specified',
        'Children'         => $children ?: '0',
        'Lodging Level'    => $lodging ?: 'Not specified',
        'Special Requests' => nl2br(htmlspecialchars($message)) ?: 'None',
    ]);
    $staffHtml = buildEmailTemplate(
        "New Booking Request [$ticketId] – Century Adventures",
        "Booking request from $name for $safari",
        $staffBody
    );
    sendMailWithHeaders($routing['to'], 'Century Adventures Bookings', "🗓️ Booking Request [$ticketId] – $safari", $staffHtml, $email, EMAIL_ADMIN, ['message_id' => $initialMsgId]);

    $confirmHtml = buildEmailTemplate(
        "Booking Request Received [$ticketId] – Century Adventures",
        "Hi $name, your booking request has been received!",
        buildConfirmation($name, "Booking Request Received! (Ticket $ticketId)", "Your booking request for <strong>$safari</strong> has been registered under ticket number <strong>$ticketId</strong>. Our team will confirm availability and send a detailed itinerary within 24 hours.")
    );
    sendMailWithHeaders($email, $name, "🦁 Booking Request Received [$ticketId] – Century Adventures", $confirmHtml, $routing['reply_to'], null, [
        'message_id'  => buildReplyMessageId($ticketId),
        'in_reply_to' => $initialMsgId,
        'references'  => $initialMsgId
    ]);

    jsonSuccess("Thank you $name! Your booking request has been received. Reference: $ticketId.");
}

function handleEnquiry(array $d, string $name, string $email, string $phone, string $message): void {
    $safari  = sanitize($d['safari'] ?? $d['tour'] ?? 'Not specified');
    $date    = sanitize($d['date']   ?? $d['travel_date'] ?? '');
    $guests  = sanitize($d['guests'] ?? $d['adults']      ?? '');
    $convId  = sanitize($d['conv_id'] ?? 'conv-' . time() . '-' . rand(1000, 9999));

    saveSubmission('enquiry', [
        'name' => $name, 'email' => $email, 'phone' => $phone,
        'safari' => $safari, 'date' => $date, 'guests' => $guests, 'message' => $message,
    ]);

    // Ticket System Core Initialization
    $subject  = "Safari Inquiry: $safari";
    $ticketId = ensureTicket($convId, $name, $email, $subject, 'enquiry', 'open', $phone);
    
    $msgText  = "Enquiry about: $safari\nTravel Date: $date\nGuests: $guests\nDetails: $message\nPhone: $phone";
    $msgEntry = [
        'id'        => 'msg-' . time() . '-visitor',
        'sender'    => 'visitor',
        'text'      => $msgText,
        'timestamp' => time() * 1000,
    ];
    appendTicketMessage($convId, $msgEntry, $name, $email, 'safari');

    $routing = getDepartmentRouting('enquiry');
    $initialMsgId = buildInitialMessageId($ticketId);

    $staffBody = buildFieldsTable("New Safari Enquiry ($ticketId)", 'Enquire Form', [
        'Ticket ID'   => "<strong>$ticketId</strong>",
        'Full Name'   => $name,
        'Email'       => "<a href='mailto:$email'>$email</a>",
        'Phone'       => $phone ?: 'Not provided',
        'Safari'      => $safari,
        'Travel Date' => $date ?: 'TBD',
        'Guests'      => $guests ?: 'Not specified',
        'Message'     => nl2br(htmlspecialchars($message)) ?: 'None',
    ]);
    $staffHtml = buildEmailTemplate(
        "New Enquiry [$ticketId] – Century Adventures",
        "Enquiry from $name about $safari",
        $staffBody
    );
    sendMailWithHeaders($routing['to'], 'Century Adventures Team', "❓ New Enquiry [$ticketId] – $safari", $staffHtml, $email, EMAIL_ADMIN, ['message_id' => $initialMsgId]);

    $confirmHtml = buildEmailTemplate(
        "We received your enquiry [$ticketId] – Century Adventures",
        "Hi $name, we received your enquiry!",
        buildConfirmation($name, "Enquiry Received! (Ticket $ticketId)", "Thank you for your interest in <strong>$safari</strong>. Your enquiry has been registered under ticket number <strong>$ticketId</strong>. Our team will send you a personalized itinerary and quote within 24 hours.")
    );
    sendMailWithHeaders($email, $name, "📬 Enquiry Received [$ticketId] – Century Adventures", $confirmHtml, $routing['reply_to'], null, [
        'message_id'  => buildReplyMessageId($ticketId),
        'in_reply_to' => $initialMsgId,
        'references'  => $initialMsgId
    ]);

    jsonSuccess("Thank you! Your enquiry has been sent. Reference: $ticketId.");
}

function handleSupport(array $d, string $name, string $email, string $phone, string $message): void {
    $subject  = sanitize($d['subject'] ?? 'General Inquiry');
    $convId   = sanitize($d['conv_id'] ?? 'conv-' . time() . '-' . rand(1000, 9999));

    $cat  = getCategoryFromSubject($subject, 'general');

    saveSubmission('support', [
        'name' => $name, 'email' => $email, 'phone' => $phone,
        'subject' => $subject, 'message' => $message,
    ]);

    // Ticket System Core Initialization
    $ticketId = ensureTicket($convId, $name, $email, $subject, 'support', 'open', $phone);
    
    $msgText  = "Subject: $subject\nMessage: $message\nPhone: $phone";
    $msgEntry = [
        'id'        => 'msg-' . time() . '-visitor',
        'sender'    => 'visitor',
        'text'      => $msgText,
        'timestamp' => time() * 1000,
    ];
    appendTicketMessage($convId, $msgEntry, $name, $email, $cat);

    $routing = getDepartmentRouting('support');
    $initialMsgId = buildInitialMessageId($ticketId);

    $staffBody = buildFieldsTable("New Support Message ($ticketId)", 'Safari Support Widget', [
        'Ticket ID' => "<strong>$ticketId</strong>",
        'Name'    => $name,
        'Email'   => "<a href='mailto:$email'>$email</a>",
        'Phone'   => $phone ?: 'Not provided',
        'Subject' => $subject,
        'Message' => nl2br(htmlspecialchars($message)),
    ]);
    $staffHtml = buildEmailTemplate(
        "Support Message [$ticketId] – Century Adventures",
        "Support inquiry from $name: $subject",
        $staffBody
    );
    sendMailWithHeaders($routing['to'], 'Century Adventures Support', "💬 Support [$ticketId]: $subject – $name", $staffHtml, $email, EMAIL_ADMIN, ['message_id' => $initialMsgId]);

    // Silent confirm for live widget, but we still trigger standard email
    $confirmHtml = buildEmailTemplate(
        "Support Inquiry Received [$ticketId] – Century Adventures",
        "Hi $name, we received your support inquiry!",
        buildConfirmation($name, "Support Inquiry Received! (Ticket $ticketId)", "We've registered your widget support inquiry under ticket number <strong>$ticketId</strong>. Our team will get back to you shortly.")
    );
    sendMailWithHeaders($email, $name, "💬 Support Inquiry Received [$ticketId] – Century Adventures", $confirmHtml, $routing['reply_to'], null, [
        'message_id'  => buildReplyMessageId($ticketId),
        'in_reply_to' => $initialMsgId,
        'references'  => $initialMsgId
    ]);

    jsonSuccess("Message sent! Reference: $ticketId.");
}

function handleQuote(array $d, string $name, string $email, string $phone, string $message): void {
    $destination = sanitize($d['destination'] ?? '');
    $dates       = sanitize($d['dates']       ?? '');
    $travelers   = sanitize($d['travelers']   ?? '');
    $budget      = sanitize($d['budget']      ?? '');
    $convId      = sanitize($d['conv_id'] ?? 'conv-' . time() . '-' . rand(1000, 9999));

    saveSubmission('quote', [
        'name' => $name, 'email' => $email, 'phone' => $phone,
        'destination' => $destination, 'dates' => $dates,
        'travelers' => $travelers, 'budget' => $budget, 'message' => $message,
    ]);

    // Ticket System Core Initialization
    $subject  = "Safari Quote Request: $destination";
    $ticketId = ensureTicket($convId, $name, $email, $subject, 'quote', 'open', $phone);
    
    $msgText  = "Destination: $destination\nDates: $dates\nTravelers: $travelers\nBudget: $budget\nDetails: $message\nPhone: $phone";
    $msgEntry = [
        'id'        => 'msg-' . time() . '-visitor',
        'sender'    => 'visitor',
        'text'      => $msgText,
        'timestamp' => time() * 1000,
    ];
    appendTicketMessage($convId, $msgEntry, $name, $email, 'pricing');

    $routing = getDepartmentRouting('quote');
    $initialMsgId = buildInitialMessageId($ticketId);

    $staffBody = buildFieldsTable("New Quote Request ($ticketId)", 'Safari Widget', [
        'Ticket ID'     => "<strong>$ticketId</strong>",
        'Name'          => $name,
        'Email'         => "<a href='mailto:$email'>$email</a>",
        'Phone'         => $phone ?: 'Not provided',
        'Destination'   => $destination ?: 'Not specified',
        'Travel Dates'  => $dates ?: 'Flexible',
        'Travelers'     => $travelers ?: 'Not specified',
        'Budget (USD)'  => $budget ?: 'Flexible',
        'Details'       => nl2br(htmlspecialchars($message)) ?: 'None',
    ]);
    $staffHtml = buildEmailTemplate(
        "Quote Request [$ticketId] – Century Adventures",
        "Quote request from $name",
        $staffBody
    );
    sendMailWithHeaders($routing['to'], 'Century Adventures Bookings', "📋 Quote Request [$ticketId] – $name ($destination)", $staffHtml, $email, EMAIL_ADMIN, ['message_id' => $initialMsgId]);

    $confirmHtml = buildEmailTemplate(
        "Quote Request Received [$ticketId] – Century Adventures",
        "Hi $name, your quote request was received!",
        buildConfirmation($name, "Quote Request Received! (Ticket $ticketId)", "We've received your quote request for <strong>$destination</strong> (Ticket <strong>$ticketId</strong>). Our specialists will prepare a personalized itinerary and email you within 24 hours.")
    );
    sendMailWithHeaders($email, $name, "📋 Quote Request Received [$ticketId] – Century Adventures", $confirmHtml, $routing['reply_to'], null, [
        'message_id'  => buildReplyMessageId($ticketId),
        'in_reply_to' => $initialMsgId,
        'references'  => $initialMsgId
    ]);

    jsonSuccess("Your quote request has been sent! Reference: $ticketId.");
}

function handleReport(array $d, string $name, string $email, string $phone, string $message): void {
    $issueType = sanitize($d['issue_type'] ?? 'Other');
    $convId    = sanitize($d['conv_id'] ?? 'conv-' . time() . '-' . rand(1000, 9999));

    saveSubmission('report', [
        'name' => $name, 'email' => $email, 'phone' => $phone,
        'issue_type' => $issueType, 'message' => $message,
    ]);

    // Ticket System Core Initialization
    $subject  = "Issue Report: $issueType";
    $ticketId = ensureTicket($convId, $name, $email, $subject, 'report', 'open', $phone);
    
    $msgText  = "Issue Type: $issueType\nDescription: $message\nPhone: $phone";
    $msgEntry = [
        'id'        => 'msg-' . time() . '-visitor',
        'sender'    => 'visitor',
        'text'      => $msgText,
        'timestamp' => time() * 1000,
    ];
    appendTicketMessage($convId, $msgEntry, $name, $email, 'problem');

    $routing = getDepartmentRouting('report');
    $initialMsgId = buildInitialMessageId($ticketId);

    $staffBody = buildFieldsTable("Issue Report ($ticketId)", 'Support Widget', [
        'Ticket ID'   => "<strong>$ticketId</strong>",
        'Name'        => $name,
        'Email'       => "<a href='mailto:$email'>$email</a>",
        'Phone'       => $phone ?: 'Not provided',
        'Issue Type'  => $issueType,
        'Description' => nl2br(htmlspecialchars($message)),
    ]);
    $staffHtml = buildEmailTemplate(
        "Issue Report [$ticketId] – Century Adventures",
        "Issue report from $name: $issueType",
        $staffBody
    );
    sendMailWithHeaders($routing['to'], 'Century Adventures Support', "⚠️ Issue Report [$ticketId] – $issueType – $name", $staffHtml, $email, EMAIL_ADMIN, ['message_id' => $initialMsgId]);

    // We also send confirmation email to the user reporting it
    $confirmHtml = buildEmailTemplate(
        "Issue Report Received [$ticketId] – Century Adventures",
        "Hi $name, we received your report!",
        buildConfirmation($name, "Issue Report Received! (Ticket $ticketId)", "We've registered your issue report regarding <strong>$issueType</strong> under ticket number <strong>$ticketId</strong>. Our technical support team will review it shortly.")
    );
    sendMailWithHeaders($email, $name, "⚠️ Issue Report Received [$ticketId] – Century Adventures", $confirmHtml, $routing['reply_to'], null, [
        'message_id'  => buildReplyMessageId($ticketId),
        'in_reply_to' => $initialMsgId,
        'references'  => $initialMsgId
    ]);

    jsonSuccess("Report submitted. Reference: $ticketId.");
}

function handlePlanner(array $d, string $name, string $email, string $phone, string $message): void {
    $destinations = sanitize($d['destinations'] ?? '');
    $activities   = sanitize($d['activities']   ?? '');
    $lodging      = sanitize($d['lodging']       ?? '');
    $adults       = sanitize($d['adults']        ?? '');
    $children     = sanitize($d['children']      ?? '0');
    $date         = sanitize($d['date']          ?? '');
    $budget       = sanitize($d['estimated_cost'] ?? $d['budget'] ?? '');
    $convId       = sanitize($d['conv_id'] ?? 'conv-' . time() . '-' . rand(1000, 9999));

    saveSubmission('planner', [
        'name' => $name, 'email' => $email, 'phone' => $phone,
        'destinations' => $destinations, 'activities' => $activities,
        'lodging' => $lodging, 'adults' => $adults, 'children' => $children,
        'date' => $date, 'budget' => $budget, 'message' => $message,
    ]);

    // Ticket System Core Initialization
    $subject  = "Custom Safari Plan Request";
    $ticketId = ensureTicket($convId, $name, $email, $subject, 'planner', 'open', $phone);
    
    $msgText  = "Destinations: $destinations\nActivities: $activities\nLodging: $lodging\nAdults: $adults\nChildren: $children\nTravel Date: $date\nEstimated Cost/Budget: $budget\nNotes: $message\nPhone: $phone";
    $msgEntry = [
        'id'        => 'msg-' . time() . '-visitor',
        'sender'    => 'visitor',
        'text'      => $msgText,
        'timestamp' => time() * 1000,
    ];
    appendTicketMessage($convId, $msgEntry, $name, $email, 'safari');

    $routing = getDepartmentRouting('planner');
    $initialMsgId = buildInitialMessageId($ticketId);

    $staffBody = buildFieldsTable("Custom Safari Planner Submission ($ticketId)", 'Safari Planner', [
        'Ticket ID'     => "<strong>$ticketId</strong>",
        'Name'          => $name,
        'Email'         => "<a href='mailto:$email'>$email</a>",
        'Phone'         => $phone ?: 'Not provided',
        'Destinations'  => $destinations ?: 'Not specified',
        'Activities'    => $activities   ?: 'Not specified',
        'Lodging'       => $lodging      ?: 'Not specified',
        'Adults'        => $adults       ?: 'Not specified',
        'Children'      => $children,
        'Travel Date'   => $date         ?: 'TBD',
        'Est. Cost'     => $budget       ?: 'N/A',
        'Special Notes' => nl2br(htmlspecialchars($message)) ?: 'None',
    ]);
    $staffHtml = buildEmailTemplate(
        "Custom Safari Plan [$ticketId] – Century Adventures",
        "Custom plan from $name",
        $staffBody
    );
    sendMailWithHeaders($routing['to'], 'Century Adventures Bookings', "🗺️ Custom Safari Plan [$ticketId] – $name", $staffHtml, $email, EMAIL_ADMIN, ['message_id' => $initialMsgId]);

    $confirmHtml = buildEmailTemplate(
        "Your Safari Plan Was Received [$ticketId] – Century Adventures",
        "Hi $name, we received your custom safari plan!",
        buildConfirmation($name, "Custom Safari Plan Received! (Ticket $ticketId)", "Fantastic! We've registered your custom safari plan under ticket number <strong>$ticketId</strong>. Our expert team will review your destinations and activities and send you a tailored itinerary within 24–48 hours.")
    );
    sendMailWithHeaders($email, $name, "🗺️ Your Custom Safari Plan [$ticketId] – Century Adventures", $confirmHtml, $routing['reply_to'], null, [
        'message_id'  => buildReplyMessageId($ticketId),
        'in_reply_to' => $initialMsgId,
        'references'  => $initialMsgId
    ]);

    jsonSuccess("Your custom safari plan has been received! Reference: $ticketId.");
}


// ════════════════════════════════════════════════════════════════════════════
// DATABASE
// ════════════════════════════════════════════════════════════════════════════

function getDb(): PDO {
    return getTicketDb();
}

function saveSubmission(string $type, array $fields): void {
    try {
        $db = getDb();
        $name    = $fields['name']    ?? '';
        $email   = $fields['email']   ?? '';
        $phone   = $fields['phone']   ?? '';
        $subject = $fields['subject'] ?? $fields['safari'] ?? $fields['issue_type'] ?? $type;
        $message = $fields['message'] ?? '';

        // Remaining fields go into extra_data as JSON
        $extra = $fields;
        unset($extra['name'], $extra['email'], $extra['phone'], $extra['message']);

        $stmt = $db->prepare("
            INSERT INTO submissions (form_type, name, email, phone, subject, message, extra_data, ip)
            VALUES (:type, :name, :email, :phone, :subject, :message, :extra, :ip)
        ");
        $stmt->execute([
            ':type'    => $type,
            ':name'    => $name,
            ':email'   => $email,
            ':phone'   => $phone,
            ':subject' => $subject,
            ':message' => $message,
            ':extra'   => json_encode($extra, JSON_UNESCAPED_UNICODE),
            ':ip'      => anonymizeIp($_SERVER['REMOTE_ADDR'] ?? ''),
        ]);
    } catch (Exception $e) {
        error_log('[CenturyAdv] DB error: ' . $e->getMessage());
    }
}


// ════════════════════════════════════════════════════════════════════════════
// HELPERS
// ════════════════════════════════════════════════════════════════════════════

function sendMail(string $to, string $toName, string $subject, string $html, ?string $replyTo = null, ?string $cc = null): void {
    sendMailWithHeaders($to, $toName, $subject, $html, $replyTo, $cc);
}

function sendMailWithHeaders(string $to, string $toName, string $subject, string $html, ?string $replyTo = null, ?string $cc = null, array $threading = []): void {
    $mailer = new Mailer();
    $result = $mailer->send($to, $toName, $subject, $html, $replyTo, $cc, $threading);
    if (!$result['success']) {
        error_log('[CenturyAdv] Mail error: ' . $result['error']);
        if (!empty($result['log'])) {
            error_log("[CenturyAdv] SMTP SESSION LOG:\n" . implode("\n", $result['log']));
        }
    }
}

function buildFieldsTable(string $heading, string $badge, array $fields): string {
    $rows = '';
    foreach ($fields as $label => $value) {
        $rows .= "
            <div class='field-row'>
                <div class='field-label'>$label</div>
                <div class='field-value'>$value</div>
            </div>";
    }
    return "
        <span class='badge'>$badge</span>
        <h2>$heading</h2>
        $rows
        <p style='margin-top:24px; color:#777; font-size:13px;'>
            Submitted on " . date('D, d M Y H:i') . " · Century Adventures Admin Panel
        </p>";
}

function buildConfirmation(string $name, string $headline, string $detail): string {
    return "
        <h2 style='color:#004225;'>$headline</h2>
        <p>Hello <strong>$name</strong>,</p>
        <p>$detail</p>
        <p>If you have any urgent questions in the meantime, feel free to reach us at
           <a href='mailto:" . EMAIL_INFO . "' style='color:#c5a044;'>" . EMAIL_INFO . "</a>
           or WhatsApp us at <strong>+255 747 115 390</strong>.</p>
        <p>Best regards,<br><strong>The Century Adventures Team</strong><br>
           🦁 Discover. Explore. Experience.</p>";
}

function rateLimitCheck(): void {
    $ip      = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $key     = sys_get_temp_dir() . '/ca_rate_' . md5($ip);
    $window  = 60;
    $maxReqs = 15; // Increased slightly to support multiple widgets

    $data = ['count' => 0, 'start' => time()];
    if (file_exists($key)) {
        $saved = json_decode(file_get_contents($key), true);
        if ($saved && (time() - $saved['start']) < $window) {
            $data = $saved;
        }
    }

    $data['count']++;
    file_put_contents($key, json_encode($data), LOCK_EX);

    if ($data['count'] > $maxReqs) {
        jsonError('Too many requests. Please wait a minute before trying again.', 429);
    }
}

function sanitize(mixed $val): string {
    return trim(strip_tags((string)$val));
}

function filterEmail(string $val): string {
    $clean = filter_var(trim($val), FILTER_VALIDATE_EMAIL);
    return $clean !== false ? $clean : '';
}

function anonymizeIp(string $ip): string {
    return preg_replace('/\.\d+$/', '.xxx', $ip);
}

function jsonSuccess(string $message): never {
    echo json_encode(['success' => true, 'message' => $message]);
    exit;
}

function jsonError(string $message, int $code = 400): never {
    http_response_code($code);
    echo json_encode(['success' => false, 'message' => $message]);
    exit;
}
