require("dotenv").config();

const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("."));


app.post("/api/send-email", async (req, res) => {

    const {
        name,
        email,
        phone,
        safari_type,
        travel_date,
        travelers,
        message
    } = req.body;


    try {

        const transporter = nodemailer.createTransport({

            host: "smtppro.zoho.com",
            port: 465,
            secure: true,

            auth: {
                user: process.env.ZOHO_EMAIL,
                pass: process.env.ZOHO_PASSWORD
            }

        });


        await transporter.sendMail({

            from: process.env.ZOHO_EMAIL,

            to: process.env.ZOHO_EMAIL,

            subject: "New Safari Enquiry",

            html: `
            <h2>New Safari Enquiry</h2>

            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Safari Type:</strong> ${safari_type}</p>
            <p><strong>Travel Date:</strong> ${travel_date}</p>
            <p><strong>Guests:</strong> ${travelers}</p>

            <h3>Message</h3>
            <p>${message}</p>
            `

        });


        res.json({
            success: true
        });


    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false
        });

    }

});


app.listen(3000, () => {

    console.log("Server running on port 3000");

});