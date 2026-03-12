const companiemodel = require('../model/companiymodel');
const usermodel = require('../model/usermodel');
const bcrypt = require('bcrypt');
require("dotenv").config()

const nodemailer = require("nodemailer");
exports.addcompanie = async (req, res) => {
    try {
        console.log(">>>req.body", req.body)
        const { companiename, email, phone, password, companydescription, companyaddress } = req.body;
        if (!companiename || !email) {
            return res.status(400).json({ error: 'Companie name and email are required' });
        }
       
        const existingUser = await usermodel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        console.log(">>>hashedPassword", hashedPassword)
         const newCompanie = new companiemodel({
            companiename,
            email,
            phone,
            password: hashedPassword,
            companydescription,
            companyaddress,
            website:req.body.website,
            logo:req.body.logo,
            userId:req.body.userId
        });
        console.log(">>>newCompanie", newCompanie)
        const userdata = new usermodel({
            name: companiename,
            email,
            phone,
            password: hashedPassword,
            role: "companie"
        });
        console.log(">>>user", userdata)
        await userdata.save();
        console.log(">>>user saved")
        const savedCompanie = await newCompanie.save();
        console.log(">>>savedCompanie", savedCompanie)
        res.status(201).json(savedCompanie);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add companie' });
    }
};

exports.allcompanie = async (req, res) => {
    try {
        const companies = await companiemodel.find();
        res.status(200).json(companies);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch companies' });
    }
};
exports.onecompanie = async (req, res) => {
    try {
        const companie = await companiemodel.findById(req.params.id);   
        if (!companie) {
            return res.status(404).json({ error: 'Companie not found' });
        }
        res.status(200).json(companie);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch companie' });
    }
};
exports.updatecompanie = async (req, res) => {
    try {
        const updatedCompanie = await companiemodel.findByIdAndUpdate
            (req.params.id, req.body
                , { new: true });
        if (!updatedCompanie) {
            return res.status(404).json({ error: 'Companie not found' });
        }
        res.status(200).json(updatedCompanie);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update companie' });
    }
};
exports.deletecompanie = async (req, res) => {
    try {
        const deletedCompanie = await companiemodel.findByIdAndDelete(req.params.id);
        if (!deletedCompanie) {
            return res.status(404).json({ error: 'Companie not found' });
        }
        res.status(200).json({ message: 'Companie deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete companie' });
    }
};


exports.companyAction = async (req, res) => {

try {

const { status, rejectReason } = req.body;

const company = await companiemodel.findById(req.params.id);

if (!company) {
return res.status(404).json({ message: "Company not found" });
}


// ================= ACCEPT =================

if (status === "approved") {

company.status = "approved";

await company.save();

return res.status(200).json({
message: "Company approved successfully"
});

}


// ================= REJECT =================

if (status === "rejected") {

company.status = "rejected";
company.rejectReason = rejectReason;
company.isDeleted = true;

await company.save();


// ===== EMAIL SEND =====

  const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.USER_EMAIL,
                pass: process.env.USER_PASS,
            }
        });

const mailOptions = {

from: process.env.USER_EMAIL,

to: company.email,

subject: "Company Registration Rejected",

text: `Hello ${company.companiename},

Your company registration has been rejected.

Reason: ${rejectReason}

Thank you.`

};

await transporter.sendMail(mailOptions);


return res.status(200).json({
message: "Company rejected and email sent"
});

}


return res.status(400).json({
message: "Invalid status"
});

} catch (error) {

res.status(500).json({
message: error.message
});

}

};