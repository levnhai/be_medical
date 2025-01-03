const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const paymentSchema = new mongoose.Schema(
  {
    patientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    appointmentId: { type: Schema.Types.ObjectId, ref: 'Appointment', required: true },
    price: { type: Number, required: true },
    orderId: { type: String, required: true },
    paymentMethod: { type: String, required: true }, // vnpay, momo, cash
    status: { type: String, default: 'pending' }, // pending, paid, failed
    transactionId: String,
    paymentDate: Date,
  },
  { timestamps: true },
);

module.exports = mongoose.model('Payment', paymentSchema);
