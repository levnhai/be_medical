const HospitalServices = require('../../services/hospital/hospitalService');

class HospitalController {
  async getAllHospital(req, res, next) {
    let hospital = await HospitalServices.getAllHospital();
    console.log('check hospital status', hospital);
    return res.status(200).json({
      hospital,
    });
  }
}
module.exports = new HospitalController();
    