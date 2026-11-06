/**
 * Multi-agent build, one pipeline per block, many cursors working in parallel.
 *   layout  : a cursor drops a grey wireframe block and drags its corner handle to size + position it
 *   write   : a different cursor starts typing the block's real text, character by character
 *   style   : another cursor paints the look over it (grayscale -> real colours)
 *   adjust  : another cursor nudges the finished block and drags it into its exact final position
 * Idle cursors immediately take the next available job on any block of the current screen.
 * The page scrolls to the next screen only after every block of the current screen is complete.
 * The build always runs to the end; if the visitor scrolls, finished blocks stay and unbuilt ones stay hidden.
 */
const COLORS = ['#3aa0ff', '#38e8a8', '#ffd23a', '#ff2a2a', '#b583ff', '#ff8a3a', '#2ee6e6', '#ff5fb7', '#9be84a', '#7aa2ff', '#ffb86b', '#e6e6ff'];
const SEL = '.head, .reveal, .hero-copy, .hero-side, .hero-word, .photo-frame, .stack-card, .learn, .tabs, .panel, .lab-list, .lab-view, .form, .contact-info, .filters, .card, .stats, .timeline';
const STAGES = 4;

const ARROW = (c: string) => `<svg viewBox="0 0 16 16" width="18" height="18"><path d="M1 1l5 14 2.2-5.8L14 7z" fill="${c}" stroke="#000" stroke-opacity=".55"/></svg>`;
const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
const rnd = (a: number, b: number) => a + Math.random() * (b - a);
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const frames = (ms: number, fn: (k: number) => void) => new Promise<void>((res) => {
  const t0 = performance.now();
  const step = (now: number) => { const k = Math.min(1, (now - t0) / ms); fn(k); k < 1 ? requestAnimationFrame(step) : res(); };
  requestAnimationFrame(step);
});

function chipFor(t: HTMLElement): string {
  const c = t.classList;
  if (c.contains('head')) return 'Heading';
  if (c.contains('hero-word')) return 'Display text';
  if (c.contains('photo-frame')) return 'Image';
  if (c.contains('form')) return 'Form';
  if (c.contains('tabs') || c.contains('filters')) return 'Tabs';
  if (c.contains('stats')) return 'Stats';
  if (c.contains('timeline')) return 'Timeline';
  if (c.contains('contact-info')) return 'Links';
  if (/^(P|BLOCKQUOTE|H[1-6])$/.test(t.tagName)) return 'Text';
  if (c.contains('btn')) return 'Button';
  return t.querySelector('h2,h3,h4') ? 'Card' : 'Text';
}

type State = 'new' | 'sizing' | 'sized' | 'writing' | 'written' | 'styling' | 'styled' | 'adjusting' | 'done';
interface Task { t: HTMLElement; idx: number; state: State; last: number; placed: HTMLElement | null }

