const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AddressSchema = require('./address');

const Docter = new Schema(
  {
    // _id: Schema.Types.ObjectId,
    accountId: { type: Schema.Types.ObjectId, ref: 'Account', required: true },
    // email: { type: 'string' },
    // password: { type: 'string', required: true },
    fullName: { type: 'string', required: true },
    // reEnterPassword: { type: 'string', required: true },
    address: [AddressSchema],
    gender: { type: 'string' },
    // phoneNumber: { type: 'string', required: true, unique: true },
    positionId: { type: 'string' },
    price: { type: 'string' },
    hospitalId: { type: 'string', required: true },
    // role: { type: String, default: 'docter' },
    referralCode: { type: 'string' },
    image: { type: Buffer, contentType: String },
    rating: { type: 'Number', default: 0 },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Docter', Docter);
