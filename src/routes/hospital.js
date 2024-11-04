const express = require('express');
const router = express.Router();
const hospitalController = require('../controllers/hospital/hospitalController');

router.get('/get-all-hospital', hospitalController.getAllHospital);
router.post('/get-hospital-by-type', hospitalController.getHospitalByType);
router.post('/get-count-hospital-by-type', hospitalController.getCountHospitalByType);
router.post('/create-hospital', hospitalController.handleCreateHospital);

module.exports = router;
