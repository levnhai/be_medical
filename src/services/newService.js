const _ = require('lodash');
const dotenv = require('dotenv');
const _New = require('../models/NewsPost');
const _Doctor = require('../models/doctor');
const CategoryNews = require('../models/CategoryNews');
const NewsPost = require('../models/NewsPost');
const mongoose = require('mongoose');

const handleGetAllPostsAdmin = async () => {
  try {
    // Lấy tất cả các bài viết
    const news = await _New.find({}).populate('category', 'name slug').sort({ createdAt: -1 });

    return {
      message: 'Lấy dữ liệu thành công',
      code: 200,
      status: true,
      news: news,
    };
  } catch (error) {
    return { code: 500, message: 'Lỗi máy chủ', status: false, error };
  }
};
const handleGetPostsByAuthor = async (authorId, authorModel) => {
  try {
    const posts = await NewsPost.find({
      'author._id': authorId,
      authorModel: authorModel,
    })
      .populate('category')
      .sort({ createdAt: -1 });

    return {
      message: 'Lấy dữ liệu thành công',
      status: true,
      posts,
      code: 200,
    };
  } catch (error) {
    return { code: 500, message: 'Lỗi máy chủ', status: false, error };
  }
};
const handleGetHospitalAndDoctorsPosts = async (hospitalId) => {
  try {
    // Get all doctors associated with this hospital
    const doctors = await _Doctor.find({ hospital: hospitalId });
    const doctorIds = doctors.map((doctor) => doctor._id);

    // Find posts from both the hospital and its doctors
    const posts = await NewsPost.find({
      $or: [
        { 'author._id': hospitalId, authorModel: 'Hospital' },
        { 'author._id': { $in: doctorIds }, authorModel: 'Doctor' },
      ],
    })
      .populate('category')
      .sort({ createdAt: -1 });

    return {
      message: 'Lấy dữ liệu thành công',
      status: true,
      posts,
      code: 200,
    };
  } catch (error) {
    return { code: 500, message: 'Lỗi máy chủ', status: false, error };
  }
};
const handleGetAllPosts = async () => {
  try {
    const news = await _New.find({ status: 1 }).populate('category', 'name slug').sort({ createdAt: -1 });

    // Giới hạn ký tự cho tiêu đề và nội dung của mỗi bài viết
    const modifiedNews = news.map((article) => ({
      ...article._doc, // Dùng _doc để lấy dữ liệu gốc từ Mongoose document
      title: article.title.length > 50 ? article.title.slice(0, 50) + '...' : article.title,
      content: article.content.length > 100 ? article.content.slice(0, 100) + '...' : article.content,
    }));

    return {
      message: 'Lấy dữ liệu thành công',
      code: 200,
      status: true,
      news: modifiedNews,
    };
  } catch (error) {
    return { code: 500, message: 'Lỗi máy chủ', status: false, error };
  }
};

// handle get post by id
const handleGetPostById = async (postId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return {
        message: 'ID không hợp lệ',
        code: 400,
        status: false,
      };
    }
    const news = await _New.findOne({ _id: postId, status: 1 }).populate('category', 'name slug');

    if (!news) {
      return {
        message: 'Không tìm thấy bài viết',
        code: 404,
        status: false,
      };
    }
    return {
      message: 'Lấy dữ liệu thành công',
      code: 200,
      status: true,
      news,
    };
  } catch (error) {
    return { code: 500, message: 'Lỗi máy chủ', status: false, error };
  }
};

