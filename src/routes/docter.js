const express = require('express');
const router = express.Router();
const docterController = require('../controllers/docter/docterController');

router.post('/create-docter', docterController.handleCreateDocter);
router.get('/get-all-docter', docterController.handleGetAllDocter);
router.put('/update-docter/:id', docterController.handleUpdateDocter);
router.delete('/delete-docter/:id', docterController.handleDeleteDocter);
router.get('/', docterController.index);

module.exports = router;
    