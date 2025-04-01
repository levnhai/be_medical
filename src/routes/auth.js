const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth/authController');

//authentication
router.post('/check-phone', authController.handleCheckphone);
router.post('/otp-input', authController.handleSendotpInput);
router.post('/verify-otp', authController.handleVerifyOtp);
router.post('/forgot-password', authController.handleForgotPassword);
router.post('/create-account', authController.handleSingUp);
router.post('/login', authController.handleSingIn);
router.post('/login-admin', authController.handleLoginAdmin);

module.exports = router;
