import {
  getPreferences,
  updatePreferences,
  getConversations,
  getConversation,
  getRecentActivity,
} from '../services/memory/memoryService.js';
import { successResponse } from '../utils/apiResponse.js';

export const getUserPreferences = (req, res, next) => {
  try {
    const prefs = getPreferences(req.session.user.id);
    return successResponse(res, 'Preferences retrieved', { preferences: prefs });
  } catch (error) {
    next(error);
  }
};

export const updateUserPreferences = (req, res, next) => {
  try {
    const prefs = updatePreferences(req.session.user.id, req.body);
    return successResponse(res, 'Preferences updated', { preferences: prefs });
  } catch (error) {
    next(error);
  }
};

export const listConversations = (req, res, next) => {
  try {
    const conversations = getConversations(req.session.user.id);
    return successResponse(res, 'Conversations retrieved', { conversations });
  } catch (error) {
    next(error);
  }
};

export const getConversationById = (req, res, next) => {
  try {
    const conversation = getConversation(req.session.user.id, req.params.id);
    return successResponse(res, 'Conversation retrieved', {
      conversationId: conversation.id,
      messages: conversation.messages,
    });
  } catch (error) {
    next(error);
  }
};

export const getActivity = (req, res, next) => {
  try {
    const activity = getRecentActivity(req.session.user.id);
    return successResponse(res, 'Activity retrieved', { activity });
  } catch (error) {
    next(error);
  }
};
