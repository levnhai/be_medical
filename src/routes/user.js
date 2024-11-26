const express = require('express');
const router = express.Router();
const userController = require('../controllers/user/userController');

router.get('/get-all', userController.handleGetAllUsers);
router.post('/delete-user', userController.handleDeleteUser);
router.post('/edit-user/:userId', userController.handleEditUser);
router.post('/create-user', userController.handleCreateUser);

module.exports = router;
