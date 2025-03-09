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

  async handleGetScheduleByHospital(req, res, next) {
    const hospitalId = req.userDecoded.id;
    let result = await ScheduleServices.handleGetAllScheduleByHospital(hospitalId);
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
