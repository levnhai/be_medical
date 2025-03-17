const AppointmentServices = require('../../services/appointment/appointmentServices');
require('dotenv').config();

class AppointmentController {
  async handleGetAppointmentByHospital(req, res, next) {
    {
      const userLogin = req.userDecoded.id;
      const role = req.userDecoded.role;
      const result = await AppointmentServices.handleGetAppointmentByHospital({ userLogin, role });
      return res.status(result.code).json({
        result,
      });
    }
  }

  async handleUpdateStatus(req, res, next) {
    {
      const { status } = req.body;
      const { id } = req.params;
      const result = await AppointmentServices.handleUpdateStatus({ status, id });
      return res.status(result.code).json({
        result,
      });
    }
  }
}
module.exports = new AppointmentController();
