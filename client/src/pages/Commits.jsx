import { useState, useEffect, useCallback } from 'react';
import {
  RefreshCw,
  GitCommitHorizontal,
  GitBranch,
  Plus,
  GitCompare,
  Sparkles,
} from 'lucide-react';
import { api } from '../services/api';
import CommitCard from '../components/CommitCard';
import BranchCard from '../components/BranchCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { getFileStatusColor } from '../utils/prUtils';

const TABS = [
  { id: 'commits', label: 'Commits', icon: GitCommitHorizontal },
  { id: 'branches', label: 'Branches', icon: GitBranch },
  { id: 'compare', label: 'Compare', icon: GitCompare },
];

export default function Commits() {
  const [activeTab, setActiveTab] = useState('commits');
  const [repos, setRepos] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [branches, setBranches] = useState([]);
  const [commits, setCommits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingRepos, setLoadingRepos] = useState(true);
  const [error, setError] = useState(null);

  const [showCreateBranch, setShowCreateBranch] = useState(false);
  const [newBranchName, setNewBranchName] = useState('');
  const [baseBranch, setBaseBranch] = useState('');
  const [creating, setCreating] = useState(false);

  const [compareBase, setCompareBase] = useState('');
  const [compareHead, setCompareHead] = useState('');
  const [comparison, setComparison] = useState(null);
  const [comparing, setComparing] = useState(false);

  const [owner, repo] = selectedRepo.split('/');

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const { data } = await api.getRepositories();
        setRepos(data.repositories);
        if (data.repositories.length > 0) {
          const first = data.repositories[0];
          setSelectedRepo(`${first.owner.login}/${first.name}`);
          setSelectedBranch(first.defaultBranch || 'main');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingRepos(false);
      }
    };
    fetchRepos();
  }, []);

  const fetchBranches = useCallback(async () => {
    if (!selectedRepo) return;
    try {
      const { data } = await api.getBranches(owner, repo);
      setBranches(data.branches);
      if (!selectedBranch && data.branches.length > 0) {
        setSelectedBranch(data.branches[0].name);
      }
      if (!baseBranch && data.branches.length > 0) {
        setBaseBranch(data.branches[0].name);
      }
    } catch (err) {
      setError(err.message);
    }
  }, [selectedRepo, owner, repo, selectedBranch, baseBranch]);

  const fetchCommits = useCallback(async () => {
    if (!selectedRepo) return;
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.getCommits(owner, repo, selectedBranch || undefined);
      setCommits(data.commits);
    } catch (err) {
      setError(err.message);
      setCommits([]);
    } finally {
      setLoading(false);
    }
  }, [selectedRepo, owner, repo, selectedBranch]);

  useEffect(() => {
    if (selectedRepo) fetchBranches();
  }, [selectedRepo, fetchBranches]);

  useEffect(() => {
    if (selectedRepo && activeTab === 'commits') fetchCommits();
  }, [selectedRepo, selectedBranch, activeTab, fetchCommits]);

  const handleCreateBranch = async (e) => {
    e.preventDefault();
    if (!newBranchName.trim() || !baseBranch) return;

    const base = branches.find((b) => b.name === baseBranch);
    if (!base) return;

    setCreating(true);
    setError(null);
    try {
      await api.createBranch(owner, repo, { name: newBranchName.trim(), sha: base.sha });
      setNewBranchName('');
      setShowCreateBranch(false);
      await fetchBranches();
    } catch (err) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteBranch = async (branchName) => {
    if (!confirm(`Delete branch "${branchName}"? This cannot be undone.`)) return;

    setError(null);
    try {
      await api.deleteBranch(owner, repo, branchName);
      await fetchBranches();
      if (selectedBranch === branchName) {
        setSelectedBranch(branches.find((b) => b.name !== branchName)?.name || '');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCompare = async () => {
    if (!compareBase || !compareHead) return;

    setComparing(true);
    setError(null);
    try {
      const { data } = await api.compareBranches(owner, repo, compareBase, compareHead);
      setComparison(data);
    } catch (err) {
      setError(err.message);
      setComparison(null);
    } finally {
      setComparing(false);
    }
  };

  const defaultBranch = repos.find((r) => `${r.owner.login}/${r.name}` === selectedRepo)?.defaultBranch;

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Commits & Branches</h2>
          <p className="mt-1 text-sm text-github-muted">
            Browse commit history and manage branches.
          </p>
        </div>
        <button
          onClick={() => (activeTab === 'commits' ? fetchCommits() : fetchBranches())}
          className="btn-secondary"
          disabled={loading || !selectedRepo}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <select
          value={selectedRepo}
          onChange={(e) => {
            setSelectedRepo(e.target.value);
            setComparison(null);
          }}
          disabled={loadingRepos}
          className="rounded-lg border border-github-border bg-github-surface px-4 py-2.5 text-sm outline-none focus:border-github-link"
        >
          {repos.map((r) => (
            <option key={r.id} value={`${r.owner.login}/${r.name}`}>
              {r.fullName}
            </option>
          ))}
        </select>

        {activeTab === 'commits' && (
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="rounded-lg border border-github-border bg-github-surface px-4 py-2.5 text-sm outline-none focus:border-github-link"
          >
            {branches.map((b) => (
              <option key={b.name} value={b.name}>
                {b.name}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="mb-6 flex gap-1 border-b border-github-border">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
              activeTab === id
                ? 'border-github-link text-white'
                : 'border-transparent text-github-muted hover:text-white'
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-800/50 bg-red-900/20 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {activeTab === 'commits' && (
        <>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-github-muted">
              Showing commits on <span className="font-mono text-gray-300">{selectedBranch}</span>
            </p>
            <button disabled className="btn-secondary opacity-50" title="Available in Phase 7">
              <Sparkles className="h-4 w-4" />
              Summarize (Phase 7)
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <LoadingSpinner size="lg" />
            </div>
          ) : commits.length === 0 ? (
            <div className="card py-16 text-center text-github-muted">No commits found.</div>
          ) : (
            <div className="grid gap-3">
              {commits.map((commit) => (
                <CommitCard key={commit.sha} commit={commit} owner={owner} repo={repo} />
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === 'branches' && (
        <>
          <div className="mb-4 flex justify-end">
            <button onClick={() => setShowCreateBranch(true)} className="btn-primary">
              <Plus className="h-4 w-4" />
              Create Branch
            </button>
          </div>

          {showCreateBranch && (
            <form onSubmit={handleCreateBranch} className="card mb-4 space-y-4">
              <h3 className="font-semibold">Create New Branch</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm">Branch name</label>
                  <input
                    value={newBranchName}
                    onChange={(e) => setNewBranchName(e.target.value)}
                    placeholder="feature/my-branch"
                    required
                    className="w-full rounded-lg border border-github-border bg-github-bg px-4 py-2.5 text-sm outline-none focus:border-github-link"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm">Base branch</label>
                  <select
                    value={baseBranch}
                    onChange={(e) => setBaseBranch(e.target.value)}
                    className="w-full rounded-lg border border-github-border bg-github-bg px-4 py-2.5 text-sm outline-none focus:border-github-link"
                  >
                    {branches.map((b) => (
                      <option key={b.name} value={b.name}>{b.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex gap-2">
                <button type="submit" disabled={creating} className="btn-primary">
                  {creating ? 'Creating...' : 'Create'}
                </button>
                <button type="button" onClick={() => setShowCreateBranch(false)} className="btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          )}

          {branches.length === 0 ? (
            <div className="card py-16 text-center text-github-muted">No branches found.</div>
          ) : (
            <div className="grid gap-3">
              {branches.map((branch) => (
                <BranchCard
                  key={branch.name}
                  branch={branch}
                  isDefault={branch.name === defaultBranch}
                  onDelete={handleDeleteBranch}
                />
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === 'compare' && (
        <>
          <div className="card mb-4">
            <h3 className="mb-4 font-semibold">Compare Branches</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm text-github-muted">Base</label>
                <select
                  value={compareBase}
                  onChange={(e) => setCompareBase(e.target.value)}
                  className="w-full rounded-lg border border-github-border bg-github-bg px-4 py-2.5 text-sm outline-none focus:border-github-link"
                >
                  <option value="">Select base branch</option>
                  {branches.map((b) => (
                    <option key={b.name} value={b.name}>{b.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm text-github-muted">Compare</label>
                <select
                  value={compareHead}
                  onChange={(e) => setCompareHead(e.target.value)}
                  className="w-full rounded-lg border border-github-border bg-github-bg px-4 py-2.5 text-sm outline-none focus:border-github-link"
                >
                  <option value="">Select head branch</option>
                  {branches.map((b) => (
                    <option key={b.name} value={b.name}>{b.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <button
              onClick={handleCompare}
              disabled={comparing || !compareBase || !compareHead}
              className="btn-primary mt-4"
            >
              {comparing ? 'Comparing...' : 'Compare'}
            </button>
          </div>

          {comparison && (
            <div className="space-y-4">
              <div className="card">
                <p className="text-sm">
                  <span className="font-mono text-github-link">{comparison.base}</span>
                  <span className="mx-2 text-github-muted">←</span>
                  <span className="font-mono text-green-400">{comparison.head}</span>
                </p>
                <p className="mt-2 text-sm text-github-muted">
                  {comparison.comparison.aheadBy} commits ahead · {comparison.comparison.behindBy} behind ·{' '}
                  {comparison.comparison.totalCommits} total commits · status: {comparison.comparison.status}
                </p>
              </div>

              {comparison.comparison.commits.length > 0 && (
                <div className="grid gap-3">
                  {comparison.comparison.commits.map((commit) => (
                    <CommitCard key={commit.sha} commit={commit} owner={owner} repo={repo} />
                  ))}
                </div>
              )}

              {comparison.comparison.files?.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold">Changed Files ({comparison.comparison.files.length})</h3>
                  {comparison.comparison.files.map((file) => (
                    <div key={file.filename} className="card">
                      <div className="flex items-center justify-between">
                        <p className="truncate font-mono text-sm">{file.filename}</p>
                        <div className="flex gap-3 text-xs">
                          <span className={getFileStatusColor(file.status)}>{file.status}</span>
                          <span className="text-green-400">+{file.additions}</span>
                          <span className="text-red-400">-{file.deletions}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
