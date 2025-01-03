const DoctorServices = require('../../services/doctor/doctorServices');

class DoctorController {
  async handleCreateDoctor(req, res, next) {
    {
      let { formData } = req.body;
      console.log('check formData', formData);
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

  async handleUpdateDoctor(req, res, next) {
    try {
      const docterId = req.params.id;
      const updateData = req.body;
      const result = await DoctorServices.handleUpdateDocter(docterId, updateData);
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
      console.log('check hospitalOnly', hospitalId);
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
