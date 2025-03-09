const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard/dashboardController');
const { protect, adminOnly, hospitalOnly } = require('../middleware/authMiddleware');

router.get('/dashboard-stats', protect, dashboardController.getAllStats);
router.post('/stats-by-hospital', dashboardController.getAllStatsByHospital);

module.exports = router;
