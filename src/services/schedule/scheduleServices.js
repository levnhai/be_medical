const _Schedule = require('../../models/schedules');

// handle create specialty
const handleCreateSchedule = ({ doctorId, hospitalId, date, hours }) => {
  return new Promise(async (resolve, reject) => {
    console.log('check hour', hours);
    try {
      // Lấy tất cả lịch làm việc của bác sĩ trong ngày
      const existingSchedules = await _Schedule.find({ doctor: doctorId, date });

      // Chuyển đổi start và end sang kiểu Date
      const convertedHours = hours.map(({ start, end, price }) => ({
        start: new Date(`${date}T${start}:00Z`),
        end: new Date(`${date}T${end}:00Z`),
        price,
      }));

      console.log('check convertedHours', convertedHours);

      //   Hàm kiểm tra giờ bị trùng
      const isOverlapping = (hour1, hour2) => {
        const start1 = new Date(`${date}T${hour1.start}:00Z`);
        const end1 = new Date(`${date}T${hour1.end}:00Z`);
        const start2 = new Date(`${date}T${hour2.start}:00Z`);
        const end2 = new Date(`${date}T${hour2.end}:00Z`);

        return start1 < end2 && start2 < end1; // Trùng lặp nếu thời gian chồng lên nhau
      };

      //Kiểm tra tất cả các giờ đã lưu với giờ mới
      for (const existingSchedule of existingSchedules) {
        for (const existingHour of existingSchedule.hours) {
          for (const newHour of convertedHours) {
            if (!isOverlapping(existingHour, newHour)) {
              resolve({ code: 200, message: 'Giờ làm việc đã tồn tại', status: false });
              return;
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

      resolve({ code: 200, message: 'Thêm thành công', status: true, schedule });
    } catch (error) {
      reject(error);
    }
  });
};

const handleGetAllScheduleByHospital = (hospitalId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await _Schedule.find({ hospital: hospitalId }).populate('doctor');
      resolve({ code: 200, message: 'Lấy dữ liệu thành công', status: true, total: data.length, data });
    } catch (error) {
      reject(error);
    }
  });
};

const handleGetAllScheduleByDoctor = (doctorId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await _Schedule.find({ doctor: doctorId });
      resolve({ code: 200, message: 'Lấy dữ liệu thành công', status: true, total: data.length, data });
    } catch (error) {
      reject(error);
    }
  });
};
module.exports = {
  handleCreateSchedule,
  handleGetAllScheduleByHospital,
  handleGetAllScheduleByDoctor,
};
