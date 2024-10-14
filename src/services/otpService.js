const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);

const _Otp = require('../models/otp');

// insert otp
const insertOtp = (phoneNumber, otp) => {
  return new Promise(async (resolve, reject) => {
    try {
      const hashOtp = await bcrypt.hashSync(otp, salt);
      const result = _Otp.create({ phoneNumber, otp: hashOtp });

      if (result) {
        resolve({ message: 'Lưu otp thành công', errCode: 1 });
      } else {
        resolve({ message: 'Lưu otp thất bại', errCode: 0 });
      }
    } catch (error) {
      reject(error);
    }
  });
};

//verify otp
const verifyOtp = ({ otp, hashOtp }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const invalid = await bcrypt.compare(otp, hashOtp);
      resolve(invalid);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  insertOtp,
  verifyOtp,
};
