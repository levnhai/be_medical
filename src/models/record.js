const mongoose = require('mongoose');
const AddressSchema = require('./address');

const RecordSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fullName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    job: { type: String, required: true },
    cccd: { type: String, required: true },
    email: { type: String },
    gender: { type: String, required: true },
    ethnic: { type: String, required: true },
    address: [AddressSchema],
  },
  { timestamps: true },
);

module.exports = mongoose.model('Record', RecordSchema);
