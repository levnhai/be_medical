const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);
const { mongoose } = require('../../config/database');

const _Account = require('../../models/account');
const _Doctor = require('../../models/doctor');
const _Hospital = require('../../models/hospital');
const _User = require('../../models/user');
const _Otp = require('../../models/otp');
const _Admin = require('../../models/admin');

const { generateJWTToken } = require('../../utils/generateJWTToken');
const { generateOTP } = require('../../utils/generateOTP');
const { isCheckPhoneExists } = require('../../utils/checkPhoneExists');
const otpService = require('../../services/otpService');

//admin
const handleLoginAdmin = async ({ phoneNumber, password }) => {
  try {
    if (!phoneNumber || !password) {
      return { code: 400, message: 'Please fill required fields', status: false };
    }
    const account = await _Account.findOne({ phoneNumber });
    let userData = {};
    switch (account.role) {
      case 'system_admin':
        const system_admin = await _Admin.findOne({ accountId: account.id });
        if (!system_admin) {
          return { code: 200, message: 'Tài khoản không tồn tại hoặc sai thông tin đăng nhập', status: false };
        }
        userData = system_admin;
        break;
      case 'hospital_admin':
        const hospital = await _Hospital.findOne({ accountId: account.id });
        if (!hospital) {
          return { code: 200, message: 'Tài khoản không tồn tại hoặc sai thông tin đăng nhập', status: false };
        }
        if (!hospital?.renewalStatus) {
          return {
            code: 200,
            message: 'Dịch vụ của bạn đã hết hạn.',
            status: false,
          };
        }
        userData = hospital;
        break;
      case 'doctor':
        const doctor = await _Doctor.findOne({ accountId: account.id }).populate('hospital');
        if (!doctor) {
          return { code: 200, message: 'Tài khoản không tồn tại hoặc sai thông tin đăng nhập', status: false };
        }
        if (!doctor?.hospital?.renewalStatus) {
          return {
            code: 200,
            message: 'Dịch vụ của bạn đã hết hạn',
            status: false,
          };
        }
        userData = doctor;
        break;
      default:
        return { code: 400, message: 'Invalid role', status: false };
    }

    const token = generateJWTToken({ account, userData });
    const isPassword = await bcrypt.compare(password, account.password);
    // isPassword
    //   ? return({ code: 200, message: 'Đăng nhập thành công', status: true, token, userData })
    //   : resolve({ code: 200, message: 'mật khẩu không đúng', status: false });
    if (isPassword) {
      return { code: 200, message: 'Đăng nhập thành công', status: true, token, userData };
    } else {
      return { code: 200, message: 'mật khẩu không đúng', status: false };
    }
  } catch (error) {
    return { code: 500, message: 'Lỗi máy chủ', status: false, error };
  }
};

//user
//login
const handleSingIn = async ({ phoneNumber, password }) => {
  try {
    if (phoneNumber && password) {
      let userData = {};

      const account = await _Account.findOne({ phoneNumber, role: 'patient' });
      if (!account) {
        return { code: 200, message: 'Tài khoản không tồn tại', status: false };
      } else {
        userData = await _User.findOne({ accountId: account.id });
      }
      const token = await generateJWTToken({ account, userData });
      const isPassword = await bcrypt.compare(password, account.password);

      if (isPassword) {
        return { code: 200, messagr: 'Đăng nhập thành công', status: true, token, userData };
      }
      return { code: 200, messagr: 'Mật khẩu không trùng khớp', status: false };
    } else {
      return { code: 200, messagr: 'Nhập các trường bắt buộc', status: false };
    }
  } catch (error) {
    return { code: 500, message: 'Lỗi máy chủ', status: false, error };
  }
};
// handle check phone exitst
const handleCheckPhoneExists = async (phoneNumber) => {
  try {
    let isCheckPhoneExists = await _Account.findOne({
      phoneNumber,
      role: 'patient',
    });

    if (isCheckPhoneExists) {
      return { code: 200, message: 'Số điện thoại đã tồn tại', exists: true };
    } else {
      return { code: 200, message: 'Số điện thoại chưa tồn tại', exists: false };
    }
  } catch (error) {
    return { code: 500, message: 'Lỗi máy chủ', status: false, error };
  }
};

