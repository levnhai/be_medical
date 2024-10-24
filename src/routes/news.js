
const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');

router.get('/get-all', newsController.getAllPosts);
router.get('/:id', newsController.getPostById);
router.post('/create', newsController.createPost);
router.put('/:id', newsController.updatePost);
router.delete('/:id', newsController.deletePost);
router.get('/category/:slug', newsController.getPostsByCategory);

module.exports = router;