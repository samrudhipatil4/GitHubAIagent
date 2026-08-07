import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Github, FolderGit2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import PlaceholderPage from '../components/PlaceholderPage';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatRelativeDate } from '../utils/repoUtils';

export default function Dashboard() {
  const { user } = useAuth();
  const [repoCount, setRepoCount] = useState(null);
  const [recentRepos, setRecentRepos] = useState([]);
  const [loadingRepos, setLoadingRepos] = useState(true);

  useEffect(() => {
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

    if (user) fetchRepos();
  }, [user]);

  return (
    <PlaceholderPage
      title="Dashboard"
      description="Overview of your GitHub activity and AI suggestions."
    >
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
            {user.bio && (
              <p className="mt-1 text-sm text-gray-400">{user.bio}</p>
            )}
            <div className="mt-2 flex gap-4 text-xs text-github-muted">
              <span>{repoCount ?? user.publicRepos} repos</span>
              <span>{user.followers} followers</span>
              <span>{user.following} following</span>
            </div>
          </div>
          <a
            href={user.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
          >
            <Github className="h-4 w-4" />
            View Profile
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Repositories', value: loadingRepos ? '...' : (repoCount ?? '—'), link: '/repositories' },
          { label: 'Open PRs', value: '—', link: '/pull-requests' },
          { label: 'Open Issues', value: '—', link: '/issues' },
          { label: 'Recent Commits', value: '—', link: '/commits' },
        ].map((widget) => (
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
          <h3 className="mb-3 font-semibold">AI Suggestions</h3>
          <p className="text-sm text-github-muted">
            AI-powered suggestions will appear here in Phase 7.
          </p>
        </div>
      </div>
    </PlaceholderPage>
  );
}
