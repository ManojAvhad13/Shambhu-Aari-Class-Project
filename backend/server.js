const express = require('express');
const Student = require('./models/Student');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const app = express();
const PORT = 5000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/shambhu-fashion-design', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("MongoDB connected successfully");
}).catch((err) => {
    console.error("MongoDB connection failed:", err);
});





// const DATA_FILE = path.join(__dirname, 'students.json');
const ADMIN_CREDENTIALS = {
    id: 'shobha-admin',
    password: 'shambhu9950'
};

// Helper to get data and persist to JSON file
const saveStudent = (student) => {
    Student.find()
        .then(data => res.json(data))
        .catch(err => res.status(500).send("Error fetching students"));

};

app.delete('/students/:id', async (req, res) => {
    try {
        await Student.findByIdAndDelete(req.params.id);
        res.status(200).send("Student deleted");
    } catch (err) {
        res.status(500).send("Failed to delete student");
    }
});


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
            pass: 'skqc lnck jvuo avnz'
        }
    });

    // Email options
    const mailOptions = {

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
        // Store in MongoDB
        const student = new Student({ name, phone, address, mode });
        await student.save();

        // Send email & SMS (keep your existing Nodemailer + SMS logic here)

        res.status(200).json({ message: 'Submitted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error saving student', error: err.message });
    }
});

// Fetch all students data
app.get('/students', async (req, res) => {
    try {
        const students = await Student.find().sort({ _id: -1 }); // Latest first
        res.json(students);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching students', error: err.message });
    }
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
