const mongoose = require('mongoose');

const SystemAdminSchema = new mongoose.Schema({
  fullName: { type: 'string', required: true },
  image: { type: Buffer, contentType: String },
});
module.exports = mongoose.model('SystemAdmin', SystemAdminSchema);
