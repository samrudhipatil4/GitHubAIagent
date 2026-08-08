export function getIssueStatus(issue) {
  if (issue.state === 'open') {
    return { label: 'Open', className: 'bg-green-900/40 text-green-300' };
  }
  return { label: 'Closed', className: 'bg-red-900/40 text-red-300' };
}
