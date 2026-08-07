import PlaceholderPage from '../components/PlaceholderPage';

export default function CodeReview() {
  return (
    <PlaceholderPage
      title="Code Review"
      description="AI-powered pull request analysis for bugs, security, and quality."
    >
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        {[
          { label: 'Overall Score', value: '—' },
          { label: 'Bugs Found', value: '—' },
          { label: 'Security Issues', value: '—' },
        ].map((item) => (
          <div key={item.label} className="card text-center">
            <p className="text-sm text-github-muted">{item.label}</p>
            <p className="mt-2 text-2xl font-bold">{item.value}</p>
          </div>
        ))}
      </div>
    </PlaceholderPage>
  );
}
