// handle create record
const moment = require('moment');
const querystring = require('querystring');
const crypto = require('crypto');
const _Appointment = require('../../models/appointment');
const _Payment = require('../../models/payment');

// thanh toán tại phòng khám
const handleCreateAppointment = (formData) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log('check form data', formData);
      const { patientId, doctorId, hospitalId, date, hours, price, status, paymentStatus, paymentMethod, orderId } =
        formData;
      console.log('check hours', hours);
      const appointment = await _Appointment.create({
        patientId,
        doctorId,
        hospitalId,
        date,
        hours,
        price,
        status,
        paymentStatus,
        paymentMethod,
        orderId,
      });

      await _Payment.create({
        appointmentId: appointment._id,
        orderId,
        patientId,
        price,
        paymentMethod,
        status: paymentMethod === 'cash' ? 'pending' : 'processing',
      });
      resolve({ code: 200, message: 'Tạo lịch hẹn thành công', status: true, appointment });
    } catch (error) {
      reject(error);
    }
  });
};

// Hàm tạo URL thanh toán VNPay
const createPaymentUrl = ({ orderId, amount, orderInfo, ipAddr }) => {
  return new Promise((resolve, reject) => {
    try {
      console.log('check tham số đầu vào', orderId, amount, orderInfo, ipAddr);
      console.log('check tham số đầu vào 2', process.env.VNP_HASH_SECRET);
      const date = new Date();
      const createDate = date.toISOString().slice(0, 19).replace(/[-T:]/g, '');
      const orderType = 'billpayment';
      const locale = 'vn';
      const currCode = 'VND';

      let vnp_Params = {
        vnp_Version: '2.1.0',
        vnp_Command: 'pay',
        vnp_TmnCode: process.env.VNP_TMNCODE,
        vnp_Locale: locale,
        vnp_CurrCode: currCode,
        vnp_TxnRef: orderId,
        vnp_OrderInfo: orderInfo,
        vnp_OrderType: orderType,
        vnp_Amount: amount * 100,
        vnp_ReturnUrl: process.env.VNP_RETURNURL,
        vnp_IpAddr: ipAddr,
        vnp_CreateDate: createDate,
      };

      // Sắp xếp tham số theo thứ tự alphabet
      vnp_Params = sortObject(vnp_Params);

      // Tạo chữ ký
      const signData = querystring.stringify(vnp_Params);
      console.log('check signData', signData);
      const hmac = crypto.createHmac('sha512', process.env.VNP_HASHSECRET);
      vnp_Params['vnp_SecureHash'] = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

      const paymentUrl = `${process.env.VNP_URL}?${querystring.stringify(vnp_Params)}`;

      console.log('check payment url', paymentUrl);
      resolve(paymentUrl);
    } catch (error) {
      reject(error);
    }
  });
};

// Hàm kiểm tra chữ ký trả về từ VNPay
const verifyPayment = (vnp_Params) => {
  return new Promise((resolve, reject) => {
    try {
      const secureHash = vnp_Params['vnp_SecureHash'];
      delete vnp_Params['vnp_SecureHash'];
      delete vnp_Params['vnp_SecureHashType'];

      const sortedParams = sortObject(vnp_Params);
      const signData = querystring.stringify(sortedParams);
      const hmac = crypto.createHmac('sha512', process.env.VNP_HASHSECRET);
      const checkHash = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

      if (secureHash === checkHash) {
        resolve(vnp_Params);
      } else {
        reject(new Error('Invalid signature'));
      }
    } catch (error) {
      reject(error);
    }
  });
};

// Hàm sắp xếp object
const sortObject = (obj) => {
  const sorted = {};
  const keys = Object.keys(obj).sort();
  keys.forEach((key) => {
    sorted[key] = obj[key];
  });
  return sorted;
};

module.exports = {
  createPaymentUrl,
  verifyPayment,
  handleCreateAppointment,
};