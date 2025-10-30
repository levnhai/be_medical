const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  companyName: {
    type: String,
    required: true
  },
  quantityEmployee: {
    type: Number,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  registrationDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Registration', registrationSchema);