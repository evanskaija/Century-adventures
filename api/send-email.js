const nodemailer = require("nodemailer");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const {
    name,
    email,
    phone,
    safari_type,
    travel_date,
    travelers,
    message
  } = req.body;

  const transporter = nodemailer.createTransport({
    host: "smtppro.zoho.com",
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
      replyTo: email,
      to: process.env.ZOHO_EMAIL,
      subject: `New Safari Enquiry from ${name}`,
      text: `
New Website Enquiry - Century Adventures

Name: ${name}
Email: ${email}
Phone / WhatsApp: ${phone}

Safari Type: ${safari_type}
Preferred Travel Date: ${travel_date}
Number of Guests: ${travelers}

Message:
${message}
      `,
    });

    res.status(200).json({ success: true });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}