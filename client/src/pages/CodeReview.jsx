import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ScanSearch, GitPullRequest } from 'lucide-react';
import { api } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function CodeReview() {
  const [repos, setRepos] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState('');
  const [pullRequests, setPullRequests] = useState([]);
  const [loadingRepos, setLoadingRepos] = useState(true);
  const [loadingPRs, setLoadingPRs] = useState(false);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const { data } = await api.getRepositories();
        setRepos(data.repositories);
        if (data.repositories.length > 0) {
          const first = data.repositories[0];
          setSelectedRepo(`${first.owner.login}/${first.name}`);
        }
      } finally {
        setLoadingRepos(false);
      }
    };
    fetchRepos();
  }, []);

  useEffect(() => {
    if (!selectedRepo) return;

    const [owner, repo] = selectedRepo.split('/');
    const fetchPRs = async () => {
      setLoadingPRs(true);
      try {
        const { data } = await api.getPullRequests(owner, repo, 'open');
        setPullRequests(data.pullRequests);
      } catch {
        setPullRequests([]);
      } finally {
        setLoadingPRs(false);
      }
    };
    fetchPRs();
  }, [selectedRepo]);

  const [owner, repo] = selectedRepo.split('/');

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <ScanSearch className="h-6 w-6 text-github-link" />
          <h2 className="text-2xl font-bold text-white">AI Code Review</h2>
        </div>
        <p className="mt-1 text-sm text-github-muted">
          AI-powered pull request analysis for bugs, security, performance, and code quality.
        </p>
      </div>

      <div className="mb-6">
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
      </div>

      {loadingRepos || loadingPRs ? (
        <div className="flex justify-center py-16">
          <LoadingSpinner size="lg" />
        </div>
      ) : pullRequests.length === 0 ? (
        <div className="card py-16 text-center text-github-muted">
          No open pull requests found for this repository.
        </div>
      ) : (
        <div className="grid gap-3">
          {pullRequests.map((pr) => (
            <Link
              key={pr.id}
              to={`/code-review/${owner}/${repo}/${pr.number}`}
              className="card flex items-center justify-between transition-colors hover:border-github-link/40 hover:bg-github-hover/30"
            >
              <div className="flex items-center gap-3">
                <GitPullRequest className="h-5 w-5 text-github-muted" />
                <div>
                  <p className="font-medium text-white">
                    #{pr.number} {pr.title}
                  </p>
                  <p className="text-xs text-github-muted">by {pr.author.login}</p>
                </div>
              </div>
              <span className="btn-secondary text-xs">
                <ScanSearch className="h-3.5 w-3.5" />
                Review
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
