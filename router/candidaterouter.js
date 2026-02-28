const express = require('express');
const router = express.Router();
const condidatecontroller = require('../controller/candidatecontroller');

router.post('/add', condidatecontroller.addcandidate);
router.get('/all', condidatecontroller.allcandidate);
router.get('/onecandidate/:id', condidatecontroller.onecandidate);
router.post('/update/:id', condidatecontroller.updatecandidate);
router.delete('/delete/:id', condidatecontroller.deletecandidate);
module.exports = router;