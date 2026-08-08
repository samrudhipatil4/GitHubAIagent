import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { api } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatDate, formatRelativeDate } from '../utils/repoUtils';
import { getIssueStatus } from '../utils/issueUtils';

export default function IssueCreate() {
  const { owner, repo } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [selectedLabels, setSelectedLabels] = useState([]);
  const [selectedAssignees, setSelectedAssignees] = useState([]);
  const [labels, setLabels] = useState([]);
  const [collaborators, setCollaborators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const [labelsRes, collabRes] = await Promise.all([
          api.getIssueLabels(owner, repo),
          api.getIssueCollaborators(owner, repo),
        ]);
        setLabels(labelsRes.data.labels);
        setCollaborators(collabRes.data.collaborators);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMeta();
  }, [owner, repo]);

  const toggleLabel = (name) => {
    setSelectedLabels((prev) =>
      prev.includes(name) ? prev.filter((l) => l !== name) : [...prev, name]
    );
  };

  const toggleAssignee = (login) => {
    setSelectedAssignees((prev) =>
      prev.includes(login) ? prev.filter((a) => a !== login) : [...prev, login]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSubmitting(true);
    setError(null);

    try {
      const { data } = await api.createIssue(owner, repo, {
        title: title.trim(),
        body: body.trim(),
        labels: selectedLabels,
        assignees: selectedAssignees,
      });
      navigate(`/issues/${owner}/${repo}/${data.issue.number}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <Link to="/issues" className="mb-4 inline-flex items-center gap-2 text-sm text-github-link hover:underline">
        <ArrowLeft className="h-4 w-4" />
        Back to issues
      </Link>

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white">New Issue</h2>
        <p className="mt-1 text-sm text-github-muted">
          {owner}/{repo}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Issue title"
              required
              className="w-full rounded-lg border border-github-border bg-github-bg px-4 py-2.5 text-sm outline-none focus:border-github-link"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">Description</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Describe the issue..."
              rows={8}
              className="w-full rounded-lg border border-github-border bg-github-bg px-4 py-2.5 text-sm outline-none focus:border-github-link"
            />
          </div>
        </div>

        {labels.length > 0 && (
          <div className="card">
            <label className="mb-3 block text-sm font-medium">Labels</label>
            <div className="flex flex-wrap gap-2">
              {labels.map((label) => (
                <button
                  key={label.name}
                  type="button"
                  onClick={() => toggleLabel(label.name)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-opacity ${
                    selectedLabels.includes(label.name) ? 'ring-2 ring-white/30' : 'opacity-60 hover:opacity-100'
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

        {collaborators.length > 0 && (
          <div className="card">
            <label className="mb-3 block text-sm font-medium">Assignees</label>
            <div className="flex flex-wrap gap-2">
              {collaborators.map((user) => (
                <button
                  key={user.login}
                  type="button"
                  onClick={() => toggleAssignee(user.login)}
                  className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                    selectedAssignees.includes(user.login)
                      ? 'border-github-link bg-github-hover text-white'
                      : 'border-github-border text-github-muted hover:border-github-muted'
                  }`}
                >
                  <img src={user.avatarUrl} alt={user.login} className="h-5 w-5 rounded-full" />
                  {user.login}
                </button>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-red-800/50 bg-red-900/20 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="flex gap-2">
          <button type="submit" disabled={submitting || !title.trim()} className="btn-primary">
            {submitting ? 'Creating...' : 'Create Issue'}
          </button>
          <Link to="/issues" className="btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
