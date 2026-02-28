const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Gemini Setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/analyze', async (req, res) => {
  try {
    const { name, age, gender } = req.body;
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `You are a medical AI assistant for A.F Clinic. Provide a very brief (2 lines max) 
    preliminary AI health insight for a patient named ${name}, age ${age}, gender ${gender}. 
    Focus on general wellness or common risks for this age group. End with "Please consult Dr. for details."`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    res.json({ analysis: response.text() });
  } catch (err) {
    res.status(500).json({ error: "AI is sleeping right now" });
  }
});

module.exports = router;