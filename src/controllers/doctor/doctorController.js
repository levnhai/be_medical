const DoctorServices = require('../../services/doctor/doctorServices');

class DoctorController {
  async handleCreateDoctor(req, res, next) {
    {
      let { formData } = req.body;
      const result = await DoctorServices.handleCreateDoctor(formData);
      return res.status(result.code).json({
        result,
      });
    }
  }

  async handleGetAllDoctor(req, res, next) {
    {
      const result = await DoctorServices.handleGetAllDoctor();
      return res.status(result.code).json({
        result,
      });
    }
  }

  async handleGetTopDoctor(req, res, next) {
    {
      let limit = req.query.limit;
      if (!limit) limit = 10;
      const result = await DoctorServices.handleGetTopDoctor(limit);
      return res.status(result.code).json({
        result,
      });
    }
  }

  async handleUpdateDoctor(req, res, next) {
    try {
      const doctorId = req.params.id;
      const updateData = req.body;
      const result = await DoctorServices.handleUpdateDoctor(doctorId, updateData);
      return res.status(result.code).json({
        result,
      });
    } catch (error) {
      next(error);
    }
  }

  async handleDeleteDoctor(req, res, next) {
    try {
      const docterId = req.params.id;
      const result = await DoctorServices.handleDeleteDoctor(docterId);
      return res.status(result.code).json({
        result,
      });
    } catch (error) {
      next(error);
    }
  }

  async handleGetDoctorByHospital(req, res, next) {
    try {
      const { hospitalId } = req.body;
      const result = await DoctorServices.handleGetDoctorByHospital(hospitalId);
      return res.status(result.code).json({
        result,
      });
    } catch (error) {
      next(error);
    }
  }

  async handleGetDoctorByHospitalAndDoctor(req, res, next) {
    try {
      const { hospitalId, doctorId } = req.body;
      const result = await DoctorServices.handleGetDoctorByHospitalAndDoctor({ hospitalId, doctorId });
      return res.status(result.code).json({
        result,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DoctorController();
