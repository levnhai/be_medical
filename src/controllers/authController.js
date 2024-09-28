const User = require('../models/user'); // Mô hình người dùng
const { OAuth2Client } = require('google-auth-library');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios'); 
const client = new OAuth2Client(process.env.GG_CLIENT_ID);

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
exports.googleLogin = async (req, res) => {
  try {
    console.log('Received data:', req.body);
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({
        status: 'Lỗi',
        message: 'Token không được cung cấp'
      });
    }

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GG_CLIENT_ID
    });
    const { name, email, picture } = ticket.getPayload();

    // Tìm user theo email
    let user = await User.findOne({ email });

    if (!user) {
      // Nếu user chưa tồn tại, tạo mới với một mật khẩu ngẫu nhiên
      const randomPassword = Math.random().toString(36).slice(-8);
      user = new User({
        username: name,
        email,
        password: randomPassword, // Lưu ý: Bạn nên hash password này trước khi lưu
        profilePicture: picture
      });
      await user.save();
    }

    // Tạo JWT token
    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });

    res.status(200).json({
      status: 'Đăng nhập thành công',
      token: jwtToken,
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(400).json({
      status: 'Lỗi',
      message: error.message
    });
  }
};
exports.facebookLogin = async (req, res) => {
  try {
    const { accessToken } = req.body;
    
    if (!accessToken) {
      return res.status(400).json({
        status: 'Error',
        message: 'Access token not provided'
      });
    }

    // Verify the access token and get user info from Facebook
    const facebookResponse = await axios.get(`https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${accessToken}`);
    const { id, name, email, picture } = facebookResponse.data;

    // Find user by Facebook ID or email
    let user = await User.findOne({ $or: [{ facebookId: id }, { email }] });

    if (!user) {
      // If user doesn't exist, create a new one
      const randomPassword = Math.random().toString(36).slice(-8);
      user = new User({
        username: name,
        email,
        password: await bcrypt.hash(randomPassword, 12),
        profilePicture: picture.data.url,
        facebookId: id
      });
      await user.save();
    }

    // Create JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });

    res.status(200).json({
      status: 'Login successful',
      token,
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Facebook login error:', error);
    res.status(400).json({
      status: 'Error',
      message: error.message
    });
  }
};