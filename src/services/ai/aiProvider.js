import { generateChatResponse } from './geminiService.js';
import { env } from '../../config/env.js';
import { AppError } from '../../utils/AppError.js';

export const generateAIResponse = async (message, history, accessToken) => {
  if (env.AI_PROVIDER === 'gemini') {
    return generateChatResponse(message, history, accessToken);
  }

  throw new AppError(`AI provider "${env.AI_PROVIDER}" is not supported yet`, 501);
};
