import { GoogleGenAI } from "@google/genai";

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({apiKey: "AIzaSyBm02JpFRrZqR2rlJSdfEs3IA59-8zvK0I"});

/* 
history: 
[
      {
        role: "user",
        parts: [{ text: "Hello" }],
      },
      {
        role: "model",
        parts: [{ text: "Great to meet you. What would you like to know?" }],
      },
    ],

*/

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: "What is your name?",
    config: {
      systemInstruction: "Your name is NoraCloud, you're an e-commerce assistant. You're meant to guide the user on how to use the application.",
    },
     history: []

  });
  console.log(response.text);
}

main();




async function main() {
  const chat = ai.chats.create({
    model: "gemini-3-flash-preview",
    history: [
      {
        role: "user",
        parts: [{ text: "Hello" }],
      },
      {
        role: "model",
        parts: [{ text: "Great to meet you. What would you like to know?" }],
      },
    ],
  });

  const response1 = await chat.sendMessage({
    message: "I have 2 dogs in my house.",
  });
  console.log("Chat response 1:", response1.text);

  const response2 = await chat.sendMessage({
    message: "How many paws are in my house?",
  });
  console.log("Chat response 2:", response2.text);
}

await main();

