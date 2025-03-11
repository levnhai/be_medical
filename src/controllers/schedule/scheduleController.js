const ScheduleServices = require('../../services/schedule/scheduleServices');

class ScheduleController {
  // handle create specialty
  async handleCreateSchedule(req, res, next) {
    const { formData } = req.body;
    let result = await ScheduleServices.handleCreateSchedule(formData);
    return res.status(result.code).json({
      result,
    });
  }

  async handleGetSchedule(req, res, next) {
    const userLogin = req.userDecoded.id;
    const role = req.userDecoded.role;
    let result = await ScheduleServices.handleGetSchedule({ userLogin, role });
    return res.status(result.code).json({
      result,
    });
  }

  async handleGetAllScheduleByDoctor(req, res, next) {
    const { doctorId } = req.body;
    let result = await ScheduleServices.handleGetAllScheduleByDoctor(doctorId);
    return res.status(result.code).json({
      result,
    });
  }
}

module.exports = new ScheduleController();
