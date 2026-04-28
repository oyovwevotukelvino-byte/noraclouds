// NoraClouds Backend Server
// Node.js + Express + Groq AI Proxy
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const GROQ_API_KEY = process.env.GROQ_API_KEY;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// ================================================
// Groq Chat API Endpoint
// ================================================
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history = [], systemInstruction } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const messages = [
      { role: 'system', content: systemInstruction || 'You are NoraBot, a helpful shopping assistant.' },
      ...history.map(msg => ({ role: msg.role === 'assistant' ? 'assistant' : 'user', content: msg.content })),
      { role: 'user', content: message }
    ];

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: messages,
        max_tokens: 1000
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Groq API error');
    }

    const aiReply = data.choices[0].message.content;

    res.json({
      success: true,
      response: aiReply,
      model: 'llama-3.3-70b-versatile'
    });

  } catch (error) {
    console.error('Groq API Error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get response from AI'
    });
  }
});

// ================================================
// Health Check Endpoint
// ================================================
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'NoraClouds API', timestamp: new Date().toISOString() });
});

// ================================================
// Start Server
// ================================================
app.listen(PORT, () => {
  console.log(`🚀 NoraClouds server running on http://localhost:${PORT}`);
  console.log(`📡 Groq API: ${GROQ_API_KEY ? 'Configured' : 'NOT CONFIGURED - Set GROQ_API_KEY env variable'}`);
});
