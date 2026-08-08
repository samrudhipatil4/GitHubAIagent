import { GitBranch, Shield, Trash2 } from 'lucide-react';

export default function BranchCard({ branch, onDelete, isDefault }) {
  const shortSha = branch.sha.slice(0, 7);

  return (
    <div className="card flex items-center justify-between gap-4">
      <div className="flex min-w-0 items-center gap-3">
        <GitBranch className="h-5 w-5 shrink-0 text-github-link" />
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono font-medium text-white">{branch.name}</span>
            {isDefault && (
              <span className="rounded-full bg-github-hover px-2 py-0.5 text-xs text-github-muted">default</span>
            )}
            {branch.protected && (
              <span className="flex items-center gap-1 rounded-full bg-yellow-900/30 px-2 py-0.5 text-xs text-yellow-400">
                <Shield className="h-3 w-3" />
                protected
              </span>
            )}
          </div>
          <p className="mt-1 font-mono text-xs text-github-muted">{shortSha}</p>
        </div>
      </div>
      {!branch.protected && !isDefault && onDelete && (
        <button
          onClick={() => onDelete(branch.name)}
          className="rounded-lg p-2 text-github-muted transition-colors hover:bg-red-900/20 hover:text-red-400"
          title="Delete branch"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
