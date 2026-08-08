export const severityColors = {
  high: 'bg-red-900/40 text-red-300 border-red-800/50',
  medium: 'bg-yellow-900/40 text-yellow-300 border-yellow-800/50',
  low: 'bg-blue-900/40 text-blue-300 border-blue-800/50',
};

export const typeColors = {
  bug: 'text-red-400',
  security: 'text-orange-400',
  performance: 'text-yellow-400',
  codeQuality: 'text-github-link',
};

export const typeLabels = {
  bug: 'Bug',
  security: 'Security',
  performance: 'Performance',
  codeQuality: 'Code Quality',
};

export const getScoreColor = (score) => {
  if (score >= 90) return 'text-green-400';
  if (score >= 70) return 'text-yellow-400';
  if (score >= 50) return 'text-orange-400';
  return 'text-red-400';
};

export const getScoreLabel = (score) => {
  if (score >= 90) return 'Excellent';
  if (score >= 70) return 'Good';
  if (score >= 50) return 'Needs Work';
  return 'Poor';
};

export const getRecommendationStyle = (rec) => {
  if (rec === 'approve') return 'bg-green-900/40 text-green-300';
  if (rec === 'request_changes') return 'bg-red-900/40 text-red-300';
  return 'bg-yellow-900/40 text-yellow-300';
};
