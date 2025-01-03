const _Record = require('../../models/record');

// handle create record
const handleCreateRecord = (formData) => {
  return new Promise(async (resolve, reject) => {
    try {
      const {
        userId,
        fullName,
        phoneNumber,
        email,
        cccd,
        job,
        ethnic,
        street,
        gender,
        provinceId,
        districtId,
        wardId,
        provinceName,
        districtName,
        wardName,
      } = formData;

      const address = {
        provinceId,
        districtId,
        wardId,
        provinceName,
        districtName,
        wardName,
        street,
      };
      const record = await _Record.create({
        userId,
        fullName,
        phoneNumber,
        job,
        cccd,
        email,
        gender,
        ethnic,
        address,
      });

      console.log('check formData', userId);
      resolve({ code: 200, message: 'Thêm thành công', status: true, record });
    } catch (error) {
      reject(error);
    }
  });
};
const handlegetRecordById = (recordId) => {
  return new Promise(async (resolve, reject) => {
    console.log('check recordById', recordId);
    try {
      const data = await _Record.find({ userId: recordId });
      resolve({
        code: 200,
        message: 'Lấy dữ liệu thành công',
        status: true,
        total: data.length,
        data,
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  handleCreateRecord,
  handlegetRecordById,
};
