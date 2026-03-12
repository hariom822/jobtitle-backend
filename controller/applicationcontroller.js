const application = require('../model/Applcationmodel');
const nodemailer = require('nodemailer');
const uploadimg = require("../utility/cloudnary").uploadImage;
require('dotenv').config();
exports.addapplication = async (req, res) => {
    try {
        const { userId, jobId, coverLetter } = req.body;
        const resume=req.files
       
        console.log(">>>>>>>>",resume)
        const resumeurl=await uploadimg(resume,)
        console.log("ffffffffff>>>",resumeurl)
         const newApplication = new application({
            userId,
            jobId,
            resume:resumeurl[0].url,
            coverLetter
        });
        
        await newApplication.save();
        res.status(201).json({ message: 'Application added successfully', application: newApplication });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.allapplication = async (req, res) => {
    try {
        const applications = await application.find().populate('jobId').populate("userId");
        res.json(applications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getApplicationsByJobId = async (req, res) => {
    try {
        const { jobId } = req.params;
        const applications = await application.find({ jobId }).populate('userId');
        res.json(applications);
    }
        catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.oneapplication = async (req, res) => {
    try {
        const app = await application.findById(req.params.id).populate('userId').populate('jobId');
        if (!app) return res.status(404).json({ message: 'Application not found' });
        res.json(app);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateapplication = async (req, res) => {
    try {
        const { userId, jobId, status, resume, coverLetter } = req.body;
        console.log(">>>req.body", req.body)
        if(status === "accepted"){
            const app = await application.findById(req.params.id).populate('userId').populate('jobId');
            console.log(">>>app", app)
            if (!app) return res.status(404).json({ message: 'Application not found' });
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.USER_EMAIL,
                pass: process.env.USER_PASS,
                }
            });
           await transporter.sendMail({
  from: process.env.USER_EMAIL,
  to: app.userId.email,
  subject: "Application Status Update",

  html: `
  <div style="font-family: Arial, sans-serif; line-height:1.6; color:#333;">
    
    <h2 style="color:#2c3e50;">Application Status Update</h2>

    <p>Dear <b>${app.userId.name}</b>,</p>

    <p>
      Thank you for applying for the position of 
      <b>${app.jobId.name}</b>.
    </p>

    <p>
      We have reviewed your application and would like to inform you that 
      your application status is:
    </p>

    <p style="font-size:18px; font-weight:bold; color:${
      status === "accepted" ? "green" : "red"
    };">
      ${status.toUpperCase()}
    </p>

    <hr/>

    <h3>Job Details</h3>
    <table style="border-collapse: collapse;">
      <tr>
        <td><b>Position:</b></td>
        <td>${app.jobId.name}</td>
      </tr>
      <tr>
        <td><b>Location:</b></td>
        <td>${app.jobId.location}</td>
      </tr>
      <tr>
        <td><b>Salary:</b></td>
        <td>₹${app.jobId.salary}</td>
      </tr>
    </table>

    <p>
      If you have any questions, feel free to contact the company.
    </p>

    <br/>

    <p>
      Best Regards,<br/>
      <b>Recruitment Team</b>
    </p>

  </div>
  `
});
        }

        const updatedApp = await application.findByIdAndUpdate(
            req.params.id,
            { userId, jobId, status, resume, coverLetter },
            { new: true }
        ).populate('userId').populate('jobId');
        if (!updatedApp) return res.status(404).json({ message: 'Application not found' });
        res.json(updatedApp);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteapplication = async (req, res) => {
    try {
        const deletedApp = await application.findByIdAndDelete(req.params.id);
        if (!deletedApp) return res.status(404).json({ message: 'Application not found' });
        res.json({ message: 'Application deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getMyApplications = async (req, res) => {
  try {
    console.log("getMyApplications called with userId:", req.params.id);    
    const apps = await application.find({
      userId: req.params.id
    });
    console.log("my applications", apps);
    res.json(apps);

  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};