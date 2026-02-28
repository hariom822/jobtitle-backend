const employee=require('../model/employemodel')
const User =require("../model/usermodel");
const uploadimg=require('../utility/cloudnary').uploadImage
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
require("dotenv").config()
let oldotp= 0;
function generatePassword(length = 4) {
  const chars =
    "0123456789";
  let password = "";

  for (let i = 0; i <length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    password += chars[randomIndex];
  }

  return password;
}
exports.addemployee=async(req,res)=>{
        console.log(">>>>req.file",req.files)
         console.log(">>>>req.body",req.body)
        const {name,email,phone,salary,menttype,pannumbert}=req.body
        if(!(name,email,phone)){
           return  res.status(400).json({message:"all filed requored"})
        }
         const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message:"user already exist"})
        }
        const password = generatePassword(6);
         const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);

      const data1 =req.files;
      const imagee = await uploadimg(data1);
       const data={name,email,phone,salary,menttype,pannumbert,addherimage:imagee[0].url,profileimage:imagee[1].url,password:hashedPassword}
       console.log(">>>data",data)
              const transporter=nodemailer.createTransport({
            service:"gmail",
            auth: {
                user: process.env.USER_EMAIL,
                pass: process.env.USER_PASS,
            }
        });
 const info = await transporter.sendMail({
          from: '"HR Team | Task Manager" <hariomsharmah822822@gmail.com>',
  to: email,
  subject: "🎉 Welcome! You Have Been Added as an Employee",
  html: `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Employee Added</title>
  </head>
  <body style="margin:0; padding:0; background-color:#f3f4f6; font-family: Arial, sans-serif;">
    
    <div style="max-swidth:600px; margin:30px auto; background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 4px 10px rgba(0,0,0,0.1);">
      
      <!-- Header -->
      <div style="background:#16a34a; padding:20px; text-align:center;">
        <h1 style="color:#ffffff; margin:0; font-size:22px;">
          🎉 Welcome to Task Manager
        </h1>
      </div>

      <!-- Body -->
      <div style="padding:24px; color:#374151;">
        <p style="font-size:16px; margin-bottom:16px;">
          Hello <strong>${name}</strong> 👋,
        </p>

        <p style="font-size:15px; margin-bottom:20px;">
          We are happy to inform you that you have been successfully added as an employee in our system.
        </p>

        <!-- Employee Info -->
        <div style="border:1px solid #e5e7eb; border-radius:6px; padding:16px; background:#f9fafb;">
          <p style="margin:0 0 8px 0; font-size:14px;">
            <strong>👤 Name:</strong> ${name}
          </p>
          <p style="margin:0 0 8px 0; font-size:14px;">
            <strong>📧 Email:</strong> ${email}
          </p>
          <p style="margin:0 0 8px 0; font-size:14px;">
            <strong>📞 Phone:</strong> ${phone}
          </p>
            <p style="margin:0 0 8px 0; font-size:14px;">
            <strong>🔑 Password:</strong> ${password}
          </p>
          <p style="margin:0 0 8px 0; font-size:14px;">
            <strong>💼 Employment Type:</strong> ${menttype}
          </p>
          <p style="margin:0; font-size:14px;">
            <strong>💰 Salary:</strong> ₹${salary}
          </p>
        </div>

        <!-- Button -->
        <div style="text-align:center; margin-top:24px;">
          <a href="http://localhost:3000/login"
            style="display:inline-block; padding:12px 24px; background:#16a34a; color:#ffffff; text-decoration:none; font-size:14px; border-radius:6px;">
            Login to Dashboard
          </a>
        </div>

        <p style="font-size:13px; color:#6b7280; margin-top:24px;">
          If you have any questions, feel free to contact the HR team.
        </p>
      </div>

      <!-- Footer -->
      <div style="background:#f3f4f6; padding:16px; text-align:center; font-size:12px; color:#6b7280;">
        © 2026 Task Manager | All rights reserved.
      </div>
    </div>

  </body>
  </html>
  `
});

        const submitemployee=new employee(data)
        await submitemployee.save()
        const user=new User({
            name:name,
            email:email,
            phone:phone,
            password:hashedPassword,
            role:"employee"
        })
        await user.save()
        res.status(201).json(submitemployee)
} 
exports.allemployee=async(req,res)=>{
    try {
        const employees=await employee.find()
        res.status(200).json(employees)
    } catch (error) {
        res.status(500).json({message:error.message})
 }
}
exports.oneemployee=async(req,res)=>{
    try {
        const {id}=req.params
        const employees=await employee.findById(id).populate("userid")
        res.status(200).json(employees)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}
exports.updateemployee = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedemployee = await employee.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    if (!updatedemployee) {
      return res.status(404).json({ message: "employee not found" });
    }

    res.status(200).json(updatedemployee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.ststusemployee=async(req,res)=>{
    try {
        const {id}=req.params
        const employeeData=await employee.findById(id)
        if(!employeeData){
            return res.status(404).json({message:"employee not found"})
        }
        employeeData.status=employeeData.status==="active"?"inactive":"active"
        await employeeData.save()
        res.status(200).json({message:"employee status updated successfully",status:employeeData.status})
    }
      catch (error) {
        res.status(500).json({message:error.message})
    }
}
exports.deleteemployee=async(req,res)=>{
    try {
        const employeeId=req.params.id
        const deletedemployee=await employee.findByIdAndDelete(employeeId)
        if(!deletedemployee){

            return res.status(404).json({message:"employee not found"})
        }
        res.status(200).json({message:"employee deleted successfully"})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}
