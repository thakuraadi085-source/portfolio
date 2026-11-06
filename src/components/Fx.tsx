import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { site } from '../data/site';
import { runAgentBuild } from './agentBuild';

const PALETTE = ['#ff2a2a', '#3aa0ff', '#ffd23a', '#38e8a8', '#b583ff', '#ff8a3a'];
const Arrow = ({ c }: { c: string }) => (
  <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M1 1l5 14 2.2-5.8L14 7z" fill={c} stroke="#000" strokeOpacity=".5" /></svg>
);

/** Intro: coloured cursors swirl around the monogram, then converge and fade (as in the reference recording). */
export function Preloader() {
  const [gone, setGone] = useState(false);
  const [out, setOut] = useState(false);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setGone(true); return; }
    const a = setTimeout(() => setOut(true), 2100), b = setTimeout(() => setGone(true), 2700);
    return () => { clearTimeout(a); clearTimeout(b); };
  }, []);
  if (gone) return null;
  return (
    <div className={out ? 'pre out' : 'pre'} aria-hidden="true">
      <div className="pre-tile">AR</div>
      {Array.from({ length: 14 }).map((_, i) => (
        <span key={i} className="pre-c" style={{ '--a': `${i * 25.7}deg`, '--d': `${i * 35}ms` } as CSSProperties}><Arrow c={PALETTE[i % PALETTE.length]} /></span>
      ))}
    </div>
  );
}

const GHOSTS = [{ n: 'design.lead', c: '#3aa0ff', d: 31 }, { n: 'ai.agent', c: '#38e8a8', d: 37 }, { n: 'reviewer', c: '#ffd23a', d: 43 }];

/** Decorative multiplayer-style cursors with name tags. */
export function GhostCursors() {
  return (
    <div className="ghosts" aria-hidden="true">
      {GHOSTS.map((g, i) => (
        <div key={g.n} className="gcur" style={{ '--c': g.c, animationDuration: `${g.d}s`, animationDelay: `-${i * 11}s` } as CSSProperties}>
          <Arrow c={g.c} /><span>{g.n}</span>
        </div>
      ))}
    </div>
  );
}

/** Design-tool style selection box (handles + W × H tag) shown over hovered elements. */
export function SelectionBox() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(pointer: coarse)').matches) return;
    const SEL = '.btn, .card, .stack-card, .lab-item, .learn, .menu a, .tab, .hero-card, .photo-frame, .build-grid li';
    const hide = () => { el.style.opacity = '0'; };
    const over = (e: PointerEvent) => {
      const t = (e.target as HTMLElement).closest?.(SEL) as HTMLElement | null;
      if (!t) return hide();
      const r = t.getBoundingClientRect();
      el.style.opacity = '1';
      el.style.transform = `translate(${r.left}px,${r.top}px)`;
      el.style.width = `${r.width}px`;
      el.style.height = `${r.height}px`;
      el.dataset.size = `${Math.round(r.width)} × ${Math.round(r.height)}`;
    };
    window.addEventListener('pointerover', over, { passive: true });
    window.addEventListener('scroll', hide, { passive: true });
    return () => { window.removeEventListener('pointerover', over); window.removeEventListener('scroll', hide); };
  }, []);
  return <div ref={ref} className="selbox" aria-hidden="true"><i /><i /><i /><i /></div>;
}

/** Rotating capability card in the hero (right column). */
export function HeroCard() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % site.heroCards.length), 3400);
    return () => clearInterval(t);
  }, []);
  const c = site.heroCards[i];
  return (
    <div className="hero-card" key={i}>
      <span className="mono hc-n">{String(i + 1).padStart(2, '0')} <em>/ {String(site.heroCards.length).padStart(2, '0')}</em></span>
      <h4>{c.title}</h4>
      <p>{c.text}</p>
      <div className="chips">{c.tags.map((t) => <span key={t} className="chip">{t}</span>)}</div>
    </div>
  );
}

/** 12 AI-agent cursors build the page live, then converge when done. */
export function AgentBuild() {
  useEffect(() => runAgentBuild(2300), []);
  return null;
}
