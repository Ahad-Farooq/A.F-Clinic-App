const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');

// 1. Naya Patient Add Karne Ki API
router.post('/add', async (req, res) => {
    try {
        const { name, age, gender, contact, assignedDoctor } = req.body;
        
        // Validation check taake koi empty data save na ho
        if (!name || !age || !gender || !contact || !assignedDoctor) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const newPatient = new Patient({ 
            name, 
            age, 
            gender, 
            contact, 
            assignedDoctor,
            status: 'pending', // Registration ke waqt status hamesha pending hoga
            prescription: ''   // Doctor checkup se pehle prescription empty rahegi
        });

        await newPatient.save();
        res.status(201).json({ message: "✅ Patient Added Successfully", patient: newPatient });
    } catch (err) {
        console.error("Add Patient Error:", err.message);
        res.status(500).json({ error: "Server Error: " + err.message });
    }
});

// 2. Saare Patients Get Karne Ki API
router.get('/all', async (req, res) => {
    try {
        // Sirf wahi patients jo database mein mojood hain
        const patients = await Patient.find().sort({ date: -1 });
        res.json(patients);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. Patient Status aur Prescription Update Karne Ki API
router.put('/update/:id', async (req, res) => {
    try {
        const { status, prescription } = req.body;
        
        // findByIdAndUpdate use karte waqt check lazmi hai
        const updatedPatient = await Patient.findByIdAndUpdate(
            req.params.id,
            { status, prescription },
            { new: true, runValidators: true } // runValidators se schema rules apply hote hain
        );

        if (!updatedPatient) {
            return res.status(404).json({ error: "Patient record not found" });
        }

        res.json({ message: "✅ Record Archived Successfully", patient: updatedPatient });
    } catch (err) {
        console.error("Update Error:", err.message);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;