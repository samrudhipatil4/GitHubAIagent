import { Bot, Github, Sparkles, Shield, Zap } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const features = [
  { icon: Sparkles, label: 'AI Chat', desc: 'Natural language GitHub ops' },
  { icon: Shield, label: 'Code Review', desc: 'Automated PR analysis' },
  { icon: Zap, label: 'Insights', desc: 'Repo summaries & stats' },
];

export default function Login() {
  const { login } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const error = searchParams.get('error');

  const dismissError = () => {
    setSearchParams({});
  };

  return (
    <div className="w-full max-w-lg">
      <div className="card text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-github-accent to-green-700 shadow-lg shadow-green-900/30">
          <Bot className="h-8 w-8 text-white" />
        </div>

        <h1 className="text-2xl font-bold text-white">AI GitHub Assistant</h1>
        <p className="mt-3 text-sm leading-relaxed text-github-muted">
          Manage repositories, pull requests, issues, and workflows using natural
          language. Powered by GitHub APIs and AI.
        </p>

        {error && (
          <div className="mt-4 rounded-lg border border-red-800/50 bg-red-900/20 px-4 py-3 text-left">
            <p className="text-sm font-medium text-red-400">Authentication failed</p>
            <p className="mt-1 text-xs text-red-300/80">{decodeURIComponent(error)}</p>
            <button
              onClick={dismissError}
              className="mt-2 text-xs text-red-400 underline hover:text-red-300"
            >
              Dismiss
            </button>
          </div>
        )}

        <button onClick={login} className="btn-primary mt-8 w-full">
          <Github className="h-5 w-5" />
          Sign in with GitHub
        </button>

        <p className="mt-4 text-xs text-github-muted">
          Requires GitHub OAuth credentials in your .env file
        </p>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3">
        {features.map(({ icon: Icon, label, desc }) => (
          <div
            key={label}
            className="rounded-lg border border-github-border bg-github-surface px-3 py-4 text-center transition-colors hover:border-github-muted/30"
          >
            <Icon className="mx-auto h-5 w-5 text-github-link" />
            <p className="mt-2 text-xs font-medium text-gray-300">{label}</p>
            <p className="mt-0.5 text-[10px] text-github-muted">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
