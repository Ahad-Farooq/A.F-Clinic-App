const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json()); 
// CORS ko update kiya hai taake Vercel deployment mein masla na aaye
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
})); 

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.log("❌ DB Connection Error:", err.message));

// ROUTES
app.use('/api/auth', require('./routes/auth'));
app.use('/api/patients', require('./routes/patient'));
app.use('/api/ai', require('./routes/ai'));

// Root Route (Vercel check karne ke liye ke backend zinda hai ya nahi)
app.get("/", (req, res) => res.send("A.F Clinic API is running... 🚀"));

// --- SERVER START LOGIC ---
const PORT = process.env.PORT || 5000;

// Agar local chala rahe hain toh listen karega, Vercel khud manage kar lega
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`🚀 Server is running on port ${PORT}`);
    });
}

// Ye line Vercel ke liye sabse zaroori hai
module.exports = app;