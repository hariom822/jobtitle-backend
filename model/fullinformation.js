// models/FullInformation.js

const mongoose = require("mongoose");

const fullInformationSchema = new mongoose.Schema({

  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Candidate",
    required: true,
  },
  // userId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "users",
  //   required: true,
  // },

  dateOfBirth: {
    type: Date,
  },

  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
    default: "Male",
  },

  education: {
    degree: String,
    university: String,
    passingYear: Number,
    percentage: Number,
  },

  experience: [
    {
      companyName: String,
      role: String,
      startDate: Date,
      endDate: Date,
      description: String,
    }
  ],

  skills: [
    {
      type: String
    }
  ],

  linkedin: String,
  github: String,
  portfolio: String,

  bio: String,

  profileImage: {
    type: String, 
  },

resume: {
    type: String, 
  },

}, { timestamps: true });

module.exports = mongoose.model("FullInformation", fullInformationSchema);