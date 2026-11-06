import type { Project } from '../types';

/** Clearly-illustrative generated visual (NOT a real screenshot). */
export function ProjectVisual({ project, large = false }: { project: Project; large?: boolean }) {
  const h = project.hue;
  const id = `g-${project.slug}`;
  return (
    <div className={`pv ${large ? 'pv-lg' : ''}`}>
      <svg viewBox="0 0 400 220" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={`hsl(${h} 85% 52%)`} stopOpacity="0.9" />
            <stop offset="1" stopColor={`hsl(${(h + 50) % 360} 70% 12%)`} />
          </linearGradient>
        </defs>
        <rect width="400" height="220" fill={`url(#${id})`} />
        {Array.from({ length: 9 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 50} y1="0" x2={i * 50} y2="220" stroke="#fff" strokeOpacity="0.07" />
        ))}
        {Array.from({ length: 5 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 55} x2="400" y2={i * 55} stroke="#fff" strokeOpacity="0.07" />
        ))}
        <circle cx="300" cy="70" r="70" fill="none" stroke="#fff" strokeOpacity="0.25" />
        <circle cx="300" cy="70" r="40" fill="none" stroke="#fff" strokeOpacity="0.2" />
        <rect x="40" y="120" width="140" height="10" fill="#fff" fillOpacity="0.5" />
        <rect x="40" y="140" width="100" height="6" fill="#fff" fillOpacity="0.25" />
        <rect x="40" y="154" width="120" height="6" fill="#fff" fillOpacity="0.25" />
        <text x="40" y="95" fontFamily="Anton, Impact, sans-serif" fontSize="64" fill="#fff" fillOpacity="0.92">{project.index}</text>
      </svg>
      <span className="pv-tag">Illustrative visual</span>
    </div>
  );
}
