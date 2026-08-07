import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PlaceholderPage from '../components/PlaceholderPage';

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <PlaceholderPage
      title="Settings"
      description="Manage your GitHub connection, AI provider, and preferences."
    >
      <div className="mt-4 space-y-4">
        <div className="card">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {user?.avatarUrl && (
                <img
                  src={user.avatarUrl}
                  alt={user.login}
                  className="h-10 w-10 rounded-full border border-github-border"
                />
              )}
              <div>
                <p className="font-medium">GitHub Connection</p>
                <p className="text-sm text-github-muted">
                  {user ? `Connected as @${user.login}` : 'Not connected'}
                </p>
              </div>
            </div>
            <span className="rounded-full bg-green-900/40 px-3 py-1 text-xs font-medium text-green-400">
              Connected
            </span>
          </div>
        </div>

        <div className="card flex items-center justify-between">
          <div>
            <p className="font-medium">AI Provider</p>
            <p className="text-sm text-github-muted">Gemini (available in Phase 7)</p>
          </div>
          <button disabled className="btn-secondary opacity-50">
            Configure
          </button>
        </div>

        <div className="card flex items-center justify-between">
          <div>
            <p className="font-medium">Theme</p>
            <p className="text-sm text-github-muted">Dark</p>
          </div>
          <button disabled className="btn-secondary opacity-50">
            Configure
          </button>
        </div>

        <div className="card flex items-center justify-between border-red-900/30">
          <div>
            <p className="font-medium text-red-400">Sign Out</p>
            <p className="text-sm text-github-muted">Disconnect your GitHub account</p>
          </div>
          <button onClick={handleLogout} className="inline-flex items-center gap-2 rounded-lg border border-red-800/50 bg-red-900/20 px-4 py-2.5 text-sm font-medium text-red-400 transition-colors hover:bg-red-900/40">
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
    </PlaceholderPage>
  );
}
