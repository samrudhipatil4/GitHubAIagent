import { Link } from 'react-router-dom';
import { Star, GitFork, Lock, Globe } from 'lucide-react';
import { getLanguageColor, formatRelativeDate } from '../utils/repoUtils';

export default function RepoCard({ repo }) {
  return (
    <Link
      to={`/repositories/${repo.owner.login}/${repo.name}`}
      className="card block transition-colors hover:border-github-link/40 hover:bg-github-hover/30"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-semibold text-github-link">{repo.fullName}</h3>
            {repo.isPrivate ? (
              <Lock className="h-3.5 w-3.5 shrink-0 text-github-muted" />
            ) : (
              <Globe className="h-3.5 w-3.5 shrink-0 text-github-muted" />
            )}
          </div>
          {repo.description && (
            <p className="mt-1 line-clamp-2 text-sm text-github-muted">{repo.description}</p>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-github-muted">
        {repo.language && (
          <span className="flex items-center gap-1.5">
            <span
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: getLanguageColor(repo.language) }}
            />
            {repo.language}
          </span>
        )}
        <span className="flex items-center gap-1">
          <Star className="h-3.5 w-3.5" />
          {repo.stars}
        </span>
        <span className="flex items-center gap-1">
          <GitFork className="h-3.5 w-3.5" />
          {repo.forks}
        </span>
        <span>Updated {formatRelativeDate(repo.updatedAt)}</span>
      </div>
    </Link>
  );
}
