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

  index(req, res, next) {
    res.send('đây là docter');
  }
}
module.exports = new DocterController();
