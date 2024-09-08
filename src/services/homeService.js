const _ = require('lodash');
const DocterDb = require('../app/Models/Docter');
const ProvinceDb = require('../app/Models/province');
const ScheduleDb = require('../app/Models/Schedules');
const AllCodeDb = require('../app/Models/allcode');
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);
const MAX_NUMBER_SCHEDULE = 10;

const handleCheckPhoneExists = (phoneNumberInput) => {
  return new Promise(async (resolve, reject) => {
    try {
      let isCheckPhoneExists = await DocterDb.findOne({
        phoneNumber: phoneNumberInput,
      });

      if (isCheckPhoneExists) {
        resolve(true);
      } else {
        resolve(false);
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
module.exports = {
  getAllProvince,
  getAllCodeDataByType,
  bulkCreateSchedule,
};
