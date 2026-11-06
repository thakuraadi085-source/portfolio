import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../hooks/hooks';

interface Node { x: number; y: number; vx: number; vy: number }

/** Lightweight canvas neural-network backdrop (no WebGL needed → works everywhere). */
export function Backdrop() {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    let w = 0, h = 0, raf = 0, nodes: Node[] = [];
    const mouse = { x: -999, y: -999 };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = `${w}px`; canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(70, (w * h) / 22000));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25,
      }));
    };

    const draw = (animate: boolean) => {
      ctx.clearRect(0, 0, w, h);
      for (const n of nodes) {
        if (animate) {
          n.x += n.vx; n.y += n.vy;
          if (n.x < 0 || n.x > w) n.vx *= -1;
          if (n.y < 0 || n.y > h) n.vy *= -1;
        }
      }
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 130) {
            ctx.strokeStyle = `rgba(255,42,42,${(1 - d / 130) * 0.16})`;
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
        const m = Math.hypot(a.x - mouse.x, a.y - mouse.y);
        if (m < 160) {
          ctx.strokeStyle = `rgba(80,160,255,${(1 - m / 160) * 0.4})`;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
        }
        ctx.fillStyle = 'rgba(255,255,255,0.55)';
        ctx.fillRect(a.x - 1, a.y - 1, 2, 2);
      }
    };

    const loop = () => { draw(true); raf = requestAnimationFrame(loop); };
    const onMove = (e: PointerEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    const onVis = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden && !reduced) loop();
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('visibilitychange', onVis);
    if (reduced) draw(false); else loop();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [reduced]);

  return <canvas ref={ref} className="backdrop" aria-hidden="true" />;
}
