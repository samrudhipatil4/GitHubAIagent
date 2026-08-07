import { useState, useEffect, useCallback } from 'react';
import { RefreshCw } from 'lucide-react';
import { api } from '../services/api';
import PRCard from '../components/PRCard';
import LoadingSpinner from '../components/LoadingSpinner';

const STATES = [
  { value: 'open', label: 'Open' },
  { value: 'closed', label: 'Closed' },
  { value: 'all', label: 'All' },
];

export default function PullRequests() {
  const [repos, setRepos] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState('');
  const [state, setState] = useState('open');
  const [pullRequests, setPullRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingRepos, setLoadingRepos] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const { data } = await api.getRepositories();
        setRepos(data.repositories);
        if (data.repositories.length > 0) {
          const first = data.repositories[0];
          setSelectedRepo(`${first.owner.login}/${first.name}`);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingRepos(false);
      }
    };

    fetchRepos();
  }, []);

  const fetchPullRequests = useCallback(async () => {
    if (!selectedRepo) return;

    const [owner, repo] = selectedRepo.split('/');
    setLoading(true);
    setError(null);

    try {
      const { data } = await api.getPullRequests(owner, repo, state);
      setPullRequests(data.pullRequests);
    } catch (err) {
      setError(err.message);
      setPullRequests([]);
    } finally {
      setLoading(false);
    }
  }, [selectedRepo, state]);

  useEffect(() => {
    fetchPullRequests();
  }, [fetchPullRequests]);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Pull Requests</h2>
          <p className="mt-1 text-sm text-github-muted">
            View, review, and merge pull requests across your repositories.
          </p>
        </div>
        <button onClick={fetchPullRequests} className="btn-secondary" disabled={loading || !selectedRepo}>
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <select
          value={selectedRepo}
          onChange={(e) => setSelectedRepo(e.target.value)}
          disabled={loadingRepos}
          className="rounded-lg border border-github-border bg-github-surface px-4 py-2.5 text-sm outline-none focus:border-github-link"
        >
          {repos.map((repo) => (
            <option key={repo.id} value={`${repo.owner.login}/${repo.name}`}>
              {repo.fullName}
            </option>
          ))}
        </select>

        <div className="flex rounded-lg border border-github-border p-1">
          {STATES.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setState(value)}
              className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
                state === value
                  ? 'bg-github-hover text-white'
                  : 'text-github-muted hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {loadingRepos && (
        <div className="flex justify-center py-16">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {loading && !loadingRepos && (
        <div className="flex justify-center py-16">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {error && !loading && (
        <div className="rounded-lg border border-red-800/50 bg-red-900/20 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {!loading && !loadingRepos && !error && pullRequests.length === 0 && selectedRepo && (
        <div className="card py-16 text-center text-github-muted">
          No {state === 'all' ? '' : state} pull requests found for this repository.
        </div>
      )}

      {!loading && !loadingRepos && pullRequests.length > 0 && (
        <div className="grid gap-4">
          {pullRequests.map((pr) => {
            const [owner, repo] = selectedRepo.split('/');
            return <PRCard key={pr.id} pullRequest={pr} owner={owner} repo={repo} />;
          })}
        </div>
      )}
    </div>
  );
}
