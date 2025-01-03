const jwt = require('jsonwebtoken');
require('dotenv').config();
const _Account = require('../models/account');
const _Docter = require('../models/docter');
const _Hospital = require('../models/hospital');

// exports.protect = async (req, res, next) => {
//   try {
//     console.log('check req.cookies', req.cookies);
//     let token;

//     // Lấy token từ header Authorization nếu có
//     if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
//       token = req.headers.authorization.split(' ')[1];
//     }

//     // Nếu không có, lấy token từ cookie
//     if (!token && req.cookies.login) {
//       token = req.cookies.login;
//     }

//     console.log('check token: ', token);
//     if (!token) {
//       return res.status(401).json({
//         status: 'fail',
//         message: 'require login',
//       });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     console.log('check decoded: ', decoded);

//     const currentUser = await _Account.findById(decoded.accountId);

//     console.log('check currentUser', currentUser);

//     if (!currentUser) {
//       return res.status(401).json({
//         status: 'fail',
//         message: 'The user belonging to this token no longer exists.',
//       });
//     }

//     req.user = currentUser;
//     next();
//   } catch (err) {
//     res.status(401).json({
//       status: 'fail',
//       message: 'Invalid token. Please log in again!',
//     });
//   }
// };
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

    // Throw error if no token found
    if (!token) {
      return res.status(401).json({
        status: 'fail',
        message: 'No token provided. Please login.',
      });
    }

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
    let modelName;

    switch (currentUser.role) {
      case 'docter':
        userDetails = await _Docter.findOne({ accountId: currentUser._id });
        modelName = 'Docter';
        break;
    
      case 'hospital_admin':
        userDetails = await _Hospital.findOne({ accountId: currentUser._id });
        modelName = 'Hospital';
        break;
    
      case 'system_admin':
        userDetails = { accountId: currentUser._id };
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
