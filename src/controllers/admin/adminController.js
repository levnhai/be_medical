const AdminServices = require('../../services/admin/adminServices');

class AdminController {
  async handleCreateAdmin(req, res, next) {
    {
      let { formData } = req.body;
      const result = await AdminServices.handleCreateAdmin(formData);
      return res.status(result.code).json({
        result,
      });
    }
  }
}

module.exports = new AdminController();
