import { Link } from 'react-router-dom';
import { GitCommitHorizontal } from 'lucide-react';
import { formatRelativeDate } from '../utils/repoUtils';

export default function CommitCard({ commit, owner, repo }) {
  const shortSha = commit.sha.slice(0, 7);
  const firstLine = commit.message.split('\n')[0];

  return (
    <Link
      to={`/commits/${owner}/${repo}/${commit.sha}`}
      className="card block transition-colors hover:border-github-link/40 hover:bg-github-hover/30"
    >
      <div className="flex items-start gap-3">
        <GitCommitHorizontal className="mt-0.5 h-5 w-5 shrink-0 text-github-muted" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <code className="rounded bg-github-hover px-2 py-0.5 text-xs text-github-link">{shortSha}</code>
            <h3 className="truncate font-medium text-white">{firstLine}</h3>
          </div>
          <p className="mt-2 text-sm text-github-muted">
            {commit.author.login || commit.author.name} committed {formatRelativeDate(commit.author.date)}
          </p>
        </div>
        {commit.author.avatarUrl && (
          <img src={commit.author.avatarUrl} alt="" className="h-8 w-8 rounded-full" />
        )}
      </div>
    </Link>
  );
}
