const AuthServices = require('../../services/auth/authServices');
require('dotenv').config();

class AuthController {
  //admin
  async handleLoginAdmin(req, res, next) {
    {
      let { phoneNumber, password } = req.body;
      const result = await AuthServices.handleLoginAdmin({ phoneNumber, password });
      return res.status(result.code).json({
        result,
      });
    }
  }

  // user

  //facebookLogin
  async handleSingIn(req, res, next) {
    {
      let { phoneNumber, password } = req.body;
      const result = await AuthServices.handleSingIn({ phoneNumber, password });
      return res.status(result.code).json({
        result,
      });
    }
  }

  async handleCheckphone(req, res) {
    let phoneNumber = req.body?.phoneNumber;

    if (phoneNumber) {
      const { code, message, exists } = await AuthServices.handleCheckPhoneExists(phoneNumber);
      return res.status(code).json({
        code,
        message,
        exists,
      });
    }
    return res.status(400).json({ code: 400, message: 'Vui lòng nhập số điện thoại' });
  }

  // send otp
  async handleSendotpInput(req, res) {
    let phoneNumber = req.body?.phoneNumber;

    if (phoneNumber) {
      const { code, message } = await AuthServices.handleSendotpInput(phoneNumber);
      return res.status(code).json({
        code,
        message,
      });
    }
    return res.status(400).json({ code: 400, message: 'Vui lòng nhập số điện thoại' });
  }

  // verify otp
  async handleVerifyOtp(req, res) {
    let { phoneNumber, otp } = req.body;
    console.log('chekc phone', phoneNumber);
    console.log('chekc otp', otp);

    const { code, message, status } = await AuthServices.handleVerifyOtp(phoneNumber, otp);
    return res.status(code).json({
      code,
      message,
      status,
    });
  }

  //sing up
  async handleSingUp(req, res) {
    const { formData } = req.body;
    console.log('check formData', formData);
    const result = await AuthServices.handleSingUp(formData);
    console.log('check result', result);

    return res.status(result.code).json({
      result,
    });
  }
  // forgot password
  async handleForgotPassword(req, res) {
    const { phoneNumber, password, reEnterPassword } = req.body;
    const result = await AuthServices.handleForgotPassword({ phoneNumber, password, reEnterPassword });
    return res.status(result.code).json({
      result,
    });
  }

  // exports.googleLogin = async (req, res) => {
  //   try {
  //     console.log('Received data:', req.body);
  //     const { token } = req.body;

  //     if (!token) {
  //       return res.status(400).json({
  //         status: 'Lỗi',
  //         message: 'Token không được cung cấp',
  //       });
  //     }

  //     const ticket = await client.verifyIdToken({
  //       idToken: token,
  //       audience: process.env.GG_CLIENT_ID,
  //     });
  //     const { name, email, picture } = ticket.getPayload();

  //     // Tìm user theo email
  //     let user = await User.findOne({ email });

  //     if (!user) {
  //       // Nếu user chưa tồn tại, tạo mới với một mật khẩu ngẫu nhiên
  //       const randomPassword = Math.random().toString(36).slice(-8);
  //       user = new User({
  //         username: name,
  //         email,
  //         password: randomPassword, // Lưu ý: Bạn nên hash password này trước khi lưu
  //         profilePicture: picture,
  //       });
  //       await user.save();
  //     }

  //     // Tạo JWT token
  //     const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
  //       expiresIn: process.env.JWT_EXPIRES_IN,
  //     });

  //     res.status(200).json({
  //       status: 'Đăng nhập thành công',
  //       token: jwtToken,
  //       data: {
  //         id: user._id,
  //         username: user.username,
  //         email: user.email,
  //         role: user.role,
  //       },
  //     });
  //   } catch (error) {
  //     console.error('Google login error:', error);
  //     res.status(400).json({
  //       status: 'Lỗi',
  //       message: error.message,
  //     });
  //   }
  // };

  // exports.facebookLogin = async (req, res) => {
  //   try {
  //     const { accessToken } = req.body;

  //     if (!accessToken) {
  //       return res.status(400).json({
  //         status: 'Error',
  //         message: 'Access token not provided',
  //       });
  //     }

  //     // Verify the access token and get user info from Facebook
  //     const facebookResponse = await axios.get(
  //       `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${accessToken}`,
  //     );
  //     const { id, name, email, picture } = facebookResponse.data;

  //     // Find user by Facebook ID or email
  //     let user = await User.findOne({ $or: [{ facebookId: id }, { email }] });

  //     if (!user) {
  //       // If user doesn't exist, create a new one
  //       const randomPassword = Math.random().toString(36).slice(-8);
  //       user = new User({
  //         username: name,
  //         email,
  //         password: await bcrypt.hash(randomPassword, 12),
  //         profilePicture: picture.data.url,
  //         facebookId: id,
  //       });
  //       await user.save();
  //     }

  //     // Create JWT token
  //     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
  //       expiresIn: process.env.JWT_EXPIRES_IN,
  //     });

  //     res.status(200).json({
  //       status: 'Login successful',
  //       token,
  //       data: {
  //         id: user._id,
  //         username: user.username,
  //         email: user.email,
  //         role: user.role,
  //       },
  //     });
  //   } catch (error) {
  //     console.error('Facebook login error:', error);
  //     res.status(400).json({
  //       status: 'Error',
  //       message: error.message,
  //     });
  //   }
  // };
}
module.exports = new AuthController();
