const _Specialty = require('../../models/specialty');
// handle get all specialty
const handleGetAllSpecialty = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await _Specialty.find({});
      resolve({ code: 200, message: 'Lấy dữ liệu thành công', status: true, total: data.length, data });
    } catch (error) {
      reject(error);
    }
  });
};

// handle create specialty
const handleCreateSpecialty = ({ fullName, description }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const specialty = await _Specialty.create({
        fullName,
        description,
      });

      resolve({ code: 200, message: 'Thêm thành công', status: true, specialty });
    } catch (error) {
      reject(error);
    }
  });
};
// handle edit hospital
const handleEditHospital = (hospitalId, formData) => {
  return new Promise(async (resolve, reject) => {
    try {
      const {
        fullName,
        phoneNumber,
        workingTime,
        hospitalType,
        email,
        image,
        districtId,
        districtName,
        provinceId,
        provinceName,
        street,
        wardId,
        wardName,
        description,
      } = formData;

      // Construct address object
      const address = [
        {
          // Notice the array wrapper to match schema
          districtId,
          districtName,
          provinceId,
          provinceName,
          street,
          wardId,
          wardName,
        },
      ];

      // Find and update the hospital
      const updatedHospital = await _Hospital.findByIdAndUpdate(
        hospitalId, // Remove the object wrapper
        {
          fullName,
          phoneNumber,
          workingTime,
          hospitalType,
          email,
          image,
          address, // Use the address array
          description,
        },
        { new: true, runValidators: true },
      );

      if (!updatedHospital) {
        return resolve({
          code: 404,
          message: 'Không tìm thấy bệnh viện',
          status: false,
        });
      }

      resolve({
        code: 200,
        message: 'Cập nhật bệnh viện thành công',
        status: true,
        hospital: updatedHospital,
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  handleGetAllSpecialty,
  handleCreateSpecialty,
  handleEditHospital,
};
