import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '../../config/env.js';
import { AppError } from '../../utils/AppError.js';
import { SYSTEM_PROMPT } from '../../prompts/systemPrompt.js';
import { toolDeclarations } from '../../tools/toolDefinitions.js';
import { executeTool } from '../../tools/toolManager.js';

const MAX_TOOL_ITERATIONS = 5;

export const generateChatResponse = async (message, history, accessToken) => {
  if (!env.GEMINI_API_KEY) {
    throw new AppError('GEMINI_API_KEY is not configured. Add it to your .env file.', 503);
  }

  const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: env.AI_MODEL,
    systemInstruction: SYSTEM_PROMPT,
    tools: [{ functionDeclarations: toolDeclarations }],
  });

  const geminiHistory = history
    .filter((msg) => msg.role === 'user' || msg.role === 'assistant')
    .map((msg) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

  const chat = model.startChat({ history: geminiHistory });
  const toolsUsed = [];

  let result = await chat.sendMessage(message);
  let iterations = 0;

  while (iterations < MAX_TOOL_ITERATIONS) {
    const functionCalls = result.response.functionCalls();

    if (!functionCalls || functionCalls.length === 0) break;

    const functionResponses = [];

    for (const call of functionCalls) {
      toolsUsed.push(call.name);
      const toolResult = await executeTool(call.name, call.args, accessToken);
      functionResponses.push({
        functionResponse: {
          name: call.name,
          response: toolResult,
        },
      });
    }

    result = await chat.sendMessage(functionResponses);
    iterations++;
  }

  const reply = result.response.text();

  if (!reply) {
    throw new AppError('AI did not generate a response', 502);
  }

  return { reply, toolsUsed: [...new Set(toolsUsed)] };
};
