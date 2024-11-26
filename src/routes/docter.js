const express = require('express');
const router = express.Router();
const docterController = require('../controllers/docter/docterController');
const { protect, adminOnly, hospitalOnly } = require('../middleware/authMiddleware');

router.post('/create-docter', protect, hospitalOnly, docterController.handleCreateDocter);
router.get('/get-all-docter', protect, adminOnly, docterController.handleGetAllDocter);
router.put('/update-docter/:id', docterController.handleUpdateDocter);
router.delete('/delete-docter/:id', docterController.handleDeleteDocter);
router.post('/get-docter-by-hospital', protect, docterController.handleGetDocterByHospital);

module.exports = router;
