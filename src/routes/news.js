
const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

router.get('/get-all', newsController.getAllPosts);
router.get('/get-all-admin', newsController.getAllPostsAdmin);
router.get('/get-news-by-id/:id', newsController.getPostById);
router.get('/related-news/:postId', newsController.getRelatedNews);
router.get('/most-viewed', newsController.getMostViewedNews);
router.post('/create', protect , restrictTo('doctor', 'hospital_admin') ,newsController.createPost);
router.put('/update/:id', newsController.updatePost);
router.delete('/delete/:id', protect , restrictTo('system_admin', 'hospital_admin'), newsController.deletePost);
router.get('/category/:slug', newsController.getPostsByCategory);
router.get('/my-posts', protect, restrictTo('doctor'), newsController.getMyPosts);
router.get('/hospital-posts', protect, restrictTo('hospital_admin'), newsController.getHospitalAndDoctorPosts);

module.exports = router;