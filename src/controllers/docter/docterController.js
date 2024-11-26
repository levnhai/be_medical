const DocterServices = require('../../services/docter/docterServices');

class DocterController {
  async handleCreateDocter(req, res, next) {
    {
      let { formData } = req.body;
      const result = await DocterServices.handleCreateDocter(formData);
      return res.status(result.code).json({
        result,
      });
    }
  }

  async handleGetAllDocter(req, res, next) {
    {
      const result = await DocterServices.handleGetAllDocter();
      return res.status(result.code).json({
        result,
      });
    }
  }

  async handleUpdateDocter(req, res, next) {
    try {
      const docterId = req.params.id;
      const updateData = req.body;
      const result = await DocterServices.handleUpdateDocter(docterId, updateData);
      return res.status(result.code).json({
        result,
      });
    } catch (error) {
      next(error);
    }
  }

  async handleDeleteDocter(req, res, next) {
    try {
      const docterId = req.params.id;
      const result = await DocterServices.handleDeleteDocter(docterId);
      return res.status(result.code).json({
        result,
      });
    } catch (error) {
      next(error);
    }
  }

  async handleGetDocterByHospital(req, res, next) {
    try {
      const { hospitalId } = req.body;
      const result = await DocterServices.handleGetDocterByHospital(hospitalId);
      return res.status(result.code).json({
        result,
      });
    } catch (error) {
      next(error);
    }
  }
}
module.exports = new DocterController();
