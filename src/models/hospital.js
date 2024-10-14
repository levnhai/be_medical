const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SpecialtyTimeSchema = new Schema({
  date: {type: 'string', required: true},
  time: {type: 'string', required: true}
});

const SpecialtySchema = new Schema({
  name : {type: 'string', required: true},
  schedule : [SpecialtyTimeSchema]
})

const ServiceSchema = new Schema({
  type: {type: 'string', required: true},
  description : {type: 'string', required: true},
  specialties: [SpecialtySchema]
})

const Hospital = new Schema({
  fullName: { type: 'string', required: true },
  address: { type: 'string', required: true },
  phoneNumber: { type: 'string' },
  workingTime: { type: 'string' },
  provinceId: { type: 'Number' },
  contentHTML: { type: 'string' },
  contentMarkdown: { type: 'string' },
  hospitalType: { type: 'string' },
  services: [ServiceSchema],
  image: { type: Buffer, contentType: String },
  rating: { type: 'Number', default: 0 },
});

module.exports = mongoose.model('Hospital', Hospital);
