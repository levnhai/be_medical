const PaymentServices = require('../../services/payments/paymentServices');

class PaymentController {
  // async createPayment(req, res, next) {
  //   try {
  //     const ipAddr = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  //     const { orderId, amount, orderInfo } = req.body;
  //     // Tạo URL thanh toán
  //     const result = await VNpayServices.createPaymentUrl({
  //       orderId,
  //       amount,
  //       orderInfo,
  //       ipAddr,
  //     });

  //     console.log('check result', result);

  //     return res.status(200).json({ result });
  //   } catch (error) {
  //     console.error('Error creating payment URL:', error);
  //     return res.status(500).json({ message: 'Lỗi tạo thanh toán' });
  //   }
  // }

  // async vnpayReturn(req, res) {
  //   const query = req.query;
  //   // Xử lý kết quả thanh toán trả về từ VNPay
  //   res.status(200).json({ message: 'Kết quả thanh toán', query });
  // }

  // thanh toán tại phòng khám

  async handleClinicCreate(req, res, next) {
    try {
      let { formData } = req.body;
      console.log('checking', formData);
      const result = await PaymentServices.handleCreateAppointment(formData);
      return res.status(result.code).json(result);
    } catch (error) {
      next(error);
    }
  }

  async handleGetAppointmentByUserId(req, res, next) {
    try {
      let { patientId } = req.body;
      const result = await PaymentServices.handleGetAppointmentByUserId(patientId);
      return res.status(result.code).json(result);
    } catch (error) {
      next(error);
    }
  }
}
module.exports = new PaymentController();
