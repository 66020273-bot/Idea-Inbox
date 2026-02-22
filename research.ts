import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function searchBestPractices() {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: "What are the 2025/2026 best practices for a web application to save files directly to local device storage on iOS (iPhone)? Can a PWA or web app use 'Save to Files' to bypass the sandbox? Mention File System Access API support and Web Share API for files.",
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  console.log(response.text);
  console.log(JSON.stringify(response.candidates?.[0]?.groundingMetadata?.groundingChunks, null, 2));
}

searchBestPractices();
