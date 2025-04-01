const mongoose = require('mongoose');
const NewsPost = require('../models/NewsPost');
const CategoryNews = require('../models/CategoryNews');
const newService = require('../services/newService');

class newController {
  // get all post
  async getAllPosts(req, res) {
    const result = await newService.handleGetAllPosts();
    return res.status(result.code).json({
      result,
    });
  }
  // get all post admin
  async getAllPostsAdmin(req, res) {
    try {
      const result = await newService.handleGetAllPostsAdmin();
      return res.status(result.code).json({
        result,
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Lỗi hệ thống',
        error: error.message,
      });
    }
  }
  async getMyPosts(req, res) {
    try {
      if (req.user.role !== 'doctor') {
        return res.status(403).json({
          message: 'Không có quyền truy cập',
          status: false,
        });
      }

      const result = await newService.handleGetPostsByAuthor(req.user.modelId, 'Doctor');
      return res.status(result.code).json({
        result,
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Lỗi hệ thống',
        error: error.message,
      });
    }
  }
  // Add this to newController.js
  async getHospitalAndDoctorPosts(req, res) {
    try {
      if (req.user.role !== 'hospital_admin') {
        return res.status(403).json({
          message: 'Không có quyền truy cập',
          status: false,
        });
      }

      const result = await newService.handleGetHospitalAndDoctorsPosts(req.user.modelId);
      return res.status(result.code).json({
        result,
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Lỗi hệ thống',
        error: error.message,
      });
    }
  }
  // get post by id
  async getPostById(req, res) {
    const postId = req.params.id;
    if (!postId) {
      return res.status(400).json({ message: 'Lấy dữ liệu thất bại', status: false });
    } else {
      const result = await newService.handleGetPostById(postId);
      return res.status(result.code).json({
        result,
      });
    }
  }
  async createPost(req, res) {
    try {
      const postData = req.body;

      // Validate required fields
      if (!postData.title || !postData.content || !postData.category || !postData.imageUrl) {
        return res.status(400).json({
          message: 'Thiếu thông tin bắt buộc',
          status: false,
        });
      }

      // Extra safety checks
      if (!req.user || !req.user.modelId) {
        return res.status(401).json({
          message: 'Thông tin người dùng không hợp lệ',
          status: false,
        });
      }

      // Use information from req.user attached in middleware
      postData.author = {
        _id: req.user.modelId,
        fullName: req.user.fullName,
      };
      postData.authorModel = req.user.model;

      const result = await newService.handleCreatePost(postData);
      return res.status(result.code).json({ result });
    } catch (error) {
      console.error('FULL CREATE POST ERROR:', error);
      return res.status(500).json({
        message: 'Lỗi server',
        status: false,
        error: error.message,
        errorStack: error.stack,
      });
    }
  }
  // Update post
  async updatePost(req, res) {
    try {
      const postId = req.params.id;
      const updateData = req.body;

      if (!postId) {
        return res.status(400).json({
          message: 'ID bài viết không được để trống',
          status: false,
        });
      }

      const result = await newService.handleUpdatePost(postId, updateData);
      return res.status(result.code).json({ result });
    } catch (error) {
      return res.status(500).json({
        message: 'Lỗi server',
        status: false,
        error: error.message,
      });
    }
  }
  // Delete post
  async deletePost(req, res) {
    try {
      const postId = req.params.id;
      if (!postId) {
        return res.status(400).json({
          message: 'ID bài viết không được để trống',
          status: false,
        });
      }

      const result = await newService.handleDeletePost(postId);
      return res.status(result.code).json({ result });
    } catch (error) {
      return res.status(500).json({
        message: 'Lỗi server',
        status: false,
        error: error.message,
      });
    }
  }

