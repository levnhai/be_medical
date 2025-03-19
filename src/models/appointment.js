const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WorkingHourSchema = new mongoose.Schema({
  start: { type: Date, required: true },
  end: { type: Date, required: true },
});

const appointmentSchema = new mongoose.Schema(
  {
    record: { type: Schema.Types.ObjectId, ref: 'Record', required: true },
    patientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    doctor: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true },
    hospital: { type: Schema.Types.ObjectId, ref: 'Hospital', required: true },
    orderId: { type: String, required: true },
    date: { type: Date, required: true },
    price: { type: String, required: true },
    hours: { type: [WorkingHourSchema], required: true },
    status: {
      type: String,
      enum: ['Booked', 'Completed', 'Cancelled'],
      default: 'Booked',
    },
    note: { type: String },
    paymentMethod: { type: String },
    paymentStatus: { type: String, default: 'pending' },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Appointment', appointmentSchema);
