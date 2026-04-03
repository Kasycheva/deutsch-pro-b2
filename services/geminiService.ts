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

const stripCodeFences = (text: string): string => text.replace(/```json\s*|```\s*/gi, '').trim();

const extractJsonArray = (text: string): string => {
  const clean = stripCodeFences(text);
  const start = clean.indexOf('[');
  const end = clean.lastIndexOf(']');

  if (start === -1 || end === -1 || end <= start) {
    throw new Error('No JSON array found in AI response.');
  }

  return clean.slice(start, end + 1);
};

const parseBooleanLike = (value: unknown): boolean | null => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (['true', 'wahr', 'верно', 'правда'].includes(normalized)) return true;
    if (['false', 'falsch', 'неверно', 'ложь'].includes(normalized)) return false;
  }
  return null;
};

const buildFallbackOptions = (raw: any): string[] => {
  const candidateKeys = ['incorrectAnswers', 'distractors', 'wrongAnswers', 'variants'];
  const wrongAnswers = candidateKeys
    .map((key) => raw?.[key])
    .find(Array.isArray) as unknown[] | undefined;

  const correctText = String(
    raw?.correctAnswerText ??
    raw?.correctAnswer ??
    raw?.answer ??
    raw?.correctOption ??
    ''
  ).trim();

  const cleanedWrongAnswers = (wrongAnswers ?? [])
    .map((item) => String(item).trim())
    .filter(Boolean);

  const options = [correctText, ...cleanedWrongAnswers]
    .filter(Boolean)
    .filter((value, index, array) => array.indexOf(value) === index);

  return options.slice(0, 4);
};

const normalizeQuizQuestion = (raw: any): QuizQuestion | null => {
  if (!raw || typeof raw !== 'object') return null;

  const question = String(raw.question ?? raw.prompt ?? '').trim();
  const explanation = String(raw.explanation ?? raw.reason ?? 'Проверьте правило и попробуйте ещё раз.').trim();
  const context = typeof raw.context === 'string' ? raw.context.trim() : undefined;
  const providedType = String(raw.type ?? raw.kind ?? '').trim().toLowerCase();

  if (!question) return null;

  let options = Array.isArray(raw.options)
    ? raw.options.map((option: unknown) => String(option).trim()).filter(Boolean)
    : [];

  const booleanAnswer = parseBooleanLike(raw.correctAnswer ?? raw.answer);
  if (booleanAnswer !== null && options.length === 0) {
    options = ['Верно', 'Неверно'];
  }

  if (options.length === 0) {
    options = buildFallbackOptions(raw);
  }

  if (providedType === 'fill-gap' || providedType === 'fill_in_the_blank') {
    const correctAnswerText = String(raw.correctAnswerText ?? raw.correctAnswer ?? raw.answer ?? '').trim();
    if (!correctAnswerText) return null;

    return {
      type: 'fill-gap',
      question,
      options: [],
      correctIndex: -1,
      correctAnswerText,
      explanation,
      context,
    };
  }

  if (options.length >= 2) {
    let correctIndex = Number.isInteger(raw.correctIndex) ? raw.correctIndex : -1;

    if (correctIndex < 0 && typeof raw.correctAnswer === 'number') {
      correctIndex = raw.correctAnswer;
    }

    if (correctIndex < 0) {
      const correctText = String(raw.correctAnswerText ?? raw.correctAnswer ?? raw.answer ?? raw.correctOption ?? '').trim();
      if (correctText) {
        const foundIndex = options.findIndex((option) => option.toLowerCase() === correctText.toLowerCase());
        if (foundIndex >= 0) {
          correctIndex = foundIndex;
        }
      }
    }

    if (booleanAnswer !== null) {
      correctIndex = booleanAnswer ? 0 : 1;
    }

    if (correctIndex < 0 || correctIndex >= options.length) {
      correctIndex = 0;
    }

    const isTrueFalse =
      providedType === 'true-false' ||
      options.length === 2 && options.every((option) => ['верно', 'неверно', 'true', 'false', 'wahr', 'falsch'].includes(option.toLowerCase()));

    return {
      type: isTrueFalse ? 'true-false' : 'multiple-choice',
      question,
      options,
      correctIndex,
      explanation,
      context,
    };
  }

  const fallbackAnswer = String(raw.correctAnswerText ?? raw.correctAnswer ?? raw.answer ?? '').trim();
  if (!fallbackAnswer) return null;

  return {
    type: 'fill-gap',
    question,
    options: [],
    correctIndex: -1,
    correctAnswerText: fallbackAnswer,
    explanation,
    context,
  };
};

