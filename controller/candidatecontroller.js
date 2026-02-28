const condidate = require('../model/candidatemodel');
const user = require('../model/usermodel');
const nodemailer = require('nodemailer');
require("dotenv").config()
exports.addcandidate = async (req, res) => {
    try {
        const { name, email, phone, password, education, experience } = req.body;
        const newCandidate = new condidate({
            name,
            email,
            phone,
            password,
            education,
            experience
        });
        const userdata=new user({
            name:name,
            email:email,
            phone:phone,
            password:password,
            role:"candidate"
        })
        console.log("password>>>>>>>>>>>",password)
               const transporter = nodemailer.createTransport({
                   service: 'gmail',
                   auth: {
                       user: process.env.USER_EMAIL,
                       pass: process.env.USER_PASS,
                   }
               });
        const info =transporter.sendMail({ 
            from: process.env.USER_EMAIL,
            to: email,
            subject: 'Welcome to Job Portal',
            text: `Hello ${name},\n\nThank you for registering as a candidate on
             our job portal. We are excited to have you on board!\n\nBest regards,\nJob Portal Team`
        }); 
        await userdata.save()
        const savedCandidate = await newCandidate.save();
        res.status(201).json(savedCandidate);
    }
        catch (error) {
        res.status(500).json({ error: 'Failed to add candidate' });
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
