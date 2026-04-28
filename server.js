// NoraClouds Backend Server
// Node.js + Express + Gemini API Proxy + Product API
require('dotenv').config();  
const express = require('express');
const cors = require('cors');
const path = require('path');
const { GoogleGenAI } = require('@google/genai');

const app = express();
const PORT = process.env.PORT || 3000;

// Get API key from environment variable
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Initialize Gemini client
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// ================================================
// Gemini Chat API Endpoint
// ================================================
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history = [], systemInstruction } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Format history for Gemini API
    const formattedHistory = history.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : msg.role,
      parts: [{ text: msg.content || msg.parts?.[0]?.text || '' }]
    }));

    // Create chat session with history
    const chat = ai.chats.create({
     model: 'gemini-1.5-flash',
      history: formattedHistory,
      config: {
        systemInstruction: systemInstruction || 'You are NoraBot, a helpful shopping assistant.'
      }
    });

    // Send message and get response
    const response = await chat.sendMessage({
      message: message
    });

    res.json({
      success: true,
      response: response.text,
      model: 'gemini-2.0-flash'
    });

  } catch (error) {
    console.error('Gemini API Error:', error);
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
  console.log(`📡 Gemini API: ${GEMINI_API_KEY ? 'Configured' : 'NOT CONFIGURED - Set GEMINI_API_KEY env variable'}`);
});

