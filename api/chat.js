const { GoogleGenAI } = require('@google/genai');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export default async function handler(req, res) {
  // Allow CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { message, history = [], systemInstruction } = req.body;

    if (!message) return res.status(400).json({ error: 'Message is required' });

    const formattedHistory = history.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : msg.role,
      parts: [{ text: msg.content || msg.parts?.[0]?.text || '' }]
    }));

    const chat = ai.chats.create({
      model: 'gemini-2.0-flash',
      history: formattedHistory,
      config: {
        systemInstruction: systemInstruction || 'You are NoraBot, a helpful shopping assistant.'
      }
    });

    const response = await chat.sendMessage({ message });

    res.json({ success: true, response: response.text, model: 'gemini-2.0-flash' });

  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}