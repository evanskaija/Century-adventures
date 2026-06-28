<?php
/**
 * Century Adventures – SMTP Connection Test
 * ─────────────────────────────────────────────────────────────────────────────
 * ACCESS RESTRICTED: Delete or rename this file after verifying SMTP works.
 * 
 * Usage: Open in browser → https://yourdomain.com/test_mailer.php?key=testme123
 */

// Simple access key – change before deploying!
$ACCESS_KEY = 'testme123';
if (($_GET['key'] ?? '') !== $ACCESS_KEY) {
    http_response_code(403);
    die('<h2 style="font-family:sans-serif;color:red">403 Forbidden – provide ?key=</h2>');
}

require_once __DIR__ . '/smtp-config.php';
require_once __DIR__ . '/mailer.php';

$testTo   = $_GET['to']  ?? SMTP_USER;   // Send test to self by default
$testName = 'Test Recipient';

$html = buildEmailTemplate(
    'SMTP Test – Century Adventures',
    'This is a test email from the Century Adventures mailer.',
    '<h2 style="color:#004225">✅ SMTP Test Successful!</h2>
     <p>If you are reading this, your Zoho SMTP configuration is working correctly.</p>
     <div class="field-row">
        <div class="field-label">SMTP Host</div>
        <div class="field-value">' . SMTP_HOST . ':' . SMTP_PORT . ' (' . SMTP_SECURE . ')</div>
     </div>
     <div class="field-row">
        <div class="field-label">Authenticated As</div>
        <div class="field-value">' . SMTP_FROM . '</div>
     </div>
     <div class="field-row">
        <div class="field-label">Sent At</div>
        <div class="field-value">' . date('D, d M Y H:i:s T') . '</div>
     </div>'
);

$mailer = new Mailer();
$result = $mailer->send($testTo, $testName, '🧪 Century Adventures SMTP Test', $html, SMTP_FROM);

// Output result
header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>SMTP Test – Century Adventures</title>
<style>
  body { font-family: 'Segoe UI', sans-serif; max-width: 760px; margin: 50px auto; padding: 0 24px; }
  h1 { color: #004225; }
  .status { padding: 18px 24px; border-radius: 12px; font-size: 1.1rem; font-weight: 700; margin-bottom: 24px; }
  .ok  { background: #d1fae5; color: #065f46; border: 1px solid #6ee7b7; }
  .err { background: #fee2e2; color: #991b1b; border: 1px solid #fca5a5; }
  pre  { background: #f3f4f6; padding: 20px; border-radius: 8px; font-size: 0.82rem; overflow-x: auto; line-height: 1.6; }
  .warn { color: #d97706; font-size: 0.85rem; margin-top: 20px; border-top: 1px solid #eee; padding-top: 16px; }
</style>
</head>
<body>
<h1>🦁 Century Adventures – SMTP Test</h1>

<?php if ($result['success']): ?>
<div class="status ok">✅ Email sent successfully to <strong><?= htmlspecialchars($testTo) ?></strong></div>
<?php else: ?>
<div class="status err">❌ Failed: <?= htmlspecialchars($result['error']) ?></div>
<?php endif; ?>

<h3>SMTP Session Log</h3>
<pre><?php
foreach ($result['log'] as $line) {
    echo htmlspecialchars($line) . "\n";
}
?></pre>

<h3>Configuration Used</h3>
<pre>
SMTP_HOST:   <?= SMTP_HOST ?>

SMTP_PORT:   <?= SMTP_PORT ?>

SMTP_SECURE: <?= SMTP_SECURE ?>

SMTP_USER:   <?= SMTP_USER ?>

SMTP_FROM:   <?= SMTP_FROM ?>

DB_PATH:     <?= DB_PATH ?>

DB exists:   <?= file_exists(DB_PATH) ? 'YES' : 'NOT YET (will be created on first form submit)' ?>

</pre>

<p class="warn">
  ⚠️ <strong>Security reminder:</strong> Delete or rename <code>test_mailer.php</code> after verifying your SMTP works.
  Anyone with the access key can trigger emails from your server.
</p>
</body>
</html>
