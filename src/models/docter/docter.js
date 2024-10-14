const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Docter = new Schema(
  {
    // _id: Schema.Types.ObjectId,
    email: { type: 'string' },
    password: { type: 'string', required: true },
    fullName: { type: 'string', required: true },
    reEnterPassword: { type: 'string', required: true },
    address: { type: 'string' },
    gender: { type: 'string' },
    roleId: { type: 'string' },
    phoneNumber: { type: 'string' },
    positionId: { type: 'string' },
    referralCode: { type: 'string' },
    image: { type: Buffer, contentType: String },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Docter', Docter);
