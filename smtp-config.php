<?php
/**
 * Century Adventures – SMTP Configuration
 * ─────────────────────────────────────────────────────────────────────────────
 * Edit ONLY the values in this file. All mailer scripts load this config.
 *
 * Zoho Mail SMTP uses port 465 (SSL) or 587 (STARTTLS).
 * The FROM address MUST match the authenticated Zoho account.
 */

// ── SMTP Credentials ────────────────────────────────────────────────────────
define('SMTP_HOST',     'smtp.zoho.com');
define('SMTP_PORT',     465);              // 465 = SSL  |  587 = STARTTLS
define('SMTP_SECURE',   'ssl');            // 'ssl' or 'tls'
define('SMTP_USER',     'admin@century-adventures.com');   // Zoho login email
define('SMTP_PASS',     'YOUR_ZOHO_APP_PASSWORD');         // Zoho App-specific password
define('SMTP_FROM',     'admin@century-adventures.com');   // Must match SMTP_USER on Zoho
define('SMTP_FROM_NAME','Century Adventures');

// ── Business Email Routing ───────────────────────────────────────────────────
define('EMAIL_ADMIN',    'admin@century-adventures.com');
define('EMAIL_INFO',     'info@century-adventures.com');
define('EMAIL_BOOKINGS', 'bookings@century-adventures.com');
define('EMAIL_VISIT',    'visit@century-adventures.com');

// ── Database Path ────────────────────────────────────────────────────────────
define('DB_PATH', __DIR__ . '/database.sqlite');

// ── Security ─────────────────────────────────────────────────────────────────
define('HONEYPOT_FIELD', 'website');   // Hidden field name; must be empty on submit
define('MIN_SUBMIT_TIME', 3);          // Seconds since page load (bot guard)
define('ALLOWED_ORIGINS', [            // Domains allowed to POST to the API
    'http://localhost',
    'http://127.0.0.1',
    'https://century-adventures.com',
    'https://www.century-adventures.com',
]);
