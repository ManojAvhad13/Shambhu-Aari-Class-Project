const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// POST route to send email
app.post('/send-email', async (req, res) => {
    const { name, phone, mode } = req.body;

    if (!name || !phone || !mode) {
        return res.status(400).send("Missing required fields");
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'avhadmanu58@gmail.com',
            pass: 'skqc lnck jvuo avnz' // Use App Password if 2FA is enabled
        }
    });

    // Email options
    const mailOptions = {
        // shobhanaikwade99@gmail.com
        // avhadmanu58@gmail.com
        from: 'avhadmanu58@gmail.com',
        to: 'avhadmanu58@gmail.com', // or your own email
        subject: 'New Join Request - Shambhu Fashion Design',
        html: `
            <h3>New Student Join Request</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Mode:</strong> ${mode} class</p>
            <p><strong>Address:</strong> ${req.body.address || 'Not provided'}</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).send('Email sent successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to send email');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
