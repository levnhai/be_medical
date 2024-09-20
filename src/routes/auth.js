const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

// Route cho tất cả các user đã đăng nhập
router.get('/profile', authMiddleware.protect, (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Your profile information',
    data: {
      user: req.user
    }
  });
});

// Route chỉ dành cho admin
router.get('/admin', authMiddleware.protect, authMiddleware.adminOnly, (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Welcome to the admin area'
  });
});

// Route dành cho doctor, trưởng khoa và admin
router.get('/doctor', authMiddleware.protect, authMiddleware.doctorOrAdminOnly, (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Welcome to the doctor area'
  });
});

// Route cho việc logout
router.post('/logout', authMiddleware.protect, (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully'
  });
});

module.exports = router;