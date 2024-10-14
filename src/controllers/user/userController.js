const userServices = require('../../services/user/userService');

class userController {
  // check phone exitst
  async handleCheckphone(req, res) {
    let phoneNumber = req.body?.phoneNumber;

    if (phoneNumber) {
      const { code, message, exists } = await userServices.handleCheckPhoneExists(phoneNumber);
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
      const { code, message } = await userServices.handleSendotpInput(phoneNumber);
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

    const { code, message, status } = await userServices.handleVerifyOtp(phoneNumber, otp);
    return res.status(code).json({
      code,
      message,
      status,
    });
  }

  // sing in
  async handleLogin(req, res) {
    let { phoneNumber, password } = req.body;

    if (phoneNumber && password) {
      let result = await userServices.handleSingIn({ phoneNumber, password });
      return res.status(result.code).json({
        result,
      });
    }
    return res.status(result.code).json({ message: 'Vui lòng nhập số điện thoại' });
  }

  //sing up
  async handleSingUp(req, res) {
    const { formData } = req.body;

    console.log('check formData', formData);

    const result = await userServices.handleSingUp(formData);
    return res.status(result.code).json({
      result,
    });
  }
  // forgot password
  async handleForgotPassword(req, res) {
    const { phoneNumber, password, reEnterPassword } = req.body;
    const result = await userServices.handleForgotPassword({ phoneNumber, password, reEnterPassword });
    return res.status(result.code).json({
      result,
    });
  }
}

module.exports = new userController();
