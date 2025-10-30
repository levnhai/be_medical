const dashboardService = require('../../services/dashboard/dashboardService');

class DashboardController {
  async getAllStats(req, res, next) {
    const userLogin = req.userDecoded.id;
    const role = req.userDecoded.role;
    let result = await dashboardService.handleGetAllStats({ userLogin, role });
    return res.status(result.code).json({
      result,
    });
  }

  async getAllStatsByHospital(req, res, next) {
    const { hospitalId } = req.body;
    let result = await dashboardService.handleGetAllStatsByHospital(hospitalId);
    return res.status(result.code).json({
      result,
    });
  }
}
module.exports = new DashboardController();
