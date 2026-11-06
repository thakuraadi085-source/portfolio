import { useMemo, useState, type FormEvent, type ReactNode } from 'react';
import { ArrowDownRight, ArrowUpRight, Github, Linkedin, Mail, MapPin, Send } from 'lucide-react';
import { capabilities, education, learning, nav, research, site } from '../data/site';
import { projects } from '../data/projects';
import { skillCategories, stack } from '../data/skills';
import type { Project, ProjectGroup } from '../types';
import { useReveal } from '../hooks/hooks';
import { Photo } from './Photo';
import { HeroCard } from './Fx';
import { ProjectVisual } from './ProjectVisual';
import { ProjectModal } from './ProjectModal';

const TOTAL = nav.length;

function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useReveal<HTMLDivElement>();
  return <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}

function Head({ id, n, eyebrow, title, sub }: { id: string; n: number; eyebrow: string; title: string; sub?: string }) {
  return (
    <Reveal className="head">
      <p className="mono sec">//{String(n).padStart(2, '0')}.00 SEC_{id.toUpperCase()} INDEX [{String(n).padStart(2, '0')} / {String(TOTAL).padStart(2, '0')}]</p>
      <p className="mono red eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {sub && <p className="muted sub">{sub}</p>}
    </Reveal>
  );
}

export function Hero() {
  return (
    <section id="home" className="hero">
      <div className="hero-word" aria-hidden="true">PORTFOLIO</div>
      <div className="hero-grid">
        <div className="hero-copy">
          <p className="hello">Hello, I’m</p>
          <h1><span className="name-block">{site.firstName}.</span><span className="sr-only"> {site.name}</span></h1>
          <p className="mono red role">● {site.roles.slice(0, 3).join(' · ').toUpperCase()}</p>
          <p className="lead">{site.subTagline}</p>
          <div className="cta">
            <a className="btn" href="#contact">INITIATE DISPATCH <ArrowUpRight size={16} /></a>
            <a className="btn ghost" href="#projects">EXPLORE PROJECTS <ArrowDownRight size={16} /></a>
          </div>
          <dl className="stats">
            <div><dt>{projects.length}</dt><dd>Projects</dd></div>
            <div><dt>{skillCategories.length}</dt><dd>Skill domains</dd></div>
            <div><dt>MCA</dt><dd>Currently pursuing</dd></div>
          </dl>
        </div>
        <div className="hero-side">
          <Photo />
          <HeroCard />
        </div>
      </div>
      <p className="scroll-hint mono">SCROLL ↓</p>
    </section>
  );
}

export function About() {
  return (
    <section id="about" className="section">
      <Head id="about" n={1} eyebrow="PERSONAL PROFILE" title="Background & Philosophy" />
      <div className="about-grid">
        <Reveal className="col">
          {site.intro.map((t) => <p key={t}>{t}</p>)}
        </Reveal>
        <Reveal className="col quote-col" delay={120}>
          {site.about.map((t) => <p key={t} className="muted">{t}</p>)}
          <blockquote>{site.philosophy}</blockquote>
        </Reveal>
      </div>
    </section>
  );
}

