const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/schedule/scheduleController');
const { protect, adminOnly, hospitalOnly } = require('../middleware/authMiddleware');

router.post('/create-schedule', protect, hospitalOnly, scheduleController.handleCreateSchedule);
router.get('/get-schedule-by-hospital', protect, hospitalOnly, scheduleController.handleGetScheduleByHospital);
router.post('/get-schedule-by-doctor', scheduleController.handleGetAllScheduleByDoctor);

module.exports = router;