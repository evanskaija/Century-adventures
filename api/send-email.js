const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

function checkCredentials() {
  if (process.env.ZOHO_EMAIL && process.env.ZOHO_PASSWORD) {
    return true;
  }
  try {
    const candidates = [
      path.resolve(process.cwd(), ".env"),
      path.resolve(process.cwd(), "..", ".env"),
      path.resolve(process.cwd(), "Century-adventures-main", ".env"),
      path.resolve(__dirname, ".env"),
      path.resolve(__dirname, "..", ".env"),
      path.resolve(__dirname, "..", "..", ".env"),
      path.resolve(__dirname, "..", "Century-adventures-main", ".env")
    ];
    let envPath = "";
    for (const c of candidates) {
      if (fs.existsSync(c)) {
        envPath = c;
        break;
      }
    }
    if (envPath) {
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

  if (!checkCredentials()) {
    return res.status(500).json({
      success: false,
      error: "SMTP credentials (ZOHO_EMAIL and ZOHO_PASSWORD) are not configured. Please set them in your environment variables or create a .env file at the project root."
    });
  }

  const { name, email, message, form_type, subject, source_page } = req.body;

  // Determine Form Title based on submission parameters
  let formTitle = "General Inquiry Form";
  if (form_type === "booking") {
    formTitle = "Safari Booking Request Form";
  } else if (form_type === "enquiry") {
    formTitle = "Custom Tour Inquiry Form";
  } else if (form_type === "contact") {
    formTitle = "Contact Us Form";
  } else if (subject) {
    formTitle = `${subject} Form`;
  }

  // Predefined order and user-friendly labels for fields
  const fieldLabels = {
    name: "Customer Name",
    email: "Customer Email",
    phone: "Phone Number",
    country: "Country of Residence",
    safari: "Selected Package / Safari",
    safari_type: "Experience Style Preference",
    experience_style: "Experience Style",
    experience_type: "Experience Type",
    travel_date: "Desired Travel Date",
    arrival_date: "Arrival Date",
    departure_date: "Departure Date",
    date: "Travel Dates",
    travelers: "Number of Guests",
    adults: "Adults Count",
    children: "Children Count",
    lodging: "Comfort / Lodging Level",
    budget: "Budget Range",
    source_page: "Submitted from Page",
  };

  // Build key details table rows
  let tableRows = "";
  const dateStr = new Date().toLocaleString("en-US", {
    timeZone: "Africa/Nairobi",
    dateStyle: "medium",
    timeStyle: "short",
  }) + " (EAT)";

  // Add submission time first
  tableRows += `
    <tr>
      <td class="label-cell">Submission Time</td>
      <td class="value-cell">${dateStr}</td>
    </tr>
  `;

  // Dynamically build rows from request payload matching fieldLabels
  for (const [key, label] of Object.entries(fieldLabels)) {
    if (req.body[key] !== undefined && req.body[key] !== "") {
      let val = req.body[key];
      if (Array.isArray(val)) {
        val = val.join(", ");
      }
      tableRows += `
        <tr>
          <td class="label-cell">${label}</td>
          <td class="value-cell">${val}</td>
        </tr>
      `;
    }
  }

  // Include any other custom/unmapped variables except internal config
  const internalKeys = [
    "name", "email", "phone", "message", "notes", "special", "form_type", "subject",
    "access_key", "from_name", "to_email", "_elapsed", "conv_id", "website", "source_page"
  ];
  for (const [key, val] of Object.entries(req.body)) {
    if (!internalKeys.includes(key) && !fieldLabels[key] && val !== undefined && val !== "") {
      const formattedLabel = key.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
      tableRows += `
        <tr>
          <td class="label-cell">${formattedLabel}</td>
          <td class="value-cell">${Array.isArray(val) ? val.join(", ") : val}</td>
        </tr>
      `;
    }
  }

  // Main message / special notes section
  let messageBlock = "";
  const notesText = message || req.body.notes || req.body.special || req.body.special_requests;
  if (notesText) {
    messageBlock = `
      <h2 class="section-title" style="margin-top: 30px;">Visitor Message & Notes</h2>
      <div class="message-box">${notesText}</div>
    `;
  }

  // Generate Branded HTML email body
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Website Submission</title>
  <style>
    body {
      font-family: 'Poppins', 'Helvetica Neue', Helvetica, Arial, sans-serif;
      background-color: #fdfbf7;
      margin: 0;
      padding: 0;
      color: #1a1a1a;
      -webkit-font-smoothing: antialiased;
    }
    .email-container {
      max-width: 600px;
      margin: 30px auto;
      background-color: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0,0,0,0.03);
      border: 1px solid #f1ece4;
    }
    .email-header {
      background-color: #1b4332;
      padding: 30px 40px;
      text-align: center;
      border-bottom: 4px solid #d4af37;
    }
    .email-header img {
      width: 70px;
      height: auto;
      margin-bottom: 12px;
      display: inline-block;
    }
    .email-header h1 {
      font-family: 'Cinzel', Georgia, serif;
      color: #d4af37;
      margin: 0;
      font-size: 22px;
      letter-spacing: 2px;
      text-transform: uppercase;
      font-weight: bold;
    }
    .email-header p {
      color: #ffffff;
      margin: 5px 0 0 0;
      font-size: 13px;
      opacity: 0.9;
      letter-spacing: 1px;
    }
    .email-body {
      padding: 35px 40px;
    }
    .form-title-badge {
      display: inline-block;
      background-color: #f3ede2;
      color: #8b5e3c;
      padding: 6px 16px;
      border-radius: 30px;
      font-size: 12px;
      font-weight: bold;
      text-transform: uppercase;
      margin-bottom: 25px;
      letter-spacing: 1px;
    }
    .section-title {
      font-family: 'Cinzel', Georgia, serif;
      font-size: 17px;
      color: #1b4332;
      border-bottom: 2px solid #f1ece4;
      padding-bottom: 8px;
      margin-top: 0;
      margin-bottom: 18px;
      font-weight: bold;
    }
    .details-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 25px;
    }
    .details-table tr:nth-child(even) {
      background-color: #faf8f5;
    }
    .details-table td {
      padding: 12px 16px;
      border-bottom: 1px solid #f5ede0;
      vertical-align: top;
      font-size: 14px;
      line-height: 1.5;
    }
    .label-cell {
      font-weight: bold;
      color: #1b4332;
      width: 38%;
    }
    .value-cell {
      color: #4a4a4a;
    }
    .message-box {
      background-color: #faf8f5;
      border-left: 4px solid #d4af37;
      padding: 20px;
      border-radius: 0 10px 10px 0;
      font-size: 14px;
      line-height: 1.6;
      color: #4a4a4a;
      white-space: pre-wrap;
    }
    .email-footer {
      background-color: #1b4332;
      padding: 25px;
      text-align: center;
      color: #ffffff;
      font-size: 12px;
      border-top: 1px solid rgba(255,255,255,0.05);
    }
    .email-footer p {
      margin: 4px 0;
      opacity: 0.8;
    }
    .email-footer a {
      color: #d4af37;
      text-decoration: none;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      <img src="https://www.century-adventures.com/assets/logo.png" alt="Century Adventures Logo" height="70">
      <h1>Century Adventures</h1>
      <p>Official Website Submission</p>
    </div>
    <div class="email-body">
      <span class="form-title-badge">${formTitle}</span>
      <h2 class="section-title">Submission Details</h2>
      <table class="details-table">
        ${tableRows}
      </table>
      ${messageBlock}
    </div>
    <div class="email-footer">
      <p>This inquiry was automatically generated from the <a href="https://www.century-adventures.com">Century Adventures Website</a>.</p>
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
      user: process.env.ZOHO_EMAIL,
      pass: process.env.ZOHO_PASSWORD,
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.ZOHO_EMAIL,
      replyTo: email || process.env.ZOHO_EMAIL,
      to: process.env.ZOHO_EMAIL,
      subject: `[Website Submission] ${formTitle} from ${name || "Visitor"}`,
      html: htmlContent,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error sending branded form email:", error);
    res.status(500).json({ success: false, error: error.message });
  }
}
