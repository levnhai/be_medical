const express = require('express');
const router = express.Router();
const specialtyController = require('../controllers/specialty/specialtyController');
const { protect, adminOnly, hospitalOnly } = require('../middleware/authMiddleware');

router.post('/create', protect, adminOnly, specialtyController.handleCreateSpecialty);
router.get('/get-all-specialty', specialtyController.handleGetAllSpecialty);

module.exports = router;
