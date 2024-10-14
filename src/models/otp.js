const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  phoneNumber: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
  },
  otp: {
    type: String,
    required: true,
  },
  time: {
    type: Date,
    default: Date.now,
    index: { expires: 60 }, // 20 seconds expires
  },
});

module.exports = mongoose.model('otp', otpSchema);
