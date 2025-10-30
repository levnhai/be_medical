const _ = require('lodash');
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);
const jwt = require('jsonwebtoken');

const _User = require('../../models/user');
const _Otp = require('../../models/otp');
const _Account = require('../../models/account');
const otpService = require('../../services/otpService');

const { isCheckPhoneExists } = require('../../utils/checkPhoneExists');
const { generateOTP } = require('../../utils/generateOTP');

// handle get all users
const handleGetAllUsers = async () => {
  try {
    const user = await _User.find({}, '-password -reEnterPassword').populate('accountId', '-password -role');
    return { code: 200, message: 'Lấy dữ liệu thành công', total: user.length, status: true, user };
  } catch (error) {
    return { code: 500, message: 'Lỗi máy chủ', status: false, error };
  }
};

// handle delete user
const handleDeleteUser = async (userId) => {
  try {
    let user = await _User.findOneAndDelete({ _id: userId });
    if (user) {
      return { code: 200, message: 'Xóa người dùng thành công', status: true };
    } else {
      return { code: 200, message: 'Không tìm thấy người dùng', status: false };
    }
  } catch (error) {
    return { code: 500, message: 'Lỗi máy chủ', status: false, error };
  }
};

// handle edit user
const handleEditUser = async (userId, formData) => {
  try {
    // Kiểm tra user có tồn tại không
    const user = await _User.findById(userId);
    if (!user) {
      return {
        code: 404,
        message: 'Không tìm thấy người dùng',
        status: false,
      };
    }

    // Nếu cập nhật email, kiểm tra email mới có trùng với user khác không
    if (formData.email && formData.email !== user.email) {
      const existingEmail = await _User.findOne({
        email: formData.email,
        _id: { $ne: userId },
      });
      if (existingEmail) {
        return {
          code: 400,
          message: 'Email đã tồn tại',
          status: false,
        };
      }
    }

    // Nếu cập nhật số điện thoại, kiểm tra số điện thoại mới có trùng với user khác không
    if (formData.phoneNumber && formData.phoneNumber !== user.phoneNumber) {
      const existingPhone = await _User.findOne({
        phoneNumber: formData.phoneNumber,
        _id: { $ne: userId },
      });
      if (existingPhone) {
        return {
          code: 400,
          message: 'Số điện thoại đã tồn tại',
          status: false,
        };
      }
    }

    if (formData.password) {
      if (formData.password !== formData.reEnterPassword) {
        return {
          code: 400,
          message: 'Mật khẩu nhập lại không khớp',
          status: false,
        };
      }
      const salt = await bcrypt.genSalt(10);
      formData.password = await bcrypt.hash(formData.password, salt);
      formData.reEnterPassword = formData.password;
    }

    // Cập nhật thông tin user
    await _User.findByIdAndUpdate(userId, formData, { new: true });

    return {
      code: 200,
      message: 'Cập nhật thông tin thành công',
      status: true,
    };
  } catch (error) {
    return { code: 500, message: 'Lỗi máy chủ', status: false, error };
  }
};

// handle create user
const handleCreateUser = async (formData) => {
  try {
    const { email, phoneNumber, fullName, password, reEnterPassword, image, gender, address, referralCode } = formData;

    const isCheckPhoneExist = await isCheckPhoneExists(phoneNumber);
    if (isCheckPhoneExist) {
      return { code: 200, message: 'Số điện thoại đã tồn tại', status: false };
    }

    if (password !== reEnterPassword) {
      return { code: 200, message: 'Nhập mật khẩu không trùng khớp', status: false };
    }

    let hastpassword = await bcrypt.hashSync(password, salt);

    const account = await _Account.create({
      phoneNumber,
      email,
      password: hastpassword,
      role: 'patient',
    });

    const user = await _User.create({
      accountId: account._id,
      fullName,
      gender,
      address,
      image,
      referralCode,
    });

    return { code: 200, message: 'Tạo người dùng thành công', status: true, user };
  } catch (error) {
    return { code: 500, message: 'Lỗi máy chủ', status: false, error };
  }
};
module.exports = {
  handleGetAllUsers,
  handleDeleteUser,
  handleEditUser,
  handleCreateUser,
};
