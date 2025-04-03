const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);

const _Otp = require('../models/otp');

// insert otp
const insertOtp = async (phoneNumber, otp) => {
  try {
    const hashOtp = await bcrypt.hashSync(otp, salt);
    const result = _Otp.create({ phoneNumber, otp: hashOtp });

    if (result) {
      return { message: 'Lưu otp thành công', errCode: 1 };
    } else {
      return { message: 'Lưu otp thất bại', errCode: 0 };
    }
  } catch (error) {
    return { code: 500, message: 'Lỗi máy chủ', status: false, error };
  }
};

//verify otp
const verifyOtp = ({ otp, hashOtp }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const invalid = await bcrypt.compare(otp, hashOtp);
      return invalid;
    } catch (error) {
      return { code: 500, message: 'Lỗi máy chủ', status: false, error };
    }
  });
};

module.exports = {
  insertOtp,
  verifyOtp,
};
