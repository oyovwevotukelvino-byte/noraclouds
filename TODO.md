# Gemini Chat Integration - NoraClouds

## Status: ✅ COMPLETE

### 1. ✅ Complete server.js
- Set up Express server with CORS
- Create POST `/api/chat` endpoint
- Use `@google/genai` to send messages to Gemini
- Accept system instruction, history, and user message from frontend
- Return AI response
- Added `dotenv` support for environment variables

### 2. ✅ Update script.js
- Replaced OpenRouter API config with local `/api/chat` endpoint
- Updated `sendAIMessage()` to POST to backend
- Send chat history in Gemini-compatible format
- Kept existing UI: typing indicator, localStorage history, clear chat
- Updated system prompt for NoraClouds e-commerce

### 3. ✅ System Prompt
- NoraBot: friendly shopping assistant for NoraClouds
- Product knowledge: iPhones, MacBooks, Watches, Audio, Accessories
- Features: free shipping over $500, 30-day returns, 24/7 support
- Help users find products, compare specs, answer pricing/shipping questions

### 4. ✅ Dependencies Installed
- `express`, `cors`, `@google/genai`, `dotenv`
- `package.json` and `package-lock.json` created

## How to Run

1. **Start the backend server:**
   ```bash
   node server.js
   ```

2. **Open the frontend:**
   Open `index.html` in your browser (or use Live Server)

3. **Test the chat:**
   - Click the chat bubble in the bottom-right corner
   - Type a message and press Enter
   - The chat will maintain history across page reloads

## Architecture

```
┌─────────────┐      POST /api/chat       ┌─────────────┐      ┌─────────────┐
│  index.html │ ────────────────────────> │  server.js  │ ───> │ Gemini API  │
│  script.js  │  {message, history,       │  (Express)  │      │  (Google)   │
│  (Chat UI)  │   systemInstruction}      │             │      │             │
└─────────────┘                           └─────────────┘      └─────────────┘
       │                                         │
       │ localStorage                             │
       v                                         v
chat_history saved                        AI response returned
```
