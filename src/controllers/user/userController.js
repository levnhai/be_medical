const userServices = require('../../services/user/userService');

class userController {
  // handleGetAllUsers
  async handleGetAllUsers(req, res) {
    const result = await userServices.handleGetAllUsers();
    return res.status(result.code).json({
      result,
    });
  }

  // handle delete user
  async handleDeleteUser(req, res) {
    const userId = req.body.id;
    if (!userId)
      return res.status(401).json({
        code: 401,
        message: 'Không tìm thấy người dùng',
        status: false,
      });
    const result = await userServices.handleDeleteUser(userId);
    return res.status(result.code).json({
      result,
    });
  }

  // handle edit user
  async handleEditUser(req, res) {
    const userId = req.params.userId;
    const formData = req.body;

    if (!userId) {
      return res.status(401).json({
        code: 401,
        message: 'Không tìm thấy người dùng',
        status: false,
      });
    }

    const result = await userServices.handleEditUser(userId, formData);
    return res.status(result.code).json({
      result,
    });
  }
  // handle create user
  async handleCreateUser(req, res) {
    const formData = req.body;
    const result = await userServices.handleCreateUser(formData);
    return res.status(result.code).json({
      result,
    });
  }
}

module.exports = new userController();
