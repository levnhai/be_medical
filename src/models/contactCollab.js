const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ContactCollab = Schema({
    // _id: Schema.Types.ObjectId,
    fullName: { type: 'string', required: true },
    email: { type: 'string' },
    phoneNumber: { type: 'string', required: true, unique: true },
    note: {type: 'string'},
    status: {type: 'string'}, //wait, success, failure
    createdAt: {type: Date, default: Date.now},
    updatedAt: { type: Date }
});

module.exports = mongoose.model('ContactCollab', ContactCollab);