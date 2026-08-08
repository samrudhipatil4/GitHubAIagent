import { useState } from 'react';
import { ChevronDown, ChevronRight, AlertTriangle } from 'lucide-react';
import {
  severityColors,
  typeColors,
  typeLabels,
  getScoreColor,
  getScoreLabel,
  getRecommendationStyle,
} from '../utils/reviewUtils';

function FileReview({ file }) {
  const [expanded, setExpanded] = useState(file.issues.length > 0);

  return (
    <div className="card">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between text-left"
      >
        <div className="flex items-center gap-2">
          {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          <span className="font-mono text-sm text-gray-300">{file.filename}</span>
        </div>
        <span className={`rounded-full px-2 py-0.5 text-xs ${file.issues.length > 0 ? 'bg-red-900/30 text-red-300' : 'bg-green-900/30 text-green-300'}`}>
          {file.issues.length} issues
        </span>
      </button>

      {expanded && file.issues.length > 0 && (
        <div className="mt-4 space-y-3 border-t border-github-border pt-4">
          {file.issues.map((issue, i) => (
            <div key={i} className={`rounded-lg border p-3 ${severityColors[issue.severity]}`}>
              <div className="flex flex-wrap items-center gap-2">
                <AlertTriangle className="h-3.5 w-3.5" />
                <span className={`text-xs font-medium capitalize ${typeColors[issue.type]}`}>
                  {typeLabels[issue.type] || issue.type}
                </span>
                <span className="text-xs capitalize opacity-70">{issue.severity}</span>
                {issue.line && (
                  <span className="font-mono text-xs opacity-70">Line {issue.line}</span>
                )}
              </div>
              <p className="mt-2 text-sm">{issue.message}</p>
              {issue.suggestion && (
                <p className="mt-2 text-xs opacity-80">
                  <span className="font-medium">Suggestion:</span> {issue.suggestion}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {expanded && file.issues.length === 0 && (
        <p className="mt-3 border-t border-github-border pt-3 text-sm text-green-400">
          No issues found in this file.
        </p>
      )}
    </div>
  );
}

export default function ReviewResult({ review }) {
  if (!review) return null;

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-github-muted">
              PR #{review.pullRequest.number}: {review.pullRequest.title}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-gray-300">{review.summary}</p>
          </div>
          <div className="text-center">
            <p className={`text-5xl font-bold ${getScoreColor(review.overallScore)}`}>
              {review.overallScore}
            </p>
            <p className="mt-1 text-sm text-github-muted">{getScoreLabel(review.overallScore)}</p>
            <span className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-medium capitalize ${getRecommendationStyle(review.recommendation)}`}>
              {review.recommendation?.replace('_', ' ')}
            </span>
          </div>
        </div>
        <p className="mt-4 text-xs text-github-muted">
          Analyzed {review.filesAnalyzed} of {review.totalFiles} files ·{' '}
          {new Date(review.reviewedAt).toLocaleString()}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Bugs', value: review.categories.bugs, color: 'text-red-400' },
          { label: 'Security', value: review.categories.security, color: 'text-orange-400' },
          { label: 'Performance', value: review.categories.performance, color: 'text-yellow-400' },
          { label: 'Code Quality', value: review.categories.codeQuality, color: 'text-github-link' },
        ].map(({ label, value, color }) => (
          <div key={label} className="card text-center">
            <p className="text-sm text-github-muted">{label}</p>
            <p className={`mt-2 text-3xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      <div>
        <h3 className="mb-4 font-semibold">File Analysis</h3>
        <div className="space-y-3">
          {review.files.map((file) => (
            <FileReview key={file.filename} file={file} />
          ))}
        </div>
      </div>
    </div>
  );
}
