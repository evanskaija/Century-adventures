const nodemailer = require('nodemailer');
const querystring = require('querystring');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  // Vercel serverless functions parse body automatically, but in case of urlencoded or raw string:
  let body = req.body || {};
  if (typeof body === 'string') {
    body = querystring.parse(body);
  }

  const name = body.name || '';
  const email = body.email || '';
  const phone = body.phone || '';
  const safari_type = body.safari_type || '';
  const travel_date = body.travel_date || '';
  const travelers = body.travelers || '';
  const message = body.message || '';

  if (!name || !email) {
    res.status(400).send('Name and email are required.');
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: 'smtppro.zoho.com',
      port: 465,
      secure: true, // SSL/TLS
      auth: {
        user: 'admin@century-adventures.com',
        pass: 'cU7qAcMZYmqv'
      }
    });

    const mailOptions = {
      from: '"Century Adventures Website" <admin@century-adventures.com>',
      to: 'admin@century-adventures.com',
      replyTo: `"${name}" <${email}>`,
      subject: 'New Contact Enquiry - Century Adventures',
      html: `
        <h2>New Website Enquiry</h2>
        <strong>Name:</strong> ${name}<br>
        <strong>Email:</strong> ${email}<br>
        <strong>Phone:</strong> ${phone}<br>
        <strong>Safari Type:</strong> ${safari_type}<br>
        <strong>Travel Date:</strong> ${travel_date}<br>
        <strong>Guests:</strong> ${travelers}<br><br>
        <strong>Message:</strong><br>
        ${message.replace(/\r?\n/g, '<br>')}
      `
    };

    await transporter.sendMail(mailOptions);

    // Redirect to contact.html with success param (like send-contact.php did)
    res.writeHead(302, { Location: '/contact.html?success=1' });
    res.end();
  } catch (error) {
    res.status(500).send('Error: ' + error.message);
  }
};
