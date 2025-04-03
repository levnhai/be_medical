const _Appointment = require('../../models/appointment');
const _Payment = require('../../models/payment');

const handleGetAppointmentByHospital = async ({ userLogin, role }) => {
  try {
    let data = [];
    if (role === 'hospital_admin') {
      // data = await _Appointment.find();
      data = await _Appointment.find({ hospital: userLogin }).populate('doctor').populate('record');
    } else if (role === 'doctor') {
      data = await _Appointment.find({ doctor: userLogin }).populate('doctor').populate('record');
    } else {
      return { code: 403, message: 'Không có quyền truy cập', status: false };
    }
    return { code: 200, message: 'Lấy dữ liệu thành công', status: true, total: data.length, data };
  } catch (error) {
    return { code: 500, message: 'Lỗi máy chủ', status: false, error };
  }
};

const handleUpdateStatus = async ({ status, id }) => {
  try {
    const updatedAppointment = await _Appointment.findByIdAndUpdate(id, { status }, { new: true });
    if (!updatedAppointment) {
      return { code: 400, message: 'Không tìm thấy lịch hẹn', status: false };
    }
    if (status === 'Completed') {
      await _Payment.findOneAndUpdate({ appointmentId: id }, { status: 'paid' }, { new: true, upsert: true });
      await _Appointment.findByIdAndUpdate(id, { paymentStatus: 'paid' }, { new: true, upsert: true });
    }
    return { code: 200, message: 'Cập nhật trạng thái thành công', status: true };
  } catch (error) {
    return { code: 500, message: 'Lỗi máy chủ', status: false, error };
  }
};

const handleDeleteAppointment = async ({ id }) => {
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

    return {
      code: 200,
      message: 'Xóa lịch hẹn thành công',
      status: true,
    };
  } catch (error) {
    return { code: 500, message: 'Lỗi máy chủ', status: false, error };
  }
};
module.exports = {
  handleGetAppointmentByHospital,
  handleUpdateStatus,
  handleDeleteAppointment,
};
