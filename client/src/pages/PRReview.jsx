import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ScanSearch, RefreshCw } from 'lucide-react';
import { api } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ReviewResult from '../components/ReviewResult';

export default function PRReview() {
  const { owner, repo, number } = useParams();
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const runReview = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.reviewPullRequest(owner, repo, number);
      setReview(data.review);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [owner, repo, number]);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await api.getPullRequestReview(owner, repo, number);
        setReview(data.review);
      } catch {
        await runReview();
        return;
      }
      setLoading(false);
    };
    init();
  }, [owner, repo, number, runReview]);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            to={`/pull-requests/${owner}/${repo}/${number}`}
            className="mb-2 inline-flex items-center gap-2 text-sm text-github-link hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to PR #{number}
          </Link>
          <h2 className="text-2xl font-bold text-white">AI Code Review</h2>
          <p className="mt-1 text-sm text-github-muted">
            {owner}/{repo} · PR #{number}
          </p>
        </div>
        <button onClick={runReview} disabled={loading} className="btn-primary">
          {loading ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <ScanSearch className="h-4 w-4" />
          )}
          {loading ? 'Analyzing...' : 'Re-run Review'}
        </button>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-sm text-github-muted">
            AI is analyzing changed files... This may take a minute.
          </p>
        </div>
      )}

      {error && !loading && (
        <div className="rounded-lg border border-red-800/50 bg-red-900/20 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {!loading && review && <ReviewResult review={review} />}
    </div>
  );
}
