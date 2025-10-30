const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AddressSchema = new mongoose.Schema({
  provinceId: { type: String, required: true },
  provinceName: { type: String },
  districtId: { type: String, required: true },
  districtName: { type: String },
  wardId: { type: String, required: true },
  wardName: { type: String },
  street: { type: String },
});

module.exports = AddressSchema;
