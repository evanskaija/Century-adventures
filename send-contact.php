<?php
/**
 * Century Adventures – Contact Form Submission Handler
 * ─────────────────────────────────────────────────────────────────────────────
 * Routes enquiries to infor@century-adventures.com
 * Uses the custom Pure PHP SMTP Mailer (Zoho SMTP) for domain authentication,
 * and falls back to PHP mail() if SMTP fails or is not configured.
 */

require_once __DIR__ . '/smtp-config.php';
require_once __DIR__ . '/mailer.php';

// Sanitize inputs
$name      = strip_tags(trim($_POST['name'] ?? ''));
$email     = filter_var(trim($_POST['email'] ?? ''), FILTER_VALIDATE_EMAIL);
$phone     = strip_tags(trim($_POST['phone'] ?? ''));
$safari    = strip_tags(trim($_POST['safari_type'] ?? ''));
$date      = strip_tags(trim($_POST['travel_date'] ?? ''));
$travelers = strip_tags(trim($_POST['travelers'] ?? ''));
$message   = strip_tags(trim($_POST['message'] ?? ''));

if (!$name || !$email) {
    echo "Name and a valid email address are required.";
    exit;
}

$to = "infor@century-adventures.com";
$subject = "New Contact Enquiry - Century Adventures";

// Build plain text message body for fallback
$body = "New enquiry received from Century Adventures website\n\n" .
        "Name: $name\n" .
        "Email: $email\n" .
        "Phone: $phone\n" .
        "Safari Type: $safari\n" .
        "Travel Date: $date\n" .
        "Number of Guests: $travelers\n\n" .
        "Message:\n$message";

// For Zoho SMTP, we send HTML formatted email (looks premium and professional)
$htmlBody = buildEmailTemplate(
    $subject,
    "New contact enquiry from $name",
    "<h2>New contact enquiry from website</h2>" .
    "<div class='field-row'><div class='field-label'>Name</div><div class='field-value'>$name</div></div>" .
    "<div class='field-row'><div class='field-label'>Email</div><div class='field-value'><a href='mailto:$email'>$email</a></div></div>" .
    "<div class='field-row'><div class='field-label'>Phone</div><div class='field-value'>$phone</div></div>" .
    "<div class='field-row'><div class='field-label'>Safari Type</div><div class='field-value'>$safari</div></div>" .
    "<div class='field-row'><div class='field-label'>Travel Date</div><div class='field-value'>$date</div></div>" .
    "<div class='field-row'><div class='field-label'>Number of Guests</div><div class='field-value'>$travelers</div></div>" .
    "<div class='field-row'><div class='field-label'>Message</div><div class='field-value'>" . nl2br(htmlspecialchars($message)) . "</div></div>"
);

// Try using Zoho SMTP first
$smtpSuccess = false;
try {
    $mailer = new Mailer();
    $result = $mailer->send($to, "Century Adventures Team", $subject, $htmlBody, $email);
    if ($result['success']) {
        $smtpSuccess = true;
    } else {
        error_log("[CenturyAdv] send-contact.php SMTP failed: " . $result['error']);
    }
} catch (Exception $e) {
    error_log("[CenturyAdv] send-contact.php SMTP exception: " . $e->getMessage());
}

if ($smtpSuccess) {
    header("Location: contact.html?success=1");
    exit();
}

// Fallback to PHP mail() if SMTP fails
$headers = "From: website@century-adventures.com\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

if (mail($to, $subject, $body, $headers)) {
    header("Location: contact.html?success=1");
    exit();
} else {
    echo "Message failed. Please try again.";
}
?>