const normalizeQuizQuestions = (payload: unknown): QuizQuestion[] => {
  if (!Array.isArray(payload)) return [];
  return payload
    .map(normalizeQuizQuestion)
    .filter((question): question is QuizQuestion => Boolean(question));
};

export const generateQuiz = async (topicTitle: string, level: string, category?: string): Promise<QuizQuestion[]> => {
  const prompt = `Create exactly 5 German ${level} quiz questions for the topic "${topicTitle}"${category ? ` in the category "${category}"` : ''}.
Return ONLY a JSON array.
Each item must use this schema:
{
  "type": "multiple-choice" | "true-false" | "fill-gap",
  "question": "question text",
  "options": ["option 1", "option 2", "option 3", "option 4"],
  "correctIndex": 0,
  "correctAnswerText": "only for fill-gap",
  "explanation": "short explanation in Russian",
  "context": "optional short transcript or reading passage"
}
Rules:
- multiple-choice questions must always have 4 options;
- true-false questions must always have 2 options;
- fill-gap questions must have an empty options array and a non-empty correctAnswerText;
- do not wrap JSON in markdown fences.`;

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const responseText = await generateGeminiContent(prompt, "You are a quiz generator. Output valid JSON only.");
      const parsed = JSON.parse(extractJsonArray(responseText));
      const normalized = normalizeQuizQuestions(parsed);

      const validQuestions = normalized.filter((question) => {
        if (question.type === 'fill-gap') {
          return Boolean(question.correctAnswerText);
        }
        return question.options.length >= 2;
      });

      if (validQuestions.length >= 3) {
        return validQuestions.slice(0, 5);
      }
    } catch (error) {
      console.error(`Failed to build quiz on attempt ${attempt + 1}`, error);
    }
  }

  return [
    {
      type: 'multiple-choice',
      question: `Что чаще всего используется в теме "${topicTitle}"?`,
      options: ['Контекст и ключевые слова', 'Случайный порядок слов', 'Только перевод дословно', 'Игнорирование грамматики'],
      correctIndex: 0,
      explanation: 'Для заданий уровня B2 важно опираться на контекст, структуру и грамматические сигналы.',
    },
    {
      type: 'true-false',
      question: 'На уровне B2 нужно обращать внимание на оттенки смысла и формулировки.',
      options: ['Верно', 'Неверно'],
      correctIndex: 0,
      explanation: 'Да, на B2 проверяется не только базовое понимание, но и точность интерпретации.',
    },
    {
      type: 'fill-gap',
      question: 'Im Deutschen steht das Verb im Nebensatz meistens am ___.',
      options: [],
      correctIndex: -1,
      correctAnswerText: 'Ende',
      explanation: 'В придаточном предложении немецкий глагол обычно стоит в конце.',
    },
  ];
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
  const speakWithBrowser = async (): Promise<void> => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    await new Promise<void>((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'de-DE';
      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    });
  };

  try {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 8000);

    // 1. Try Gemini TTS via Serverless Function
    const response = await fetch("/api/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({ text }),
    });
    window.clearTimeout(timeoutId);

    if (response.ok) {
      const { audioData } = await response.json();
      if (audioData) {
        if (!audioContext) audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        if (audioContext.state === 'suspended') await audioContext.resume();

        await new Promise<void>((resolve, reject) => {
          const audio = new Audio(`data:audio/wav;base64,${audioData}`);
          audio.onended = () => resolve();
          audio.onerror = () => reject(new Error('Failed to play returned audio.'));
          audio.play().catch(reject);
        });
        return;
      }
    }
    
    // 2. Fallback to Browser TTS
    console.warn("Gemini TTS failed or returned no data, using browser fallback.");
    await speakWithBrowser();
    
  } catch (error) {
    console.error("Pronunciation error:", error);
    // Final fallback
    await speakWithBrowser();
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
