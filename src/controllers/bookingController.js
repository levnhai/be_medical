const Booking = require('../models/Booking');

exports.createBooking = async (req, res) => {
  try {
    const { fullName,  email, phoneNumber } = req.body;
    const newBooking = new Booking({
      fullName,
      email,
      phoneNumber
    });
    const savedBooking = await newBooking.save();
    res.status(201).json({
      message: 'Đăng ký thành công',
      data: savedBooking
    });
  } catch (error) {
    res.status(400).json({
      message: 'Đăng ký thất bại',
      error: error.message
    });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.status(200).json({
      message: 'Lấy danh sách đăng ký thành công',
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      message: 'Lấy danh sách đăng ký thất bại',
      error: error.message
    });
  }
};

exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Không tìm thấy đăng ký' });
    }
    res.status(200).json({
      message: 'Lấy thông tin đăng ký thành công',
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      message: 'Lấy thông tin đăng ký thất bại',
      error: error.message
    });
  }
};

exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Không tìm thấy đăng ký để xóa' });
    }
    res.status(200).json({
      message: 'Xóa đăng ký thành công',
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      message: 'Xóa đăng ký thất bại',
      error: error.message
    });
  }
};