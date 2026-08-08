import { generateAIResponse } from '../services/ai/aiProvider.js';
import { AppError } from '../utils/AppError.js';
import { v4 as uuidv4 } from 'uuid';

const conversations = new Map();

export const getOrCreateConversation = (conversationId, userId) => {
  if (conversationId && conversations.has(conversationId)) {
    const conv = conversations.get(conversationId);
    if (conv.userId !== userId) {
      throw new AppError('Conversation not found', 404);
    }
    return conv;
  }

  const id = conversationId || uuidv4();
  const conversation = {
    id,
    userId,
    messages: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  conversations.set(id, conversation);
  return conversation;
};

export const getUserConversations = (userId) => {
  return Array.from(conversations.values())
    .filter((c) => c.userId === userId)
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .map(({ id, messages, createdAt, updatedAt }) => ({
      id,
      preview: messages.find((m) => m.role === 'user')?.content?.slice(0, 60) || 'New conversation',
      messageCount: messages.length,
      createdAt,
      updatedAt,
    }));
};

export const processMessage = async (message, conversationId, userId, accessToken) => {
  if (!message?.trim()) {
    throw new AppError('Message is required', 400);
  }

  const conversation = getOrCreateConversation(conversationId, userId);
  const history = conversation.messages.slice(-20);

  conversation.messages.push({
    role: 'user',
    content: message.trim(),
    timestamp: new Date().toISOString(),
  });

  const { reply, toolsUsed } = await generateAIResponse(message.trim(), history, accessToken);

  conversation.messages.push({
    role: 'assistant',
    content: reply,
    toolsUsed,
    timestamp: new Date().toISOString(),
  });

  conversation.updatedAt = new Date().toISOString();

  return {
    reply,
    toolsUsed,
    conversationId: conversation.id,
    messages: conversation.messages,
  };
};

export const getConversation = (conversationId, userId) => {
  const conversation = conversations.get(conversationId);
  if (!conversation || conversation.userId !== userId) {
    throw new AppError('Conversation not found', 404);
  }
  return conversation;
};
