export default function ActivityChart({ activity = [] }) {
  if (activity.length === 0) {
    return <p className="text-sm text-github-muted">No commit activity data available.</p>;
  }

  const recentWeeks = activity.slice(-26);
  const maxTotal = Math.max(...recentWeeks.map((w) => w.total), 1);

  return (
    <div>
      <div className="flex h-32 items-end gap-1">
        {recentWeeks.map((week, i) => {
          const height = Math.max((week.total / maxTotal) * 100, week.total > 0 ? 4 : 0);
          const date = new Date(week.week * 1000);
          return (
            <div
              key={i}
              className="group relative flex-1"
              title={`${date.toLocaleDateString()}: ${week.total} commits`}
            >
              <div
                className="w-full rounded-t bg-github-accent transition-colors group-hover:bg-blue-400"
                style={{ height: `${height}%` }}
              />
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex justify-between text-xs text-github-muted">
        <span>{new Date(recentWeeks[0].week * 1000).toLocaleDateString(undefined, { month: 'short', year: '2-digit' })}</span>
        <span>{new Date(recentWeeks[recentWeeks.length - 1].week * 1000).toLocaleDateString(undefined, { month: 'short', year: '2-digit' })}</span>
      </div>
      <p className="mt-2 text-xs text-github-muted">
        {recentWeeks.reduce((sum, w) => sum + w.total, 0)} commits in the last 26 weeks
      </p>
    </div>
  );
}
