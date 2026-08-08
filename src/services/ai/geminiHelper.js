import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '../../config/env.js';
import { AppError } from '../../utils/AppError.js';

export const callGeminiText = async (prompt, systemInstruction) => {
  if (!env.GEMINI_API_KEY) {
    throw new AppError('GEMINI_API_KEY is not configured', 503);
  }

  const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: env.AI_MODEL,
    systemInstruction,
    generationConfig: { temperature: 0.4 },
  });

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  if (!text) throw new AppError('AI did not generate a response', 502);
  return text;
};
