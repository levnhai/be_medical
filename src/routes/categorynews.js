const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categorynewsController');

// Định nghĩa các route cho CRUD thể loại
router.get('/get-all', categoryController.getAllCategories);        
router.get('/get/:id', categoryController.getCategoryById);      
router.post('/create', categoryController.createCategory);         
router.put('/update/:id', categoryController.updateCategory);       
router.delete('/delete/:id', categoryController.deleteCategory);    

module.exports = router;