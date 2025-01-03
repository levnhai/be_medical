const ScheduleServices = require('../../services/schedule/scheduleServices');

class ScheduleController {
  // handle create specialty
  async handleCreateSchedule(req, res, next) {
    const { doctorId, date, hours, hospitalId } = req.body;
    let result = await ScheduleServices.handleCreateSchedule({ doctorId, hospitalId, date, hours });
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
    console.log('check docterId', doctorId);
    let result = await ScheduleServices.handleGetAllScheduleByDoctor(doctorId);
    return res.status(result.code).json({
      result,
    });
  }
}

module.exports = new ScheduleController();
