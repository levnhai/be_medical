const jwt = require('jsonwebtoken');
require('dotenv').config();
const _Account = require('../models/account');
const _Doctor = require('../models/doctor');
const _Hospital = require('../models/hospital');

exports.protect = async (req, res, next) => {
  try {
    let token;

    // Get token from Authorization header if present
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Fallback to cookie if no token in header
    if (!token && req.cookies.login) {
      token = req.cookies.login;
    }

    // Return error if no token found
    if (!token) {
      return res.status(401).json({
        status: 'fail',
        message: 'No token provided. Please login.',
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const currentUser = await _Account.findById(decoded.accountId);

    if (!currentUser) {
      return res.status(401).json({
        status: 'fail',
        message: 'User no longer exists',
      });
    }

    // Populate additional user details based on role
    let userDetails;
    let modelId;
    let modelName;

    switch (currentUser.role) {
      case 'doctor':
        userDetails = await _Doctor.findOne({ accountId: currentUser._id });
        modelId = userDetails?._id;
        modelName = 'Doctor';
        break;

      case 'hospital_admin':
        userDetails = await _Hospital.findOne({ accountId: currentUser._id });
        modelId = userDetails?._id;
        modelName = 'Hospital';
        break;

      case 'system_admin':
        userDetails = { accountId: currentUser._id };
        modelId = currentUser._id;
        modelName = 'SystemAdmin';
        break;

      default:
        return res.status(403).json({
          status: 'fail',
          message: 'User role not recognized',
        });
    }

    // Ensure userDetails exists
    if (!userDetails) {
      return res.status(404).json({
        status: 'fail',
        message: 'Detailed user profile not found',
      });
    }

    req.user = currentUser;
    req.userDecoded = decoded;
    // // Attach to request object
    req.user = {
      ...currentUser.toObject(),
      modelId,
      model: modelName,
      fullName: userDetails.fullName || currentUser.fullName || 'Unknown',
    };

    next();
  } catch (err) {
    console.error('FULL MIDDLEWARE ERROR:', err);
    res.status(401).json({
      status: 'fail',
      message: 'Authentication error: ' + err.message,
    });
  }
};
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    console.log('User role:', req.user.role); // In ra role để kiểm tra
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to perform this action',
      });
    }
    next();
  };
};

exports.adminOnly = (req, res, next) => {
  console.log('check req.user.role', req.user.role);
  if (req.user.role !== 'system_admin') {
    return res.status(403).json({
      status: 'fail',
      message: 'This route is restricted to admin users only.',
    });
  }
  next();
};

exports.hospitalOnly = (req, res, next) => {
  if (req.user.role !== 'hospital_admin') {
    return res.status(403).json({
      status: 'fail',
      message: 'This route is restricted to admin users only.',
    });
  }
  next();
};

exports.doctorOrAdmin = (req, res, next) => {
  if (!['hospital_admin', 'system_admin'].includes(req.user.role)) {
    return res.status(403).json({
      status: 'fail',
      message: 'This route is restricted to system admin and hospital admin',
    });
  }
  next();
};

exports.patientOnly = (req, res, next) => {
  if (req.user.role !== 'patiend') {
    console.log('check req.role', req.user.role);
    return res.status(403).json({
      status: 'fail',
      message: 'This route is restricted to patient users only.',
    });
  }
  next();
};
// Middleware để kiểm tra quyền sở hữu bài viết
exports.checkPostOwnership = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const NewsPost = require('../models/NewsPost');

    // Tìm bài viết theo id
    const post = await NewsPost.findById(postId);

    if (!post) {
      return res.status(404).json({
        status: 'fail',
        message: 'Không tìm thấy bài viết',
      });
    }

    // Nếu là bác sĩ, kiểm tra xem có phải là tác giả hay không
    if (req.user.role === 'doctor') {
      if (post.author._id.toString() !== req.user.modelId.toString()) {
        return res.status(403).json({
          status: 'fail',
          message: 'Bạn không có quyền thao tác trên bài viết này',
        });
      }
    }

    req.post = post; // Đính kèm bài viết vào request để sử dụng sau này
    next();
  } catch (error) {
    return res.status(500).json({
      status: 'fail',
      message: 'Lỗi server: ' + error.message,
    });
  }
};
