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

// // dat
// router.post('/signup', authController.signup);
// router.post('/google-login', authController.googleLogin);
// router.post('/facebook-login', authController.facebookLogin);

// // Route cho tất cả các user đã đăng nhập
// router.get('/profile', authMiddleware.protect, (req, res) => {
//   res.status(200).json({
//     status: 'success',
//     message: 'Your profile information',
//     data: {
//       user: req.user,
//     },
//   });
// });

// // Route chỉ dành cho admin
// router.get('/admin', authMiddleware.protect, authMiddleware.adminOnly, (req, res) => {
//   res.status(200).json({
//     status: 'success',
//     message: 'Welcome to the admin area',
//   });
// });

// // Route dành cho doctor, trưởng khoa và admin
// router.get('/doctor', authMiddleware.protect, authMiddleware.doctorOrAdminOnly, (req, res) => {
//   res.status(200).json({
//     status: 'success',
//     message: 'Welcome to the doctor area',
//   });
// });

// // Route cho việc logout
// router.post('/logout', authMiddleware.protect, (req, res) => {
//   res.status(200).json({
//     status: 'success',
//     message: 'Logged out successfully',
//   });
// });

module.exports = router;
