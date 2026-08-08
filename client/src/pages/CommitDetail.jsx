import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, GitCommitHorizontal } from 'lucide-react';
import { api } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatDate, formatRelativeDate } from '../utils/repoUtils';
import { getFileStatusColor } from '../utils/prUtils';

export default function CommitDetail() {
  const { owner, repo, sha } = useParams();
  const [commit, setCommit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCommit = async () => {
      try {
        const { data } = await api.getCommit(owner, repo, sha);
        setCommit(data.commit);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCommit();
  }, [owner, repo, sha]);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !commit) {
    return (
      <div>
        <Link to="/commits" className="mb-4 inline-flex items-center gap-2 text-sm text-github-link hover:underline">
          <ArrowLeft className="h-4 w-4" />
          Back to commits
        </Link>
        <div className="rounded-lg border border-red-800/50 bg-red-900/20 px-4 py-3 text-sm text-red-400">
          {error || 'Commit not found'}
        </div>
      </div>
    );
  }

  const shortSha = commit.sha.slice(0, 7);

  return (
    <div>
      <Link to="/commits" className="mb-4 inline-flex items-center gap-2 text-sm text-github-link hover:underline">
        <ArrowLeft className="h-4 w-4" />
        Back to commits
      </Link>

      <div className="card mb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <GitCommitHorizontal className="h-5 w-5 text-github-muted" />
              <code className="rounded bg-github-hover px-2 py-0.5 text-sm text-github-link">{shortSha}</code>
            </div>
            <h2 className="mt-3 whitespace-pre-wrap text-lg font-semibold text-white">{commit.message}</h2>
            <div className="mt-4 flex items-center gap-3">
              {commit.author.avatarUrl && (
                <img src={commit.author.avatarUrl} alt="" className="h-8 w-8 rounded-full" />
              )}
              <p className="text-sm text-github-muted">
                <span className="text-gray-300">{commit.author.login || commit.author.name}</span> committed{' '}
                {formatRelativeDate(commit.author.date)}
              </p>
            </div>
            {commit.stats && (
              <p className="mt-3 text-sm text-github-muted">
                <span className="text-green-400">+{commit.stats.additions}</span>
                {' · '}
                <span className="text-red-400">-{commit.stats.deletions}</span>
                {' · '}
                {commit.stats.total} total changes
              </p>
            )}
          </div>
          <a href={commit.htmlUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary shrink-0">
            View on GitHub
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>

      <div className="card mb-6">
        <h3 className="mb-3 font-semibold">Details</h3>
        <dl className="grid gap-2 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-github-muted">Full SHA</dt>
            <dd className="mt-0.5 break-all font-mono text-xs text-gray-300">{commit.sha}</dd>
          </div>
          <div>
            <dt className="text-github-muted">Date</dt>
            <dd className="mt-0.5 text-gray-300">{formatDate(commit.author.date)}</dd>
          </div>
          {commit.parents?.length > 0 && (
            <div className="sm:col-span-2">
              <dt className="text-github-muted">Parents</dt>
              <dd className="mt-1 flex flex-wrap gap-2">
                {commit.parents.map((parent) => (
                  <Link
                    key={parent}
                    to={`/commits/${owner}/${repo}/${parent}`}
                    className="font-mono text-xs text-github-link hover:underline"
                  >
                    {parent.slice(0, 7)}
                  </Link>
                ))}
              </dd>
            </div>
          )}
        </dl>
      </div>

      <div className="space-y-3">
        <h3 className="font-semibold">Changed Files ({commit.files?.length || 0})</h3>
        {commit.files?.length === 0 ? (
          <div className="card py-12 text-center text-github-muted">No file changes.</div>
        ) : (
          commit.files.map((file) => (
            <div key={file.filename} className="card">
              <div className="flex items-center justify-between gap-3">
                <p className="truncate font-mono text-sm text-gray-300">{file.filename}</p>
                <div className="flex shrink-0 items-center gap-3 text-xs">
                  <span className={`font-medium capitalize ${getFileStatusColor(file.status)}`}>
                    {file.status}
                  </span>
                  <span className="text-green-400">+{file.additions}</span>
                  <span className="text-red-400">-{file.deletions}</span>
                </div>
              </div>
              {file.patch && (
                <pre className="mt-3 max-h-64 overflow-auto rounded-lg bg-github-bg p-3 text-xs text-gray-400">
                  {file.patch}
                </pre>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
