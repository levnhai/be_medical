const _Contact = require('../../models/contactCollab');
const _Hospital = require('../../models/hospital');
const _Doctor = require('../../models/doctor');
const _NewPost = require('../../models/NewsPost');
const _User = require('../../models/user');
const _Appointment = require('../../models/appointment');
const _Payment = require('../../models/payment');

// handle get all stats
const handleGetAllStats = async ({ userLogin, role }) => {
  try {
    let data = [];
    const currentYear = new Date().getFullYear();
    if (role === 'system_admin') {
      const [
        hospitalData,
        hospitalCount,
        hospitalsRenewe,
        hospitalsRenewedData,
        hospitalsNotRenewed,
        doctorCount,
        newCount,
        userCount,
      ] = await Promise.all([
        _Hospital.find({}),
        _Hospital.countDocuments(),
        _Hospital.countDocuments({ renewalStatus: true }),
        _Hospital.find({ renewalStatus: true }),
        _Hospital.countDocuments({ renewalStatus: false }),
        _Doctor.countDocuments(),
        _NewPost.countDocuments(),
        _User.countDocuments(),
      ]);

      const totalByYear = await _Hospital.find({
        renewalStatus: true,
        createdAt: {
          $gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
          $lt: new Date(`${currentYear + 1}-01-01T00:00:00.000Z`),
        },
      });

      const totalByMonth = Array.from({ length: 12 }, (_, i) => ({
        month: `Tháng ${i + 1}`,
        count: 0,
      }));

      totalByYear.forEach((appt) => {
        const monthIndex = new Date(appt.createdAt).getMonth();
        totalByMonth[monthIndex].count += 1;
      });
      // tính doanh thu theo hàng tháng
      const revenueByMonth = Array.from({ length: 12 }, (_, i) => ({
        month: `Tháng ${i + 1}`,
        total: 0,
      }));

      totalByYear.forEach((payment) => {
        const date = new Date(payment.createdAt);
        const monthIndex = date.getMonth(); // Lấy chỉ số tháng (0-11)
        revenueByMonth[monthIndex].total += payment.monthlyFee;
      });

      const amountTotal =
        hospitalsRenewedData && hospitalsRenewedData.reduce((sum, hospital) => sum + (hospital.monthlyFee || 0), 0);

      data = {
        hospitalData,
        hospitalCount,
        doctorCount,
        newCount,
        hospitalsRenewe,
        hospitalsNotRenewed,
        userCount,
        amountTotal,
        revenueByMonth,
      };
    } else if (role === 'hospital_admin') {
      const [doctorCount, appointment, appointmentCount, newCount, userCount] = await Promise.all([
        _Doctor.countDocuments({ hospital: userLogin }),
        _Appointment.find({ hospital: userLogin }).populate('record', 'fullName phoneNumber'),
        _Appointment.countDocuments({ hospital: userLogin }),
        _NewPost.countDocuments(),
        _User.countDocuments(),
      ]);

      const appointmentIds = appointment.map((appt) => appt._id);

      const payments = await _Payment.find({
        appointmentId: { $in: appointmentIds },
        status: 'paid',
        createdAt: {
          $gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
          $lt: new Date(`${currentYear + 1}-01-01T00:00:00.000Z`),
        },
      });

      const appointmentByYear = await _Appointment.find({
        hospital: userLogin,
        createdAt: {
          $gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
          $lt: new Date(`${currentYear + 1}-01-01T00:00:00.000Z`),
        },
      });

      const appointmentByMonth = Array.from({ length: 12 }, (_, i) => ({
        month: `Tháng ${i + 1}`,
        count: 0,
      }));

      appointmentByYear.forEach((appt) => {
        const monthIndex = new Date(appt.createdAt).getMonth();
        appointmentByMonth[monthIndex].count += 1;
      });
      // tính doanh thu theo hàng tháng
      const revenueByMonth = Array.from({ length: 12 }, (_, i) => ({
        month: `Tháng ${i + 1}`,
        total: 0,
      }));

      payments.forEach((payment) => {
        const date = new Date(payment.createdAt);
        const monthIndex = date.getMonth(); // Lấy chỉ số tháng (0-11)
        revenueByMonth[monthIndex].total += payment.price;
      });

      // tổng doanh thu
      const amountTotal = payments.reduce((sum, payment) => sum + payment.price, 0);

      data = {
        appointment,
        amountTotal,
        doctorCount,
        appointmentCount,
        appointmentByMonth,
        newCount,
        userCount,
        revenueByMonth,
      };
    } else if (role === 'doctor') {
      const [appointment, appointmentCount, appointmentSuccess, appointmentFailed, newCount, userCount] =
        await Promise.all([
          _Appointment.find({ doctor: userLogin }).populate('record', 'fullName phoneNumber'),
          _Appointment.countDocuments({ doctor: userLogin }),
          _Appointment.countDocuments({ doctor: userLogin, status: 'Completed' }),
          _Appointment.countDocuments({ doctor: userLogin, status: 'canceled' }),
          _NewPost.countDocuments(),
          _User.countDocuments(),
        ]);

      const appointmentIds = appointment.map((appt) => appt._id);

      const payments = await _Payment.find({
        appointmentId: { $in: appointmentIds },
        status: 'paid',
        createdAt: {
          $gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
          $lt: new Date(`${currentYear + 1}-01-01T00:00:00.000Z`),
        },
      });

      const appointmentByYear = await _Appointment.find({
        doctor: userLogin,
        createdAt: {
          $gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
          $lt: new Date(`${currentYear + 1}-01-01T00:00:00.000Z`),
        },
      });

      const appointmentByMonth = Array.from({ length: 12 }, (_, i) => ({
        month: `Tháng ${i + 1}`,
        count: 0,
      }));

      appointmentByYear.forEach((appt) => {
        const monthIndex = new Date(appt.createdAt).getMonth();
        appointmentByMonth[monthIndex].count += 1;
      });
      // tính doanh thu theo hàng tháng
      const revenueByMonth = Array.from({ length: 12 }, (_, i) => ({
        month: `Tháng ${i + 1}`,
        total: 0,
      }));

      payments.forEach((payment) => {
        const date = new Date(payment.createdAt);
        const monthIndex = date.getMonth(); // Lấy chỉ số tháng (0-11)
        revenueByMonth[monthIndex].total += payment.price;
      });

      // tổng doanh thu
      const amountTotal = payments.reduce((sum, payment) => sum + payment.price, 0);
      data = {
        appointment,
        amountTotal,
        appointmentCount,
        newCount,
        userCount,
        revenueByMonth,
        appointmentByMonth,
        appointmentSuccess,
        appointmentFailed,
      };
    }

    // const [hospitalData, hospitalCount, doctorCount, newCount, userCount] = await Promise.all([
    //   _Hospital.find({}),
    //   _Hospital.countDocuments(),
    //   _Doctor.countDocuments(),
    //   _NewPost.countDocuments(),
    //   _User.countDocuments(),
    // ]);

    // data = {
    //   hospitalData,
    //   hospitalCount,
    //   doctorCount,
    //   newCount,
    //   userCount,
    // };
    return {
      code: 200,
      message: 'Lấy dữ liệu thành công',
      status: true,
      data,
    };
  } catch (error) {
    return { code: 500, message: 'Lỗi máy chủ', status: false, error };
  }
};

const handleGetAllStatsByHospital = async (hospitalId) => {
  try {
    const [doctorCount, appointment, appointmentCount, newCount, userCount] = await Promise.all([
      _Doctor.countDocuments({ hospital: hospitalId }),
      _Appointment.find({ hospital: hospitalId }).populate('record', 'fullName phoneNumber'),
      _Appointment.countDocuments({ hospital: hospitalId }),
      _NewPost.countDocuments(),
      _User.countDocuments(),
    ]);

    const amountTotal = Number(
      appointment?.filter((item) => item?.status === 'paid').reduce((sum, item) => sum + item.price, 0),
    );
    const data = {
      appointment,
      amountTotal,
      doctorCount,
      appointmentCount,
      newCount,
      userCount,
    };
    return {
      code: 200,
      message: 'Lấy dữ liệu thành công',
      status: true,
      data,
    };
  } catch (error) {
    return { code: 500, message: 'Lỗi máy chủ', status: false, error };
  }
};

module.exports = {
  handleGetAllStats,
  handleGetAllStatsByHospital,
};
