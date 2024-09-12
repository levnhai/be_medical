const express = require('express');
const router = express.Router();
const registrationController = require('../controllers/registrationController');

router.post('/register', registrationController.createRegistration);
router.get('/registrations', registrationController.getAllRegistrations);
router.get('/registrations/:id', registrationController.getRegistrationById);
router.delete('/registrations/:id', registrationController.deleteRegistration);

module.exports = router;