
const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');

router.get('/', newsController.getAllPosts);
router.get('/:id', newsController.getPostById);
router.post('/', newsController.createPost);
router.put('/:id', newsController.updatePost);
router.delete('/:id', newsController.deletePost);
router.get('/category/:categorySlug', newsController.getPostsByCategory);

module.exports = router;