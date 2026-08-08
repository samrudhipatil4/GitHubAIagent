import { useState, useEffect } from 'react';
import { LogOut, Save, Loader2 } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import PageHeader from '../components/PageHeader';

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [preferences, setPreferences] = useState({
    preferredRepository: '',
    preferredBranch: 'main',
    theme: 'dark',
    aiProvider: 'gemini',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrefs = async () => {
      try {
        const { data } = await api.getPreferences();
        setPreferences(data.preferences);
      } catch {
        // use defaults
      } finally {
        setLoading(false);
      }
    };
    fetchPrefs();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const { data } = await api.updatePreferences(preferences);
      setPreferences(data.preferences);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Manage your GitHub connection, AI provider, and preferences."
      />

      {error && (
        <div className="mb-4 rounded-lg border border-red-800/50 bg-red-900/20 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="space-y-4">
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

        <div className="card space-y-4">
          <h3 className="font-semibold">Preferences</h3>

          <div>
            <label className="mb-1 block text-sm text-github-muted">Preferred Repository</label>
            <input
              type="text"
              value={preferences.preferredRepository}
              onChange={(e) => setPreferences({ ...preferences, preferredRepository: e.target.value })}
              placeholder="owner/repo"
              className="w-full rounded-lg border border-github-border bg-github-bg px-3 py-2 text-sm text-white focus:border-github-accent focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-github-muted">Preferred Branch</label>
            <input
              type="text"
              value={preferences.preferredBranch}
              onChange={(e) => setPreferences({ ...preferences, preferredBranch: e.target.value })}
              placeholder="main"
              className="w-full rounded-lg border border-github-border bg-github-bg px-3 py-2 text-sm text-white focus:border-github-accent focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-github-muted">AI Provider</label>
            <select
              value={preferences.aiProvider}
              onChange={(e) => setPreferences({ ...preferences, aiProvider: e.target.value })}
              className="w-full rounded-lg border border-github-border bg-github-bg px-3 py-2 text-sm text-white focus:border-github-accent focus:outline-none"
            >
              <option value="gemini">Google Gemini</option>
              <option value="openai">OpenAI (coming soon)</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm text-github-muted">Theme</label>
            <select
              value={preferences.theme}
              onChange={(e) => setPreferences({ ...preferences, theme: e.target.value })}
              className="w-full rounded-lg border border-github-border bg-github-bg px-3 py-2 text-sm text-white focus:border-github-accent focus:outline-none"
            >
              <option value="dark">Dark</option>
              <option value="light">Light (coming soon)</option>
            </select>
          </div>

          <button onClick={handleSave} disabled={loading || saving} className="btn-primary">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saved ? 'Saved!' : 'Save Preferences'}
          </button>
        </div>

        <div className="card flex items-center justify-between">
          <div>
            <p className="font-medium">MCP Integration</p>
            <p className="text-sm text-github-muted">
              AI tools routed through Model Context Protocol
            </p>
          </div>
          <Link to="/chat" className="btn-secondary">
            Open Chat
          </Link>
        </div>

        <div className="card flex items-center justify-between border-red-900/30">
          <div>
            <p className="font-medium text-red-400">Sign Out</p>
            <p className="text-sm text-github-muted">Disconnect your GitHub account</p>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-lg border border-red-800/50 bg-red-900/20 px-4 py-2.5 text-sm font-medium text-red-400 transition-colors hover:bg-red-900/40"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
