const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointment/appointmentController');
const { protect, adminOnly, hospitalOnly } = require('../middleware/authMiddleware');

// router.post('/create-appointment', appointmentController.createAppointment);
router.get('/get-all-appointment-by-hospital', protect, appointmentController.handleGetAppointmentByHospital);
router.put('/update-status/:id', protect, appointmentController.handleUpdateStatus);
router.delete('/delete-appointment/:id', protect, appointmentController.handleDeleteAppointment);

module.exports = router;
