const User = require('../models/user'); // Mô hình người dùng
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

exports.signup = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const newUser = await User.create({
      username,
      email,
      password,
      role
    });

    const token = signToken(newUser._id);

    res.status(201).json({
      status: 'Thành công',
      token,
      data: {
        user: newUser
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if ((!username && !email) || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Vui lòng cung cấp tên người dùng hoặc email và mật khẩu'
      });
    }

    const user = await User.findOne({
      $or: [
        { username: username },
        { email: email }
      ]
    }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        status: 'Thất bại',
        message: 'Sai tài khoản/email hoặc mật khẩu'
      });
    }

    const token = signToken(user._id);

    // Trả về thêm thông tin người dùng, bao gồm role
    res.status(200).json({
      status: 'Đăng nhập thành công',
      token,
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'Lỗi',
      message: err.message
    });
  }
};