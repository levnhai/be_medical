const _Contact = require('../../models/contactCollab');
const _Hospital = require('../../models/hospital');
const _Doctor = require('../../models/doctor');
const _NewPost = require('../../models/NewsPost');
const _User = require('../../models/user');
const _Appointment = require('../../models/appointment');

// handle get all stats
const handleGetAllStats = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const [hospitalCount, doctorCount, newCount, userCount] = await Promise.all([
        _Hospital.countDocuments(),
        _Doctor.countDocuments(),
        _NewPost.countDocuments(),
        _User.countDocuments(),
      ]);

      const data = {
        hospitalCount,
        doctorCount,
        newCount,
        userCount,
      };
      resolve({
        code: 200,
        message: 'Lấy dữ liệu thành công',
        status: true,
        data,
      });
    } catch (error) {
      reject(error);
    }
  });
};

const handleGetAllStatsByHospital = (hospitalId) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log('check hosspiral', hospitalId);
      const [doctorCount, appointment, appointmentCount, newCount, userCount] = await Promise.all([
        _Doctor.countDocuments({ hospital: hospitalId }),
        _Appointment.find({ hospital: hospitalId }).populate('record', 'fullName phoneNumber'),
        _Appointment.countDocuments({ hospital: hospitalId }),
        _NewPost.countDocuments(),
        _User.countDocuments(),
      ]);
      const data = {
        appointment,
        doctorCount,
        appointmentCount,
        newCount,
        userCount,
      };
      resolve({
        code: 200,
        message: 'Lấy dữ liệu thành công',
        status: true,
        data,
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  handleGetAllStats,
  handleGetAllStatsByHospital,
};
