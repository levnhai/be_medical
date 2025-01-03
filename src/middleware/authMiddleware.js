const jwt = require('jsonwebtoken');
require('dotenv').config();
const _Account = require('../models/account');

exports.protect = async (req, res, next) => {
  try {
    let token;

    // Lấy token từ header Authorization nếu có
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Nếu không có, lấy token từ cookie
    if (!token && req.cookies.login) {
      token = req.cookies.login;
    }

    console.log('check token: ', token);
    if (!token) {
      return res.status(401).json({
        status: 'fail',
        message: 'require login',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const currentUser = await _Account.findById(decoded.accountId);

    if (!currentUser) {
      return res.status(401).json({
        status: 'fail',
        message: 'The user belonging to this token no longer exists.',
      });
    }

    req.user = currentUser;
    req.userDecoded = decoded;
    next();
  } catch (err) {
    res.status(401).json({
      status: 'fail',
      message: 'Invalid token. Please log in again!',
    });
  }
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
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
