const express = require('express');
const router = express.Router();
const fullinformationcontroller = require('../controller/fullinformationcontroller');
const auth = require("../middleware/auth")

router.post('/add', auth, fullinformationcontroller.addinformation);
router.get('/all', auth, fullinformationcontroller.getAllInformation);

router.get('/one/:id', fullinformationcontroller.getInformationById);
router.get('/oneemail/:email', fullinformationcontroller.getInformationByEmail);
router.post('/update/:id', fullinformationcontroller.updateinformation);
router.delete('/delete/:id', auth, fullinformationcontroller.deleteinformation);
router.post('/upload-profile', auth, fullinformationcontroller.uploadProfileImage);
router.post('/delete-profile/:id', fullinformationcontroller.deleteField);
router.post("/edit-profile/:id", auth, fullinformationcontroller.editProfile);
// router.get('/:candidateId', auth, fullinformationcontroller.getProfilee);
router.post('/save', auth, fullinformationcontroller.saveProfile);
module.exports = router;