//  kiểm tra giờ bị trùng lặp
function isOverlapping({ date, hour1, hour2 }) {
  const start1 = new Date(`${date}T${hour1.start}:00Z`);
  const end1 = new Date(`${date}T${hour1.end}:00Z`);
  const start2 = new Date(`${date}T${hour2.start}:00Z`);
  const end2 = new Date(`${date}T${hour2.end}:00Z`);

  return start1 < end2 && start2 < end1; // Trùng lặp nếu thời gian chồng lên nhau
}

// get hour/minutes
function extractTime(dateTimeString) {
  const date = new Date(dateTimeString);
  const hours = date.getUTCHours();
  const minutes = date.getMinutes();
  const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  return formattedTime;
}

module.exports = { isOverlapping, extractTime };
