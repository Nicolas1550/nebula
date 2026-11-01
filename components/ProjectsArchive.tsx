'use client';

import { useMemo, useState } from 'react';
import { portfolioProjects, type ProjectCategory } from '../data/portfolioProjects';

type Filter = 'all' | ProjectCategory;
const filters: { key: Filter; label: string }[] = [
  { key: 'all', label: 'TODOS' },
  { key: 'fullstack', label: 'FULL STACK' },
  { key: 'product', label: 'PRODUCT ENGINEERING' },
  { key: 'leadership', label: 'LIDERAZGO / QA' },
  { key: 'web', label: 'WEB / UX' },
];
const categoryLabels: Record<ProjectCategory, string> = {
  fullstack: 'FULL STACK',
  product: 'PRODUCT ENGINEERING',
  leadership: 'TECH LEAD · QA · PM',
  web: 'WEB · UX',
};

export default function ProjectsArchive() {
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');
  const [showAll, setShowAll] = useState(false);
  const search = query.trim().toLocaleLowerCase('es');
  const filtered = useMemo(() => portfolioProjects.filter(project => {
    if (filter !== 'all' && project.category !== filter) return false;
    if (!search) return true;
    return [project.title, project.description, ...project.technologies]
      .some(value => value.toLocaleLowerCase('es').includes(search));
  }), [filter, search]);
  // Los trabajos destacados aparecen primero; el listado completo siempre es accesible.
  const ordered = useMemo(() => [...filtered].sort((a, b) => Number(b.featured) - Number(a.featured)), [filtered]);
  const shown = filter === 'all' && !search && !showAll ? ordered.slice(0, 6) : ordered;

  return <section id="all-projects" className="archive-projects" aria-label="Mis proyectos profesionales">
    <div className="archive-heading">
      <div><span className="archive-overline">ORIGIN / ARCHIVO 001 / TRABAJOS REALES</span>
        <h3>Proyectos <em>en órbita.</em></h3>
        <p>Desarrollo, producto, QA y liderazgo técnico. Seleccioná una misión para conocer el trabajo realizado.</p>
      </div>
      <div className="archive-count"><strong>{portfolioProjects.length.toString().padStart(2, '0')}</strong><span>PROYECTOS<br/>EN EL ARCHIVO</span></div>
    </div>

    <div className="archive-toolbar">
      <label className="archive-search"><span aria-hidden="true">⌕</span><span className="sr-only">Buscar proyectos o tecnologías</span>
        <input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Buscar proyecto o tecnología…" autoComplete="off" />
        {query && <button type="button" title="Limpiar búsqueda" aria-label="Limpiar búsqueda" onClick={() => setQuery('')}>×</button>}
      </label>
      <span className="archive-counter" role="status">{filtered.length} / {portfolioProjects.length} RESULTADOS</span>
    </div>
    <div className="archive-filters" role="group" aria-label="Filtrar proyectos">
      {filters.map(item => <button type="button" key={item.key} onClick={() => {setFilter(item.key);setShowAll(true)}} className={filter === item.key ? 'active' : ''} aria-pressed={filter === item.key}>{item.label} <span>{item.key === 'all' ? portfolioProjects.length : portfolioProjects.filter(p => p.category === item.key).length}</span></button>)}
    </div>
    <div className="archive-grid">
      {shown.map((project, i) => <article className="archive-card" key={project.id}>
        <div className="archive-image"><img src={`/portfolio/thumbs/${project.id}.webp`} alt={`Vista del proyecto ${project.title}`} loading="lazy" decoding="async" />
          <span className="archive-image-index">MISSION / {project.id.slice(1)}</span>
          {project.featured && <span className="archive-featured">DESTACADO</span>}
        </div>
        <div className="archive-card-content">
          <span className="archive-category">{categoryLabels[project.category]}</span>
          <h4>{project.title}</h4><p>{project.summary}</p>
          <div className="archive-tags">{project.technologies.slice(0, 4).map(tech => <span key={tech}>{tech}</span>)}{project.technologies.length > 4 && <span>+{project.technologies.length - 4}</span>}</div>
          <details className="archive-details">
            <summary>VER DETALLES TÉCNICOS <span aria-hidden="true">＋</span></summary>
            <div className="archive-details-body"><p>{project.description}</p><strong>STACK Y COMPETENCIAS</strong><div className="archive-tags">{project.technologies.map(tech => <span key={tech}>{tech}</span>)}</div></div>
          </details>
          {project.demoNotice && <div className="project-demo-notice" role="note"><span className="project-demo-notice-label">◉ DEMOSTRACIÓN DISPONIBLE</span><p>{project.demoNotice}</p><a href={project.links.find(link => link.label === "VIDEO DEMO")?.href} target="_blank" rel="noopener noreferrer">▶ VER VIDEO DEMO ↗</a></div>}
          <div className="archive-links">
            {project.links.map(link => <a href={link.href} key={link.href} className={link.label === "VIDEO DEMO" ? "project-demo-link" : undefined} rel="noopener noreferrer" target="_blank">{link.label} <span aria-hidden="true">↗</span></a>)}
            {!project.links.length && <span>ENLACES NO PUBLICADOS</span>}
          </div>
        </div>
      </article>)}
    </div>
    {filtered.length === 0 && <div className="archive-empty">No encontramos proyectos con esa búsqueda. <button onClick={() => {setQuery('');setFilter('all');setShowAll(false)}}>BORRAR FILTROS ↗</button></div>}
    {filter === 'all' && !search && !showAll && <button type="button" className="archive-show-all" onClick={() => setShowAll(true)}>EXPLORAR LOS {portfolioProjects.length} PROYECTOS <span>↓</span></button>}
    {filter === 'all' && !search && showAll && <button type="button" className="archive-show-all archive-collapse" onClick={() => setShowAll(false)}>MOSTRAR SOLO DESTACADOS ↑</button>}
    <p className="archive-footnote">Los proyectos y descripciones provienen de mi portfolio original. Algunos repositorios privados no se muestran.</p>
  </section>;
}
