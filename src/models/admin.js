const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AddressSchema = require('./address');

const SystemAdminSchema = new mongoose.Schema({
  accountId: { type: Schema.Types.ObjectId, ref: 'Account', required: true },
  fullName: { type: 'string', required: true },
  phoneNumber: { type: 'string', required: true },
  address: [AddressSchema],
  gender: { type: 'string' },
  image: { type: Buffer, contentType: String },
});
module.exports = mongoose.model('SystemAdmin', SystemAdminSchema);
