const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SpecialtySchema = new Schema({
  fullName: { type: String, required: true },
  description: { type: String, required: true },
});

module.exports = mongoose.model('Specialty', SpecialtySchema);
