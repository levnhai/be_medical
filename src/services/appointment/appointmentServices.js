const _Appointment = require('../../models/appointment');

const handleGetAppointmentByHospital = ({ userLogin, role }) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log('check hospitalId', userLogin, role);
      let data = [];
      if (role === 'hospital_admin') {
        // data = await _Appointment.find();
        data = await _Appointment.find({ hospital: userLogin }).populate('doctor').populate('record');
        console.log('beenj vieenj');
      } else if (role === 'doctor') {
        data = await _Appointment.find({ doctor: userLogin }).populate('doctor').populate('record');
      } else {
        return res.status(403).json({ message: 'Không có quyền truy cập' });
      }
      // const data = await _Appointment.find({ hospital: hospitalId }).populate('doctor').populate('record');
      resolve({ code: 200, message: 'Lấy dữ liệu thành công', status: true, total: data.length, data });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  handleGetAppointmentByHospital,
};
