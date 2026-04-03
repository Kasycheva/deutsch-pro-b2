/**
 * Gemini API Service (Vercel Serverless Version)
 * Communicates with /api/generate and /api/tts to keep API keys secure.
 */

import { QuizQuestion } from '../types';

// --- Text Generation ---

export const generateGeminiContent = async (prompt: string, systemInstruction?: string): Promise<string> => {
  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, systemInstruction }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Server error");
    }

    const data = await response.json();
    return data.text || "";
  } catch (error) {
    console.error("Gemini Proxy Call Error:", error);
    throw error;
  }
};

// --- Specialized AI Functions ---

export const generateTheoryContent = async (topicTitle: string, level: string): Promise<string> => {
  const prompt = `Generate a detailed German B2 theory lesson for the topic: "${topicTitle}". 
  Include grammar rules, examples, and common mistakes. 
  Explain in Russian, but keep German examples in German. 
  Format with clear headings and bullet points.`;
  
  return generateGeminiContent(prompt, "You are an expert German language teacher for B2 level.");
};

export const generateQuiz = async (topicTitle: string, level: string): Promise<QuizQuestion[]> => {
  const prompt = `Generate 5 quiz questions for the German B2 topic: "${topicTitle}". 
  Include a mix of multiple-choice and true/false questions. 
  Return ONLY a JSON array of objects with fields: question, options (array), correctAnswer (index), explanation (in Russian).`;
  
  const responseText = await generateGeminiContent(prompt, "You are a quiz generator. Output valid JSON only.");
  try {
    // Strip markdown code blocks if present
    const cleanJson = responseText.replace(/```json\n?|```/g, '').trim();
    return JSON.parse(cleanJson);
  } catch (e) {
    console.error("Failed to parse quiz JSON", e);
    return [];
  }
};

export const explainGrammar = async (sentence: string): Promise<string> => {
  const prompt = `Explain the grammar of this German sentence in detail: "${sentence}". 
  Break down the word order, cases, and verb conjugations. 
  Explain in Russian.`;
  
  return generateGeminiContent(prompt, "You are a helpful German grammar analyzer.");
};

export const checkSentence = async (sentence: string): Promise<{ corrected: string, explanation: string }> => {
  const prompt = `Check this German sentence for errors: "${sentence}". 
  If there are errors, provide the corrected version and explain why in Russian. 
  If it's correct, say "Отлично!" and explain why it's correct. 
  Format: CORRECTED: [sentence] EXPLANATION: [russian text]`;
  
  const text = await generateGeminiContent(prompt, "You are a strict but encouraging German teacher.");
  
  const correctedMatch = text.match(/CORRECTED:\s*(.*?)\s*EXPLANATION:/s);
  const explanationMatch = text.match(/EXPLANATION:\s*(.*)/s);
  
  return {
    corrected: correctedMatch ? correctedMatch[1].trim() : sentence,
    explanation: explanationMatch ? explanationMatch[1].trim() : "Анализ завершен."
  };
};

// --- Audio / TTS ---

let audioContext: AudioContext | null = null;

export const playPronunciation = async (text: string): Promise<void> => {
  try {
    // 1. Try Gemini TTS via Serverless Function
    const response = await fetch("/api/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    if (response.ok) {
      const { audioData } = await response.json();
      if (audioData) {
        if (!audioContext) audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        if (audioContext.state === 'suspended') await audioContext.resume();
        
        const binaryString = window.atob(audioData);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        
        const audioBuffer = await audioContext.decodeAudioData(bytes.buffer);
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        source.start(0);
        return;
      }
    }
    
    // 2. Fallback to Browser TTS
    console.warn("Gemini TTS failed or returned no data, using browser fallback.");
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'de-DE';
    window.speechSynthesis.speak(utterance);
    
  } catch (error) {
    console.error("Pronunciation error:", error);
    // Final fallback
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'de-DE';
    window.speechSynthesis.speak(utterance);
  }
};

// --- Translation Tasks ---

export const generateTranslationTask = async (topic: string): Promise<{ german: string, russian: string }> => {
  const prompt = `Generate a German B2 level sentence about "${topic}" and its Russian translation. 
  Format: GERMAN: [sentence] RUSSIAN: [translation]`;
  
  const text = await generateGeminiContent(prompt, "You are a translation task generator.");
  const deMatch = text.match(/GERMAN:\s*(.*?)\s*RUSSIAN:/s);
  const ruMatch = text.match(/RUSSIAN:\s*(.*)/s);
  
  return {
    german: deMatch ? deMatch[1].trim() : "Guten Tag!",
    russian: ruMatch ? ruMatch[1].trim() : "Добрый день!"
  };
};

export const evaluateTranslation = async (original: string, userTranslation: string): Promise<string> => {
  const prompt = `Evaluate this translation. Original German: "${original}". User Russian translation: "${userTranslation}". 
  Is it accurate? Provide feedback and a better version if needed. Explain in Russian.`;
  
  return generateGeminiContent(prompt, "You are a translation expert.");
};
