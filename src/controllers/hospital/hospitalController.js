const HospitalServices = require('../../services/hospital/hospitalService');

class HospitalController {
  // get all hospital
  async getAllHospital(req, res, next) {
    let result = await HospitalServices.handleGetAllHospital();
    console.log('check hospital status', result);
    return res.status(result.code).json({
      result,
    });
  }

  // get hospital by type
  async getHospitalByType(req, res, next) {
    const type = req.body?.type;
    const search = req.body?.search;
    let result = await HospitalServices.handleGetHospitalByType({ type, search });
    console.log('check hospital status', result);
    return res.status(result.code).json({
      result,
    });
  }

  // get count hospital by type
  async getCountHospitalByType(req, res, next) {
    const search = req.body?.search;
    let result = await HospitalServices.handleGetCountHospitalByType(search);
    console.log('check hospital status', result);
    return res.status(result.code).json({
      result,
    });
  }

  // handle create hospital
  async handleCreateHospital(req, res, next) {
    const { formData } = req.body;
    let result = await HospitalServices.handleCreateHospital(formData);
    return res.status(result.code).json({
      result,
    });
  }
}
module.exports = new HospitalController();