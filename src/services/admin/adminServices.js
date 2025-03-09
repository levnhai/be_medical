const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);
const _ = require('lodash');
const { mongoose } = require('../../config/database');

const _Admin = require('../../models/admin');
const _Account = require('../../models/account');
const { isCheckPhoneExists } = require('../../utils/checkPhoneExists');

const handleCreateAdmin = (formData) => {
  return new Promise(async (resolve, reject) => {
    const session = await mongoose.startSession(); // Khởi tạo session từ mongoose
    session.startTransaction(); // Bắt đầu transaction
    try {
      const {
        fullName,
        phoneNumber,
        password,
        reEnterPassword,
        email,
        gender,
        provinceId,
        districtId,
        wardId,
        provinceName,
        districtName,
        wardName,
        street,
        image,
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

      const isCheckPhoneExist = await isCheckPhoneExists(phoneNumber);
      if (isCheckPhoneExist) {
        return resolve({ code: 200, message: 'Số điện thoại đã tồn tại', status: false });
      }

      if (password !== reEnterPassword) {
        return resolve({ code: 200, message: 'Nhập mật khẩu không trùng khớp', status: false });
      }

      let hashPassword = await bcrypt.hashSync(password, salt);

      // Tạo account
      const account = await _Account.create(
        [
          {
            phoneNumber,
            email,
            password: hashPassword,
            role: 'system_admin',
          },
        ],
        { session },
      );

      const admin = await _Admin.create(
        [
          {
            accountId: account[0]._id,
            fullName,
            phoneNumber,
            gender,
            address,
            image,
          },
        ],
        { session },
      );

      await session.commitTransaction();
      session.endSession();

      resolve({ code: 200, message: 'Tạo người dùng thành công', status: true, admin });
    } catch (error) {
      // Nếu xảy ra lỗi, rollback
      await session.abortTransaction();
      session.endSession();
      reject(error);
    }
  });
};

module.exports = {
  handleCreateAdmin,
};