// handle Send otp input
const handleSendotpInput = async (phoneNumber) => {
  try {
    const otp = generateOTP();
    console.log('chekc randomOtp', otp);
    if (otp) {
      const { message } = await otpService.insertOtp(phoneNumber, otp);
      return { message, code: 201 };
    } else {
      return { message: 'Tạo otp thất bại', code: 400 };
    }
  } catch (error) {
    return { code: 500, message: 'Lỗi máy chủ', status: false, error };
  }
};

debugger;
// handle verifyOtp
const handleVerifyOtp = async (phoneNumber, otp) => {
  try {
    const otpHolder = await _Otp.find({ phoneNumber });
    console.log('🚀 ~ handleVerifyOtp ~ otpHolder:', otpHolder);
    if (!otpHolder.length) {
      return { code: 201, message: 'Hết thời gian nhập', status: false };
    }

    // get last otp
    const lastOtp = otpHolder[otpHolder.length - 1];
    console.log('🚀 ~ handleVerifyOtp ~ lastOtp:', lastOtp);

    // check otp
    const invalid = await otpService.verifyOtp({ otp, hashOtp: lastOtp.otp });
    console.log('🚀 ~ handleVerifyOtp ~ invalid:', invalid);
    if (invalid) {
      await _Otp.deleteMany({ phoneNumber });
      return { code: 201, message: 'Xác thực Thành công!', status: true };
    } else {
      return { code: 201, message: 'Xác thực thất bại!', status: false };
    }
  } catch (error) {
    return { code: 500, message: 'Lỗi máy chủ', status: false, error };
  }
};

// handle sing up
const handleSingUp = async (formData) => {
  try {
    const session = await mongoose.startSession(); // Khởi tạo session từ mongoose
    session.startTransaction();
    const { fullName, phoneNumber, password, reEnterPassword, referralCode } = formData;
    // const checkPhoneExists = await isCheckPhoneExists(phoneNumber);
    let checkPhoneExists = await _Account.findOne({
      phoneNumber,
      role: 'patient',
    });

    // if (checkPhoneExists && checkPhoneExists.role === 'patient') {
    //   resolve({ code: 200, message: 'Số điện thoại đã tồn tại', status: false });
    // }

    if (!checkPhoneExists) {
      if (password === reEnterPassword) {
        const hashReEnterPassword = await bcrypt.hashSync(reEnterPassword, salt);

        const account = await _Account.create(
          [
            {
              phoneNumber,
              password: hashReEnterPassword,
              role: 'patient',
            },
          ],
          { session },
        );

        const userData = await _User.create(
          [
            {
              accountId: account[0]._id,
              fullName,
              referralCode,
            },
          ],
          { session },
        );
        await session.commitTransaction();
        session.endSession();
        return { code: 201, message: 'Tạo thành công', status: true, userData: userData[0] };
      } else {
        // Nếu xảy ra lỗi, rollback
        await session.abortTransaction();
        session.endSession();
        return { code: 200, message: 'Mật khẩu không khớp', status: false };
      }
    } else {
      return { code: 200, message: 'Số điện thoại đã tồn tại', status: false };
    }
  } catch (error) {
    return { code: 500, message: 'Lỗi máy chủ', status: false, error };
  }
};

// handle forgot password
const handleForgotPassword = async ({ phoneNumber, password, reEnterPassword }) => {
  try {
    if (password === reEnterPassword) {
      const account = await _Account.findOne({ phoneNumber });
      if (!account) {
        return { code: 200, message: 'Người dùng không tồn tại', status: false };
      }
      const hastPassword = await bcrypt.hashSync(password, salt);
      const hastReEnterPassword = await bcrypt.hashSync(reEnterPassword, salt);
      await _Account.findOneAndUpdate(
        { phoneNumber },
        { password: hastPassword, reEnterPassword: hastReEnterPassword },
        { new: true },
      );

      return { code: 200, message: 'Cập nhật mật khẩu thành công', status: true };
    } else {
      return { code: 200, message: 'Mật khẩu không trùng khớp', status: false };
    }
  } catch (error) {
    return { code: 500, message: 'Lỗi máy chủ', status: false, error };
  }
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
