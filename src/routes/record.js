const express = require('express');
const router = express.Router();
const recordController = require('../controllers/record/recordController');
const { protect } = require('../middleware/authMiddleware');

router.post('/create-record', protect, recordController.handleCreateRecord);
router.post('/get-record-by-id', recordController.handlegetRecordById);

module.exports = router;
