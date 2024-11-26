const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = new Schema(
  {
    // _id: Schema.Types.ObjectId,
    accountId: { type: Schema.Types.ObjectId, ref: 'Account', required: true },
    fullName: { type: 'string' },
    email: { type: String },
    address: { type: 'string' },
    gender: { type: 'string' },
    referralCode: { type: 'string' },
    image: { type: Buffer, contentType: String },
  },
  { timestamps: true },
);

module.exports = mongoose.model('User', User);
