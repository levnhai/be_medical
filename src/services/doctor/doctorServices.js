const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);
const _ = require('lodash');
const { mongoose } = require('../../config/database');

const _Doctor = require('../../models/doctor');
const _Account = require('../../models/account');
const { isCheckPhoneExists } = require('../../utils/checkPhoneExists');

const handleCreateDoctor = (formData) => {
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
        specialtyId,
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
            role: 'doctor',
          },
        ],
        { session },
      );

      const doctor = await _Doctor.create(
        [
          {
            accountId: account[0]._id,
            fullName,
            phoneNumber,
            price,
            rating,
            positionId,
            gender,
            address,
            image,
            hospital: hospitalId,
            specialty: specialtyId,
          },
        ],
        { session },
      );

      await session.commitTransaction();
      session.endSession();

      resolve({ code: 200, message: 'Tạo người dùng thành công', status: true, doctor });
    } catch (error) {
      // Nếu xảy ra lỗi, rollback
      await session.abortTransaction();
      session.endSession();
      reject(error);
    }
  });
};

// handle get all users
const handleGetAllDoctor = () => {
  return new Promise(async (resolve, reject) => {
    try {
      // const data = await _Doctor.find({});
      const data = await _Doctor.aggregate([
        {
          $lookup: {
            from: 'hospitals',
            let: { hospitalId: '$hospitalId' },
            pipeline: [
              { $match: { $expr: { $eq: ['$_id', { $toObjectId: '$$hospitalId' }] } } },
              { $project: { fullName: 1, location: 1 } },
            ],
            as: 'hospitalData',
          },
        },
        {
          $lookup: {
            from: 'specialties',
            let: { specialtyId: '$specialtyId' },
            pipeline: [
              { $match: { $expr: { $eq: ['$_id', { $toObjectId: '$$specialtyId' }] } } },
              { $project: { fullName: 1 } }, //  lấy các trường cần thiết
            ],
            as: 'specialtyData',
          },
        },
        {
          $addFields: {
            hospitalData: { $arrayElemAt: ['$hospitalData', 0] }, // giảm số lượng mảng
            specialtyData: { $arrayElemAt: ['$specialtyData', 0] },
          },
        },
      ]);
      resolve({ code: 200, message: 'Lấy dữ liệu thành công', status: true, total: data.length, data });
    } catch (error) {
      reject(error);
    }
  });
};

const handleUpdateDoctor = (docterId, updateData) => {
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
      const existingDocter = await _Doctor.findById(docterId);
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

      const updatedDocter = await _Doctor
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

const handleDeleteDoctor = (docterId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const existingDocter = await _Doctor.findById(docterId);
      if (!existingDocter) {
        resolve({
          code: 404,
          message: 'Không tìm thấy bác sĩ',
          status: false,
        });
        return;
      }

      await _Doctor.findByIdAndDelete(docterId);

      resolve({
        code: 200,
        message: 'Xóa hồ sơ thành công',
        status: true,
      });
    } catch (error) {
      reject(error);
    }
  });
};

const handleGetDoctorByHospital = (hospitalId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await _Doctor.find({ hospital: hospitalId }).populate('specialty').populate('hospital');

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

const handleGetDoctorByHospitalAndDoctor = ({ hospitalId, doctorId }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const query = {};
      if (doctorId) {
        query._id = doctorId;
      }
      if (hospitalId) {
        query.hospital = hospitalId;
      }

      console.log('check query: ', query);
      const data = await _Doctor.find(query).populate('hospital').populate('specialty');
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
  handleGetAllDoctor,
  handleCreateDoctor,
  handleUpdateDoctor,
  handleDeleteDoctor,
  handleGetDoctorByHospital,
  handleGetDoctorByHospitalAndDoctor,
};
