const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);

const _Docter = require('../../models/docter');
const _Account = require('../../models/account');
const { isCheckPhoneExists } = require('../../utils/checkPhoneExists');

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

      const session = await mongoose.startSession();
      session.startTransaction();

      const isCheckPhoneExist = await isCheckPhoneExists(phoneNumber);
      if (isCheckPhoneExist) {
        resolve({ code: 200, message: 'Số điện thoại đã tồn tại', status: false });
      }

      if (password !== reEnterPassword) {
        resolve({ code: 200, message: 'Nhập mật khẩu không trùng khớp', status: false });
      }

      let hastpassword = await bcrypt.hashSync(password, salt);

      const account = await _Account.create({
        phoneNumber,
        email,
        password: hastpassword,
        role: 'docter',
      });

      const docter = await _Docter.create({
        accountId: account._id,
        fullName,
        price,
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

const handleUpdateDocter = (docterId, updateData) => {
  return new Promise(async (resolve, reject) => {
    try {
      const {
        fullName,
        phoneNumber,
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
      } = updateData;

      // Kiểm tra bác sĩ có tồn tại không
      const existingDocter = await _Docter.findById(docterId);
      if (!existingDocter) {
        resolve({
          code: 404,
          message: 'Không tìm thấy bác sĩ',
          status: false,
        });
        return;
      }

      // Kiểm tra số điện thoại mới có trùng với bác sĩ khác không
      if (phoneNumber !== existingDocter.phoneNumber) {
        const isPhoneExists = await isCheckPhoneExists(phoneNumber);
        if (isPhoneExists) {
          resolve({
            code: 400,
            message: 'Số điện thoại đã tồn tại',
            status: false,
          });
          return;
        }
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

      const updatedDocter = await _Docter
        .findByIdAndUpdate(
          docterId,
          {
            fullName,
            phoneNumber,
            email,
            rating,
            positionId,
            gender,
            address,
            image,
            hospitalId,
          },
          { new: true },
        )
        .select('-password -reEnterPassword');

      resolve({
        code: 200,
        message: 'Cập nhật thông tin bác sĩ thành công',
        status: true,
        data: updatedDocter,
      });
    } catch (error) {
      reject(error);
    }
  });
};

const handleDeleteDocter = (docterId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const existingDocter = await _Docter.findById(docterId);
      if (!existingDocter) {
        resolve({
          code: 404,
          message: 'Không tìm thấy bác sĩ',
          status: false,
        });
        return;
      }

      await _Docter.findByIdAndDelete(docterId);

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

const handleGetDocterByHospital = (hospitalId) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log('check hospitalid', hospitalId);
      const data = await _Docter.find({ hospitalId });
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
  handleGetAllDocter,
  handleCreateDocter,
  handleUpdateDocter,
  handleDeleteDocter,
  handleGetDocterByHospital,
};
