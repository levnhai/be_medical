const Registration = require('../models/Registration');

exports.createRegistration = async (req, res) => {
  try {
    const { fullName, companyName, quantityEmployee, phoneNumber } = req.body;
    const newRegistration = new Registration({
      fullName,
      companyName,
      quantityEmployee,
      phoneNumber
    });
    const savedRegistration = await newRegistration.save();
    res.status(201).json({
      message: 'Đăng ký thành công',
      data: savedRegistration
    });
  } catch (error) {
    res.status(400).json({
      message: 'Đăng ký thất bại',
      error: error.message
    });
  }
};

exports.getAllRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find();
    res.status(200).json({
      message: 'Lấy danh sách đăng ký thành công',
      data: registrations
    });
  } catch (error) {
    res.status(500).json({
      message: 'Lấy danh sách đăng ký thất bại',
      error: error.message
    });
  }
};

exports.getRegistrationById = async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);
    if (!registration) {
      return res.status(404).json({ message: 'Không tìm thấy đăng ký' });
    }
    res.status(200).json({
      message: 'Lấy thông tin đăng ký thành công',
      data: registration
    });
  } catch (error) {
    res.status(500).json({
      message: 'Lấy thông tin đăng ký thất bại',
      error: error.message
    });
  }
};

exports.deleteRegistration = async (req, res) => {
  try {
    const registration = await Registration.findByIdAndDelete(req.params.id);
    if (!registration) {
      return res.status(404).json({ message: 'Không tìm thấy đăng ký để xóa' });
    }
    res.status(200).json({
      message: 'Xóa đăng ký thành công',
      data: registration
    });
  } catch (error) {
    res.status(500).json({
      message: 'Xóa đăng ký thất bại',
      error: error.message
    });
  }
};