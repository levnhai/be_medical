const _Specialty = require('../../models/specialty');
// handle get all specialty
const handleGetAllSpecialty = async () => {
  try {
    const data = await _Specialty.find({});
    return { code: 200, message: 'Lấy dữ liệu thành công', status: true, total: data.length, data };
  } catch (error) {
    return { code: 500, message: 'Lỗi máy chủ', status: false, error };
  }
};

// handle create specialty
const handleCreateSpecialty = async ({ fullName, description }) => {
  try {
    const specialty = await _Specialty.create({
      fullName,
      description,
    });

    return { code: 200, message: 'Thêm thành công', status: true, specialty };
  } catch (error) {
    return { code: 500, message: 'Lỗi máy chủ', status: false, error };
  }
};

module.exports = {
  handleGetAllSpecialty,
  handleCreateSpecialty,
};
