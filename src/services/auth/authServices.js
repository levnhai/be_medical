const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);
const mongoose = require('mongoose');

const _Account = require('../../models/account');
const _Docter = require('../../models/doctor');
const _Hospital = require('../../models/hospital');
const _User = require('../../models/user');
const _Otp = require('../../models/otp');

const { generateJWTToken } = require('../../utils/generateJWTToken');
const { generateOTP } = require('../../utils/generateOTP');
const { isCheckPhoneExists } = require('../../utils/checkPhoneExists');
const otpService = require('../../services/otpService');

//admin
const handleLoginAdmin = ({ phoneNumber, password }) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (phoneNumber && password) {
        const account = await _Account.findOne({ phoneNumber });
        let userData = {};
        switch (account.role) {
          case 'system_admin':
            break;
          case 'hospital_admin':
            const hospital = await _Hospital.findOne({ accountId: account.id });
            if (!hospital) {
              resolve({ code: 404, message: 'Hospital not found for this admin', status: false });
            }
            userData = hospital;
            break;

          case 'docter':
            const docter = await _Docter.findOne({ accountId: account.id });
            if (!docter) {
              resolve({ code: 404, message: 'docter profile not found', status: false });
            }
            userData = docter;
            break;
          default:
            resolve({ code: 400, message: 'Invalid role', status: false });
        }

        const token = generateJWTToken({ account, userData });
        const isPassword = await bcrypt.compare(password, account.password);
        isPassword
          ? resolve({ code: 200, messagr: 'Đăng nhập thành công', status: true, token, userData })
          : resolve({ code: 200, messagr: 'Mật khẩu không trùng khớp', status: false });
      } else {
        resolve({ code: 200, messagr: 'Nhập các trường bắt buộc', status: false });
      }
    } catch (error) {
      reject(error);
    }
  });
};

//user
//login
const handleSingIn = ({ phoneNumber, password }) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (phoneNumber && password) {
        const account = await _Account.findOne({ phoneNumber });
        console.log('check access', account);
        if (!account) {
          resolve({ code: 200, message: 'Tài khoản không tồn tại', status: false });
        }
        let userData = {};
        if (account.role === 'patient') {
          userData = await _User.findOne({ accountId: account.id });
        } else {
          resolve({ code: 400, message: 'Tài khoản không tồn tại', status: false });
        }
        const token = generateJWTToken({ account, userData });
        const isPassword = await bcrypt.compare(password, account.password);
        isPassword
          ? resolve({ code: 200, messagr: 'Đăng nhập thành công', status: true, token, userData })
          : resolve({ code: 200, messagr: 'Mật khẩu không trùng khớp', status: false });
      } else {
        resolve({ code: 200, messagr: 'Nhập các trường bắt buộc', status: false });
      }
    } catch (error) {
      reject(error);
    }
  });
};
// handle check phone exitst
const handleCheckPhoneExists = (phoneNumber) => {
  return new Promise(async (resolve, reject) => {
    try {
      let isCheckPhoneExists = await _Account.findOne({
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
      const checkPhoneExists = await isCheckPhoneExists(phoneNumber);
      if (!checkPhoneExists) {
        if (password === reEnterPassword) {
          const hashReEnterPassword = await bcrypt.hashSync(reEnterPassword, salt);

          const account = await _Account.create({
            phoneNumber,
            password: hashReEnterPassword,
            role: 'patient',
          });
          const user = await _User.create({
            accountId: account._id,
            fullName,
            referralCode,
          });
          resolve({ code: 201, message: 'Tạo thành công', status: true, user });
        } else {
          resolve({ code: 200, message: 'Mật khẩu không khớp', status: false });
        }
      } else {
        resolve({ code: 200, message: 'Số điện thoại đã tồn tại', status: false });
      }
    } catch (error) {
      reject(error);
    }
  });
};

// hanle sing in
// const handleSingIn = ({ phoneNumber, password }) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       if (phoneNumber && password) {
//         const user = await _User.findOne({ phoneNumber });
//         const token = signToken(user._id);
//         console.log('check token,', token);

//         const isPassword = await bcrypt.compare(password, user.password);
//         isPassword
//           ? resolve({ code: 200, messagr: 'Đăng nhập thành công', status: true, user })
//           : resolve({ code: 200, messagr: 'Mật khẩu không trùng khớp', status: false });
//       } else {
//         resolve({ code: 200, messagr: 'Nhập các trường bắt buộc', status: false });
//       }
//     } catch (error) {
//       reject(error);
//     }
//   });
// };

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

module.exports = {
  handleLoginAdmin,
  handleCheckPhoneExists,
  handleVerifyOtp,
  handleSendotpInput,
  handleSingUp,
  handleForgotPassword,
  handleSingIn,
};
