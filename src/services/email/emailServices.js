const nodemailer = require('nodemailer');
require('dotenv').config();

const handleSendSimpleEmail = async ({ formData }) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: process.env.EMAIL_APP,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });

  const info = await transporter.sendMail({
    from: '"Medical " <Medical@123.email>', // sender address
    to: `${formData?.patientId?.email}`, // list of receivers
    subject: `Đặt Khám Thành Công || ${formData?.hospital?.fullName} `, // Subject line
    html: `
    <h3>📌Xin chào: ${formData?.patientId?.fullName}</h3>
    <h4>Cảm ơn quý khách đã đặt lịch khám tại <b>${formData?.hospital?.fullName}</b>.</h4>\
    <b>Thông tin lịch hẹn như sau:</b>
    <p>👉 Họ và tên: <b>${formData?.patientId?.fullName}</b></p>
    <p>👉 Bác sĩ phụ trách: <b>${formData?.doctor?.fullName}</b></p>
    <p>👉 Họ và tên: <b>${formData?.doctor?.specialty}</b></p>
    <p>👉 Ngày khám: <b>${formData?.date}</b></p>
    <p>👉 Giờ khám: <b>${formData?.date}</b></p>
    <p>👉 Địa điểm: <b>${formData?.hospital?.address}</b></p>
    <b>🔹 Lưu ý quan trọng: </b>
    <p>✔️ Vui lòng đến trước giờ hẹn [X] phút để hoàn tất thủ tục.</p>
    <p>✔️ Đem theo giấy tờ tùy thân và bảo hiểm y tế (nếu có).</p>
    <p>✔️ Nếu không thể đến, vui lòng liên hệ  để hủy hoặc đổi lịch.</p>
    <b>📞 Hỗ trợ khách hàng: Nếu có bất kỳ thắc mắc nào, vui lòng liên hệ 19001516 để được hỗ trợ.</b>

   <p> Trân trọng !</p>
    <b>${formData?.hospital?.fullName}</b>
    `, // html body
  });
};
module.exports = {
  handleSendSimpleEmail,
};
