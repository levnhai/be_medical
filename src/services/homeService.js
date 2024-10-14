const _ = require('lodash');
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);
const MAX_NUMBER_SCHEDULE = 10;
const dotenv = require('dotenv');

const UserDb = require('../models/user');

// handle check phone exitst
const handleCheckPhoneExists = (phoneNumber) => {
  return new Promise(async (resolve, reject) => {
    try {
      let isCheckPhoneExists = await UserDb.findOne({
        phoneNumber: phoneNumber,
      });

      if (isCheckPhoneExists) {
        resolve({ code: 409, message: 'Số điện thoại đã tồn tại', exists: true });
      } else {
        resolve({ code: 200, message: 'Số điện thoại chưa tồn tại', exists: false });
      }
    } catch (error) {
      reject(error);
    }
  });
};

// handle Login user
const handleLogin = () => {
  return new Promise(async (resolve, reject) => {
    try {
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
      const randomOtp = generateOTP();
      if (randomOtp) {
        resolve({ message: 'random otp thành công', errCode: 0, otpInput: randomOtp, status: 'success' });
      } else {
        resolve({ message: 'random otp thất bại', errCode: 1, otpInput: {}, status: 'failure' });
      }
    } catch (error) {
      reject(error);
    }
  });
};

let hastPassword = (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hashPassword = await bcrypt.hashSync(password, salt);
      resolve(hashPassword);
    } catch (error) {
      reject(error);
    }
  });
};

// handle get all province
const getAllProvince = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = {};
      data = await ProvinceDb.find({});
      resolve({
        errCode: 0,
        errMessage: 'get all data successfully ...',
        data: data,
      });
    } catch (error) {
      reject(error);
    }
  });
};

// handle get all code by type
const getAllCodeDataByType = (typeInput) => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = {};
      data = await AllCodeDb.find({ type: typeInput });
      resolve({
        errCode: 0,
        errMessage: 'get all data successfully ...',
        data: data,
      });
    } catch (error) {
      reject(error);
    }
  });
};

const bulkCreateSchedule = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.schedule) {
        resolve({
          errCode: 1,
          errMessage: 'missing require prams ...',
        });
      } else {
        let schedule = data.schedule;

        // thêm cột MAX_NUMBER_SCHEDULE trong db
        if (schedule && schedule.length > 0) {
          schedule = schedule.map((item) => {
            item.maxNumber = MAX_NUMBER_SCHEDULE;
            return item;
          });
        }

        // lấy dữ liệu trong db với diều kiện
        let existing = await ScheduleDb.find({ date: data.formattedDate, docterId: data.docterId });

        // kiểm tra sự tồn tại trong db, trả về những kết quả không trùng khớp
        let toCreate = _.differenceWith(schedule, existing, (a, b) => {
          return a.timeType === b.timeType && a.date === b.date;
        });

        // lưu dữ liệu
        if (toCreate && toCreate.length > 0) {
          await ScheduleDb.insertMany(toCreate);
          resolve({
            errCode: 0,
            errMessage: 'successfully created schedule...',
          });
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};

// tạo 1 otp ngẫu nhiên 6 số
const generateOTP = () => {
  const digits = '0123456789';
  let OTP = '';
  for (let i = 0; i < 6; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
};

module.exports = {
  getAllProvince,
  getAllCodeDataByType,
  bulkCreateSchedule,
  handleCheckPhoneExists,
  handleLogin,
  handleSendotpInput,
};
