import { useEffect, useRef } from 'react';
import { ExternalLink, Github, X } from 'lucide-react';
import type { Project } from '../types';
import { ProjectVisual } from './ProjectVisual';

export function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', onKey); };
  }, [onClose]);

  return (
    <div className="modal-back" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="pm-title" onClick={(e) => e.stopPropagation()}>
        <button ref={closeRef} className="modal-x" onClick={onClose} aria-label="Close project details"><X size={20} /></button>
        <ProjectVisual project={project} large />
        <div className="modal-body">
          <p className="mono red">PROJECT {project.index} · {project.category}</p>
          <h3 id="pm-title">{project.title}</h3>
          {project.status && <span className="badge">{project.status}</span>}
          <p className="lead">{project.description}</p>
          <h4 className="mono">FOCUS AREAS</h4>
          <ul className="ticks">{project.features.map((f) => <li key={f}>{f}</li>)}</ul>
          <h4 className="mono">TECHNOLOGY TAGS</h4>
          <div className="chips">{project.tags.map((t) => <span key={t} className="chip">{t}</span>)}</div>
          <div className="modal-links">
            {project.links?.live && <a className="btn" href={project.links.live} target="_blank" rel="noreferrer"><ExternalLink size={16} /> LIVE DEMO</a>}
            {project.links?.github && <a className="btn ghost" href={project.links.github} target="_blank" rel="noreferrer"><Github size={16} /> GITHUB</a>}
            {!project.links?.live && !project.links?.github && <p className="muted small">Demo and source links have not been added for this project yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
