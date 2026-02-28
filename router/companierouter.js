const express = require('express');
const router = express.Router();

const companiecontroller = require('../controller/companiecontroller');
router.post('/add', companiecontroller.addcompanie);
router.get('/all', companiecontroller.allcompanie);
router.get('/onecompanie/:id', companiecontroller.onecompanie);
router.post('/update/:id', companiecontroller.updatecompanie);
router.delete('/delete/:id', companiecontroller.deletecompanie);
module.exports = router;