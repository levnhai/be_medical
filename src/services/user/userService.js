const _ = require('lodash');
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);
const dotenv = require('dotenv');
const { generateOTP } = require('../../utils/generateOTP');

const _User = require('../../models/user');
const _Otp = require('../../models/otp');
const otpService = require('../../services/otpService');

// handle check phone exitst
const handleCheckPhoneExists = (phoneNumber) => {
  return new Promise(async (resolve, reject) => {
    try {
      let isCheckPhoneExists = await _User.findOne({
        phoneNumber,
      });

      if (isCheckPhoneExists) {
        resolve({ code: 200, message: 'Số điện thoại đã tồn tại', exists: true });
      } else {
        resolve({ code: 200, message: 'Số điện thoại chưa tồn tại', exists: false });
      }
    } catch (error) {
      reject(error);
    }
  });
};

// handle Send otp input
const handleSendotpInput = (phoneNumber) => {
  return new Promise(async (resolve, reject) => {
    console.log('check phoneNumber', phoneNumber);
    try {
      const otp = generateOTP();
      console.log('chekc randomOtp', otp);
      if (otp) {
        const { message } = await otpService.insertOtp(phoneNumber, otp);
        resolve({ message, code: 201 });
      } else {
        resolve({ message: 'Tạo otp thất bại', code: 400 });
      }
    } catch (error) {
      reject(error);
    }
  });
};

// handle verifyOtp
const handleVerifyOtp = (phoneNumber, otp) => {
  return new Promise(async (resolve, reject) => {
    try {
      const otpHolder = await _Otp.find({ phoneNumber });
      if (!otpHolder.length) {
        resolve({ code: 201, message: 'Hết thời gian nhập', status: false });
      }

      // get last otp
      const lastOtp = otpHolder[otpHolder.length - 1];

      // check otp
      const invalid = await otpService.verifyOtp({ otp, hashOtp: lastOtp.otp });
      if (invalid) {
        // deleteMany otp in data
        await _Otp.deleteMany({ phoneNumber });
        resolve({ code: 201, message: 'Xác thực Thành công!', status: true });
      } else {
        resolve({ code: 201, message: 'Xác thực thất bại!', status: false });
      }
    } catch (error) {
      reject(error);
    }
  });
};

// handle sing up
const handleSingUp = (formData) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { fullName, phoneNumber, password, reEnterPassword, referralCode } = formData;
      const isCheckPhoneExists = await handleCheckPhoneExists(phoneNumber);
      console.log('check isCheckPhoneExists', isCheckPhoneExists);
      if (!isCheckPhoneExists?.exists) {
        if (password === reEnterPassword) {
          const hashPassword = await bcrypt.hashSync(password, salt);
          const hashReEnterPassword = await bcrypt.hashSync(reEnterPassword, salt);
          console.log('hashReEnterPassword', hashReEnterPassword);
          console.log('hashReEnterPassword', hashPassword);
          const user = await _User.create({
            fullName,
            phoneNumber,
            password: hashReEnterPassword,
            reEnterPassword: hashReEnterPassword,
            referralCode,
          });
          resolve({ code: 201, message: 'Tạo thành công', user });
        } else {
          resolve({ code: 200, message: 'Mật khẩu không khớp' });
        }
      } else {
        resolve({ code: 400, message: 'Số điện thoại đã tồn tại' });
      }
    } catch (error) {
      reject(error);
    }
  });
};

// hanle sing in
const handleSingIn = ({ phoneNumber, password }) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (phoneNumber && password) {
        const user = await _User.findOne({ phoneNumber });
        console.log('check user: ', user);
        const isPassword = await bcrypt.compare(password, user.password);
        console.log('check password is: ', isPassword);

        isPassword
          ? resolve({ code: 200, messagr: 'Đăng nhập thành công', status: true, user })
          : resolve({ code: 200, messagr: 'Mật khẩu không trùng khớp', status: false });
      } else {
        resolve({ code: 200, messagr: 'Nhập các trường bắt buộc', status: false });
      }
    } catch (error) {
      reject(error);
    }
  });
};

// handle forgot password
const handleForgotPassword = ({ phoneNumber, password, reEnterPassword }) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log('check form data: ', phoneNumber, password, reEnterPassword);
      if (password === reEnterPassword) {
        const user = await _User.findOne({ phoneNumber });
        if (!user) {
          resolve({ code: 200, message: 'Người dùng không tồn tại', status: false });
        }
        const hastPassword = await bcrypt.hashSync(password, salt);
        const hastReEnterPassword = await bcrypt.hashSync(reEnterPassword, salt);
        await _User.findOneAndUpdate(
          { phoneNumber },
          { password: hastPassword, reEnterPassword: hastReEnterPassword },
          { new: true },
        );

        resolve({ code: 200, message: 'Cập nhật mật khẩu thành công', status: true });
      } else {
        resolve({ code: 200, message: 'Mật khẩu không trùng khớp', status: false });
      }
    } catch (error) {
      reject(error);
    }
  });
};

// handle get all users
const handleGetAllUsers = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await _User.find({}, '-password -reEnterPassword');
      resolve({ code: 200, message: 'Lấy dữ liệu thành công', status: true, user });
    } catch (error) {
      reject(error);
    }
  });
};

// handle delete user
const handleDeleteUser = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await _User.findOneAndDelete({ _id: userId });
      if (user) {
        resolve({ code: 200, message: 'Xóa người dùng thành công', status: true });
      } else {
        resolve({ code: 200, message: 'Không tìm thấy người dùng', status: false });
      }
    } catch (error) {
      reject(error);
    }
  });
};

// handle edit user
const handleEditUser = (formData) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await _User.findOneAndDelete({ _id: userId });
      if (user) {
        resolve({ code: 200, message: 'Xóa người dùng thành công', status: true });
      } else {
        resolve({ code: 200, message: 'Không tìm thấy người dùng', status: false });
      }
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  handleCheckPhoneExists,
  handleSendotpInput,
  handleVerifyOtp,
  handleSingUp,
  handleSingIn,
  handleForgotPassword,
  handleGetAllUsers,
  handleDeleteUser,
  handleEditUser,
};
