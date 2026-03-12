const express = require('express');
const router = express.Router();

const commantcontroller = require('../controller/commantcontroller');
const auth = require("../middleware/auth")
router.post('/add', commantcontroller.addcommant);
router.get('/all', commantcontroller.allcommant);
router.get('/one/:id', commantcontroller.onecommant);
router.post('/update/:id', commantcontroller.updatecommant);
router.delete('/delete/:id', commantcontroller.deletecommant);
router.post("/comment/:postId",commantcontroller.addComment);
module.exports = router;