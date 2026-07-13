const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

function checkCredentials() {
  if (process.env.ZOHO_EMAIL && process.env.ZOHO_PASSWORD) {
    return true;
  }
  try {
    const envPath = path.resolve(process.cwd(), ".env");
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, "utf-8");
      envContent.split("\n").forEach(line => {
        const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
        if (match) {
          const key = match[1];
          let value = match[2] || "";
          if (value.length > 0 && value.charAt(0) === '"' && value.charAt(value.length - 1) === '"') {
            value = value.substring(1, value.length - 1);
          } else if (value.length > 0 && value.charAt(0) === "'" && value.charAt(value.length - 1) === "'") {
            value = value.substring(1, value.length - 1);
          }
          process.env[key] = value.trim();
        }
      });
    }
  } catch (err) {
    console.warn("Could not read local .env file:", err);
  }
  return !!(process.env.ZOHO_EMAIL && process.env.ZOHO_PASSWORD);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const {
    passcode,
    conv_id,
    customer_email,
    customer_name,
    reply_text,
    structured_response,
    form_type,
    ticket_ref,
    original_inquiry,
  } = req.body;

  // Verification passcode
  if (passcode !== "centuryadmin") {
    return res.status(403).json({ success: false, message: "Unauthorized passcode" });
  }

  if (!customer_email) {
    return res.status(400).json({ success: false, message: "Customer email is required" });
  }

  if (!checkCredentials()) {
    return res.status(500).json({
      success: false,
      error: "SMTP credentials (ZOHO_EMAIL and ZOHO_PASSWORD) are not configured. Please set them in your environment variables or create a .env file at the project root."
    });
  }

  // Set sender and target details
  const senderEmail = process.env.ZOHO_EMAIL;
  const replyToEmail = process.env.ZOHO_EMAIL;

  // Format the message body
  let mainContentHtml = "";
  let subject = `[Century Adventures] Update regarding your inquiry ${ticket_ref || ""}`;

  if (structured_response) {
    const {
      ref_number,
      tour_package,
      price_quotation,
      travel_dates,
      availability_status,
      notes,
      terms_conditions,
    } = structured_response;

    subject = `[Century Adventures] Tour Booking Quote ${ref_number || ticket_ref} - ${tour_package || "Safari Inquiry"}`;

    let statusBadgeColor = "#b45309"; // Amber/brown
    let statusBadgeBg = "#fef3c7";
    if (availability_status === "Available" || availability_status === "Confirmed") {
      statusBadgeColor = "#15803d";
      statusBadgeBg = "#dcfce7";
    } else if (availability_status === "Waitlisted" || availability_status === "Pending") {
      statusBadgeColor = "#b45309";
      statusBadgeBg = "#fef3c7";
    } else if (availability_status === "Unavailable") {
      statusBadgeColor = "#b91c1c";
      statusBadgeBg = "#fee2e2";
    }

    mainContentHtml = `
      <p style="font-size: 15px; margin-bottom: 25px;">Dear ${customer_name || "Valued Client"},</p>
      <p style="font-size: 15px; line-height: 1.6; margin-bottom: 30px;">
        Thank you for choosing <strong>Century Adventures</strong>. We are pleased to provide a structured quotation and availability update for your custom safari booking. Please find the official proposal details listed below:
      </p>

      <!-- Structured Quote Card -->
      <div style="background-color: #ffffff; border: 1px solid #f1ece4; border-radius: 14px; overflow: hidden; margin-bottom: 30px; box-shadow: 0 4px 15px rgba(0,0,0,0.02);">
        <div style="background-color: #fcfaf7; border-bottom: 1px solid #f1ece4; padding: 16px 25px; display: flex; justify-content: space-between; align-items: center;">
          <span style="font-family: 'Cinzel', Georgia, serif; font-weight: bold; color: #1b4332; font-size: 15px;">Official Safari Quotation</span>
          <span style="font-size: 12px; color: #8b5e3c; font-weight: bold;">Ref: ${ref_number || "N/A"}</span>
        </div>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr>
            <td style="padding: 14px 20px; border-bottom: 1px solid #fcfaf7; color: #666666; width: 40%;">Tour Package</td>
            <td style="padding: 14px 20px; border-bottom: 1px solid #fcfaf7; font-weight: bold; color: #1b4332;">${tour_package || "Custom Safari Itinerary"}</td>
          </tr>
          <tr>
            <td style="padding: 14px 20px; border-bottom: 1px solid #fcfaf7; color: #666666;">Travel Dates</td>
            <td style="padding: 14px 20px; border-bottom: 1px solid #fcfaf7; font-weight: bold; color: #1b4332;">${travel_dates || "To be decided"}</td>
          </tr>
          <tr>
            <td style="padding: 14px 20px; border-bottom: 1px solid #fcfaf7; color: #666666;">Price / Quotation</td>
            <td style="padding: 14px 20px; border-bottom: 1px solid #fcfaf7; font-weight: bold; color: #d4af37; font-size: 15px;">${price_quotation || "Contact for pricing"}</td>
          </tr>
          <tr>
            <td style="padding: 14px 20px; border-bottom: 1px solid #fcfaf7; color: #666666;">Availability Status</td>
            <td style="padding: 14px 20px; border-bottom: 1px solid #fcfaf7;">
              <span style="display: inline-block; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: bold; color: ${statusBadgeColor}; background-color: ${statusBadgeBg}; text-transform: uppercase;">
                ${availability_status || "Pending"}
              </span>
            </td>
          </tr>
        </table>
      </div>

      <!-- Notes block -->
      ${notes ? `
        <h3 style="font-family: 'Cinzel', Georgia, serif; color: #1b4332; font-size: 15px; margin-top: 25px; margin-bottom: 12px; border-bottom: 1px solid #f1ece4; padding-bottom: 6px;">Tour Program Details</h3>
        <div style="background-color: #faf8f5; border-left: 4px solid #1b4332; padding: 18px 22px; border-radius: 0 10px 10px 0; font-size: 14px; line-height: 1.6; color: #4a4a4a; white-space: pre-wrap; margin-bottom: 25px;">${notes}</div>
      ` : ""}

      <!-- Terms & conditions block -->
      ${terms_conditions ? `
        <h3 style="font-family: 'Cinzel', Georgia, serif; color: #1b4332; font-size: 15px; margin-top: 25px; margin-bottom: 12px; border-bottom: 1px solid #f1ece4; padding-bottom: 6px;">Booking Terms & Conditions</h3>
        <div style="background-color: #faf8f5; border-left: 4px solid #d4af37; padding: 18px 22px; border-radius: 0 10px 10px 0; font-size: 12px; line-height: 1.6; color: #666666; white-space: pre-wrap; margin-bottom: 25px;">${terms_conditions}</div>
      ` : ""}
    `;
  } else {
    mainContentHtml = `
      <p style="font-size: 15px; margin-bottom: 20px;">Dear ${customer_name || "Valued Client"},</p>
      <div style="font-size: 15px; line-height: 1.6; color: #2d3748; white-space: pre-wrap; margin-bottom: 30px;">${reply_text}</div>
    `;
  }

  // Original Inquiry display
  let originalInquiryBlock = "";
  if (original_inquiry) {
    originalInquiryBlock = `
      <div style="margin-top: 40px; padding-top: 25px; border-top: 2px dashed #e2e8f0;">
        <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #8b5e3c; font-weight: bold; display: block; margin-bottom: 12px;">Original Inquiry Reference</span>
        <blockquote style="margin: 0; padding: 15px 20px; background-color: #f7fafc; border-left: 3px solid #cbd5e0; font-size: 13.5px; line-height: 1.6; color: #718096; border-radius: 0 8px 8px 0; white-space: pre-wrap;">${original_inquiry}</blockquote>
      </div>
    `;
  }

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Century Adventures Reply</title>
  <style>
    body {
      font-family: 'Poppins', 'Helvetica Neue', Helvetica, Arial, sans-serif;
      background-color: #fdfbf7;
      margin: 0;
      padding: 0;
      color: #1a1a1a;
      -webkit-font-smoothing: antialiased;
    }
    .container {
      max-width: 600px;
      margin: 30px auto;
      background-color: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0,0,0,0.03);
      border: 1px solid #f1ece4;
    }
    .header {
      background-color: #1b4332;
      padding: 30px 40px;
      text-align: center;
      border-bottom: 4px solid #d4af37;
    }
    .header img {
      width: 70px;
      height: auto;
      margin-bottom: 12px;
      display: inline-block;
    }
    .header h1 {
      font-family: 'Cinzel', Georgia, serif;
      color: #d4af37;
      margin: 0;
      font-size: 22px;
      letter-spacing: 2px;
      text-transform: uppercase;
      font-weight: bold;
    }
    .header p {
      color: #ffffff;
      margin: 5px 0 0 0;
      font-size: 13px;
      opacity: 0.9;
      letter-spacing: 1px;
    }
    .body {
      padding: 40px;
    }
    .signature {
      margin-top: 35px;
      padding-top: 20px;
      border-top: 1px solid #f1ece4;
      font-size: 14px;
      line-height: 1.5;
    }
    .social-links {
      margin-top: 15px;
      display: flex;
      gap: 12px;
    }
    .social-links a {
      font-size: 11px;
      font-weight: bold;
      color: #8b5e3c;
      text-decoration: none;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .social-links a:hover {
      color: #1b4332;
    }
    .footer {
      background-color: #1b4332;
      padding: 25px;
      text-align: center;
      color: #ffffff;
      font-size: 12px;
      border-top: 1px solid rgba(255,255,255,0.05);
    }
    .footer p {
      margin: 4px 0;
      opacity: 0.8;
    }
    .footer a {
      color: #d4af37;
      text-decoration: none;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://www.century-adventures.com/assets/logo.png" alt="Century Adventures Logo" height="70">
      <h1>Century Adventures</h1>
      <p>Luxury Safaris & Wildlife Tours</p>
    </div>
    <div class="body">
      ${mainContentHtml}
      
      <!-- Company Signature -->
      <div class="signature">
        <p style="margin: 0; font-weight: bold; color: #1b4332;">Sincerely,</p>
        <p style="margin: 5px 0 15px 0; color: #8b5e3c; font-weight: bold;">Century Adventures Sales & Reservations Team</p>
        
        <p style="margin: 3px 0; font-size: 13px; color: #666666;">
          <strong>Phone:</strong> +255 744 333 444 | <strong>Email:</strong> info@century-adventures.com
        </p>
        <p style="margin: 3px 0; font-size: 13px; color: #666666;">
          <strong>Address:</strong> Serengeti Block B, Arusha, Tanzania
        </p>
        
        <div class="social-links">
          <a href="https://www.century-adventures.com" target="_blank">Website</a> &bull;
          <a href="https://www.facebook.com/profile.php?id=61577731823809" target="_blank">Facebook</a> &bull;
          <a href="https://www.instagram.com" target="_blank">Instagram</a> &bull;
          <a href="https://www.tripadvisor.com" target="_blank">TripAdvisor</a>
        </div>
      </div>

      <!-- Original Inquiry Thread -->
      ${originalInquiryBlock}
    </div>
    <div class="footer">
      <p>This message was sent by Century Adventures Staff regarding your custom booking request.</p>
      <p>&copy; ${new Date().getFullYear()} Century Adventures. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `;

  const transporter = nodemailer.createTransport({
    host: "smtp.zoho.com",
    port: 465,
    secure: true,
    auth: {
      user: senderEmail,
      pass: process.env.ZOHO_PASSWORD,
    },
  });

  try {
    await transporter.sendMail({
      from: senderEmail,
      replyTo: replyToEmail,
      to: customer_email,
      subject: subject,
      html: htmlBody,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error sending response email to customer:", error);
    res.status(500).json({ success: false, error: error.message });
  }
}
