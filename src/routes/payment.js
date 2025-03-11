const express = require('express');
const router = express.Router();
const moment = require('moment');
const querystring = require('querystring');
const crypto = require('crypto');
const axios = require('axios');
const _Appointment = require('../models/appointment');
const _Payment = require('../models/payment');
const _Schedule = require('../models/schedules');
const emailServices = require('../services/email/emailServices');

// const dateFormat = require('dateformat');

const paymentController = require('../controllers/payments/paymentController');

const tmnCode = 'LRD5R4EO';
const secretKey = 'TZFO1AB3EAV43RYJBWPS5WRE4POR2IFL';
const vnpUrl = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
const returnUrl = 'http://localhost:3000/user'; // URL chuyển hướng sau khi thanh toán

const updateBookingStatus = async (doctorId, date, hourId, isBooked) => {
  try {
    const formattedDate = new Date(date + 'T00:00:00.000Z');
    const schedule = await _Schedule.findOne({ doctor: doctorId, date: formattedDate });

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

// thanh toán với vnpay
router.post('/payment-vnpay', (req, res) => {
  const { orderId, amount } = req.body;
  // const vnpUrl = process.env.VNPAY_URL;
  // const tmnCode = process.env.VNPAY_TMN_CODE;
  // const secretKey = process.env.VNPAY_HASH_SECRET;

  const tmnCode = 'LRD5R4EO';
  const secretKey = 'TZFO1AB3EAV43RYJBWPS5WRE4POR2IFL';
  const vnpUrl = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
  const returnUrl = 'http://localhost:3000/user';

  const createDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const orderInfo = `Order ID: ${orderId}`;

  const params = {
    vnp_Version: '2.0.0',
    vnp_TmnCode: tmnCode,
    vnp_Amount: amount * 100,
    vnp_CurrCode: 'VND',
    vnp_OrderInfo: orderInfo,
    vnp_OrderId: orderId,
    vnp_CreateDate: createDate,
    vnp_ExpireDate: new Date(Date.now() + 15 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' '),
    vnp_ReturnUrl: 'http://localhost:3000/user',
    vnp_IpAddr: req.ip,
  };

  const sortedKeys = Object.keys(params).sort();
  const queryString = sortedKeys.map((key) => `${key}=${params[key]}`).join('&');
  const hashData = `${queryString}&vnp_SecureHashType=SHA256`;
  const secureHash = crypto.createHmac('sha256', secretKey).update(hashData).digest('hex');

  const paymentUrl = `${vnpUrl}?${queryString}&vnp_SecureHash=${secureHash}`;
  res.json({ url: paymentUrl });
});
router.get('/vnpay_return', async (req, res) => {
  const vnp_Params = req.query;
  const vnp_SecureHash = vnp_Params.vnp_SecureHash;
  delete vnp_Params.vnp_SecureHash;

  // Sắp xếp tham số theo thứ tự alphabet
  const sortedParams = Object.keys(vnp_Params)
    .sort()
    .reduce((acc, key) => {
      acc[key] = vnp_Params[key];
      return acc;
    }, {});

  // Tạo lại chữ ký
  const signData = querystring.stringify(sortedParams, { encode: false });
  const hmac = crypto.createHmac('sha512', vnp_HashSecret);
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

  if (signed === vnp_SecureHash) {
    const payment = await Payment.findOne({ orderId: vnp_Params.vnp_TxnRef });

    if (!payment) {
      return res.status(404).json({ message: 'Không tìm thấy giao dịch' });
    }

    payment.status = vnp_Params.vnp_ResponseCode === '00' ? 'paid' : 'failed';
    payment.transactionId = vnp_Params.vnp_TransactionNo;
    payment.paymentDate = new Date();
    await payment.save();

    return res.redirect(`http://localhost:3000/payment_result?status=${payment.status}`);
  } else {
    return res.status(400).json({ message: 'Checksum không hợp lệ' });
  }
});

// thanh toán với ví momo
router.post('/payment-momo', async (req, res) => {
  var { formData } = req.body;
  var { patientId, doctor, hospital, date, hours, price, status, paymentStatus, paymentMethod } = formData;
  var accessKey = 'F8BBA842ECF85';
  var secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
  var orderInfo = 'Thanh toán lịch khám bệnh';
  var partnerCode = 'MOMO';
  var redirectUrl = 'http://localhost:3000/user';
  var ipnUrl = 'https://403e-115-75-177-83.ngrok-free.app/payment/callback';
  var requestType = 'payWithMethod';
  var amount = price;
  var orderId = partnerCode + new Date().getTime();
  var requestId = orderId;
  var extraData = '';
  var orderGroupId = '';
  var autoCapture = true;
  var lang = 'vi';

  //before sign HMAC SHA256 with format
  //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
  var rawSignature =
    'accessKey=' +
    accessKey +
    '&amount=' +
    amount +
    '&extraData=' +
    extraData +
    '&ipnUrl=' +
    ipnUrl +
    '&orderId=' +
    orderId +
    '&orderInfo=' +
    orderInfo +
    '&partnerCode=' +
    partnerCode +
    '&redirectUrl=' +
    redirectUrl +
    '&requestId=' +
    requestId +
    '&requestType=' +
    requestType;
  //signature
  const crypto = require('crypto');
  var signature = crypto.createHmac('sha256', secretKey).update(rawSignature).digest('hex');

  //json object send to MoMo endpoint
  const requestBody = JSON.stringify({
    partnerCode: partnerCode,
    partnerName: 'Test',
    storeId: 'MomoTestStore',
    requestId: requestId,
    amount: amount,
    orderId: orderId,
    orderInfo: orderInfo,
    redirectUrl: redirectUrl,
    ipnUrl: ipnUrl,
    lang: lang,
    requestType: requestType,
    autoCapture: autoCapture,
    extraData: extraData,
    orderGroupId: orderGroupId,
    signature: signature,
    orderExpireTime: 1678905900,
  });

  //Create the HTTPS objects
  const options = {
    url: 'https://test-payment.momo.vn/v2/gateway/api/create',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(requestBody),
    },
    data: requestBody,
  };
  let result;
  try {
    result = await axios(options);
    await emailServices.handleSendSimpleEmail({ formData });
    await updateBookingStatus(doctor?.id, date, hours?.timeId, true);
    const appointment = await _Appointment.create({
      record: patientId?._id,
      patientId: patientId?.userId,
      doctor: doctor?.id,
      hospital: hospital?.id,
      date,
      hours,
      price,
      status,
      paymentStatus,
      paymentMethod,
      orderId: result?.data?.orderId,
    });

    await _Payment.create({
      appointmentId: appointment._id,
      orderId: result?.data?.orderId,
      patientId: patientId?.userId,
      price,
      paymentMethod,
      status: 'pending',
    });
    return res.status(200).json(result.data);
  } catch (error) {}
});

router.post('/callback', async (req, res) => {
  /**
    resultCode = 0: giao dịch thành công.
    resultCode = 9000: giao dịch được cấp quyền (authorization) thành công .
    resultCode <> 0: giao dịch thất bại.
   */
  const { orderId, resultCode } = req.body;
  const status = resultCode === 0 ? 'paid' : 'pending';

  await _Appointment.findOneAndUpdate({ orderId: orderId }, { status: status }, { new: true });

  await _Payment.findOneAndUpdate({ orderId: orderId }, { status: status }, { new: true });

  /**
   * Dựa vào kết quả này để update trạng thái đơn hàng
   * Kết quả log:
   * {
        partnerCode: 'MOMO',
        orderId: 'MOMO1712108682648',
        requestId: 'MOMO1712108682648',
        amount: 10000,
        orderInfo: 'pay with MoMo',
        orderType: 'momo_wallet',
        transId: 4014083433,
        resultCode: 0,
        message: 'Thành công.',
        payType: 'qr',
        responseTime: 1712108811069,
        extraData: '',
        signature: '10398fbe70cd3052f443da99f7c4befbf49ab0d0c6cd7dc14efffd6e09a526c0'
      }
   */

  return res.status(204).json(req.body);
});
router.post('/check-status-transaction', async (req, res) => {
  const { orderId } = req.body;

  // const signature = accessKey=$accessKey&orderId=$orderId&partnerCode=$partnerCode
  // &requestId=$requestId
  var secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
  var accessKey = 'F8BBA842ECF85';
  const rawSignature = `accessKey=${accessKey}&orderId=${orderId}&partnerCode=MOMO&requestId=${orderId}`;

  const signature = crypto.createHmac('sha256', secretKey).update(rawSignature).digest('hex');

  const requestBody = JSON.stringify({
    partnerCode: 'MOMO',
    requestId: orderId,
    orderId: orderId,
    signature: signature,
    lang: 'vi',
  });

  // options for axios
  const options = {
    method: 'POST',
    url: 'https://test-payment.momo.vn/v2/gateway/api/query',
    headers: {
      'Content-Type': 'application/json',
    },
    data: requestBody,
  };

  const result = await axios(options);

  return res.status(200).json(result.data);
});

// thanh toán tại phòng khám
router.post('/clinic-create', paymentController.handleClinicCreate);
router.post('/get-appointment-by-userId', paymentController.handleGetAppointmentByUserId);

module.exports = router;
