const _Record = require('../../models/record');

// handle create record
const handleCreateRecord = async (formData) => {
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

    return { code: 200, message: 'Thêm thành công', status: true, record };
  } catch (error) {
    return { code: 500, message: 'Lỗi máy chủ', status: false, error };
  }
};
const handlegetRecordById = async (recordId) => {
  try {
    const data = await _Record.find({ userId: recordId });
    return {
      code: 200,
      message: 'Lấy dữ liệu thành công',
      status: true,
      total: data.length,
      data,
    };
  } catch (error) {
    return { code: 500, message: 'Lỗi máy chủ', status: false, error };
  }
};
const handleDeleteRecord = async (recordId) => {
  try {
    const existingRecord = await _Record.findById(recordId);
    if (!existingRecord) {
      return {
        code: 404,
        message: 'Không tìm thấy hồ sơ bệnh nhân',
        status: false,
      };
    }

    await _Record.findByIdAndDelete(recordId);

    return {
      code: 200,
      message: 'Xóa hồ sơ thành công',
      status: true,
    };
  } catch (error) {
    return { code: 500, message: 'Lỗi máy chủ', status: false, error };
  }
};

const handleUpdateRecord = async (recordId, formData) => {
  try {
    const {
      fullName,
      phoneNumber,
      email,
      job,
      cccd,
      gender,
      ethnic,
      birthdate,
      provinceId,
      districtId,
      wardId,
      provinceName,
      districtName,
      wardName,
      street,
    } = formData;

    const existingRecord = await _Record.findById(recordId);

    if (!existingRecord) {
      return {
        code: 404,
        message: 'Không tìm thấy hồ sơ bệnh nhân',
        status: false,
      };
    }

    const address = {
      provinceId,
      districtId,
      wardId,
      provinceName,
      districtName,
      wardName,
      street,
    };

    const updateRecord = await _Record.findByIdAndUpdate(
      recordId,
      {
        fullName,
        phoneNumber,
        email,
        gender,
        job,
        cccd,
        ethnic,
        birthdate,
        address,
      },
      { new: true },
    );

    return {
      code: 200,
      message: 'Cập nhật thông tin hồ sơ thành công',
      status: true,
      data: updateRecord,
    };
  } catch (error) {
    return { code: 500, message: 'Lỗi máy chủ', status: false, error };
  }
};

module.exports = {
  handleCreateRecord,
  handlegetRecordById,
  handleDeleteRecord,
  handleUpdateRecord,
};
