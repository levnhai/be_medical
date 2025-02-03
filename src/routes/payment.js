const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payments/paymentController');

router.post('/vnpay_create', paymentController.createPayment);
router.get('/vnpay_return', paymentController.vnpayReturn);

router.post('/clinic-create', paymentController.handleClinicCreate);
router.post('/get-appointment-by-userId', paymentController.handleGetAppointmentByUserId);

module.exports = router;
