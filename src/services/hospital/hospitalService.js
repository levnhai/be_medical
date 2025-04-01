const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);

const _Hospital = require('../../models/hospital');
const { isCheckPhoneExists } = require('../../utils/checkPhoneExists');
const _Account = require('../../models/account');
const { mongoose } = require('../../config/database');

// handle get all hospital
const handleGetAllHospital = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await _Hospital.find({}).populate('accountId');
      resolve({ code: 200, message: 'Lấy dữ liệu thành công', status: true, total: data.length, data });
    } catch (error) {
      reject(error);
    }
  });
};

const handleGetHospital = (hospitalId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await _Hospital.find({ _id: hospitalId }).select('-image').populate({
        path: 'accountId',
        select: '-password -role',
      });
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
const handleDeleteHospital = (hospitalId) => {
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
    const session = await mongoose.startSession(); // Khởi tạo session từ mongoose
    session.startTransaction(); // Bắt đầu transaction
    try {
      const {
        fullName,
        phoneNumber,
        password,
        reEnterPassword,
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
        monthlyFee,
        renewalStatus,
      } = formData;
      const address = { districtId, districtName, provinceId, provinceName, street, wardId, wardName };

      const isCheckphoneExists = await isCheckPhoneExists(phoneNumber);
      if (isCheckphoneExists) {
        await session.abortTransaction();
        session.endSession();
        resolve({ code: 200, message: 'Số điện thoại đã tồn tại', status: false });
        return;
      }

      if (password !== reEnterPassword) {
        await session.abortTransaction();
        session.endSession();
        resolve({ code: 200, message: 'Nhập mật khẩu không trùng khớp', status: false });
        return;
      }

      let hastpassword = await bcrypt.hash(password, salt);

      const account = await _Account.create(
        [
          {
            phoneNumber,
            email,
            password: hastpassword,
            role: 'hospital_admin',
          },
        ],
        {
          session,
        },
      );

      // Tạo tài khoản trước
      // const account = new _Account({
      //   phoneNumber,
      //   email,
      //   password: hastpassword,
      //   role: 'hospital_admin',
      // });

      // await account.save({ session });

      const hospital = await _Hospital.create(
        [
          {
            accountId: account[0]._id,
            fullName,
            workingTime,
            hospitalType,
            image,
            address,
            description,
            monthlyFee,
            renewalStatus,
          },
        ],
        session,
      );

      // const hospital = new _Hospital({
      //   accountId: account._id,
      //   fullName,
      //   workingTime,
      //   hospitalType,
      //   image,
      //   address,
      //   description,
      //   monthlyFee,
      //   renewalStatus,
      // });

      // await hospital.save({ session });
      await session.commitTransaction();
      session.endSession();
      resolve({ code: 200, message: 'Thêm bệnh viện thành công', status: true, hospital });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
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
        district,
        province,
        monthlyFee,
        renewalStatus,
        street,
        ward,
        description,
      } = formData;

      // Construct address object
      const address = [
        {
          districtId: district?.id,
          districtName: district?.name,
          provinceId: province?.id,
          provinceName: province?.name,
          street,
          wardId: ward?.id,
          wardName: ward?.name,
        },
      ];

      // Find and update the hospital
      const updatedHospital = await _Hospital.findByIdAndUpdate(
        hospitalId,
        {
          fullName,
          phoneNumber,
          workingTime,
          hospitalType,
          monthlyFee,
          renewalStatus,
          email,
          image,
          address,
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
  handleGetAllHospital,
  handleGetHospitalByType,
  handleCreateHospital,
  handleGetCountHospitalByType,
  handleEditHospital,
  handleDeleteHospital,
  handleGetHospital,
};
