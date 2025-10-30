const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AddressSchema = require('./address');

const SpecialtyTimeSchema = new Schema({
  date: { type: 'string', required: true },
  time: { type: 'string', required: true },
});

const SpecialtySchema = new Schema({
  name: { type: 'string', required: true },
  schedule: [SpecialtyTimeSchema],
});

const ServiceSchema = new Schema({
  type: { type: 'string', required: true },
  description: { type: 'string', required: true },
  specialties: [SpecialtySchema],
});

const Hospital = new Schema(
  {
    accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
    fullName: { type: 'string', required: true },
    workingTime: { type: 'string' },
    contentHTML: { type: 'string' },
    contentMarkdown: { type: 'string' },
    hospitalType: { type: 'string', required: true },
    description: { type: 'string' },
    address: [AddressSchema],
    // services: [ServiceSchema],
    monthlyFee: Number,
    renewalStatus: { type: Boolean, default: false },
    image: { type: Buffer, contentType: String, required: true },
    rating: { type: 'Number', default: 0 },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Hospital', Hospital);
