const express = require('express');
const router = express.Router();
const hospitalController = require('../controllers/hospital/hospitalController');

router.get('/get-all-hospital', hospitalController.getAllHospital);

module.exports = router;
