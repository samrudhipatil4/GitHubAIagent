import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ExternalLink,
  Github,
  FolderGit2,
  MessageSquare,
  Sparkles,
  ScanSearch,
  Bot,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import PageHeader from '../components/PageHeader';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatRelativeDate } from '../utils/repoUtils';

const activityIcons = {
  chat: MessageSquare,
  review: ScanSearch,
  insight: Sparkles,
};

export default function Dashboard() {
  const { user } = useAuth();
  const [repoCount, setRepoCount] = useState(null);
  const [recentRepos, setRecentRepos] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loadingRepos, setLoadingRepos] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingActivity, setLoadingActivity] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchRepos = async () => {
      try {
        const { data } = await api.getRepositories();
        setRepoCount(data.repositories.length);
        setRecentRepos(data.repositories.slice(0, 5));
      } catch {
        setRepoCount(user?.publicRepos ?? null);
      } finally {
        setLoadingRepos(false);
      }
    };

    const fetchStats = async () => {
      try {
        const { data } = await api.getDashboardStats();
        setDashboardStats(data.stats);
      } catch {
        setDashboardStats(null);
      } finally {
        setLoadingStats(false);
      }
    };

    const fetchActivity = async () => {
      try {
        const { data } = await api.getActivity();
        setActivity(data.activity);
      } catch {
        setActivity([]);
      } finally {
        setLoadingActivity(false);
      }
    };

    fetchRepos();
    fetchStats();
    fetchActivity();
  }, [user]);

  const widgets = [
    { label: 'Repositories', value: loadingRepos ? '...' : (repoCount ?? '—'), link: '/repositories' },
    { label: 'Open PRs', value: loadingStats ? '...' : (dashboardStats?.openPRs ?? '—'), link: '/pull-requests' },
    { label: 'Open Issues', value: loadingStats ? '...' : (dashboardStats?.openIssues ?? '—'), link: '/issues' },
    { label: 'Recent Commits', value: loadingStats ? '...' : (dashboardStats?.recentCommits ?? '—'), link: '/commits' },
  ];

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Overview of your GitHub activity and AI suggestions."
      />

      {user && (
        <div className="card mb-6 flex items-center gap-5">
          <img
            src={user.avatarUrl}
            alt={user.login}
            className="h-16 w-16 rounded-full border-2 border-github-border"
          />
          <div className="flex-1">
            <h3 className="text-lg font-semibold">{user.name || user.login}</h3>
            <p className="text-sm text-github-muted">@{user.login}</p>
            {user.bio && <p className="mt-1 text-sm text-gray-400">{user.bio}</p>}
            <div className="mt-2 flex gap-4 text-xs text-github-muted">
              <span>{repoCount ?? user.publicRepos} repos</span>
              <span>{user.followers} followers</span>
              <span>{user.following} following</span>
            </div>
          </div>
          <a href={user.profileUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary">
            <Github className="h-4 w-4" />
            View Profile
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {widgets.map((widget) => (
          <Link
            key={widget.label}
            to={widget.link}
            className="card block transition-colors hover:border-github-link/40"
          >
            <p className="text-sm text-github-muted">{widget.label}</p>
            <p className="mt-2 text-3xl font-bold">{widget.value}</p>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="card">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold">Recent Repositories</h3>
            <Link to="/repositories" className="text-xs text-github-link hover:underline">
              View all
            </Link>
          </div>
          {loadingRepos ? (
            <div className="flex justify-center py-6">
              <LoadingSpinner />
            </div>
          ) : recentRepos.length > 0 ? (
            <div className="space-y-3">
              {recentRepos.map((repo) => (
                <Link
                  key={repo.id}
                  to={`/repositories/${repo.owner.login}/${repo.name}`}
                  className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-github-hover"
                >
                  <FolderGit2 className="h-4 w-4 shrink-0 text-github-muted" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-github-link">{repo.fullName}</p>
                    <p className="text-xs text-github-muted">
                      Updated {formatRelativeDate(repo.updatedAt)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-github-muted">No repositories found.</p>
          )}
        </div>

        <div className="card">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="flex items-center gap-2 font-semibold">
              <Bot className="h-4 w-4" />
              AI Activity Feed
            </h3>
            <Link to="/chat" className="text-xs text-github-link hover:underline">
              Open Chat
            </Link>
          </div>
          {loadingActivity ? (
            <div className="flex justify-center py-6">
              <LoadingSpinner />
            </div>
          ) : activity.length > 0 ? (
            <div className="space-y-3">
              {activity.map((item) => {
                const Icon = activityIcons[item.type] || MessageSquare;
                return (
                  <div key={item.id} className="flex items-start gap-3 rounded-lg p-2">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-github-hover">
                      <Icon className="h-4 w-4 text-github-link" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-gray-200">{item.title}</p>
                      <p className="text-xs text-github-muted">
                        {item.type === 'chat' ? 'AI Chat' : item.type}
                        {' · '}
                        {formatRelativeDate(item.timestamp)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-github-muted">
              No AI activity yet. Try the{' '}
              <Link to="/chat" className="text-github-link hover:underline">AI Chat</Link>{' '}
              or run a{' '}
              <Link to="/code-review" className="text-github-link hover:underline">Code Review</Link>.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
