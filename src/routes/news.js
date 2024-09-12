
const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');

router.get('/news', newsController.getAllPosts);
router.get('/news/:id', newsController.getPostById);
router.post('/news', newsController.createPost);
router.put('/news/:id', newsController.updatePost);
router.delete('/news/:id', newsController.deletePost);
router.get('/news/category/:categoryId', newsController.getPostsByCategory);

module.exports = router;