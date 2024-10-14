const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Allcode = new Schema({
  keyMap: { type: 'string' },
  type: { type: 'string' },
  valueEN: { type: 'string' },
  valueVN: { type: 'string' },
});

module.exports = mongoose.model('Allcode', Allcode);
