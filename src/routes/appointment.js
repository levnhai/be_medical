const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointment/appointmentController');
const { protect, adminOnly, hospitalOnly } = require('../middleware/authMiddleware');

// router.post('/create-appointment', appointmentController.createAppointment);
router.get('/get-all-appointment-by-hospital', protect, appointmentController.handleGetAppointmentByHospital);

module.exports = router;
