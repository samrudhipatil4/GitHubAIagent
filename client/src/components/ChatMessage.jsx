import ReactMarkdown from 'react-markdown';
import { Bot, User, Wrench } from 'lucide-react';
import { getToolDisplayName } from '../utils/toolLabels';

export default function ChatMessage({ message }) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
          isUser ? 'bg-github-accent' : 'bg-github-hover'
        }`}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>

      <div className={`max-w-[80%] ${isUser ? 'text-right' : ''}`}>
        {message.toolsUsed?.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-1.5">
            {message.toolsUsed.map((tool) => (
              <span
                key={tool}
                className="inline-flex items-center gap-1 rounded-full bg-github-hover px-2 py-0.5 text-xs text-github-link"
              >
                <Wrench className="h-3 w-3" />
                {getToolDisplayName(tool)}
              </span>
            ))}
          </div>
        )}

        <div
          className={`rounded-xl px-4 py-3 text-sm ${
            isUser
              ? 'bg-github-accent text-white'
              : 'border border-github-border bg-github-surface text-gray-200'
          }`}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <div className="prose prose-invert prose-sm max-w-none prose-p:my-1 prose-pre:bg-github-bg prose-pre:text-xs prose-code:text-github-link">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          )}
        </div>

        {message.timestamp && (
          <p className="mt-1 text-xs text-github-muted">
            {new Date(message.timestamp).toLocaleTimeString()}
          </p>
        )}
      </div>
    </div>
  );
}
