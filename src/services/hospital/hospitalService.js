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

module.exports = {
  handleGetAllHospital,
  handleGetHospitalByType,
  handleCreateHospital,
  handleGetCountHospitalByType,
};
