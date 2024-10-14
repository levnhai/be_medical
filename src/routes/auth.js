const express = require('express');
const router = express.Router();
const userController = require('../controllers/user/userController');

router.post('/check-phone', userController.handleCheckphone);
router.post('/login', userController.handleLogin);
router.post('/otp-input', userController.handleSendotpInput);
router.post('/verify-otp', userController.handleVerifyOtp);
router.post('/create-account', userController.handleSingUp);
router.post('/forgot-password', userController.handleForgotPassword);

module.exports = router;
