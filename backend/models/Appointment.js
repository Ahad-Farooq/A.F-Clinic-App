const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  patientName: String,
  doctorName: String,
  date: { type: Date, default: Date.now },
  status: { type: String, default: 'Pending' }
});

module.exports = mongoose.model('Appointment', AppointmentSchema);