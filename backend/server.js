const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));


const DATA_FILE = path.join(__dirname, 'students.json');
const ADMIN_CREDENTIALS = {
    id: 'shobha-admin',
    password: 'shambhu9950'
};

// Helper to get data and persist to JSON file
const saveStudent = (student) => {
    const data = fs.existsSync(DATA_FILE) ? JSON.parse(fs.readFileSync(DATA_FILE)) : [];
    data.push(student);
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

// POST route to send email
app.post('/send-email', async (req, res) => {
    const { name, phone, mode, address } = req.body;

    if (!name || !phone || !mode || !address) {
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
        // Add start & end date
        // const startDate = new Date().toLocaleDateString();
        // const endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(); // +30 days
        saveStudent({ name, phone, mode, address });
        res.status(200).send('Email sent successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to send email');
    }
});

// Fetch all students data
app.get('/students', (req, res) => {
    const data = fs.existsSync(DATA_FILE) ? JSON.parse(fs.readFileSync(DATA_FILE)) : [];
    res.json(data);
});

// Admin login route
app.post('/admin-login', (req, res) => {
    const { adminId, adminPassword } = req.body;
    if (adminId === ADMIN_CREDENTIALS.id && adminPassword === ADMIN_CREDENTIALS.password) {
        res.status(200).send("Logged in");
    } else {
        res.status(401).send("Invalid login");
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
