const express = require('express');
const router = express.Router();
const contactCollabController = require('../controllers/contact/contactCollabController');

router.post('/create', contactCollabController.createContact);
router.get('/get-all', contactCollabController.getAllContact);
router.get('/get/:id', contactCollabController.getContactById);
router.put('/edit/:id', contactCollabController.updateContact);
router.delete('/delete/:id', contactCollabController.deleteContact);

module.exports = router;