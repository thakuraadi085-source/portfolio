import { useState } from 'react';
import { site } from '../data/site';

/** Shows /profile.jpg with a red duotone treatment; falls back to an illustrative silhouette. */
export function Photo() {
  const [failed, setFailed] = useState(false);
  return (
    <figure className="photo">
      <div className="photo-frame">
        {failed ? (
          <svg viewBox="0 0 200 240" role="img" aria-label="Placeholder portrait — add public/profile.jpg" className="photo-fallback">
            <defs>
              <linearGradient id="pg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#ff2a2a" /><stop offset="1" stopColor="#5a0a0a" />
              </linearGradient>
            </defs>
            <rect width="200" height="240" fill="url(#pg)" />
            <circle cx="100" cy="90" r="40" fill="#0a0a0a" />
            <path d="M20 240c0-55 35-80 80-80s80 25 80 80z" fill="#0a0a0a" />
          </svg>
        ) : (
          <img src={site.photo} alt={`Portrait of ${site.name}`} onError={() => setFailed(true)} loading="eager" />
        )}
        <span className="corner tl" /><span className="corner tr" /><span className="corner bl" /><span className="corner br" />
      </div>
      <figcaption className="photo-cap">
        <span className="dot" /> {failed ? 'ADD public/profile.jpg' : 'BUILD MODE · ACTIVE'}
      </figcaption>
    </figure>
  );
}
