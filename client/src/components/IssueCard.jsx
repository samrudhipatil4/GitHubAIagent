import { Link } from 'react-router-dom';
import { CircleDot, MessageSquare, User } from 'lucide-react';
import { formatRelativeDate } from '../utils/repoUtils';
import { getIssueStatus } from '../utils/issueUtils';

export default function IssueCard({ issue, owner, repo }) {
  const status = getIssueStatus(issue);

  return (
    <Link
      to={`/issues/${owner}/${repo}/${issue.number}`}
      className="card block transition-colors hover:border-github-link/40 hover:bg-github-hover/30"
    >
      <div className="flex items-start gap-3">
        <CircleDot className={`mt-0.5 h-5 w-5 shrink-0 ${issue.state === 'open' ? 'text-green-400' : 'text-red-400'}`} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-github-muted">#{issue.number}</span>
            <h3 className="truncate font-semibold text-white">{issue.title}</h3>
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${status.className}`}>
              {status.label}
            </span>
          </div>

          <p className="mt-2 text-sm text-github-muted">
            opened {formatRelativeDate(issue.createdAt)} by{' '}
            <span className="text-gray-300">{issue.author?.login}</span>
          </p>

          {issue.labels.length > 0 && (
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

          <div className="mt-3 flex items-center gap-4 text-xs text-github-muted">
            <span className="flex items-center gap-1">
              <MessageSquare className="h-3.5 w-3.5" />
              {issue.comments ?? 0} comments
            </span>
            {issue.assignees?.length > 0 && (
              <span className="flex items-center gap-1">
                <User className="h-3.5 w-3.5" />
                {issue.assignees.map((a) => a.login).join(', ')}
              </span>
            )}
          </div>
        </div>

        {issue.assignees?.length > 0 && (
          <div className="flex -space-x-2">
            {issue.assignees.slice(0, 3).map((assignee) => (
              <img
                key={assignee.login}
                src={assignee.avatarUrl}
                alt={assignee.login}
                title={assignee.login}
                className="h-7 w-7 rounded-full border-2 border-github-surface"
              />
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
