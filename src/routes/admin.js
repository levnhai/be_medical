const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin/adminController');
const { protect, adminOnly, hospitalOnly } = require('../middleware/authMiddleware');

router.post('/create-admin', protect, adminOnly, adminController.handleCreateAdmin);

module.exports = router;
