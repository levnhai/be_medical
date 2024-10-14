const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const DocterInfor = new Schema(
  {
    docterId: { type: 'string', required: true },
    priceId: { type: 'string' },
    provinceId: { type: 'string' },
    paymentId: { type: 'string' },
    hospitalId: { type: 'string' },
    roleId: { type: 'string' },
    note: { type: 'string' },
    introduceDocter: { type: 'string' },
    contentHTML: { type: 'string' },
    contentMarkdown: { type: 'string' },
    count: { type: 'number', default: 0 },
    visit: { type: 'number', default: 0 },
    rating: { type: 'Number', default: 0 },
  },
  { timestamps: true },
);

module.exports = mongoose.model('DocterInfor', DocterInfor);
