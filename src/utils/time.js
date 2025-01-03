//  kiểm tra giờ bị trùng lặp
function isOverlapping({ date, hour1, hour2 }) {
  const start1 = new Date(`${date}T${hour1.start}:00Z`);
  const end1 = new Date(`${date}T${hour1.end}:00Z`);
  const start2 = new Date(`${date}T${hour2.start}:00Z`);
  const end2 = new Date(`${date}T${hour2.end}:00Z`);

  return start1 < end2 && start2 < end1; // Trùng lặp nếu thời gian chồng lên nhau
}

module.exports = { isOverlapping };
