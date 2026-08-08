import { processMessage, getUserConversations, getConversation } from '../agents/chatAgent.js';
import { recordActivity } from '../services/memory/memoryService.js';
import { successResponse } from '../utils/apiResponse.js';

export const sendMessage = async (req, res, next) => {
  try {
    const { message, conversationId } = req.body;
    const userId = req.session.user.id;

    const result = await processMessage(message, conversationId, userId, req.accessToken);

    recordActivity(userId, {
      type: 'chat',
      title: message.trim().slice(0, 80),
      conversationId: result.conversationId,
    });

    return successResponse(res, 'AI response generated', result);
  } catch (error) {
    next(error);
  }
};

export const getHistory = (req, res, next) => {
  try {
    const userId = req.session.user.id;
    const { conversationId } = req.query;

    if (conversationId) {
      const conversation = getConversation(conversationId, userId);
      return successResponse(res, 'Conversation retrieved', {
        conversationId: conversation.id,
        messages: conversation.messages,
      });
    }

    const conversations = getUserConversations(userId);
    return successResponse(res, 'Conversations retrieved', { conversations });
  } catch (error) {
    next(error);
  }
};
