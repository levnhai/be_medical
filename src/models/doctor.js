const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AddressSchema = require('./address');

const Doctor = new Schema(
  {
    accountId: { type: Schema.Types.ObjectId, ref: 'Account', required: true },
    fullName: { type: 'string', required: true },
    phoneNumber: { type: 'string', required: true },
    address: [AddressSchema],
    schedules: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Schedule' }],
    gender: { type: 'string' },
    email: { type: 'string' },
    positionId: { type: 'string' },
    price: { type: 'string' },
    hospital: { type: Schema.Types.ObjectId, ref: 'Hospital', required: true },
    specialty: { type: Schema.Types.ObjectId, ref: 'Specialty' },
    referralCode: { type: 'string' },
    image: { type: Buffer, contentType: String },
    rating: { type: 'Number', default: 0 },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Doctor', Doctor);
