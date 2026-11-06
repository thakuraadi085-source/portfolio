import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../hooks/hooks';

interface P { x: number; y: number; vx: number; vy: number; life: number; c: string; r: number }
const COLORS = ['#ff2a2a', '#3aa0ff', '#ffd23a', '#38e8a8', '#ffffff'];

/** Decorative particle trail. Pointer-events none; the real cursor is untouched. */
export function CursorTrail() {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || window.matchMedia('(pointer: coarse)').matches) return;
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    let raf = 0;
    const ps: P[] = [];
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    const onMove = (e: PointerEvent) => {
      for (let i = 0; i < 2; i++) {
        ps.push({
          x: e.clientX, y: e.clientY,
          vx: (Math.random() - 0.5) * 1.6, vy: (Math.random() - 0.5) * 1.6 + 0.3,
          life: 1, c: COLORS[Math.floor(Math.random() * COLORS.length)], r: 1.5 + Math.random() * 2,
        });
      }
      if (ps.length > 140) ps.splice(0, ps.length - 140);
    };
    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = ps.length - 1; i >= 0; i--) {
        const p = ps[i];
        p.x += p.vx; p.y += p.vy; p.life -= 0.025;
        if (p.life <= 0) { ps.splice(i, 1); continue; }
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.c;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y - p.r * 1.4);
        ctx.lineTo(p.x + p.r * 1.2, p.y + p.r);
        ctx.lineTo(p.x - p.r * 1.2, p.y + p.r);
        ctx.closePath(); ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(loop);
    };
    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onMove, { passive: true });
    loop();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
    };
  }, [reduced]);

  return <canvas ref={ref} className="trail" aria-hidden="true" />;
}
