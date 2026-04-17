/* src/test-api.js */
import { GoogleGenerativeAI } from "@google/generative-ai";

// ⚠️ PASTE YOUR API KEY HERE
const API_KEY = "AIzaSyD48Gg2v2g5m9Fi3vRqYaUpGqgKU2lhtFQ"; 

const genAI = new GoogleGenerativeAI(API_KEY);

async function listMyModels() {
  try {
    console.log("Checking available models...");
    // This connects to Google and asks for the list
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
    const data = await response.json();
    
    if (data.error) {
      console.error("API KEY ERROR:", data.error.message);
    } else {
      console.log("✅ SUCCESS! Here are your available models:");
      // Filter for models that support 'generateContent'
      const available = data.models.filter(m => m.supportedGenerationMethods.includes("generateContent"));
      available.forEach(m => console.log(`Model Name: "${m.name.replace('models/', '')}"`));
    }
  } catch (error) {
    console.error("Network Error:", error);
  }
}

listMyModels();