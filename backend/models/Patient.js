const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  contact: { type: String, required: true },
  assignedDoctor: { type: String, required: true }, 
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Patient', PatientSchema);