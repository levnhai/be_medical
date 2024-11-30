const _ = require('lodash');
const dotenv = require('dotenv');
const _New = require('../models/NewsPost');
const CategoryNews = require('../models/CategoryNews');
const NewsPost = require('../models/NewsPost');

const handleGetAllPostsAdmin = () => {
  return new Promise(async (resolve, reject) => {
    try {
      // Lấy tất cả các bài viết
      const news = await _New.find({})
        .populate('category', 'name slug')
        .sort({ createdAt: -1 });

      // Giới hạn ký tự cho tiêu đề và nội dung của mỗi bài viết
      const modifiedNews = news.map(article => ({
        ...article._doc, // Dùng _doc để lấy dữ liệu gốc từ Mongoose document
        title: article.title.length > 50 
          ? article.title.slice(0, 50) + '...' 
          : article.title,
        content: article.content.length > 100 
          ? article.content.slice(0, 100) + '...' 
          : article.content
      }));

      resolve({ 
        message: 'Lấy dữ liệu thành công', 
        code: 200, 
        status: true, 
        news: modifiedNews 
      });
    } catch (error) {
      reject(error);
    }
  });
};
const handleGetAllPosts = () => {
  return new Promise(async (resolve, reject) => {
    try {
      // Lấy tất cả các bài viết có status khác 0
      const news = await _New.find({ status: 1  })
        .populate('category', 'name slug')
        .sort({ createdAt: -1 });

      // Giới hạn ký tự cho tiêu đề và nội dung của mỗi bài viết
      const modifiedNews = news.map(article => ({
        ...article._doc, // Dùng _doc để lấy dữ liệu gốc từ Mongoose document
        title: article.title.length > 50 
          ? article.title.slice(0, 50) + '...' 
          : article.title,
        content: article.content.length > 100 
          ? article.content.slice(0, 100) + '...' 
          : article.content
      }));

      resolve({ 
        message: 'Lấy dữ liệu thành công', 
        code: 200, 
        status: true, 
        news: modifiedNews 
      });
    } catch (error) {
      reject(error);
    }
  });
};


  // handle get post by id
const handleGetPostById = (postId) => {
    return new Promise(async (resolve, reject) => {
      try {
          const news = await _New.findOne({_id: postId});
          if(!news) {
              resolve({ message: 'Không tìm thấy bài viết', code: 200, status:true });
          }
          else {
            resolve({ message: 'Lấy dữ liệu thành công', code: 200, status:true, news });
          }
        }
      catch (error) {
        reject(error);
      }
    });
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
          status: false 
        };
      }
  
      // Create new post
      const newsPost = new NewsPost(postData);
      await newsPost.save();
  
      return {
        message: 'Tạo bài viết thành công',
        code: 201,
        status: true,
        newsPost
      };
    } catch (error) {
      throw error;
    }
  };
// Update post
const handleUpdatePost = (postId, updateData) => {
  return new Promise(async (resolve, reject) => {
      try {
          // Check if post exists
          const existingPost = await _New.findById(postId);
          if (!existingPost) {
              return resolve({ message: 'Không tìm thấy bài viết', code: 404, status: false });
          }

          // If category is being updated, validate it exists
          if (updateData.category) {
              const category = await CategoryNews.findById(updateData.category);
              if (!category) {
                  return resolve({ message: 'Danh mục không tồn tại', code: 404, status: false });
              }
          }

          // Update the post
          updateData.updatedAt = Date.now();
          const updatedPost = await _New.findByIdAndUpdate(
              postId,
              updateData,
              { new: true }
          ).populate('category');

          resolve({
              message: 'Cập nhật bài viết thành công',
              code: 200,
              status: true,
              news: updatedPost
          });
      } catch (error) {
          reject(error);
      }
  });
};
// Delete post
const handleDeletePost = (postId) => {
  return new Promise(async (resolve, reject) => {
      try {
          const deletedPost = await _New.findByIdAndDelete(postId);
          if (!deletedPost) {
              resolve({ message: 'Không tìm thấy bài viết', code: 404, status: false });
          } else {
              resolve({ message: 'Xóa bài viết thành công', code: 200, status: true });
          }
      } catch (error) {
          reject(error);
      }
  });
};

// Get posts by category slug
const handleGetPostsByCategory = (categorySlug) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Verify category exists using slug
      const category = await CategoryNews.findOne({ slug: categorySlug });
      if (!category) {
        return resolve({ 
          message: 'Không tìm thấy danh mục', 
          code: 404, 
          status: false 
        });
      }

      const news = await _New.find({ category: category._id })
        .sort({ createdAt: -1 })
        .populate('category');

      // Giới hạn ký tự cho tiêu đề và nội dung của mỗi bài viết
      const modifiedNews = news.map(article => ({
        ...article._doc, // Dùng _doc để lấy dữ liệu gốc từ Mongoose document
        title: article.title.length > 50 
          ? article.title.slice(0, 50) + '...' 
          : article.title,
        content: article.content.length > 100 
          ? article.content.slice(0, 100) + '...' 
          : article.content
      }));

      resolve({
        message: 'Lấy dữ liệu thành công',
        code: 200,
        status: true,
        news: modifiedNews, // Sử dụng modifiedNews đã được giới hạn
        category
      });
    } catch (error) {
      reject(error);
    }
  });
};


module.exports = {
    handleGetAllPosts,
    handleGetPostById,
    handleCreatePost,
    handleUpdatePost,
    handleDeletePost,
    handleGetPostsByCategory,
    handleGetAllPostsAdmin,
};
