import { Link } from 'react-router-dom';
import { GitPullRequest, MessageSquare } from 'lucide-react';
import { formatRelativeDate } from '../utils/repoUtils';
import { getPRStatus } from '../utils/prUtils';

export default function PRCard({ pullRequest, owner, repo }) {
  const status = getPRStatus(pullRequest);

  return (
    <Link
      to={`/pull-requests/${owner}/${repo}/${pullRequest.number}`}
      className="card block transition-colors hover:border-github-link/40 hover:bg-github-hover/30"
    >
      <div className="flex items-start gap-3">
        <GitPullRequest className="mt-0.5 h-5 w-5 shrink-0 text-github-muted" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-github-muted">#{pullRequest.number}</span>
            <h3 className="truncate font-semibold text-white">{pullRequest.title}</h3>
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${status.className}`}>
              {status.label}
            </span>
          </div>

          <p className="mt-2 text-sm text-github-muted">
            opened {formatRelativeDate(pullRequest.createdAt)} by{' '}
            <span className="text-gray-300">{pullRequest.author.login}</span>
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

          <div className="mt-3 flex items-center gap-4 text-xs text-github-muted">
            <span className="flex items-center gap-1">
              <MessageSquare className="h-3.5 w-3.5" />
              {pullRequest.comments ?? 0} comments
            </span>
            <span>
              {pullRequest.head.ref} → {pullRequest.base.ref}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
