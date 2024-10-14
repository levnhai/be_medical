const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = new Schema(
  {
    // _id: Schema.Types.ObjectId,
    fullName: { type: 'string', required: true },
    phoneNumber: { type: 'string', required: true },
    password: { type: 'string', required: true, unique: true },
    reEnterPassword: { type: 'string', required: true },
    address: { type: 'string' },
    gender: { type: 'string' },
    referralCode: { type: 'string' },
    image: { type: Buffer, contentType: String },
  },
  { timestamps: true },
);

module.exports = mongoose.model('User', User);
