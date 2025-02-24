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
        birthdate,
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
        birthdate,
        ethnic,
        address,
      });

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
const handleDeleteRecord = (recordId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const existingRecord = await _Record.findById(recordId);
      if (!existingRecord) {
        resolve({
          code: 404,
          message: 'Không tìm thấy hồ sơ bệnh nhân',
          status: false,
        });
        return;
      }

      await _Record.findByIdAndDelete(recordId);

      resolve({
        code: 200,
        message: 'Xóa bác sĩ thành công',
        status: true,
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  handleCreateRecord,
  handlegetRecordById,
  handleDeleteRecord,
};
