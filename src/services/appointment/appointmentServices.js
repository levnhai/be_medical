const _Appointment = require('../../models/appointment');
const _Payment = require('../../models/payment');

const handleGetAppointmentByHospital = ({ userLogin, role }) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log('check hospitalId', userLogin, role);
      let data = [];
      if (role === 'hospital_admin') {
        // data = await _Appointment.find();
        data = await _Appointment.find({ hospital: userLogin }).populate('doctor').populate('record');
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

const handleUpdateStatus = ({ status, id }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const updatedAppointment = await _Appointment.findByIdAndUpdate(id, { status }, { new: true });
      if (!updatedAppointment) {
        resolve({ code: 400, message: 'Không tìm thấy lịch hẹn', status: false });
      }
      if (status === 'Completed') {
        await _Payment.findOneAndUpdate({ appointmentId: id }, { status: 'paid' }, { new: true, upsert: true });
        await _Appointment.findByIdAndUpdate(id, { paymentStatus: 'paid' }, { new: true, upsert: true });
      }
      resolve({ code: 200, message: 'Cập nhật trạng thái thành công', status: true });
    } catch (error) {
      reject(error);
    }
  });
};

const handleDeleteAppointment = ({ id }) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Kiểm tra xem lịch hẹn có tồn tại không
      const appointment = await _Appointment.findById(id);
      if (!appointment) {
        return resolve({ code: 404, message: 'Không tìm thấy lịch hẹn', status: false });
      }

      // Xóa thanh toán liên quan nếu có
      await _Payment.findOneAndDelete({ appointmentId: id });
      
      // Xóa lịch hẹn
      await _Appointment.findByIdAndDelete(id);
      
      resolve({ 
        code: 200, 
        message: 'Xóa lịch hẹn thành công', 
        status: true 
      });
    } catch (error) {
      reject(error);
    }
  });
};
module.exports = {
  handleGetAppointmentByHospital,
  handleUpdateStatus,
  handleDeleteAppointment,
};
