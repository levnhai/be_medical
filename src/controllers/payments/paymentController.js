const PaymentServices = require('../../services/payments/paymentServices');

class PaymentController {

  
  // thanh toán tại phòng khám
  async handleClinicCreate(req, res, next) {
    try {
      let { formData } = req.body;
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
