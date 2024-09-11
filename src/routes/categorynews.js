const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categorynewsController');

// Định nghĩa các route cho CRUD thể loại
router.get('/categorynews', categoryController.getAllCategories);        
router.get('/categorynews/:id', categoryController.getCategoryById);      
router.post('/categorynews', categoryController.createCategory);         
router.put('/categorynews/:id', categoryController.updateCategory);       
router.delete('/categorynews/:id', categoryController.deleteCategory);    

module.exports = router;