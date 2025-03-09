const express = require('express');
const router = express.Router();
const recordController = require('../controllers/record/recordController');
const { protect } = require('../middleware/authMiddleware');

router.post('/create-record', recordController.handleCreateRecord);
router.post('/get-record-by-id', recordController.handlegetRecordById);
router.delete('/delete-record/:id', recordController.handleDeleteRecord);

module.exports = router;
