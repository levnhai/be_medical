
const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');
const { protect, hospitalOrAdminOnly, restrictTo } = require('../middleware/authMiddleware');

router.get('/get-all', newsController.getAllPosts);
router.get('/get-all-admin', newsController.getAllPostsAdmin);
router.get('/:id', newsController.getPostById);
router.post('/create', protect , restrictTo('docter', 'hospital_admin') ,newsController.createPost);
router.put('/update/:id', newsController.updatePost);
router.delete('/delete/:id', protect, hospitalOrAdminOnly, newsController.deletePost);
router.get('/category/:slug', newsController.getPostsByCategory);

module.exports = router;