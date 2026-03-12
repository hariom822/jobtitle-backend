const information = require('../model/fullinformation');
const Candidate = require("../model/candidatemodel");
const uploadimg = require("../utility/cloudnary").uploadImage;
exports.addinformation = async (req, res) => {
    try {
        const { candidateId } = req.body; // spelling fixed
        if (!candidateId) {
            return res.status(400).json({ error: "all fields are required" });
        }
        const newInformation = new information({
            candidateId,
        });
        await newInformation.save();
        res.status(200).json({ message: "information added successfully", newInformation });
    } catch (error) {
        console.error("Error adding information:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
// exports.updateinformation = async (req, res) => {

//   try {
//     const { candidateId } = req.body;

//     const updatedInformation = await information.findByIdAndUpdate(
//   id,
//   req.body,
//   { new: true }
// );

//     if (!updatedInformation) {
//       return res.status(404).json({ error: "information not found" });
//     }

//     res.status(200).json({
//       message: "information updated successfully",
//       updatedInformation
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// exports.updateinformation = async (req, res) => {
//     try {
//         const { id } = req.params;
//         console.log("updateinformation called with id:", id, "and body:", req.body);
       
//         const updatedInformation = await information.findByIdAndUpdate(
//             id,
//             req.body,
//             { new: true }
//         );
//         console.log("updatedInformation result:", updatedInformation);
//         if (!updatedInformation) {
//             return res.status(404).json({ error: "information not found" });
//         }

//         res.status(200).json({ message: "information updated successfully", updatedInformation });

//     } catch (error) {
//         console.error("Error updating information:", error);
//         res.status(500).json({ error: "Internal server error" });
//     }
// };
exports.updateinformation = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;

    console.log("updateinformation called with id:", id);
    console.log("Body:", body);

    let updateQuery = {};

    // 1️⃣ additional fields (linkedin, portfolio etc)
    if (body.field) {
      updateQuery = { $set: { [body.field]: body.value } };
    }

    // 2️⃣ education
    else if (body.degree || body.university || body.passingYear || body.percentage) {
      updateQuery = {
        $set: {
          education: {
            degree: body.degree,
            university: body.university,
            passingYear: body.passingYear,
            percentage: body.percentage
          }
        }
      };
    }

    // 3️⃣ experience add
    else if (body.companyName) {
      updateQuery = {
        $push: {
          experience: {
            companyName: body.companyName,
            role: body.role,
            startDate: body.startDate,
            endDate: body.endDate,
            description: body.description
          }
        }
      };
    }

    // 4️⃣ skill add
    else if (body.name) {
      updateQuery = {
        $push: {
          skills: body.name
        }
      };
    }

    // 5️⃣ personal info
    else if (body.dateOfBirth || body.gender) {
      updateQuery = {
        $set: {
          dateOfBirth: body.dateOfBirth,
          gender: body.gender
        }
      };
    }

    const updatedInformation = await information.findByIdAndUpdate(
      id,
      updateQuery,
      { new: true }
    );

    if (!updatedInformation) {
      return res.status(404).json({ error: "information not found" });
    }

    res.status(200).json({
      message: "information updated successfully",
      updatedInformation
    });

  } catch (error) {
    console.error("Error updating information:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
exports.deleteinformation = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedInformation = await information.findByIdAndDelete(id);
        if (!deletedInformation) {
            return res.status(404).json({ error: "information not found" });
        }
        res.status(200).json({ message: "information deleted successfully" });
    } catch (error) {
        console.error("Error deleting information:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// GET PROFILE
exports.getProfile = async (req, res) => {
  console.log("profile",req.params)
  try {
    const profile = await information.findOne({
      candidateId: req.params.candidateId
    });

    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

// SAVE (ADD + UPDATE)
exports.saveProfile = async (req, res) => {
  try {
    const { candidateId } = req.body;

    let profile = await information.findOne({ candidateId });

    if (profile) {
      profile = await information.findOneAndUpdate(
        { candidateId },
        req.body,
        { new: true }
      );
    } else {
      profile = await information.create(req.body);
    }

    res.json(profile);

  } catch (error) {
    res.status(500).json({ error: "Save Failed" });
  }
};

exports.getAllInformation = async (req, res) => {
  try {
    const { candidateId } = req.params;

    const info = await information.findOne({ candidateId });

    if (!info) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json(info);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
// fetch a single full information record by candidate email
exports.getInformationById = async (req, res) => {
  console.log("getInformationById called with params:", req.params);
  try {
    const { id } = req.params;

    const info = await information.findById(id);
    if (!info) {
      return res.status(404).json({ message: "Information not found" });
    }
    res.status(200).json(info);
  } catch (error) {
    console.error("Error fetching information by email:", error);
    res.status(500).json({ error: "Server Error" });
  }
};
exports.getInformationByEmail = async (req, res) => {
  console.log("getInformationByEmail called with params:", req.params);
  try {
    const { email } = req.params;

    const candidate = await Candidate.findOne({ email });
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }
    console.log("Candidate found:", candidate);
    const info = await information.findOne({ candidateId: candidate._id });
    console.log("Information found:", info);
    if (!info) {
      return res.status(404).json({ message: "Information not found" });
    }
    res.status(200).json({full: info, candidateId: candidate._id});
  }
    catch (error) {
    console.error("Error fetching information by email:", error);
    res.status(500).json({ error: "Server Error" });
  }
};
exports.uploadProfileImage = async (req, res) => {
  try {

    const { candidateId } = req.body;

    if (!candidateId) {
      return res.status(400).json({
        error: "candidateId is required"
      });
    }

    // 🔎 existing profile find
    const profile = await information.findOne({ candidateId });

    if (!profile) {
      return res.status(404).json({
        error: "Profile not found. Please create profile first."
      });
    }

    // check file
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({
        error: "No file uploaded"
      });
    }

    const fileObj = req.files[Object.keys(req.files)[0]];

    // upload image
    const imageResults = await uploadimg({
      file: fileObj
    });

    // update existing record
    profile.profileImage = imageResults[0].secure_url;

    await profile.save();

    res.json({
      message: "Profile image updated",
      profile
    });

  } catch (error) {
    console.error("uploadProfileImage error", error);

    res.status(500).json({
      error: "Image upload failed"
    });
  }
};
exports.deleteField = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;

    console.log("Delete request body:", body);

    let updateQuery = {};

    // 1️⃣ additional fields delete
    if (body.field) {
      updateQuery = {
        $set: { [body.field]: "" }
      };
    }

    // 2️⃣ skill delete
    else if (body.skill) {
      updateQuery = {
        $pull: { skills: body.skill }
      };
    }

    // 3️⃣ experience delete
    else if (body.experienceId) {
      updateQuery = {
        $pull: { experience: { _id: body.experienceId } }
      };
    }

    const updatedInformation = await information.findByIdAndUpdate(
      id,
      updateQuery,
      { new: true }
    );

    if (!updatedInformation) {
      return res.status(404).json({ error: "information not found" });
    }

    res.status(200).json({
      message: "Field deleted successfully",
      updatedInformation
    });

  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.editProfile = async (req, res) => {

  try {

    const profile = await FullInfo.findById(req.params.id);
    if (req.body.skill !== undefined) {
      profile.skills[req.body.index] = req.body.skill;
    }

    // experience edit
    if (req.body.experienceId) {

      const exp = profile.experience.id(req.body.experienceId);

      if (exp) {
        exp.companyName = req.body.companyName;
        exp.role = req.body.role;
        exp.startDate = req.body.startDate;
        exp.endDate = req.body.endDate;
        exp.description = req.body.description;
      }

    }

    await profile.save();

    res.status(200).json(profile);

  } catch (error) {
    res.status(500).json(error);
  }

};