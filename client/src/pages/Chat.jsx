import PlaceholderPage from '../components/PlaceholderPage';

export default function Chat() {
  return (
    <PlaceholderPage
      title="AI Chat"
      description="Ask questions about your repositories in natural language."
    >
      <div className="card mt-4">
        <div className="space-y-4">
          <div className="flex justify-end">
            <div className="max-w-xs rounded-lg bg-github-accent px-4 py-2 text-sm">
              Show my repositories
            </div>
          </div>
          <div className="flex justify-start">
            <div className="max-w-md rounded-lg bg-github-hover px-4 py-3 text-sm text-github-muted">
              AI chat will be available in Phase 7. You'll be able to interact
              with GitHub using natural language.
            </div>
          </div>
        </div>
        <div className="mt-6 flex gap-2">
          <input
            type="text"
            disabled
            placeholder="Ask anything about your GitHub..."
            className="flex-1 rounded-lg border border-github-border bg-github-bg px-4 py-2.5 text-sm text-github-muted outline-none"
          />
          <button disabled className="btn-primary opacity-50">
            Send
          </button>
        </div>
      </div>
    </PlaceholderPage>
  );
}