  // Get posts by category slug
  async getPostsByCategory(req, res) {
    try {
      const categorySlug = req.params.slug;
      if (!categorySlug) {
        return res.status(400).json({
          message: 'Slug danh mục không được để trống',
          status: false,
        });
      }

      const result = await newService.handleGetPostsByCategory(categorySlug);
      return res.status(result.code).json({ result });
    } catch (error) {
      return res.status(500).json({
        message: 'Lỗi server',
        status: false,
        error: error.message,
      });
    }
  }
  async getRelatedNews(req, res) {
    try {
      const postId = req.params.postId;
      if (!postId) {
        return res.status(400).json({
          message: 'ID bài viết không được để trống',
          status: false,
        });
      }

      const result = await newService.handleGetRelatedNews(postId);
      return res.status(result.code).json({ result });
    } catch (error) {
      return res.status(500).json({
        message: 'Lỗi server',
        status: false,
        error: error.message,
      });
    }
  }
  async getMostViewedNews(req, res) {
    try {
      const result = await newService.handleGetMostViewedNews();
      return res.status(result.code).json({ result });
    } catch (error) {
      return res.status(500).json({
        message: 'Lỗi server',
        status: false,
        error: error.message,
      });
    }
  }
}

module.exports = new newController();

// exports.createPost = async (req, res) => {
//   try {
//     const { title, content, author, status, tags, category, views, isFeatured, imageUrl } = req.body;

//     if (!title || !content || !author || !imageUrl || !category) {
//       return res.status(400).json({ message: 'Title, content, author, image URL, and category are required' });
//     }

//     // Kiểm tra xem category có tồn tại hay không
//     const categoryExists = await CategoryNews.findById(category);
//     if (!categoryExists) {
//       return res.status(400).json({ message: 'Category not found' });
//     }

//     const newPost = new NewsPost({ title, content, author, status, tags, category, views, isFeatured, imageUrl });
//     await newPost.save();
//     res.status(201).json(newPost);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// };

// exports.updatePost = async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ message: 'Invalid post ID' });
//     }

//     const { title, content, author, status, tags, category, views, isFeatured, imageUrl } = req.body;

//     // Kiểm tra category nếu có cập nhật
//     if (category) {
//       const categoryExists = await CategoryNews.findById(category);
//       if (!categoryExists) {
//         return res.status(400).json({ message: 'Category not found' });
//       }
//     }

//     const updateFields = {
//       title,
//       content,
//       author,
//       status,
//       tags,
//       category,
//       views,
//       isFeatured,
//       imageUrl,
//       updatedAt: new Date(),
//     };

//     Object.keys(updateFields).forEach((key) => updateFields[key] === undefined && delete updateFields[key]);

//     const updatedPost = await NewsPost.findByIdAndUpdate(id, updateFields, { new: true });

//     if (!updatedPost) {
//       return res.status(404).json({ message: 'Post not found' });
//     }

//     res.json(updatedPost);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// };

// exports.deletePost = async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ message: 'Invalid post ID' });
//     }

//     const deletedPost = await NewsPost.findByIdAndDelete(id);
//     if (!deletedPost) {
//       return res.status(404).json({ message: 'Post not found' });
//     }

//     res.json({ message: 'Post deleted' });
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// };

// exports.getPostsByCategory = async (req, res) => {
//   try {
//     const categorySlug = req.params.categorySlug;

//     if (!categorySlug) {
//       return res.status(400).json({ message: 'Category slug is required' });
//     }

//     // Tìm kiếm category theo slug
//     const category = await CategoryNews.findOne({ slug: categorySlug });
//     if (!category) {
//       return res.status(404).json({ message: 'Category not found' });
//     }

//     // Tìm kiếm các bài viết và populate thông tin category
//     const posts = await NewsPost.find({ category: category._id })
//       .populate('category', 'name slug'); // Thêm populate để lấy thông tin category

//     if (posts.length === 0) {
//       return res.status(404).json({ message: 'No posts found for this category' });
//     }

//     res.json(posts);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// exports.getPostById = async (req, res) => {
//   try {
//     const post = await NewsPost.findById(req.params.id);
//     if (!post) {
//       return res.status(404).json({ message: 'Cannot find post' });
//     }
//     res.json(post);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };
