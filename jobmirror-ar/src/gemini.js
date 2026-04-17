/* src/gemini.js */
import { GoogleGenerativeAI } from "@google/generative-ai";

// ⚠️ INSERT API KEY HERE
const API_KEY = "AIzaSyBwLXxIwv7Q7LEz6c7iomxW1CHkp90-ZMI."; 
const genAI = new GoogleGenerativeAI(API_KEY);

const MODEL_NAME = "gemini-flash-latest"; 

const generationConfig = {
  temperature: 0.7,
  maxOutputTokens: 1000, // INCREASED: Prevents "Unterminated string" errors
};

// --- GENERATE QUESTIONS ---
export async function generateInterviewQuestions(resumeText) {
  const model = genAI.getGenerativeModel({ model: MODEL_NAME, generationConfig });
  
  const prompt = `
    Context: Technical Interview.
    Resume snippet: "${resumeText.substring(0, 1000)}"
    Task: Create 2 SHORT technical questions.
    Output Format: strictly a JSON array of strings. 
    Example: ["What is React State?", "Explain Python lists."]
    DO NOT output markdown code blocks. DO NOT output "Here are the questions". Just the array.
  `;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    console.log("🔹 Raw AI Response:", text); // Debugging

    // CLEANUP: Find the actual JSON array within the text
    const jsonStart = text.indexOf('[');
    const jsonEnd = text.lastIndexOf(']');

    let aiQuestions = [];

    if (jsonStart !== -1 && jsonEnd !== -1) {
      // Extract only the part between [ and ]
      const jsonString = text.substring(jsonStart, jsonEnd + 1);
      aiQuestions = JSON.parse(jsonString);
    } else {
      throw new Error("No JSON array found in response");
    }

    // FORCE INTRO QUESTION
    return ["Briefly introduce yourself and your background.", ...aiQuestions];

  } catch (error) {
    console.error("Gemini Error (Questions):", error);
    // FALLBACK: If AI fails, use these so the app doesn't crash
    return [
      "Briefly introduce yourself and your background.",
      "What are your key technical strengths?",
      "Describe a challenging project you worked on."
    ];
  }
}

// --- ANALYZE ANSWER ---
export async function analyzeCandidateAnswer(question, answer) {
  // 1. Check if user actually spoke
  if (!answer || answer.trim().length < 5) {
    return { score: 0, feedback: "I couldn't hear you clearly. Please try again.", confidence: 0 };
  }

  const model = genAI.getGenerativeModel({ model: MODEL_NAME, generationConfig });

  const prompt = `
    Question: "${question}"
    Candidate Answer: "${answer}"
    Task: Rate 0-100 and give 1 short tip (max 15 words).
    Format: JSON {"score": 0, "feedback": "text", "confidence": 0}
  `;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    // CLEANUP: Find JSON Object
    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}');

    if (jsonStart !== -1 && jsonEnd !== -1) {
      const jsonString = text.substring(jsonStart, jsonEnd + 1);
      return JSON.parse(jsonString);
    } else {
      throw new Error("Invalid JSON structure");
    }

  } catch (error) {
    console.error("Gemini Error (Analysis):", error);
    return { score: 75, feedback: "Good effort. Let's move to the next question.", confidence: 50 };
  }
}