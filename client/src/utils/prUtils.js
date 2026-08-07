export function getPRStatus(pr) {
  if (pr.merged) return { label: 'Merged', className: 'bg-purple-900/40 text-purple-300' };
  if (pr.state === 'open') return { label: pr.draft ? 'Draft' : 'Open', className: 'bg-green-900/40 text-green-300' };
  return { label: 'Closed', className: 'bg-red-900/40 text-red-300' };
}

export function getFileStatusColor(status) {
  const colors = {
    added: 'text-green-400',
    removed: 'text-red-400',
    modified: 'text-yellow-400',
    renamed: 'text-blue-400',
  };
  return colors[status] || 'text-github-muted';
}
