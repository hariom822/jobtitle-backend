const condidate = require('../model/candidatemodel');
const user = require('../model/usermodel');
const nodemailer = require('nodemailer');
const bcrypt =require("bcrypt")
require("dotenv").config()
exports.addcandidate = async (req, res) => {
    try {
        const { name, email, phone, password, education, experience } = req.body;

        // Required fields check
        if (!name || !email || !phone || !password) {
            return res.status(400).json({ error: "Name, email, phone, and password are required" });
        }

        // Check if user already exists
        const existingUser = await user.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        // Hash password for user
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create Candidate (without password)
        const newCandidate = new condidate({
            name,
            email,
            phone,
            education,
            experience
        });

        // Create User (with hashed password)
        const userdata = new user({
            name,
            email,
            phone,
            password: hashedPassword,
            role: "candidate"
        });

        // Send welcome mail in nice HTML format
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.USER_EMAIL,
                pass: process.env.USER_PASS
            }
        });

        const info = await transporter.sendMail({
            from: `"Job Portal Team" <${process.env.USER_EMAIL}>`,
            to: email,
            subject: "🎉 Welcome to Job Portal",
            html: `
            <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; padding:20px; border:1px solid #ddd; border-radius:10px;">
                <h2 style="color:#0c66e4;">Welcome, ${name}!</h2>
                <p>Thank you for registering as a candidate on our <strong>Job Portal</strong>.</p>
                <div style="margin:20px 0; padding:15px; background:#f3f4f6; border-radius:6px;">
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Phone:</strong> ${phone}</p>
                    <p><strong>Password:</strong> ${password}</p>
                </div>
                <p style="margin-top:20px;">You can now login and apply for jobs.</p>
                <a href="http://localhost:5173/login" 
                   style="display:inline-block; margin-top:15px; padding:10px 20px; background:#0c66e4; color:white; text-decoration:none; border-radius:5px;">
                   Login Now
                </a>
                <p style="margin-top:20px; font-size:12px; color:#555;">
                    For security, please change your password after first login.
                </p>
            </div>
            `
        });

        console.log("Mail sent:", info.messageId);

        // Save to database
        await userdata.save();
        const savedCandidate = await newCandidate.save();

        res.status(201).json(savedCandidate);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to add candidate" });
    }
};

exports.allcandidate = async (req, res) => {
    try {
        const candidates = await condidate.find();
        res.status(200).json(candidates);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch candidates' });
    }
};
exports.onecandidate = async (req, res) => {
    try {
        const candidate = await condidate.findById(req.params.id);
        if (!candidate) {
            return res.status(404).json({ error: 'Candidate not found' });
        }
        res.status(200).json(candidate);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch candidate' });
    }
};
exports.updatecandidate = async (req, res) => {
    try {
        const updatedCandidate = await condidate.findByIdAndUpdate(req.params.id, req.body,{ new: true });
        if (!updatedCandidate) {
            return res.status(404).json({ error: 'Candidate not found' });
        }
        res.status(200).json(updatedCandidate);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update candidate' });
    }
};
exports.deletecandidate = async (req, res) => {
    try {
        const deletedCandidate = await condidate.findByIdAndDelete(req.params.id);
        if (!deletedCandidate) {
            return res.status(404).json({ error: 'Candidate not found' });
        }
        res.status(200).json({ message: 'Candidate deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete candidate' });
    }
};
