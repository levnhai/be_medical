const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctor/doctorController');
const { protect, adminOnly, hospitalOnly } = require('../middleware/authMiddleware');

router.post('/create-doctor', protect, hospitalOnly, doctorController.handleCreateDoctor);
router.get('/get-all-doctor', doctorController.handleGetAllDoctor);
router.get('/get-top-doctor', doctorController.handleGetTopDoctor);
router.put('/update-doctor/:id', doctorController.handleUpdateDoctor);
router.delete('/delete-doctor/:id', doctorController.handleDeleteDoctor);
router.post('/get-doctor-by-hospital', doctorController.handleGetDoctorByHospital);
router.post('/get-doctor-by-hospital-doctor', doctorController.handleGetDoctorByHospitalAndDoctor);

module.exports = router;
