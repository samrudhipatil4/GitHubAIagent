export default function PlaceholderPage({ title, description, children }) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <p className="mt-1 text-sm text-github-muted">{description}</p>
      </div>
      {children || (
        <div className="card flex flex-col items-center justify-center py-16 text-center">
          <p className="text-github-muted">
            This feature will be implemented in a future phase.
          </p>
        </div>
      )}
    </div>
  );
}
