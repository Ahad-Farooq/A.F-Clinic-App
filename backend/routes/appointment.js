const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');

// Sab appointments dekhne ke liye
router.get('/all', async (req, res) => {
    try {
        const apps = await Appointment.find();
        res.json(apps);
    } catch (err) { res.status(500).json(err); }
});

// Naya appointment create karne ke liye
router.post('/create', async (req, res) => {
    try {
        const newApp = new Appointment(req.body);
        await newApp.save();
        res.status(201).json({ message: "Appointment Booked!" });
    } catch (err) { res.status(500).json(err); }
});

module.exports = router;