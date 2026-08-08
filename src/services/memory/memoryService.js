import { getUserConversations as getChatConversations, getConversation as getChatConversation } from '../../agents/chatAgent.js';

const preferencesStore = new Map();
const activityStore = new Map();
const MAX_ACTIVITY = 20;

const defaultPreferences = () => ({
  preferredRepository: '',
  preferredBranch: 'main',
  frequentlyUsedRepository: '',
  theme: 'dark',
  aiProvider: 'gemini',
});

export const getPreferences = (userId) => {
  if (!preferencesStore.has(userId)) {
    preferencesStore.set(userId, defaultPreferences());
  }
  return { ...preferencesStore.get(userId) };
};

export const updatePreferences = (userId, updates) => {
  const current = getPreferences(userId);
  const allowed = ['preferredRepository', 'preferredBranch', 'frequentlyUsedRepository', 'theme', 'aiProvider'];
  const merged = { ...current };

  for (const key of allowed) {
    if (updates[key] !== undefined) {
      merged[key] = updates[key];
    }
  }

  preferencesStore.set(userId, merged);
  return merged;
};

export const trackRepositoryAccess = (userId, owner, repo) => {
  const fullName = `${owner}/${repo}`;
  const prefs = getPreferences(userId);
  prefs.frequentlyUsedRepository = fullName;
  preferencesStore.set(userId, prefs);
};

export const getConversations = (userId) => getChatConversations(userId);

export const getConversation = (userId, conversationId) => {
  const conversation = getChatConversation(conversationId, userId);
  return conversation;
};

export const recordActivity = (userId, activity) => {
  if (!activityStore.has(userId)) {
    activityStore.set(userId, []);
  }

  const entries = activityStore.get(userId);
  entries.unshift({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    timestamp: new Date().toISOString(),
    ...activity,
  });

  activityStore.set(userId, entries.slice(0, MAX_ACTIVITY));
};

export const getRecentActivity = (userId, limit = 10) => {
  const entries = activityStore.get(userId) || [];

  const chatActivity = getChatConversations(userId).slice(0, limit).map((conv) => ({
    id: conv.id,
    type: 'chat',
    title: conv.preview,
    timestamp: conv.updatedAt,
    messageCount: conv.messageCount,
  }));

  const combined = [...entries, ...chatActivity]
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, limit);

  return combined;
};
