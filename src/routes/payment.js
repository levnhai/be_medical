const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payments/paymentController');

// router.post('/vnpay_create', paymentController.createPayment);
// router.get('/vnpay_return', paymentController.vnpayReturn);

// Tạo URL thanh toán
router.post('/create_payment_url', async (req, res) => {
  const { patientId, appointmentId, price, paymentMethod } = req.body;
  const orderId = Date.now().toString();

  try {
    const newPayment = new Payment({
      patientId,
      appointmentId,
      price,
      orderId,
      paymentMethod,
      status: 'pending',
    });

    await newPayment.save();

    const vnp_Params = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode,
      vnp_Amount: price * 100, // Đơn vị VNPay là VNĐ * 100
      vnp_CurrCode: 'VND',
      vnp_TxnRef: orderId,
      vnp_OrderInfo: `Thanh toán cuộc hẹn ${appointmentId}`,
      vnp_OrderType: 'healthcare',
      vnp_Locale: 'vn',
      vnp_ReturnUrl,
      vnp_IpAddr: req.ip,
      vnp_CreateDate: new Date()
        .toISOString()
        .slice(0, 14)
        .replace(/[-T:.]/g, ''),
    };

    // Sắp xếp tham số theo thứ tự alphabet
    const sortedParams = Object.keys(vnp_Params)
      .sort()
      .reduce((acc, key) => {
        acc[key] = vnp_Params[key];
        return acc;
      }, {});

    // Tạo chữ ký bảo mật
    const signData = querystring.stringify(sortedParams, { encode: false });
    const hmac = crypto.createHmac('sha512', vnp_HashSecret);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    // Hoàn thiện URL thanh toán
    const paymentUrl = `${vnp_Url}?${signData}&vnp_SecureHash=${signed}`;
    res.json({ paymentUrl });
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({ message: 'Lỗi tạo thanh toán' });
  }
});

// Xử lý callback VNPay
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
router.post('/clinic-create', paymentController.handleClinicCreate);
router.post('/get-appointment-by-userId', paymentController.handleGetAppointmentByUserId);

module.exports = router;
