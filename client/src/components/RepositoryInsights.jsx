import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  Sparkles,
  BookOpen,
  FolderTree,
  Package,
  Container,
  Loader2,
  Copy,
  Check,
} from 'lucide-react';
import { api } from '../services/api';
import LanguageChart from './LanguageChart';
import ActivityChart from './ActivityChart';

function InsightActionButton({ icon: Icon, label, onClick, loading, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      className="btn-secondary flex items-center gap-2 text-sm disabled:opacity-50"
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Icon className="h-4 w-4" />}
      {label}
    </button>
  );
}

function MarkdownResult({ title, content, onClose }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!content) return null;

  return (
    <div className="card mt-4">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="font-semibold">{title}</h4>
        <div className="flex gap-2">
          <button onClick={handleCopy} className="btn-secondary text-xs">
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
          {onClose && (
            <button onClick={onClose} className="text-xs text-github-muted hover:text-white">
              Dismiss
            </button>
          )}
        </div>
      </div>
      <div className="prose prose-invert prose-sm max-w-none">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
}

export default function RepositoryInsights({ owner, repo, insights, onRefresh }) {
  const [actionLoading, setActionLoading] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [explainResult, setExplainResult] = useState(null);
  const [readmeResult, setReadmeResult] = useState(null);
  const [structureResult, setStructureResult] = useState(null);
  const [packageResult, setPackageResult] = useState(null);
  const [dockerResult, setDockerResult] = useState(null);

  const runAction = async (key, apiCall, setter, field = 'explanation') => {
    setActionLoading(key);
    setActionError(null);
    try {
      const { data } = await apiCall();
      setter(data[field] || data.readme || data.explanation);
    } catch (err) {
      setActionError(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const { summary, languages, contributors, activity, issuePRStats } = insights;

  return (
    <div>
      <div className="card mb-6">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h3 className="flex items-center gap-2 font-semibold">
              <Sparkles className="h-4 w-4 text-yellow-400" />
              AI Summary
            </h3>
            <p className="mt-2 text-sm text-gray-300">{summary}</p>
          </div>
          <button onClick={onRefresh} className="btn-secondary shrink-0 text-xs">
            Refresh
          </button>
        </div>

        <div className="flex flex-wrap gap-2 border-t border-github-border pt-4">
          <InsightActionButton
            icon={BookOpen}
            label="Explain Repository"
            loading={actionLoading === 'explain'}
            onClick={() => runAction('explain', () => api.explainRepository(owner, repo), setExplainResult)}
          />
          <InsightActionButton
            icon={Sparkles}
            label="Generate README"
            loading={actionLoading === 'readme'}
            onClick={() => runAction('readme', () => api.generateReadme(owner, repo), setReadmeResult, 'readme')}
          />
          <InsightActionButton
            icon={FolderTree}
            label="Explain Structure"
            loading={actionLoading === 'structure'}
            onClick={() => runAction('structure', () => api.explainStructure(owner, repo), setStructureResult)}
          />
          <InsightActionButton
            icon={Package}
            label="Explain package.json"
            loading={actionLoading === 'package'}
            onClick={() => runAction('package', () => api.explainPackageJson(owner, repo), setPackageResult)}
          />
          <InsightActionButton
            icon={Container}
            label="Explain Dockerfile"
            loading={actionLoading === 'docker'}
            onClick={() => runAction('docker', () => api.explainDockerfile(owner, repo), setDockerResult)}
          />
        </div>

        {actionError && (
          <div className="mt-3 rounded-lg border border-red-800/50 bg-red-900/20 px-3 py-2 text-sm text-red-400">
            {actionError}
          </div>
        )}
      </div>

      <MarkdownResult title="Repository Explanation" content={explainResult} onClose={() => setExplainResult(null)} />
      <MarkdownResult title="Generated README" content={readmeResult} onClose={() => setReadmeResult(null)} />
      <MarkdownResult title="Folder Structure" content={structureResult} onClose={() => setStructureResult(null)} />
      <MarkdownResult title="package.json Analysis" content={packageResult} onClose={() => setPackageResult(null)} />
      <MarkdownResult title="Dockerfile Analysis" content={dockerResult} onClose={() => setDockerResult(null)} />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card">
          <h3 className="mb-4 font-semibold">Languages</h3>
          <LanguageChart languages={languages} />
        </div>

        <div className="card">
          <h3 className="mb-4 font-semibold">Issue & PR Stats</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-github-hover p-4 text-center">
              <p className="text-2xl font-bold text-green-400">{issuePRStats?.issues?.open ?? 0}</p>
              <p className="text-xs text-github-muted">Open Issues</p>
            </div>
            <div className="rounded-lg bg-github-hover p-4 text-center">
              <p className="text-2xl font-bold text-gray-400">{issuePRStats?.issues?.closed ?? 0}</p>
              <p className="text-xs text-github-muted">Closed Issues</p>
            </div>
            <div className="rounded-lg bg-github-hover p-4 text-center">
              <p className="text-2xl font-bold text-purple-400">{issuePRStats?.pullRequests?.open ?? 0}</p>
              <p className="text-xs text-github-muted">Open PRs</p>
            </div>
            <div className="rounded-lg bg-github-hover p-4 text-center">
              <p className="text-2xl font-bold text-gray-400">{issuePRStats?.pullRequests?.closed ?? 0}</p>
              <p className="text-xs text-github-muted">Closed PRs</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="card">
          <h3 className="mb-4 font-semibold">Commit Activity</h3>
          <ActivityChart activity={activity} />
        </div>

        <div className="card">
          <h3 className="mb-4 font-semibold">Top Contributors</h3>
          {contributors?.length > 0 ? (
            <div className="space-y-3">
              {contributors.slice(0, 8).map((contributor) => (
                <a
                  key={contributor.id}
                  href={contributor.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-github-hover"
                >
                  <img
                    src={contributor.avatarUrl}
                    alt={contributor.login}
                    className="h-8 w-8 rounded-full"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{contributor.login}</p>
                    <p className="text-xs text-github-muted">
                      {contributor.contributions} contributions
                    </p>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <p className="text-sm text-github-muted">No contributors found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
