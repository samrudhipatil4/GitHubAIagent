import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Play,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Loader2,
  Sparkles,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { api } from '../services/api';
import PageHeader from '../components/PageHeader';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatRelativeDate } from '../utils/repoUtils';

function RunStatusBadge({ conclusion, status }) {
  if (conclusion === 'success') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-green-900/40 px-2 py-0.5 text-xs text-green-400">
        <CheckCircle2 className="h-3 w-3" /> Success
      </span>
    );
  }
  if (conclusion === 'failure') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-900/40 px-2 py-0.5 text-xs text-red-400">
        <AlertTriangle className="h-3 w-3" /> Failed
      </span>
    );
  }
  return (
    <span className="rounded-full bg-github-hover px-2 py-0.5 text-xs text-github-muted capitalize">
      {status || 'pending'}
    </span>
  );
}

export default function Actions() {
  const [repos, setRepos] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState('');
  const [runs, setRuns] = useState([]);
  const [deployment, setDeployment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [runsLoading, setRunsLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [explanation, setExplanation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const { data } = await api.getRepositories();
        setRepos(data.repositories);
        if (data.repositories.length > 0) {
          setSelectedRepo(data.repositories[0].fullName);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRepos();
  }, []);

  useEffect(() => {
    if (!selectedRepo) return;

    const [owner, repo] = selectedRepo.split('/');
    const fetchRuns = async () => {
      setRunsLoading(true);
      setExplanation(null);
      try {
        const [runsRes, deployRes] = await Promise.all([
          api.getWorkflowRuns(owner, repo),
          api.getLatestDeployment(owner, repo).catch(() => ({ data: { deployment: null } })),
        ]);
        setRuns(runsRes.data.runs || []);
        setDeployment(deployRes.data.deployment);
      } catch (err) {
        setError(err.message);
      } finally {
        setRunsLoading(false);
      }
    };
    fetchRuns();
  }, [selectedRepo]);

  const handleRerun = async (runId) => {
    const [owner, repo] = selectedRepo.split('/');
    setActionLoading(runId);
    try {
      await api.rerunWorkflow(owner, repo, runId);
      const { data } = await api.getWorkflowRuns(owner, repo);
      setRuns(data.runs || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleExplain = async (runId) => {
    const [owner, repo] = selectedRepo.split('/');
    setActionLoading(`explain-${runId}`);
    try {
      const { data } = await api.explainWorkflowFailure(owner, repo, runId);
      setExplanation(data.explanation);
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(null);
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
      <PageHeader
        title="GitHub Actions"
        description="Monitor workflow runs, diagnose failures, and retry deployments."
      />

      {error && (
        <div className="mb-4 rounded-lg border border-red-800/50 bg-red-900/20 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="card mb-6">
        <label className="mb-2 block text-sm font-medium">Repository</label>
        <select
          value={selectedRepo}
          onChange={(e) => setSelectedRepo(e.target.value)}
          className="w-full rounded-lg border border-github-border bg-github-bg px-3 py-2 text-sm text-white focus:border-github-accent focus:outline-none"
        >
          {repos.map((r) => (
            <option key={r.id} value={r.fullName}>
              {r.fullName}
            </option>
          ))}
        </select>
      </div>

      {deployment && (
        <div className="card mb-6 border-green-900/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-github-muted">Latest Successful Deployment</p>
              <p className="mt-1 font-medium">{deployment.name}</p>
              <p className="text-xs text-github-muted">
                {deployment.branch} · {formatRelativeDate(deployment.createdAt)}
              </p>
            </div>
            <a href={deployment.htmlUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary">
              <ExternalLink className="h-4 w-4" /> View
            </a>
          </div>
        </div>
      )}

      <div className="card">
        <h3 className="mb-4 font-semibold">Workflow Runs</h3>
        {runsLoading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : runs.length > 0 ? (
          <div className="space-y-3">
            {runs.map((run) => (
              <div
                key={run.id}
                className="flex flex-col gap-3 rounded-lg border border-github-border p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Play className="h-4 w-4 text-github-muted" />
                    <span className="font-medium">{run.name}</span>
                    <RunStatusBadge conclusion={run.conclusion} status={run.status} />
                  </div>
                  <p className="mt-1 text-xs text-github-muted">
                    #{run.runNumber} · {run.branch} · {run.event} · {formatRelativeDate(run.createdAt)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {run.conclusion === 'failure' && (
                    <button
                      onClick={() => handleExplain(run.id)}
                      disabled={actionLoading === `explain-${run.id}`}
                      className="btn-secondary text-xs"
                    >
                      {actionLoading === `explain-${run.id}` ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Sparkles className="h-3.5 w-3.5" />
                      )}
                      Explain
                    </button>
                  )}
                  {(run.conclusion === 'failure' || run.conclusion === 'cancelled') && (
                    <button
                      onClick={() => handleRerun(run.id)}
                      disabled={actionLoading === run.id}
                      className="btn-secondary text-xs"
                    >
                      {actionLoading === run.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <RefreshCw className="h-3.5 w-3.5" />
                      )}
                      Retry
                    </button>
                  )}
                  <a href={run.htmlUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary text-xs">
                    <ExternalLink className="h-3.5 w-3.5" /> GitHub
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-github-muted">No workflow runs found for this repository.</p>
        )}
      </div>

      {explanation && (
        <div className="card mt-6">
          <h3 className="mb-3 flex items-center gap-2 font-semibold">
            <Sparkles className="h-4 w-4 text-yellow-400" />
            AI Failure Analysis
          </h3>
          <div className="prose prose-invert prose-sm max-w-none">
            <ReactMarkdown>{explanation}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}
