const SpecialtyServices = require('../../services/specialty/specialtyService');

class SpecialtyController {
  // handle create specialty
  async handleCreateSpecialty(req, res, next) {
    const { fullName, description } = req.body;
    let result = await SpecialtyServices.handleCreateSpecialty({ fullName, description });
    return res.status(result.code).json({
      result,
    });
  }

  // handle get all specialty
  async handleGetAllSpecialty(req, res, next) {
    let result = await SpecialtyServices.handleGetAllSpecialty();
    return res.status(result.code).json({
      result,
    });
  }
}
module.exports = new SpecialtyController();
