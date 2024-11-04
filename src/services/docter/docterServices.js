const _Docter = require('../../models/docter');
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);

const handleCreateDocter = (formData) => {
  return new Promise(async (resolve, reject) => {
    try {
      const {
        fullName,
        phoneNumber,
        password,
        reEnterPassword,
        email,
        rating,
        positionId,
        gender,
        price,
        provinceId,
        districtId,
        wardId,
        provinceName,
        districtName,
        wardName,
        street,
        image,
        hospitalId,
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
      const isCheckphoneExists = await handleCheckPhoneExists(phoneNumber);
      if (isCheckphoneExists) {
        resolve({ code: 400, message: 'Số điện thoại đã tồn tại', status: false });
        return;
      }

      if (password !== reEnterPassword) {
        resolve({ code: 400, message: 'Nhập mật khẩu không trùng khớp', status: false });
        return;
      }

      let hastpassword = await bcrypt.hashSync(password, salt);
      let hastReEnterPassword = await bcrypt.hashSync(reEnterPassword, salt);
      const docter = await _Docter.create({
        phoneNumber,
        fullName,
        email,
        password: hastpassword,
        reEnterPassword: hastReEnterPassword,
        rating,
        positionId,
        gender,
        address,
        image,
        hospitalId,
      });

      resolve({ code: 200, message: 'Tạo người dùng thành công', status: true, docter });
    } catch (error) {
      reject(error);
    }
  });
};

// handle get all users
const handleGetAllDocter = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await _Docter.find({}, '-password -reEnterPassword');
      resolve({ code: 200, message: 'Lấy dữ liệu thành công', status: true, total: data.length, data });
    } catch (error) {
      reject(error);
    }
  });
};

const handleCheckPhoneExists = (phoneNumberInput) => {
  return new Promise(async (resolve, reject) => {
    try {
      let isCheckPhoneExists = await _Docter.findOne({
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

module.exports = {
  handleGetAllDocter,
  handleCreateDocter,
};
