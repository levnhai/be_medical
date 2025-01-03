const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WorkingHourSchema = new mongoose.Schema({
  start: { type: Date, required: true },
  end: { type: Date, required: true },
});

const appointmentSchema = new mongoose.Schema(
  {
    patientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    doctorId: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true },
    hospitalId: { type: Schema.Types.ObjectId, ref: 'Hospital', required: true },
    orderId: { type: String, required: true },
    date: { type: Date, required: true },
    price: { type: String, required: true },
    hours: { type: [WorkingHourSchema], required: true },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
    },
    note: { type: String },
    paymentMethod: { type: String },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Appointment', appointmentSchema);
