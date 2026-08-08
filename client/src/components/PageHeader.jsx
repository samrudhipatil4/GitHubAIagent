export default function PageHeader({ title, description }) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-white">{title}</h2>
      {description && <p className="mt-1 text-sm text-github-muted">{description}</p>}
    </div>
  );
}