export function Education() {
  return (
    <section id="education" className="section">
      <Head id="education" n={2} eyebrow="ACADEMIC TIMELINE" title="Education" />
      <ol className="timeline">
        {education.map((e, i) => (
          <li key={e.degree}>
            <Reveal delay={i * 120}>
              <span className="mono red">{e.status.toUpperCase()}</span>
              <h3>{e.degree}</h3>
              <p>{e.school}</p>
              <p className="muted small">{e.place} — {e.note}</p>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function Skills() {
  const [active, setActive] = useState(skillCategories[0].id);
  const cat = skillCategories.find((c) => c.id === active) ?? skillCategories[0];
  return (
    <section id="skills" className="section">
      <Head id="skills" n={3} eyebrow="CAPABILITY MAP" title="Skills & Expertise" sub="Grouped by domain. The tag shows how I currently work in each area — it is a focus indicator, not a proficiency score." />
      <div className="skills">
        <div className="tabs" role="tablist" aria-label="Skill categories">
          {skillCategories.map((c) => (
            <button key={c.id} role="tab" id={`tab-${c.id}`} aria-selected={c.id === active} aria-controls="skill-panel" className={c.id === active ? 'tab on' : 'tab'} onClick={() => setActive(c.id)}>
              <span className="mono">{c.letter}</span> {c.title}
            </button>
          ))}
        </div>
        <div className="panel" id="skill-panel" role="tabpanel" aria-labelledby={`tab-${cat.id}`} key={cat.id}>
          <div className="panel-head">
            <div>
              <h3>{cat.title}</h3>
              <p className="muted">{cat.blurb}</p>
            </div>
            <span className="badge">{cat.focus}</span>
          </div>
          <ul className="chips big">{cat.items.map((s) => <li key={s} className="chip">{s}</li>)}</ul>
          {cat.id === 'ai' && (
            <p className="note mono">NOTE — Applied integration (chatbots, assistants, APIs) is project work. Neural-network, brain-inspired and custom-LLM work is ongoing research & experimentation.</p>
          )}
        </div>
      </div>
    </section>
  );
}

export function TechStack() {
  return (
    <section id="stack" className="section">
      <Head id="stack" n={4} eyebrow="TOOLS & LANGUAGES" title="Technology Stack" sub="Proficiency differs between tools. Items are marked Used, Learning or Exploring." />
      <div className="stack-grid">
        {stack.map((g, i) => (
          <Reveal key={g.title} className="stack-card" delay={i * 60}>
            <h3 className="mono red">{g.title.toUpperCase()}</h3>
            <ul>
              {g.items.map((t) => (
                <li key={t.name}><span>{t.name}</span><em className={`st st-${t.state.toLowerCase()}`}>{t.state}</em></li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

const groups: ('All' | ProjectGroup)[] = ['All', 'Software', 'Web', 'AI', 'Automation', 'Games'];

export function Projects() {
  const [group, setGroup] = useState<'All' | ProjectGroup>('All');
  const [open, setOpen] = useState<Project | null>(null);
  const list = useMemo(() => (group === 'All' ? projects : projects.filter((p) => p.group === group)), [group]);
  return (
    <section id="projects" className="section">
      <Head id="projects" n={5} eyebrow="SELECTED WORK" title="Flagship Deployments" sub="Open any project for details. Visuals are illustrative, not real screenshots." />
      <div className="filters" role="group" aria-label="Filter projects">
        {groups.map((g) => (
          <button key={g} className={g === group ? 'tab on' : 'tab'} aria-pressed={g === group} onClick={() => setGroup(g)}>{g}</button>
        ))}
      </div>
      <div className="cards">
        {list.map((p) => (
          <article key={p.slug} className="card">
            <button className="card-btn" onClick={() => setOpen(p)} aria-label={`Open details for ${p.title}`}>
              <ProjectVisual project={p} />
              <div className="card-body">
                <p className="mono red">PROJECT {p.index} · {p.group.toUpperCase()}</p>
                <h3>{p.title}</h3>
                <p className="muted small">{p.category}</p>
                <p className="card-sum">{p.summary}</p>
                <div className="chips">{p.tags.slice(0, 4).map((t) => <span key={t} className="chip">{t}</span>)}</div>
                <span className="more mono">VIEW DETAILS <ArrowUpRight size={14} /></span>
              </div>
            </button>
          </article>
        ))}
      </div>
      {open && <ProjectModal project={open} onClose={() => setOpen(null)} />}
    </section>
  );
}

export function Research() {
  const [sel, setSel] = useState(0);
  const cur = research[sel];
  return (
    <section id="research" className="section">
      <Head id="research" n={6} eyebrow="THE LAB" title="Beyond Development — Research & Innovation" sub="Independent exploration. No published research or scientific breakthroughs are claimed." />
      <div className="lab">
        <ul className="lab-list" aria-label="Research topics">
          {research.map((r, i) => (
            <li key={r.title}>
              <button className={i === sel ? 'lab-item on' : 'lab-item'} onClick={() => setSel(i)} aria-pressed={i === sel}>
                <span className="mono">{String(i + 1).padStart(2, '0')}</span> {r.title}
              </button>
            </li>
          ))}
        </ul>
        <div className="lab-view" key={cur.title} aria-live="polite">
          <span className="badge">{cur.label}</span>
          <h3>{cur.title}</h3>
          <p className="lead">{cur.desc}</p>
          <div className="scan" aria-hidden="true" />
          <p className="mono muted small">STATUS LABELS: Research Interest · Experiment · Prototype · In Development · Completed</p>
        </div>
      </div>
    </section>
  );
}

export function Build() {
  return (
    <section id="build" className="section">
      <Head id="build" n={7} eyebrow="DEVELOPMENT CAPABILITIES" title="What I Can Build" sub="Areas I can design and develop — not a list of client contracts." />
      <ul className="build-grid">
        {capabilities.map((c, i) => (
          <li key={c}><Reveal delay={(i % 3) * 80}><span className="mono red">{String(i + 1).padStart(2, '0')}</span><strong>{c}</strong></Reveal></li>
        ))}
      </ul>
    </section>
  );
}

export function Learning() {
  return (
    <section id="learning" className="section">
      <Head id="learning" n={8} eyebrow="CONTINUOUS GROWTH" title="Learning & Development" sub="What I am actively studying and experimenting with right now." />
      <div className="learn-grid">
        {learning.map((l, i) => (
          <Reveal key={l.title} className="learn" delay={(i % 3) * 80}>
            <h3>{l.title}</h3>
            <p className="muted">{l.note}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function Contact() {
  const { email, linkedin, github } = site.contact;
  const endpoint = import.meta.env.VITE_FORM_ENDPOINT;
  const [state, setState] = useState<'idle' | 'sending' | 'ok' | 'err'>('idle');

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!endpoint) return;
    setState('sending');
    try {
      const res = await fetch(endpoint, { method: 'POST', headers: { Accept: 'application/json' }, body: new FormData(e.currentTarget) });
      if (!res.ok) throw new Error('bad');
      setState('ok');
      e.currentTarget.reset();
    } catch { setState('err'); }
  }

  const link = (href: string, label: string, icon: ReactNode) =>
    href ? <a href={href} target="_blank" rel="noreferrer">{icon}{label}</a> : <span className="na">{icon}{label} — not added yet</span>;

  return (
    <section id="contact" className="section contact">
      <Head id="contact" n={9} eyebrow="DIRECT CHANNEL" title="Let’s Architect Something Extraordinary." />
      <div className="contact-grid">
        <Reveal className="contact-info">
          <p className="muted">Open to collaboration inquiries, project discussions and professional opportunities.</p>
          <ul>
            <li>{email ? <a href={`mailto:${email}`}><Mail size={16} />{email}</a> : <span className="na"><Mail size={16} />Email — not added yet</span>}</li>
            <li>{link(linkedin, 'LinkedIn', <Linkedin size={16} />)}</li>
            <li>{link(github, 'GitHub', <Github size={16} />)}</li>
            <li><span><MapPin size={16} />{site.location}</span></li>
          </ul>
        </Reveal>
        <Reveal delay={100}>
          <form className="form" onSubmit={submit}>
            <label>Name<input name="name" required autoComplete="name" /></label>
            <label>Email<input name="email" type="email" required autoComplete="email" /></label>
            <label>Inquiry type
              <select name="type" defaultValue="Project discussion">
                <option>Project discussion</option><option>Collaboration inquiry</option><option>Professional opportunity</option><option>Other</option>
              </select>
            </label>
            <label>Message<textarea name="message" rows={5} required /></label>
            <button className="btn" type="submit" disabled={!endpoint || state === 'sending'}>
              {state === 'sending' ? 'SENDING…' : 'SEND MESSAGE'} <Send size={16} />
            </button>
            {!endpoint && <p className="note mono">FORM NOT CONNECTED — set VITE_FORM_ENDPOINT in .env (e.g. a Formspree URL) to enable sending.</p>}
            {state === 'ok' && <p className="ok mono" role="status">Message sent. Thank you!</p>}
            {state === 'err' && <p className="red mono" role="alert">Could not send. Please try again later.</p>}
          </form>
        </Reveal>
      </div>
    </section>
  );
}