// Create new post
const handleCreatePost = async (postData) => {
  try {
    // Validate category exists
    const category = await CategoryNews.findById(postData.category);
    if (!category) {
      return {
        message: 'Danh mục không tồn tại',
        code: 404,
        status: false,
      };
    }

    // Create new post
    const newsPost = new NewsPost(postData);
    await newsPost.save();

    return {
      message: 'Tạo bài viết thành công',
      code: 201,
      status: true,
      newsPost,
    };
  } catch (error) {
    return { code: 500, message: 'Lỗi máy chủ', status: false, error };
  }
};
// Update post
const handleUpdatePost = async (postId, updateData) => {
  try {
    // Check if post exists
    const existingPost = await _New.findById(postId);
    if (!existingPost) {
      return { message: 'Không tìm thấy bài viết', code: 404, status: false };
    }

    // If category is being updated, validate it exists
    if (updateData.category) {
      const category = await CategoryNews.findById(updateData.category);
      if (!category) {
        return { message: 'Danh mục không tồn tại', code: 404, status: false };
      }
    }

    // Update the post
    updateData.updatedAt = Date.now();
    const updatedPost = await _New.findByIdAndUpdate(postId, updateData, { new: true }).populate('category');

    return {
      message: 'Cập nhật bài viết thành công',
      code: 200,
      status: true,
      news: updatedPost,
    };
  } catch (error) {
    return { code: 500, message: 'Lỗi máy chủ', status: false, error };
  }
};
// Delete post
const handleDeletePost = async (postId) => {
  try {
    const deletedPost = await _New.findByIdAndDelete(postId);
    if (!deletedPost) {
      return { message: 'Không tìm thấy bài viết', code: 404, status: false };
    } else {
      return { message: 'Xóa bài viết thành công', code: 200, status: true };
    }
  } catch (error) {
    return { code: 500, message: 'Lỗi máy chủ', status: false, error };
  }
};

// Get posts by category slug
const handleGetPostsByCategory = async (categorySlug) => {
  try {
    // Verify category exists using slug
    const category = await CategoryNews.findOne({ slug: categorySlug });
    if (!category) {
      return {
        message: 'Không tìm thấy danh mục',
        code: 404,
        status: false,
      };
    }
    const news = await _New.find({ category: category._id, status: 1 }).sort({ createdAt: -1 }).populate('category');

    // Giới hạn ký tự cho tiêu đề và nội dung của mỗi bài viết
    const modifiedNews = news.map((article) => ({
      ...article._doc,
      title: article.title.length > 50 ? article.title.slice(0, 50) + '...' : article.title,
      content: article.content.length > 100 ? article.content.slice(0, 100) + '...' : article.content,
    }));

    return {
      message: 'Lấy dữ liệu thành công',
      code: 200,
      status: true,
      news: modifiedNews,
      category,
    };
  } catch (error) {
    return { code: 500, message: 'Lỗi máy chủ', status: false, error };
  }
};
// tin tức liên quan
const handleGetRelatedNews = async (postId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return {
        message: 'ID không hợp lệ',
        code: 400,
        status: false,
      };
    }
    // Tìm bài viết gốc để lấy category
    const originalNews = await _New
      .findOne({
        _id: postId,
        status: 1,
      })
      .populate('category', 'name slug');

    if (!originalNews) {
      return {
        message: 'Không tìm thấy bài viết',
        code: 404,
        status: false,
      };
    }
    // Tìm các bài viết liên quan
    const relatedNews = await _New
      .find({
        _id: { $ne: postId },
        category: originalNews.category._id,
        status: 1,
      })
      .populate('category', 'name slug')
      .limit(10)
      .sort({ createdAt: -1 });

    return {
      message: 'Lấy tin liên quan thành công',
      code: 200,
      status: true,
      relatedNews,
    };
  } catch (error) {
    return { code: 500, message: 'Lỗi máy chủ', status: false, error };
  }
};
// lấy cao nhất
const handleGetMostViewedNews = async () => {
  try {
    const mostViewedNews = await _New
      .find({ status: 1 })
      .sort({ views: -1 })
      .limit(9)
      .populate('category', 'name slug');

    const modifiedNews = mostViewedNews.map((article) => ({
      ...article._doc,
      title: article.title && article.title.length > 50 ? article.title.slice(0, 50) + '...' : article.title,
      content:
        article.content && article.content.length > 100 ? article.content.slice(0, 100) + '...' : article.content,
    }));

    return {
      message: 'Lấy bài viết có lượt xem cao nhất thành công',
      code: 200,
      status: true,
      mostViewedNews: modifiedNews,
    };
  } catch (error) {
    return { code: 500, message: 'Lỗi máy chủ', status: false, error };
  }
};

module.exports = {
  handleGetAllPosts,
  handleGetPostById,
  handleCreatePost,
  handleUpdatePost,
  handleDeletePost,
  handleGetPostsByCategory,
  handleGetAllPostsAdmin,
  handleGetRelatedNews,
  handleGetMostViewedNews,
  handleGetPostsByAuthor,
  handleGetHospitalAndDoctorsPosts,
};
