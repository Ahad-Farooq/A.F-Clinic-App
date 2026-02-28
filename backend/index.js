const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json()); 
app.use(cors()); 

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.log("❌ DB Connection Error:", err.message));

// ROUTES
// 1. Auth Route (Signup/Login)
app.use('/api/auth', require('./routes/auth'));

// 2. Patient Route (Registration & Appointment)
app.use('/api/patients', require('./routes/patient'));

// 3. AI Route (Gemini Integration) - Yeh line add kar di hai
app.use('/api/ai', require('./routes/ai'));

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});