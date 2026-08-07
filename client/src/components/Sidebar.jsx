import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderGit2,
  GitPullRequest,
  CircleDot,
  GitCommitHorizontal,
  MessageSquare,
  ScanSearch,
  Settings,
  Bot,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/repositories', label: 'Repositories', icon: FolderGit2 },
  { to: '/pull-requests', label: 'Pull Requests', icon: GitPullRequest },
  { to: '/issues', label: 'Issues', icon: CircleDot },
  { to: '/commits', label: 'Commits', icon: GitCommitHorizontal },
  { to: '/chat', label: 'AI Chat', icon: MessageSquare },
  { to: '/code-review', label: 'Code Review', icon: ScanSearch },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-github-border bg-github-surface">
      <div className="flex items-center gap-3 border-b border-github-border px-5 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-github-accent">
          <Bot className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-sm font-semibold text-white">AI GitHub</h1>
          <p className="text-xs text-github-muted">Assistant</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
            }
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-github-border p-4">
        <div className="flex items-center gap-3">
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.login}
              className="h-9 w-9 rounded-full border border-github-border"
            />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-github-hover text-xs font-medium">
              ?
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{user?.name || user?.login || 'User'}</p>
            <p className="truncate text-xs text-github-muted">@{user?.login || 'github'}</p>
          </div>
          <button
            onClick={handleLogout}
            title="Logout"
            className="rounded-lg p-1.5 text-github-muted transition-colors hover:bg-github-hover hover:text-white"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
