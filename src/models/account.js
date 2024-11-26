const mongoose = require('mongoose');

const AccountSchema = new mongoose.Schema(
  {
    phoneNumber: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: 'string' },
    role: {
      type: String,
      required: true,
      enum: ['system_admin', 'hospital_admin', 'docter', 'nurse', 'patient'],
    },
    isActive: { type: Boolean },
  },
  { timestamps: true },
);
module.exports = mongoose.model('Account', AccountSchema);
