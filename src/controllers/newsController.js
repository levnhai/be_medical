const mongoose = require('mongoose');
const NewsPost = require('../models/NewsPost');
const CategoryNews = require('../models/CategoryNews');

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await NewsPost.find().populate('category');
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const post = await NewsPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Cannot find post' });
    }
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createPost = async (req, res) => {
  try {
    const { title, content, author, status, tags, category, views, isFeatured, imageUrl } = req.body;

    if (!title || !content || !author || !imageUrl || !category) {
      return res.status(400).json({ message: 'Title, content, author, image URL, and category are required' });
    }

    // Kiểm tra xem category có tồn tại hay không
    const categoryExists = await CategoryNews.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ message: 'Category not found' });
    }

    const newPost = new NewsPost({ title, content, author, status, tags, category, views, isFeatured, imageUrl });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid post ID' });
    }

    const { title, content, author, status, tags, category, views, isFeatured, imageUrl } = req.body;

    // Kiểm tra category nếu có cập nhật
    if (category) {
      const categoryExists = await CategoryNews.findById(category);
      if (!categoryExists) {
        return res.status(400).json({ message: 'Category not found' });
      }
    }

    const updateFields = {
      title,
      content,
      author,
      status,
      tags,
      category,
      views,
      isFeatured,
      imageUrl,
      updatedAt: new Date(),
    };

    Object.keys(updateFields).forEach((key) => updateFields[key] === undefined && delete updateFields[key]);

    const updatedPost = await NewsPost.findByIdAndUpdate(id, updateFields, { new: true });

    if (!updatedPost) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(updatedPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid post ID' });
    }

    const deletedPost = await NewsPost.findByIdAndDelete(id);
    if (!deletedPost) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getPostsByCategory = async (req, res) => {
  try {
    const categorySlug = req.params.categorySlug;

    if (!categorySlug) {
      return res.status(400).json({ message: 'Category slug is required' });
    }

    // Tìm kiếm category theo slug
    const category = await CategoryNews.findOne({ slug: categorySlug });
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Tìm kiếm các bài viết và populate thông tin category
    const posts = await NewsPost.find({ category: category._id })
      .populate('category', 'name slug'); // Thêm populate để lấy thông tin category

    if (posts.length === 0) {
      return res.status(404).json({ message: 'No posts found for this category' });
    }

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
