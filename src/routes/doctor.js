const express = require('express');
const router = express.Router();
const docterController = require('../controllers/doctor/doctorController');
const { protect, adminOnly, hospitalOnly } = require('../middleware/authMiddleware');

router.post('/create-doctor', protect, hospitalOnly, docterController.handleCreateDoctor);
router.get('/get-all-doctor', docterController.handleGetAllDoctor);
router.put('/update-doctor/:id', docterController.handleUpdateDoctor);
router.delete('/delete-doctor/:id', docterController.handleDeleteDoctor);
router.post('/get-doctor-by-hospital', protect, docterController.handleGetDoctorByHospital);
router.post('/get-doctor-by-hospital-doctor', docterController.handleGetDoctorByHospitalAndDoctor);

module.exports = router;