export function runAgentBuild(startDelay = 2300, replay = false): () => void {
  if (typeof window === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};
  const root = document.documentElement;
  const docTop = (e: HTMLElement) => e.getBoundingClientRect().top + scrollY;

  // ── collect blocks (outermost, split big containers into their children so more cursors can work at once) ──
  const sections = Array.from(document.querySelectorAll<HTMLElement>('main > section'));
  const blocks: HTMLElement[] = [];
  sections.forEach((s) => {
    const all = Array.from(s.querySelectorAll<HTMLElement>(SEL));
    const outer = all.filter((e) => !all.some((o) => o !== e && o.contains(e))).slice(0, 18);
    outer.forEach((e) => {
      const kids = Array.from(e.children).filter((c): c is HTMLElement => c instanceof HTMLElement && c.offsetHeight > 8 && !/^(SCRIPT|STYLE)$/.test(c.tagName));
      if (kids.length >= 3 && e.offsetHeight > 220 && !e.matches('.photo-frame, .form, .tabs, .hero-word')) {
        if (e.classList.contains('reveal')) e.classList.add('in');
        blocks.push(...kids);
      } else blocks.push(e);
    });
  });
  blocks.sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
  if (!blocks.length) return () => {};
  const tasks: Task[] = blocks.map((t, idx) => ({ t, idx, state: 'new', last: -1, placed: null }));
  const N = tasks.length;
  let dead = false, userScrolled = false, steps = 0, wS = 0, wE = 0, finished = false;
  tasks.forEach(({ t }) => { t.classList.remove('ab-done', 'ab-write', 'ab-color'); t.classList.add('ab-pre'); });

  // ── dock ──
  const dock = document.createElement('div'); dock.className = 'ab-dock';
  dock.innerHTML = `<span class="dots">${COLORS.map((c) => `<i style="background:${c}"></i>`).join('')}</span><span class="n">12 agents</span><span class="steps">0 / ${N * STAGES} steps</span><span class="bar"><u></u></span><span class="stat">Scanning page…</span><button type="button" class="rep" disabled>Replay</button>`;
  const q = <T extends HTMLElement>(s: string) => dock.querySelector(s) as T;
  const layer = document.createElement('div'); layer.className = 'ab-layer'; layer.setAttribute('aria-hidden', 'true');
  let scan: HTMLElement | null = null;
  if (replay) {
    scan = document.createElement('div'); scan.className = 'pre'; scan.setAttribute('aria-hidden', 'true'); scan.style.zIndex = '590';
    scan.innerHTML = '<div class="pre-tile">AR</div>' + COLORS.map((c, i) => `<span class="pre-c" style="--a:${i * 30}deg;--d:${i * 35}ms">${ARROW(c)}</span>`).join('');
    document.body.appendChild(scan);
  }
  const agents = COLORS.map((c, id) => {
    const el = document.createElement('div'); el.className = 'ab-agent'; el.innerHTML = ARROW(c);
    layer.appendChild(el);
    return { el, c, id, x: innerWidth / 2, y: innerHeight / 2 };
  });
  document.body.append(layer, dock);
  requestAnimationFrame(() => dock.classList.add('on'));
  type Agent = (typeof agents)[number];
  const place = (a: Agent, x: number, y: number, ms: number) => {
    a.x = x; a.y = y;
    a.el.style.transitionDuration = `${ms}ms`;
    a.el.style.transform = `translate3d(${clamp(x, 2, innerWidth - 22)}px,${clamp(y, 2, innerHeight - 26)}px,0)`;
  };
  agents.forEach((a) => place(a, innerWidth / 2, innerHeight / 2, 0));
  layer.style.opacity = '0';
  const stepDone = () => {
    steps++;
    q('.steps').textContent = `${steps} / ${N * STAGES} steps`;
    q<HTMLElement>('.bar u').style.width = `${Math.round((steps / (N * STAGES)) * 100)}%`;
  };

  const onUser = () => { userScrolled = true; };
  const onKey = (e: KeyboardEvent) => { if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(e.key)) userScrolled = true; };

  // boxes that follow a block while the page scrolls
  const live = new Set<{ b: HTMLElement; t: HTMLElement; tag?: HTMLElement }>();
  function tick() {
    if (dead) return;
    live.forEach(({ b, t }) => {
      const r = t.getBoundingClientRect();
      b.style.transform = `translate3d(${r.left}px,${r.top}px,0)`; b.style.width = `${r.width}px`; b.style.height = `${r.height}px`;
    });
    requestAnimationFrame(tick);
  }
  function makeBox(t: HTMLElement, cls = '') {
    const b = document.createElement('div'); b.className = `ab-box ${cls}`;
    b.innerHTML = `<i></i><i></i><i></i><i></i><u>${chipFor(t)}</u><em></em>`;
    layer.appendChild(b);
    return { b, tag: b.querySelector('em') as HTMLElement };
  }
  const dropBox = (b: HTMLElement) => { b.classList.add('out'); setTimeout(() => b.remove(), 350); };
  const corner = (r: DOMRect | { left: number; top: number; width: number; height: number }) => [r.left + r.width, r.top + r.height] as const;

  // ── stages ──
  async function layoutStage(a: Agent, k: Task) {
    const t = k.t, { b, tag } = makeBox(t);
    const r0 = t.getBoundingClientRect();
    const w0 = clamp(r0.width * rnd(0.12, 0.3), 36, 200), h0 = clamp(r0.height * rnd(0.12, 0.3), 22, 110);
    const dx = rnd(-90, 90) + (r0.width - w0) * rnd(0, 0.55), dy = rnd(-60, 60) + (r0.height - h0) * rnd(0, 0.45);
    const frame = (e: number) => {
      const r = t.getBoundingClientRect();
      const w = w0 + (r.width - w0) * e, h = h0 + (r.height - h0) * e;
      const l = r.left + dx * (1 - e), tp = r.top + dy * (1 - e);
      b.style.transform = `translate3d(${l}px,${tp}px,0)`; b.style.width = `${w}px`; b.style.height = `${h}px`;
      tag.textContent = `${Math.round(w)} × ${Math.round(h)}`;
      return corner({ left: l, top: tp, width: w, height: h });
    };
    const [sx, sy] = frame(0);
    place(a, sx, sy, 380); await wait(360); if (dead) return;
    b.classList.add('on'); frame(0);
    await wait(rnd(120, 280)); if (dead) return;
    const dur = clamp(500 + r0.width * 0.35 + r0.height * 0.2, 650, 1250);
    await frames(dur, (kk) => { const [cx, cy] = frame(ease(kk)); place(a, cx, cy, 0); });
    if (dead) return;
    b.classList.add('placed'); k.placed = b;            // stays on screen as a grey placeholder
    live.add({ b, t, tag });
  }

  function textNodes(t: HTMLElement) {
    const out: Text[] = [];
    const w = document.createTreeWalker(t, NodeFilter.SHOW_TEXT);
    let n: Node | null;
    while ((n = w.nextNode())) {
      const p = (n as Text).parentElement;
      if ((n.nodeValue || '').trim() && p && !p.closest('script,style,svg,canvas,textarea')) out.push(n as Text);
    }
    return out;
  }

  async function writeStage(a: Agent, k: Task) {
    const t = k.t;
    const nodes = textNodes(t), texts = nodes.map((n) => n.nodeValue || ''), total = texts.reduce((s, x) => s + x.length, 0);
    const h = t.getBoundingClientRect().height;
    t.style.minHeight = `${h}px`;                        // layout stays put while text is typed in
    nodes.forEach((n) => { n.nodeValue = ''; });
    const placed = k.placed; if (placed) { for (const l of Array.from(live)) if (l.b === placed) live.delete(l); dropBox(placed); k.placed = null; }
    t.classList.remove('ab-pre'); t.classList.add('ab-write');
    const { b } = makeBox(t, 'sel on'); const lv = { b, t }; live.add(lv);
    const caret = document.createElement('div'); caret.className = 'ab-caret'; caret.style.background = a.c; layer.appendChild(caret);
    const r0 = t.getBoundingClientRect();
    place(a, r0.left + 6, r0.top + 8, 340); await wait(360);
    const caretPos = (i: number, off: number) => {
      const rg = document.createRange(); rg.setStart(nodes[i], off); rg.setEnd(nodes[i], off);
      let r: DOMRect | undefined = rg.getClientRects()[0];
      if (!r || (!r.width && !r.height)) r = undefined;
      if (r) return { x: r.left, y: r.top, h: r.height };
      const e = t.getBoundingClientRect(); return { x: e.left + 4, y: e.top + 2, h: 16 };
    };
    if (total) {
      const dur = clamp(total * 8, 500, 1900);
      await frames(dur, (kk) => {
        if (dead) return;
        let want = Math.floor(total * kk), ni = 0;
        nodes.forEach((n, i) => { const take = clamp(want, 0, texts[i].length); n.nodeValue = texts[i].slice(0, take); want -= take; if (take > 0 || i === 0) ni = i; });
        const used = nodes[ni].nodeValue!.length, c = caretPos(ni, used);
        caret.style.transform = `translate3d(${c.x}px,${c.y}px,0)`; caret.style.height = `${c.h}px`;
        place(a, c.x + 4, c.y + c.h, 0);
      });
    } else await wait(450);
    nodes.forEach((n, i) => { n.nodeValue = texts[i]; });
    t.style.minHeight = '';
    caret.remove(); live.delete(lv); dropBox(b);
    await wait(60);
  }

  async function styleStage(a: Agent, k: Task) {
    const t = k.t, { b } = makeBox(t, 'sel on'); const lv = { b, t }; live.add(lv);
    const r = t.getBoundingClientRect();
    place(a, r.left + 8, r.top + 8, 320); await wait(340); if (dead) return;
    t.classList.remove('ab-write'); t.classList.add('ab-color');   // colour floods in while the cursor sweeps across
    await frames(650, (kk) => { const e = t.getBoundingClientRect(); place(a, e.left + e.width * ease(kk), e.top + Math.min(e.height, 40) * (0.3 + 0.7 * Math.sin(kk * 9) ** 2), 0); });
    if (t.classList.contains('reveal')) t.classList.add('in');
    t.classList.remove('ab-color');
    live.delete(lv); dropBox(b);
  }

  async function adjustStage(a: Agent, k: Task) {
    const t = k.t, { b, tag } = makeBox(t, 'on'); const lv = { b, t, tag }; live.add(lv);
    const ox = rnd(10, 22) * (Math.random() < 0.5 ? -1 : 1), oy = rnd(6, 14) * (Math.random() < 0.5 ? -1 : 1);
    t.style.transition = 'none'; t.style.transform = `translate(${ox}px,${oy}px)`;
    let r = t.getBoundingClientRect(); const [cx, cy] = corner(r);
    place(a, cx, cy, 340); await wait(380); if (dead) return;
    await frames(650, (kk) => {
      const e = 1 - ease(kk);
      t.style.transform = `translate(${ox * e}px,${oy * e}px)`;
      r = t.getBoundingClientRect(); const [x, y] = corner(r);
      place(a, x, y, 0);
      tag.textContent = `x ${(ox * e).toFixed(0)}  y ${(oy * e).toFixed(0)}`;
    });
    t.style.transform = ''; t.style.transition = '';
    live.delete(lv); dropBox(b);
  }

  // ── job board ──
  const order: Array<[State, State, State]> = [['styled', 'adjusting', 'adjusting'], ['written', 'styling', 'styling'], ['sized', 'writing', 'writing'], ['new', 'sizing', 'sizing']];
  function claim(a: Agent): { k: Task; stage: number } | null {
    for (const own of [false, true]) {
      for (let s = 0; s < order.length; s++) {
        for (let i = wS; i < wE; i++) {
          const k = tasks[i];
          if (k.state === order[s][0] && (own || k.last !== a.id)) { k.state = order[s][1]; k.last = a.id; return { k, stage: 3 - s }; }
        }
      }
    }
    return null;
  }
  async function worker(a: Agent) {
    while (!dead && !finished) {
      const job = claim(a);
      if (!job) {
        // nothing free right now: drift over to a block that is being worked on
        const busy = tasks.slice(wS, wE).filter((k) => k.state !== 'done');
        if (busy.length) { const r = busy[Math.floor(Math.random() * busy.length)].t.getBoundingClientRect(); place(a, r.left + rnd(0.1, 0.9) * r.width, r.top + rnd(0.1, 0.9) * Math.min(r.height, 200), 800); }
        await wait(450); continue;
      }
      const { k, stage } = job;
      if (stage === 0) await layoutStage(a, k); else if (stage === 1) await writeStage(a, k); else if (stage === 2) await styleStage(a, k); else await adjustStage(a, k);
      if (dead) return;
      stepDone();
      k.state = (['sized', 'written', 'styled', 'done'] as State[])[stage];
      await wait(rnd(30, 120));
    }
  }

  const scrollTo = (y: number, ms: number) => {
    const from = scrollY, to = clamp(y, 0, document.documentElement.scrollHeight - innerHeight);
    return frames(ms, (kk) => { if (!dead && !userScrolled) window.scrollTo(0, from + (to - from) * ease(kk)); });
  };

  const t00 = performance.now();
  async function main() {
    await wait(startDelay); if (dead) return;
    if (scan) { scan.classList.add('out'); const s = scan; setTimeout(() => s.remove(), 700); }
    layer.style.opacity = '1';
    window.addEventListener('wheel', onUser, { passive: true }); window.addEventListener('touchstart', onUser, { passive: true });
    window.addEventListener('keydown', onKey); window.addEventListener('mousedown', onUser);
    root.style.scrollBehavior = 'auto';
    window.scrollTo(0, 0);
    q('.stat').textContent = 'Building…';
    requestAnimationFrame(tick);
    const pool = Promise.all(agents.map((a, i) => wait(i * 120).then(() => worker(a))));
    // one screen at a time: build every block on it completely, then scroll on
    while (wS < N && !dead) {
      const top = Math.max(0, docTop(tasks[wS].t) - 110);
      await scrollTo(top, 700); if (dead) return;
      const base = docTop(tasks[wS].t); let e = wS + 1;
      while (e < N && e - wS < 12 && docTop(tasks[e].t) + Math.min(tasks[e].t.offsetHeight, innerHeight * 0.5) <= base + innerHeight - 110) e++;
      wE = e;
      await new Promise<void>((res) => { const iv = setInterval(() => { if (dead || tasks.slice(wS, wE).every((k) => k.state === 'done')) { clearInterval(iv); res(); } }, 120); });
      wS = wE; wE = wS;
    }
    finished = true; await pool; if (dead) return;
    q('.stat').textContent = 'Finishing…';
    const mx = innerWidth / 2 - 8, my = innerHeight / 2 - 10;
    agents.forEach((a, k) => place(a, mx + Math.cos(k * 0.52) * 22, my + Math.sin(k * 0.52) * 22, 1000 + k * 40));
    await wait(1500); if (dead) return;
    agents.forEach((a, k) => place(a, innerWidth * 0.82 + Math.cos(k * 0.5) * 36, 90 + k * 14, 1500 + k * 50));
    await wait(900); if (dead) return;
    layer.classList.add('out');
    q('.stat').textContent = `Complete · ${((performance.now() - t00 - startDelay) / 1000).toFixed(1)}s`;
    dock.classList.add('ok');
    const rep = q<HTMLButtonElement>('.rep'); rep.disabled = false;
    rep.onclick = () => { cleanup(true); window.scrollTo(0, 0); runAgentBuild(1900, true); };
    if (!userScrolled) { const from = scrollY; await frames(900, (kk) => window.scrollTo(0, from * (1 - ease(kk)))); }
    dead = true;
    window.removeEventListener('wheel', onUser); window.removeEventListener('touchstart', onUser);
    window.removeEventListener('keydown', onKey); window.removeEventListener('mousedown', onUser);
    root.style.removeProperty('scroll-behavior');
    setTimeout(() => layer.remove(), 700);
  }
  function cleanup(full = false) {
    dead = true;
    window.removeEventListener('wheel', onUser); window.removeEventListener('touchstart', onUser);
    window.removeEventListener('keydown', onKey); window.removeEventListener('mousedown', onUser);
    tasks.forEach(({ t }) => { t.classList.remove('ab-pre', 'ab-write', 'ab-color'); t.style.minHeight = ''; t.style.transform = ''; t.style.transition = ''; if (t.classList.contains('reveal')) t.classList.add('in'); });
    root.style.removeProperty('scroll-behavior');
    layer.remove(); scan?.remove();
    if (full) dock.remove(); else dock.classList.remove('on');
  }
  main();
  return () => cleanup(true);
}
