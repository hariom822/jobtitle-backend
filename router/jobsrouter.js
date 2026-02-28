const express = require('express');
const router = express.Router();
const jobcontroller = require('../controller/jobscontrooler');

router.post('/add', jobcontroller.addjob);
router.get('/all', jobcontroller.alljob);
router.get('/onejob/:id', jobcontroller.onejob);
router.post('/update/:id', jobcontroller.updatejob);
router.delete('/delete/:id', jobcontroller.deletejob);
module.exports = router;
