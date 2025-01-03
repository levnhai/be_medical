const mongoose = require('mongoose');

const WorkingHourSchema = new mongoose.Schema({
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  price: { type: String, required: true },
});

const SchedulesSchema = new mongoose.Schema(
  {
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    hospital: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', required: true },
    date: { type: Date, required: true },
    hours: { type: [WorkingHourSchema], required: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Schedule', SchedulesSchema);
