import { getLanguageColor } from '../utils/repoUtils';

export default function LanguageChart({ languages = [] }) {
  if (languages.length === 0) {
    return <p className="text-sm text-github-muted">No language data available.</p>;
  }

  return (
    <>
      <div className="mb-4 flex h-3 overflow-hidden rounded-full">
        {languages.map((lang) => (
          <div
            key={lang.name}
            style={{
              width: `${lang.percentage}%`,
              backgroundColor: getLanguageColor(lang.name),
            }}
            title={`${lang.name} ${lang.percentage}%`}
          />
        ))}
      </div>
      <div className="space-y-2">
        {languages.map((lang) => (
          <div key={lang.name} className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2">
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: getLanguageColor(lang.name) }}
              />
              {lang.name}
            </span>
            <span className="text-github-muted">{lang.percentage}%</span>
          </div>
        ))}
      </div>
    </>
  );
}
