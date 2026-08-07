import { useState, useEffect, useCallback } from 'react';
import { Search, RefreshCw } from 'lucide-react';
import { api } from '../services/api';
import RepoCard from '../components/RepoCard';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Repositories() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [totalCount, setTotalCount] = useState(null);

  const fetchRepos = useCallback(async (query = '') => {
    setLoading(true);
    setError(null);
    setTotalCount(null);

    try {
      if (query.trim()) {
        const { data } = await api.searchRepositories(query.trim());
        setRepos(data.items);
        setTotalCount(data.totalCount);
        setIsSearching(true);
      } else {
        const { data } = await api.getRepositories();
        setRepos(data.repositories);
        setIsSearching(false);
      }
    } catch (err) {
      setError(err.message);
      setRepos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRepos();
  }, [fetchRepos]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchRepos(searchQuery);
  };

  const handleClear = () => {
    setSearchQuery('');
    fetchRepos('');
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Repositories</h2>
          <p className="mt-1 text-sm text-github-muted">
            Browse, search, and manage your GitHub repositories.
          </p>
        </div>
        <button
          onClick={() => fetchRepos(isSearching ? searchQuery : '')}
          className="btn-secondary"
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <form onSubmit={handleSearch} className="mb-6 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-github-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search repositories..."
            className="w-full rounded-lg border border-github-border bg-github-surface py-2.5 pl-10 pr-4 text-sm outline-none transition-colors focus:border-github-link"
          />
        </div>
        <button type="submit" className="btn-primary" disabled={loading}>
          Search
        </button>
        {isSearching && (
          <button type="button" onClick={handleClear} className="btn-secondary">
            Clear
          </button>
        )}
      </form>

      {isSearching && totalCount !== null && (
        <p className="mb-4 text-sm text-github-muted">
          Found {totalCount} repositories for &quot;{searchQuery}&quot;
        </p>
      )}

      {loading && (
        <div className="flex justify-center py-16">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {error && !loading && (
        <div className="rounded-lg border border-red-800/50 bg-red-900/20 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {!loading && !error && repos.length === 0 && (
        <div className="card py-16 text-center text-github-muted">
          No repositories found.
        </div>
      )}

      {!loading && !error && repos.length > 0 && (
        <div className="grid gap-4">
          {repos.map((repo) => (
            <RepoCard key={repo.id} repo={repo} />
          ))}
        </div>
      )}
    </div>
  );
}
