const express = require('express');
const router = express.Router();
const jobcontroller = require('../controller/applicationcontroller');

router.post('/add', jobcontroller.addapplication);  
router.get('/all', jobcontroller.allapplication);
router.get('/oneapplication/:id', jobcontroller.oneapplication);
router.post('/update/:id', jobcontroller.updateapplication);
router.delete('/delete/:id', jobcontroller.deleteapplication);
module.exports = router;