const _Hospital = require('../../models/hospital');

// handle get all hospital
const handleGetAllHospital = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await _Hospital.find({}, '-password -reEnterPassword');
      resolve({ code: 200, message: 'Lấy dữ liệu thành công', status: true, total: data.length, data });
    } catch (error) {
      reject(error);
    }
  });
};

// handle get hospital by type
const handleGetHospitalByType = ({ type, search }) => {
  return new Promise(async (resolve, reject) => {
    try {
      let query = {};
      if (type) {
        query.hospitalType = type;
      }
      if (search) {
        query.fullName = { $regex: new RegExp('.*' + search, 'i') };
      }
      const data = await _Hospital.find(query);
      resolve({ code: 200, message: 'Lấy dữ liệu thành công', status: true, total: data.length, data });
    } catch (error) {
      reject(error);
    }
  });
};
//delete 
const handleDeleteHospital =  (hospitalId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hospital = await _Hospital.findOneAndDelete({ _id: hospitalId });
      if (hospital) {
        resolve({ code: 200, message: 'Xóa bệnh viện thành công', status: true });
      } else {
        resolve({ code: 200, message: 'Không tìm thấy bệnh viện', status: false });
      }
    } catch (error) {
      reject(error);
    }
  });
};
// handle get hospital by type
const handleGetCountHospitalByType = (search) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log('check search', search);
      let searchQuery = {};
      if (search) {
        searchQuery.fullName = { $regex: new RegExp('.*' + search, 'i') };
      }
      const dataType = await _Hospital.find(searchQuery);

      const countType = (data) => {
        let counts = {};
        data.forEach((item) => {
          const hospitalType = item.hospitalType;
          if (counts[hospitalType]) {
            counts[hospitalType]++;
          } else {
            counts[hospitalType] = 1;
          }
        });
        return counts;
      };

      const typeCounts = countType(dataType);
      resolve({ code: 200, message: 'Lấy dữ liệu thành công', status: true, typeCounts });
    } catch (error) {
      reject(error);
    }
  });
};

// handle create hospital
const handleCreateHospital = (formData) => {
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
      const address = { districtId, districtName, provinceId, provinceName, street, wardId, wardName };
      console.log('check fullName', fullName);
      const hospital = await _Hospital.create({
        fullName,
        phoneNumber,
        workingTime,
        hospitalType,
        email,
        image,
        address,
        description,
      });

      resolve({ code: 200, message: 'Thêm bệnh viện thành công', status: true, hospital });
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
      const address = [{  // Notice the array wrapper to match schema
        districtId,
        districtName,
        provinceId,
        provinceName,
        street,
        wardId,
        wardName
      }];

      // Find and update the hospital
      const updatedHospital = await _Hospital.findByIdAndUpdate(
        hospitalId,  // Remove the object wrapper
        {
          fullName,
          phoneNumber,
          workingTime,
          hospitalType,
          email,
          image,
          address,  // Use the address array
          description,
        },
        { new: true, runValidators: true }
      );

      if (!updatedHospital) {
        return resolve({
          code: 404,
          message: 'Không tìm thấy bệnh viện',
          status: false
        });
      }

      resolve({
        code: 200,
        message: 'Cập nhật bệnh viện thành công',
        status: true,
        hospital: updatedHospital
      });
    } catch (error) {
      reject(error);
    }
  });
  
};

module.exports = {
  handleGetAllHospital,
  handleGetHospitalByType,
  handleCreateHospital,
  handleGetCountHospitalByType,
  handleEditHospital,
  handleDeleteHospital
};
