import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { RefreshCw, Plus } from 'lucide-react';
import { api } from '../services/api';
import IssueCard from '../components/IssueCard';
import LoadingSpinner from '../components/LoadingSpinner';

const STATES = [
  { value: 'open', label: 'Open' },
  { value: 'closed', label: 'Closed' },
  { value: 'all', label: 'All' },
];

export default function Issues() {
  const [repos, setRepos] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState('');
  const [state, setState] = useState('open');
  const [issues, setIssues] = useState([]);
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

  const fetchIssues = useCallback(async () => {
    if (!selectedRepo) return;

    const [owner, repo] = selectedRepo.split('/');
    setLoading(true);
    setError(null);

    try {
      const { data } = await api.getIssues(owner, repo, state);
      setIssues(data.issues);
    } catch (err) {
      setError(err.message);
      setIssues([]);
    } finally {
      setLoading(false);
    }
  }, [selectedRepo, state]);

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  const [owner, repo] = selectedRepo.split('/');

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Issues</h2>
          <p className="mt-1 text-sm text-github-muted">
            Create, edit, assign, and close issues with ease.
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchIssues} className="btn-secondary" disabled={loading || !selectedRepo}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          {selectedRepo && (
            <Link to={`/issues/${owner}/${repo}/new`} className="btn-primary">
              <Plus className="h-4 w-4" />
              New Issue
            </Link>
          )}
        </div>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <select
          value={selectedRepo}
          onChange={(e) => setSelectedRepo(e.target.value)}
          disabled={loadingRepos}
          className="rounded-lg border border-github-border bg-github-surface px-4 py-2.5 text-sm outline-none focus:border-github-link"
        >
          {repos.map((r) => (
            <option key={r.id} value={`${r.owner.login}/${r.name}`}>
              {r.fullName}
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

      {!loading && !loadingRepos && !error && issues.length === 0 && selectedRepo && (
        <div className="card py-16 text-center">
          <p className="text-github-muted">No {state === 'all' ? '' : state} issues found.</p>
          <Link to={`/issues/${owner}/${repo}/new`} className="btn-primary mt-4 inline-flex">
            <Plus className="h-4 w-4" />
            Create first issue
          </Link>
        </div>
      )}

      {!loading && !loadingRepos && issues.length > 0 && (
        <div className="grid gap-4">
          {issues.map((issue) => (
            <IssueCard key={issue.id} issue={issue} owner={owner} repo={repo} />
          ))}
        </div>
      )}
    </div>
  );
}
