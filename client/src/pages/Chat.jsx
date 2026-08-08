import { useState, useEffect, useRef } from 'react';
import { Send, Plus, Sparkles, Loader2 } from 'lucide-react';
import { api } from '../services/api';
import ChatMessage from '../components/ChatMessage';
import LoadingSpinner from '../components/LoadingSpinner';

const SUGGESTIONS = [
  'Show my repositories',
  'List open pull requests for my first repo',
  'What is my GitHub profile?',
  'Show recent commits on main branch',
];

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [conversationId, setConversationId] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [error, setError] = useState(null);
  const [activeTools, setActiveTools] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading, activeTools]);

  useEffect(() => {
    const loadConversations = async () => {
      try {
        const { data } = await api.getChatHistory();
        setConversations(data.conversations || []);
      } catch {
        // ignore
      } finally {
        setLoadingHistory(false);
      }
    };
    loadConversations();
  }, []);

  const loadConversation = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.getChatHistory(id);
      setMessages(data.messages || []);
      setConversationId(id);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const startNewChat = () => {
    setMessages([]);
    setConversationId(null);
    setError(null);
    setInput('');
  };

  const sendMessage = async (text) => {
    const message = text || input.trim();
    if (!message || loading) return;

    setInput('');
    setError(null);
    setLoading(true);
    setActiveTools(['Thinking...']);

    const userMessage = {
      role: 'user',
      content: message,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const { data } = await api.sendChatMessage(message, conversationId);
      setConversationId(data.conversationId);
      setMessages(data.messages);
      setActiveTools([]);

      const { data: historyData } = await api.getChatHistory();
      setConversations(historyData.conversations || []);
    } catch (err) {
      setError(err.message);
      setActiveTools([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  return (
    <div className="flex h-[calc(100vh-3rem)] gap-4">
      {/* Conversation sidebar */}
      <aside className="hidden w-56 shrink-0 flex-col rounded-xl border border-github-border bg-github-surface lg:flex">
        <div className="border-b border-github-border p-3">
          <button onClick={startNewChat} className="btn-primary w-full">
            <Plus className="h-4 w-4" />
            New Chat
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {loadingHistory ? (
            <div className="flex justify-center py-4">
              <LoadingSpinner size="sm" />
            </div>
          ) : conversations.length === 0 ? (
            <p className="px-2 py-4 text-center text-xs text-github-muted">No conversations yet</p>
          ) : (
            conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => loadConversation(conv.id)}
                className={`mb-1 w-full rounded-lg px-3 py-2 text-left text-xs transition-colors ${
                  conversationId === conv.id
                    ? 'bg-github-hover text-white'
                    : 'text-github-muted hover:bg-github-hover/50 hover:text-white'
                }`}
              >
                <p className="truncate">{conv.preview}</p>
                <p className="mt-0.5 text-[10px] opacity-60">{conv.messageCount} messages</p>
              </button>
            ))
          )}
        </div>
      </aside>

      {/* Main chat area */}
      <div className="flex min-w-0 flex-1 flex-col rounded-xl border border-github-border bg-github-surface">
        <div className="border-b border-github-border px-5 py-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-github-link" />
            <div>
              <h2 className="font-semibold text-white">AI Chat</h2>
              <p className="text-xs text-github-muted">Ask anything about your GitHub repositories</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {messages.length === 0 && !loading && (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <Sparkles className="mb-4 h-12 w-12 text-github-muted" />
              <h3 className="text-lg font-semibold text-white">How can I help you today?</h3>
              <p className="mt-2 max-w-md text-sm text-github-muted">
                Ask me to list repositories, show pull requests, create issues, or summarize commits.
              </p>
              <div className="mt-6 grid gap-2 sm:grid-cols-2">
                {SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => sendMessage(suggestion)}
                    className="rounded-lg border border-github-border bg-github-bg px-4 py-2.5 text-left text-xs text-gray-300 transition-colors hover:border-github-link/40 hover:bg-github-hover"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-6">
            {messages.map((msg, i) => (
              <ChatMessage key={i} message={msg} />
            ))}

            {loading && activeTools.length > 0 && (
              <div className="flex items-center gap-3 text-sm text-github-muted">
                <Loader2 className="h-4 w-4 animate-spin text-github-link" />
                <span>AI is working{activeTools[0] !== 'Thinking...' ? `: ${activeTools[0]}` : '...'}</span>
              </div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </div>

        {error && (
          <div className="mx-5 mb-3 rounded-lg border border-red-800/50 bg-red-900/20 px-4 py-2 text-sm text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="border-t border-github-border p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about your GitHub..."
              disabled={loading}
              className="flex-1 rounded-lg border border-github-border bg-github-bg px-4 py-2.5 text-sm outline-none transition-colors focus:border-github-link disabled:opacity-50"
            />
            <button type="submit" disabled={loading || !input.trim()} className="btn-primary">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Send
            </button>
          </div>
          <p className="mt-2 text-center text-[10px] text-github-muted">
            Powered by Gemini · Requires GEMINI_API_KEY in .env
          </p>
        </form>
      </div>
    </div>
  );
}
