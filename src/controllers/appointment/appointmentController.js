const AppointmentServices = require('../../services/appointment/appointmentServices');
require('dotenv').config();

class AppointmentController {
  //admin
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
}
module.exports = new AppointmentController();
