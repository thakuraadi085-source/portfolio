import { useEffect, useState } from 'react';
import { ArrowUp, Github, Linkedin, Mail, Menu, X } from 'lucide-react';
import { nav, site } from '../data/site';
import { projects } from '../data/projects';
import { useActiveSection, useScrollProgress } from '../hooks/hooks';

const ids = nav.map((n) => n.id);

export function Navbar() {
  const [open, setOpen] = useState(false);
  const active = useActiveSection(ids);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  return (
    <header className="nav">
      <a href="#home" className="brand" aria-label="Home"><span className="brand-dot" />ASR</a>
      <button className="burger" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="menu" aria-label="Toggle menu">
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>
      <nav id="menu" className={open ? 'menu open' : 'menu'} aria-label="Primary">
        {nav.map((n) => (
          <a key={n.id} href={`#${n.id}`} className={active === n.id ? 'active' : ''} aria-current={active === n.id ? 'true' : undefined} onClick={() => setOpen(false)}>
            {n.label}
          </a>
        ))}
      </nav>
      <span className="avail"><i />Available</span>
      <a className="dispatch" href="#contact">DISPATCH →</a>
    </header>
  );
}

export function StatusBar() {
  const p = useScrollProgress();
  return (
    <div className="status" role="status" aria-label="Page status">
      <span className="live"><i />ONLINE</span>
      <span>{projects.length} PROJECTS</span>
      <span className="hide-sm">MCA · PURSUING</span>
      <span className="bar"><b style={{ width: `${Math.round(p * 100)}%` }} /></span>
      <span className="pct">{String(Math.round(p * 100)).padStart(2, '0')}%</span>
    </div>
  );
}

export function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const on = () => setShow(window.scrollY > 700);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  return (
    <a href="#home" className={show ? 'totop show' : 'totop'} aria-label="Back to top" tabIndex={show ? 0 : -1}>
      <ArrowUp size={18} />
    </a>
  );
}

export function Footer() {
  const { email, linkedin, github } = site.contact;
  return (
    <footer className="footer">
      <div>
        <strong>{site.name.toUpperCase()}</strong>
        <p className="muted small">“{site.tagline}”</p>
      </div>
      <div className="socials">
        {github ? <a href={github} target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={18} /></a> : <span title="GitHub link not added yet" aria-label="GitHub (not added)"><Github size={18} /></span>}
        {linkedin ? <a href={linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={18} /></a> : <span title="LinkedIn link not added yet" aria-label="LinkedIn (not added)"><Linkedin size={18} /></span>}
        {email ? <a href={`mailto:${email}`} aria-label="Email"><Mail size={18} /></a> : <span title="Email not added yet" aria-label="Email (not added)"><Mail size={18} /></span>}
      </div>
      <p className="muted small">© {new Date().getFullYear()} {site.name} · {site.location}</p>
    </footer>
  );
}
