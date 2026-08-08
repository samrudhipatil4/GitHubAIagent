import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ExternalLink,
  CircleDot,
  MessageSquare,
  XCircle,
  Pencil,
  Check,
} from 'lucide-react';
import { api } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatDate, formatRelativeDate } from '../utils/repoUtils';
import { getIssueStatus } from '../utils/issueUtils';

export default function IssueDetail() {
  const { owner, repo, number } = useParams();
  const [issue, setIssue] = useState(null);
  const [comments, setComments] = useState([]);
  const [labels, setLabels] = useState([]);
  const [collaborators, setCollaborators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editBody, setEditBody] = useState('');
  const [editLabels, setEditLabels] = useState([]);
  const [editAssignees, setEditAssignees] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [actionError, setActionError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [issueRes, labelsRes, collabRes] = await Promise.all([
        api.getIssue(owner, repo, number),
        api.getIssueLabels(owner, repo),
        api.getIssueCollaborators(owner, repo),
      ]);

      setIssue(issueRes.data.issue);
      setComments(issueRes.data.comments);
      setLabels(labelsRes.data.labels);
      setCollaborators(collabRes.data.collaborators);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [owner, repo, number]);

  const startEditing = () => {
    setEditTitle(issue.title);
    setEditBody(issue.body || '');
    setEditLabels(issue.labels.map((l) => l.name));
    setEditAssignees(issue.assignees.map((a) => a.login));
    setEditing(true);
  };

  const handleUpdate = async () => {
    setSubmitting(true);
    setActionError(null);

    try {
      await api.updateIssue(owner, repo, number, {
        title: editTitle.trim(),
        body: editBody.trim(),
        labels: editLabels,
        assignees: editAssignees,
      });
      setEditing(false);
      await fetchData();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = async () => {
    if (!confirm(`Close issue #${number}?`)) return;

    setSubmitting(true);
    setActionError(null);

    try {
      await api.closeIssue(owner, repo, number);
      await fetchData();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);
    setActionError(null);

    try {
      await api.addIssueComment(owner, repo, number, newComment.trim());
      setNewComment('');
      await fetchData();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleEditLabel = (name) => {
    setEditLabels((prev) =>
      prev.includes(name) ? prev.filter((l) => l !== name) : [...prev, name]
    );
  };

  const toggleEditAssignee = (login) => {
    setEditAssignees((prev) =>
      prev.includes(login) ? prev.filter((a) => a !== login) : [...prev, login]
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !issue) {
    return (
      <div>
        <Link to="/issues" className="mb-4 inline-flex items-center gap-2 text-sm text-github-link hover:underline">
          <ArrowLeft className="h-4 w-4" />
          Back to issues
        </Link>
        <div className="rounded-lg border border-red-800/50 bg-red-900/20 px-4 py-3 text-sm text-red-400">
          {error || 'Issue not found'}
        </div>
      </div>
    );
  }

  const status = getIssueStatus(issue);

  return (
    <div>
      <Link to="/issues" className="mb-4 inline-flex items-center gap-2 text-sm text-github-link hover:underline">
        <ArrowLeft className="h-4 w-4" />
        Back to issues
      </Link>

      <div className="card mb-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <CircleDot className={`h-5 w-5 ${issue.state === 'open' ? 'text-green-400' : 'text-red-400'}`} />
              <span className="text-sm text-github-muted">#{issue.number}</span>
              {!editing ? (
                <h2 className="text-2xl font-bold text-white">{issue.title}</h2>
              ) : (
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="flex-1 rounded-lg border border-github-border bg-github-bg px-3 py-1.5 text-xl font-bold outline-none focus:border-github-link"
                />
              )}
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${status.className}`}>
                {status.label}
              </span>
            </div>

            <div className="mt-3 flex items-center gap-3">
              <img src={issue.author.avatarUrl} alt={issue.author.login} className="h-6 w-6 rounded-full" />
              <p className="text-sm text-github-muted">
                <span className="text-gray-300">{issue.author.login}</span> opened{' '}
                {formatRelativeDate(issue.createdAt)}
              </p>
            </div>

            {!editing && issue.labels.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {issue.labels.map((label) => (
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

            {!editing && issue.assignees.length > 0 && (
              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs text-github-muted">Assignees:</span>
                {issue.assignees.map((a) => (
                  <img
                    key={a.login}
                    src={a.avatarUrl}
                    alt={a.login}
                    title={a.login}
                    className="h-6 w-6 rounded-full"
                  />
                ))}
              </div>
            )}
          </div>

          <div className="flex shrink-0 flex-wrap gap-2">
            <a href={issue.htmlUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary">
              View on GitHub
              <ExternalLink className="h-4 w-4" />
            </a>
            {issue.state === 'open' && !editing && (
              <>
                <button onClick={startEditing} className="btn-secondary">
                  <Pencil className="h-4 w-4" />
                  Edit
                </button>
                <button onClick={handleClose} disabled={submitting} className="inline-flex items-center gap-2 rounded-lg border border-red-800/50 bg-red-900/20 px-4 py-2.5 text-sm font-medium text-red-400 hover:bg-red-900/40">
                  <XCircle className="h-4 w-4" />
                  Close
                </button>
              </>
            )}
            {editing && (
              <>
                <button onClick={handleUpdate} disabled={submitting} className="btn-primary">
                  <Check className="h-4 w-4" />
                  Save
                </button>
                <button onClick={() => setEditing(false)} className="btn-secondary">
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {actionError && (
        <div className="mb-4 rounded-lg border border-red-800/50 bg-red-900/20 px-4 py-3 text-sm text-red-400">
          {actionError}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <h3 className="mb-3 font-semibold">Description</h3>
            {editing ? (
              <textarea
                value={editBody}
                onChange={(e) => setEditBody(e.target.value)}
                rows={10}
                className="w-full rounded-lg border border-github-border bg-github-bg px-4 py-2.5 text-sm outline-none focus:border-github-link"
              />
            ) : issue.body ? (
              <div className="whitespace-pre-wrap text-sm text-gray-300">{issue.body}</div>
            ) : (
              <p className="text-sm text-github-muted">No description provided.</p>
            )}
          </div>

          <div className="card">
            <h3 className="mb-4 flex items-center gap-2 font-semibold">
              <MessageSquare className="h-4 w-4" />
              Comments ({comments.length})
            </h3>

            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="border-b border-github-border pb-4 last:border-0 last:pb-0">
                  <div className="flex items-start gap-3">
                    <img src={comment.author.avatarUrl} alt={comment.author.login} className="h-8 w-8 rounded-full" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{comment.author.login}</span>
                        <span className="text-xs text-github-muted">
                          {formatRelativeDate(comment.createdAt)}
                        </span>
                      </div>
                      <p className="mt-2 whitespace-pre-wrap text-sm text-gray-300">{comment.body}</p>
                    </div>
                  </div>
                </div>
              ))}

              {comments.length === 0 && (
                <p className="text-sm text-github-muted">No comments yet.</p>
              )}
            </div>

            {issue.state === 'open' && (
              <form onSubmit={handleComment} className="mt-4 border-t border-github-border pt-4">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Leave a comment..."
                  rows={3}
                  className="w-full rounded-lg border border-github-border bg-github-bg px-4 py-2.5 text-sm outline-none focus:border-github-link"
                />
                <button
                  type="submit"
                  disabled={submitting || !newComment.trim()}
                  className="btn-primary mt-2"
                >
                  Comment
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="card text-sm">
            <h3 className="mb-3 font-semibold">Details</h3>
            <dl className="space-y-2 text-github-muted">
              <div className="flex justify-between">
                <dt>Created</dt>
                <dd className="text-gray-300">{formatDate(issue.createdAt)}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Updated</dt>
                <dd className="text-gray-300">{formatDate(issue.updatedAt)}</dd>
              </div>
              {issue.closedAt && (
                <div className="flex justify-between">
                  <dt>Closed</dt>
                  <dd className="text-gray-300">{formatDate(issue.closedAt)}</dd>
                </div>
              )}
            </dl>
          </div>

          {editing && labels.length > 0 && (
            <div className="card">
              <h3 className="mb-3 text-sm font-semibold">Labels</h3>
              <div className="flex flex-wrap gap-2">
                {labels.map((label) => (
                  <button
                    key={label.name}
                    type="button"
                    onClick={() => toggleEditLabel(label.name)}
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      editLabels.includes(label.name) ? 'ring-2 ring-white/30' : 'opacity-60'
                    }`}
                    style={{
                      backgroundColor: `#${label.color}33`,
                      color: `#${label.color}`,
                    }}
                  >
                    {label.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {editing && collaborators.length > 0 && (
            <div className="card">
              <h3 className="mb-3 text-sm font-semibold">Assignees</h3>
              <div className="flex flex-wrap gap-2">
                {collaborators.map((user) => (
                  <button
                    key={user.login}
                    type="button"
                    onClick={() => toggleEditAssignee(user.login)}
                    className={`flex items-center gap-1.5 rounded-lg border px-2 py-1 text-xs ${
                      editAssignees.includes(user.login)
                        ? 'border-github-link bg-github-hover'
                        : 'border-github-border opacity-60'
                    }`}
                  >
                    <img src={user.avatarUrl} alt={user.login} className="h-4 w-4 rounded-full" />
                    {user.login}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
