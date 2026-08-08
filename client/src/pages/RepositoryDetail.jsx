import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Star,
  GitFork,
  Eye,
  CircleDot,
  ExternalLink,
  ArrowLeft,
  Lock,
  Globe,
  GitCommitHorizontal,
  GitBranch,
  BarChart3,
  LayoutGrid,
} from 'lucide-react';
import { api } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import RepositoryInsights from '../components/RepositoryInsights';
import { getLanguageColor, formatDate, formatRelativeDate } from '../utils/repoUtils';

export default function RepositoryDetail() {
  const { owner, repo } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [repository, setRepository] = useState(null);
  const [stats, setStats] = useState(null);
  const [contributors, setContributors] = useState([]);
  const [recentCommits, setRecentCommits] = useState([]);
  const [branches, setBranches] = useState([]);
  const [insights, setInsights] = useState(null);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [repoRes, statsRes, contributorsRes, commitsRes, branchesRes] = await Promise.all([
          api.getRepository(owner, repo),
          api.getRepositoryStats(owner, repo),
          api.getRepositoryContributors(owner, repo),
          api.getCommits(owner, repo, undefined).catch(() => ({ data: { commits: [] } })),
          api.getBranches(owner, repo).catch(() => ({ data: { branches: [] } })),
        ]);

        setRepository(repoRes.data.repository);
        setStats(statsRes.data.stats);
        setContributors(contributorsRes.data.contributors);
        setRecentCommits(commitsRes.data.commits.slice(0, 5));
        setBranches(branchesRes.data.branches.slice(0, 5));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [owner, repo]);

  const fetchInsights = async () => {
    setInsightsLoading(true);
    try {
      const { data } = await api.getRepositoryInsights(owner, repo);
      setInsights(data.insights);
    } catch (err) {
      setError(err.message);
    } finally {
      setInsightsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'insights' && !insights) {
      fetchInsights();
    }
  }, [activeTab, owner, repo]);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error && !repository) {
    return (
      <div>
        <Link to="/repositories" className="mb-4 inline-flex items-center gap-2 text-sm text-github-link hover:underline">
          <ArrowLeft className="h-4 w-4" />
          Back to repositories
        </Link>
        <div className="rounded-lg border border-red-800/50 bg-red-900/20 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div>
      <Link to="/repositories" className="mb-4 inline-flex items-center gap-2 text-sm text-github-link hover:underline">
        <ArrowLeft className="h-4 w-4" />
        Back to repositories
      </Link>

      <div className="card mb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-white">{repository.fullName}</h2>
              {repository.isPrivate ? (
                <span className="flex items-center gap-1 rounded-full bg-github-hover px-2 py-0.5 text-xs text-github-muted">
                  <Lock className="h-3 w-3" /> Private
                </span>
              ) : (
                <span className="flex items-center gap-1 rounded-full bg-github-hover px-2 py-0.5 text-xs text-github-muted">
                  <Globe className="h-3 w-3" /> Public
                </span>
              )}
            </div>
            {repository.description && (
              <p className="mt-2 text-github-muted">{repository.description}</p>
            )}
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-github-muted">
              {repository.language && (
                <span className="flex items-center gap-1.5">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: getLanguageColor(repository.language) }}
                  />
                  {repository.language}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Star className="h-4 w-4" /> {repository.stars} stars
              </span>
              <span className="flex items-center gap-1">
                <GitFork className="h-4 w-4" /> {repository.forks} forks
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-4 w-4" /> {repository.watchers} watchers
              </span>
              <span className="flex items-center gap-1">
                <CircleDot className="h-4 w-4" /> {repository.openIssues} issues
              </span>
            </div>
            <p className="mt-3 text-xs text-github-muted">
              Default branch: <span className="text-gray-300">{repository.defaultBranch}</span>
              {' · '}Created {formatDate(repository.createdAt)}
              {' · '}Updated {formatDate(repository.updatedAt)}
            </p>
          </div>
          <a
            href={repository.htmlUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary shrink-0"
          >
            View on GitHub
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>

      <div className="mb-6 flex gap-1 border-b border-github-border">
        {[
          { id: 'overview', label: 'Overview', icon: LayoutGrid },
          { id: 'insights', label: 'Insights', icon: BarChart3 },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === id
                ? 'border-github-accent text-white'
                : 'border-transparent text-github-muted hover:text-white'
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="card">
              <h3 className="mb-4 font-semibold">Languages</h3>
              {stats?.languages?.length > 0 ? (
                <>
                  <div className="mb-4 flex h-2 overflow-hidden rounded-full">
                    {stats.languages.map((lang) => (
                      <div
                        key={lang.name}
                        style={{
                          width: `${lang.percentage}%`,
                          backgroundColor: getLanguageColor(lang.name),
                        }}
                        title={`${lang.name} ${lang.percentage}%`}
                      />
                    ))}
                  </div>
                  <div className="space-y-2">
                    {stats.languages.map((lang) => (
                      <div key={lang.name} className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <span
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: getLanguageColor(lang.name) }}
                          />
                          {lang.name}
                        </span>
                        <span className="text-github-muted">{lang.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-sm text-github-muted">No language data available.</p>
              )}
            </div>

            <div className="card">
              <h3 className="mb-4 font-semibold">Contributors</h3>
              {contributors.length > 0 ? (
                <div className="space-y-3">
                  {contributors.map((contributor) => (
                    <a
                      key={contributor.id}
                      href={contributor.profileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-github-hover"
                    >
                      <img
                        src={contributor.avatarUrl}
                        alt={contributor.login}
                        className="h-8 w-8 rounded-full"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{contributor.login}</p>
                        <p className="text-xs text-github-muted">
                          {contributor.contributions} contributions
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-github-muted">No contributors found.</p>
              )}
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="card">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="flex items-center gap-2 font-semibold">
                  <GitCommitHorizontal className="h-4 w-4" />
                  Latest Commits
                </h3>
                <Link to="/commits" className="text-xs text-github-link hover:underline">View all</Link>
              </div>
              {recentCommits.length > 0 ? (
                <div className="space-y-3">
                  {recentCommits.map((commit) => (
                    <Link
                      key={commit.sha}
                      to={`/commits/${owner}/${repo}/${commit.sha}`}
                      className="block rounded-lg p-2 transition-colors hover:bg-github-hover"
                    >
                      <p className="truncate text-sm font-medium text-white">
                        {commit.message.split('\n')[0]}
                      </p>
                      <p className="mt-1 text-xs text-github-muted">
                        {commit.sha.slice(0, 7)} · {formatRelativeDate(commit.author.date)}
                      </p>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-github-muted">No commits found.</p>
              )}
            </div>

            <div className="card">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="flex items-center gap-2 font-semibold">
                  <GitBranch className="h-4 w-4" />
                  Branches
                </h3>
                <Link to="/commits" className="text-xs text-github-link hover:underline">Manage</Link>
              </div>
              {branches.length > 0 ? (
                <div className="space-y-2">
                  {branches.map((branch) => (
                    <div key={branch.name} className="flex items-center justify-between rounded-lg p-2">
                      <span className="font-mono text-sm text-github-link">{branch.name}</span>
                      <span className="font-mono text-xs text-github-muted">{branch.sha.slice(0, 7)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-github-muted">No branches found.</p>
              )}
            </div>
          </div>
        </>
      )}

      {activeTab === 'insights' && (
        insightsLoading ? (
          <div className="flex justify-center py-16">
            <LoadingSpinner size="lg" />
          </div>
        ) : insights ? (
          <RepositoryInsights
            owner={owner}
            repo={repo}
            insights={insights}
            onRefresh={fetchInsights}
          />
        ) : (
          <div className="card text-sm text-github-muted">
            Failed to load insights.{' '}
            <button onClick={fetchInsights} className="text-github-link hover:underline">
              Try again
            </button>
          </div>
        )
      )}
    </div>
  );
}
