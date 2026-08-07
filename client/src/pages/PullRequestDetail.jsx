import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ExternalLink,
  GitPullRequest,
  GitMerge,
  ScanSearch,
  FileCode,
  MessageSquare,
} from 'lucide-react';
import { api } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatDate, formatRelativeDate } from '../utils/repoUtils';
import { getPRStatus, getFileStatusColor } from '../utils/prUtils';

const TABS = [
  { id: 'overview', label: 'Overview', icon: GitPullRequest },
  { id: 'files', label: 'Files', icon: FileCode },
  { id: 'comments', label: 'Comments', icon: MessageSquare },
];

export default function PullRequestDetail() {
  const { owner, repo, number } = useParams();
  const [pullRequest, setPullRequest] = useState(null);
  const [files, setFiles] = useState([]);
  const [comments, setComments] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [merging, setMerging] = useState(false);
  const [error, setError] = useState(null);
  const [mergeError, setMergeError] = useState(null);
  const [showMergeConfirm, setShowMergeConfirm] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [prRes, filesRes, commentsRes] = await Promise.all([
        api.getPullRequest(owner, repo, number),
        api.getPullRequestFiles(owner, repo, number),
        api.getPullRequestComments(owner, repo, number),
      ]);

      setPullRequest(prRes.data.pullRequest);
      setFiles(filesRes.data.files);
      setComments(commentsRes.data.comments);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [owner, repo, number]);

  const handleMerge = async () => {
    setMerging(true);
    setMergeError(null);

    try {
      await api.mergePullRequest(owner, repo, number);
      setShowMergeConfirm(false);
      await fetchData();
    } catch (err) {
      setMergeError(err.message);
    } finally {
      setMerging(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !pullRequest) {
    return (
      <div>
        <Link to="/pull-requests" className="mb-4 inline-flex items-center gap-2 text-sm text-github-link hover:underline">
          <ArrowLeft className="h-4 w-4" />
          Back to pull requests
        </Link>
        <div className="rounded-lg border border-red-800/50 bg-red-900/20 px-4 py-3 text-sm text-red-400">
          {error || 'Pull request not found'}
        </div>
      </div>
    );
  }

  const status = getPRStatus(pullRequest);
  const canMerge = pullRequest.state === 'open' && !pullRequest.merged && !pullRequest.draft;

  return (
    <div>
      <Link to="/pull-requests" className="mb-4 inline-flex items-center gap-2 text-sm text-github-link hover:underline">
        <ArrowLeft className="h-4 w-4" />
        Back to pull requests
      </Link>

      <div className="card mb-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-github-muted">#{pullRequest.number}</span>
              <h2 className="text-2xl font-bold text-white">{pullRequest.title}</h2>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${status.className}`}>
                {status.label}
              </span>
            </div>

            <div className="mt-3 flex items-center gap-3">
              <img
                src={pullRequest.author.avatarUrl}
                alt={pullRequest.author.login}
                className="h-6 w-6 rounded-full"
              />
              <p className="text-sm text-github-muted">
                <span className="text-gray-300">{pullRequest.author.login}</span> opened this{' '}
                {formatRelativeDate(pullRequest.createdAt)}
              </p>
            </div>

            <p className="mt-3 text-sm">
              <span className="rounded bg-github-hover px-2 py-0.5 font-mono text-green-400">
                {pullRequest.head.ref}
              </span>
              <span className="mx-2 text-github-muted">→</span>
              <span className="rounded bg-github-hover px-2 py-0.5 font-mono text-github-link">
                {pullRequest.base.ref}
              </span>
            </p>

            {pullRequest.labels.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {pullRequest.labels.map((label) => (
                  <span
                    key={label.name}
                    className="rounded-full px-2 py-0.5 text-xs font-medium"
                    style={{
                      backgroundColor: `#${label.color}33`,
                      color: `#${label.color}`,
                    }}
                  >
                    {label.name}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-4 flex flex-wrap gap-4 text-sm text-github-muted">
              <span>+{pullRequest.additions ?? 0} additions</span>
              <span>-{pullRequest.deletions ?? 0} deletions</span>
              <span>{pullRequest.changedFiles ?? files.length} files changed</span>
              <span>{pullRequest.commits ?? '—'} commits</span>
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap gap-2">
            <a
              href={pullRequest.htmlUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              View on GitHub
              <ExternalLink className="h-4 w-4" />
            </a>
            <button disabled className="btn-secondary opacity-50" title="Available in Phase 8">
              <ScanSearch className="h-4 w-4" />
              AI Review
            </button>
            {canMerge && (
              <button onClick={() => setShowMergeConfirm(true)} className="btn-primary">
                <GitMerge className="h-4 w-4" />
                Merge
              </button>
            )}
          </div>
        </div>
      </div>

      {showMergeConfirm && (
        <div className="card mb-6 border-yellow-800/50 bg-yellow-900/10">
          <h3 className="font-semibold text-yellow-300">Confirm Merge</h3>
          <p className="mt-2 text-sm text-github-muted">
            Are you sure you want to merge pull request #{pullRequest.number} into{' '}
            <span className="font-mono text-gray-300">{pullRequest.base.ref}</span>?
          </p>
          {mergeError && (
            <p className="mt-2 text-sm text-red-400">{mergeError}</p>
          )}
          <div className="mt-4 flex gap-2">
            <button onClick={handleMerge} disabled={merging} className="btn-primary">
              {merging ? 'Merging...' : 'Confirm Merge'}
            </button>
            <button onClick={() => setShowMergeConfirm(false)} className="btn-secondary">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="mb-4 flex gap-1 border-b border-github-border">
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
            {id === 'files' && files.length > 0 && (
              <span className="rounded-full bg-github-hover px-1.5 text-xs">{files.length}</span>
            )}
            {id === 'comments' && comments.length > 0 && (
              <span className="rounded-full bg-github-hover px-1.5 text-xs">{comments.length}</span>
            )}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="card">
          {pullRequest.body ? (
            <div className="prose prose-invert max-w-none whitespace-pre-wrap text-sm text-gray-300">
              {pullRequest.body}
            </div>
          ) : (
            <p className="text-sm text-github-muted">No description provided.</p>
          )}
          <div className="mt-6 grid gap-3 border-t border-github-border pt-4 text-sm sm:grid-cols-2">
            <div>
              <span className="text-github-muted">Created:</span>{' '}
              <span className="text-gray-300">{formatDate(pullRequest.createdAt)}</span>
            </div>
            <div>
              <span className="text-github-muted">Updated:</span>{' '}
              <span className="text-gray-300">{formatDate(pullRequest.updatedAt)}</span>
            </div>
            {pullRequest.mergedAt && (
              <div>
                <span className="text-github-muted">Merged:</span>{' '}
                <span className="text-gray-300">{formatDate(pullRequest.mergedAt)}</span>
              </div>
            )}
            <div>
              <span className="text-github-muted">Mergeable:</span>{' '}
              <span className="text-gray-300">{pullRequest.mergeableState || 'unknown'}</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'files' && (
        <div className="space-y-3">
          {files.length === 0 ? (
            <div className="card py-12 text-center text-github-muted">No files changed.</div>
          ) : (
            files.map((file) => (
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
      )}

      {activeTab === 'comments' && (
        <div className="space-y-3">
          {comments.length === 0 ? (
            <div className="card py-12 text-center text-github-muted">No review comments yet.</div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="card">
                <div className="flex items-start gap-3">
                  <img
                    src={comment.author.avatarUrl}
                    alt={comment.author.login}
                    className="h-8 w-8 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{comment.author.login}</span>
                      <span className="text-xs text-github-muted">
                        {formatRelativeDate(comment.createdAt)}
                      </span>
                    </div>
                    {comment.path && (
                      <p className="mt-1 font-mono text-xs text-github-link">
                        {comment.path}{comment.line ? `:${comment.line}` : ''}
                      </p>
                    )}
                    <p className="mt-2 whitespace-pre-wrap text-sm text-gray-300">{comment.body}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
