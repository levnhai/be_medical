const _Schedule = require('../../models/schedules');

const handleCreateSchedule = async (formData) => {
  try {
    const { doctorId, hospitalId, date, hours } = formData;

    // Lấy tất cả lịch làm việc của bác sĩ trong ngày
    const existingSchedules = await _Schedule.find({ doctor: doctorId, date });

    // Chuyển đổi start và end sang kiểu Date (nếu cần)
    const convertedHours = hours.map(({ start, end, price }) => ({
      start: new Date(`${date}T${start}:00Z`),
      end: new Date(`${date}T${end}:00Z`),
      price,
    }));

    // Hàm kiểm tra giờ bị trùng
    const isOverlapping = (hour1, hour2) => {
      return hour1.start < hour2.end && hour2.start < hour1.end;
    };

    for (const existingSchedule of existingSchedules) {
      for (const existingHour of existingSchedule.hours) {
        for (const newHour of convertedHours) {
          if (isOverlapping(existingHour, newHour)) {
            return { code: 400, message: 'Khung giờ bị trùng', status: false };
          }
        }
      }
    }

    // Lặp qua mảng hours và lưu
    const workingHours = convertedHours.map((hour) => ({
      doctor: doctorId,
      hospital: hospitalId,
      date,
      hours: hour,
    }));

    const schedule = await _Schedule.insertMany(workingHours);

    return { code: 200, message: 'Thêm thành công', status: true, schedule };
  } catch (error) {
    return { code: 500, message: 'Lỗi máy chủ', status: false, error };
  }
};

const handleGetSchedule = async ({ userLogin, role }) => {
  try {
    let data = [];
    if (role === 'hospital_admin') {
      data = await _Schedule.find({ hospital: userLogin }).populate('doctor');
    } else if (role === 'doctor') {
      data = await _Schedule.find({ doctor: userLogin }).populate('doctor');
    }
    return { code: 200, message: 'Lấy dữ liệu thành công', status: true, total: data.length, data };
  } catch (error) {
    return { code: 500, message: 'Lỗi máy chủ', status: false, error };
  }
};

const handleGetAllScheduleByDoctor = async (doctorId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await _Schedule.find({ doctor: doctorId });
      return { code: 200, message: 'Lấy dữ liệu thành công', status: true, total: data.length, data };
    } catch (error) {
      return { code: 500, message: 'Lỗi máy chủ', status: false, error };
    }
  });
};

const updateBookingStatus = async (doctorId, date, hourId, isBooked) => {
  try {
    const formattedDate = new Date(date + 'T00:00:00.000Z');
    const schedule = await _Schedule.findOne({ doctor: doctorId, date: formattedDate, 'hours._id': hourId });

    if (!schedule) {
      return { success: false, message: 'Lịch khám không tồn tại' };
    }

    const hourIndex = schedule.hours.findIndex((hour) => hour._id.toString() === hourId);

    if (hourIndex === -1) {
      return { success: false, message: 'Khung giờ không tồn tại' };
    }

    schedule.hours[hourIndex].isBooked = isBooked;
    await schedule.save();

    return { success: true, message: 'Cập nhật thành công', schedule };
  } catch (error) {
    return { success: false, message: 'Lỗi cập nhật', error };
  }
};

module.exports = {
  handleCreateSchedule,
  handleGetSchedule,
  handleGetAllScheduleByDoctor,
  updateBookingStatus,
};
