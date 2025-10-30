const HospitalServices = require('../../services/hospital/hospitalService');

class HospitalController {
  // get all hospital
  async getAllHospital(req, res, next) {
    let result = await HospitalServices.handleGetAllHospital();
    return res.status(result.code).json({
      result,
    });
  }

  async getHospital(req, res, next) {
    const hospitalId = req.params.hospitalId;
    let result = await HospitalServices.handleGetHospital(hospitalId);
    return res.status(result.code).json({
      result,
    });
  }

  // get hospital by type
  async getHospitalByType(req, res, next) {
    const type = req.body?.type;
    const search = req.body?.search;
    let result = await HospitalServices.handleGetHospitalByType({ type, search });
    return res.status(result.code).json({
      result,
    });
  }

  // get count hospital by type
  async getCountHospitalByType(req, res, next) {
    const search = req.body?.search;
    let result = await HospitalServices.handleGetCountHospitalByType(search);
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

  // handle edit hospital
  async handleEditHospital(req, res, next) {
    const hospitalId = req.params.hospitalId;
    const formData = req.body;

    let result = await HospitalServices.handleEditHospital(hospitalId, formData);
    return res.status(result.code).json({
      result,
    });
  }

  // handle delete hospital
  async handleDeleteHospital(req, res, next) {
    const hospitalId = req.params.hospitalId;
    const formData = req.body;
    let result = await HospitalServices.handleDeleteHospital(hospitalId, formData);
    return res.status(result.code).json({
      result,
    });
  }
}
module.exports = new HospitalController();
