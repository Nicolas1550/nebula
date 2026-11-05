'use client';
import {useEffect,useMemo,useRef,useState} from 'react';
import {portfolioProjects, type PortfolioProject} from '../../data/portfolioProjects';

type Message={id:number;role:'nova'|'visitor';body:string;projects?:PortfolioProject[]};
const welcome='Soy NOVA, guía del universo NEBULA. Puedo ayudarte a encontrar proyectos reales, tecnologías y experiencia profesional. Funciono con una base local de información; no soy un modelo generativo ni envío tus preguntas a un servidor.';
const quick=['¿Cuáles son sus mejores proyectos?','¿Qué tecnologías domina?','¿Tiene experiencia en testing?','¿Cómo puedo contactarlo?'];
const normalize=(s:string)=>s.toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9.+# ]/g,' ').replace(/\s+/g,' ').trim();
const blocked=new Set(['que','con','para','como','cual','cuales','donde','tiene','sobre','de','del','los','las','una','uno','por','hay','sus','proyecto','proyectos','trabajo','trabajos','me','puedes','ver','mostrar','quiero','necesito','hacer','este','esta','el','la','en','y','a']);
function answer(question:string):{body:string;projects?:PortfolioProject[]}{
  const q=normalize(question);
  if(/contact|correo|email|escribir|contrat|linkedin|hablar/.test(q))return {body:'Podés conocer su trayectoria en su portfolio público. También podés abrir su perfil de GitHub desde los repositorios publicados. No muestro un correo que no esté confirmado.',projects:[]};
  if(/test|qa|cypress|automatiz|calidad/.test(q)){
    const matching=portfolioProjects.filter(p=>/cypress|e2e|qa|test/i.test([p.title,p.description,...p.technologies].join(' '))).slice(0,3);
    return {body:'Sí. Hay experiencia en automatización E2E con Cypress y calidad de producto, especialmente en ChicksX. Acá están los proyectos más relacionados:',projects:matching};
  }
  if(/experiencia|empresa|laboral|donde trabajo|trayectoria|empleo/.test(q))return {body:'Su experiencia profesional incluye Botic Partners (Frontend / Full Stack), Equilibrio AI (Full Stack Product Engineer), UnderTango Club (Tech Lead / Project Manager), ChicksX (E2E Engineer), Chicks Gold (Product Engineer) y Coderhouse (tutor). Podés abrir la pestaña EXPERIENCIA en ORIGIN.'};
  if(/tecnolog|lenguaje|stack|herramienta|framework|programa|habilidad/.test(q))return {body:'Sus proyectos incluyen Next.js, React, TypeScript, JavaScript, Node.js, MySQL, Tailwind CSS, Cypress, .NET y herramientas de producto. Podés comprobar cada tecnología en las fichas de los proyectos y en la sección TECNOLOGÍAS.'};
  if(/destacad|mejor|recomend|principal|importante|top/.test(q))return {body:'Para una primera mirada, estos trabajos destacados muestran desarrollo Full Stack, ingeniería de producto y soluciones reales. Abrí sus fichas para ver la tecnología y enlaces:',projects:portfolioProjects.filter(p=>p.featured).slice(0,4)};
  if(/cuantos|cantidad|total/.test(q))return {body:`El archivo ORIGIN contiene ${portfolioProjects.length} proyectos extraídos del portfolio original, con descripciones e imágenes. Podés explorarlos en el museo y en la galería.`};
  const tokens=q.split(' ').filter(t=>t.length>=3&&!blocked.has(t));
  const scores=portfolioProjects.map(p=>{
    const title=normalize(p.title),tech=normalize(p.technologies.join(' ')),desc=normalize(p.description+' '+p.summary);
    const score=tokens.reduce((v,t)=>v+(title.includes(t)?5:0)+(tech.includes(t)?4:0)+(desc.includes(t)?1:0),0);
    return {project:p,score};
  }).filter(x=>x.score>0).sort((a,b)=>b.score-a.score).slice(0,4);
  if(scores.length)return {body:'Encontré estos trabajos relacionados con tu consulta. Los resultados provienen de las fichas reales del portfolio:',projects:scores.map(x=>x.project)};
  return {body:`Puedo ayudarte a explorar los ${portfolioProjects.length} proyectos, tecnologías, experiencia o testing. Probá con una tecnología específica como React, Next.js, MySQL o Cypress. Para detalles no publicados, conviene consultar directamente al desarrollador.`};
}
export default function NovaAssistant({hidden=false}:{hidden?:boolean}){
  const [open,setOpen]=useState(false);
  const [input,setInput]=useState('');
  const [messages,setMessages]=useState<Message[]>([{id:0,role:'nova',body:welcome}]);
  const bottom=useRef<HTMLDivElement>(null);
  const field=useRef<HTMLInputElement>(null);
  const next=useRef(1);
  const suggestions=useMemo(()=>quick,[]);
  useEffect(()=>{if(open){bottom.current?.scrollIntoView({block:'nearest',behavior:'smooth'});field.current?.focus();}},[messages,open]);
  useEffect(()=>{if(!open)return;const onKey=(e:KeyboardEvent)=>{if(e.key==='Escape')setOpen(false)};window.addEventListener('keydown',onKey);return()=>window.removeEventListener('keydown',onKey)},[open]);
  function ask(text:string){const query=text.trim().slice(0,250);if(!query)return;const reply=answer(query);setMessages(m=>[...m,{id:next.current++,role:'visitor',body:query},{id:next.current++,role:'nova',...reply}]);setInput('');}
  if(hidden)return null;
  return <div className="nova-root">
    {open&&<section className="nova-panel" role="dialog" aria-label="NOVA, asistente del portfolio">
      <div className="nova-heading"><span className="nova-orb"/><div><strong>NOVA <span>/ ARCHIVO INTERACTIVO</span></strong><small>ASISTENTE LOCAL · DATOS DEL PORTFOLIO</small></div><button type="button" onClick={()=>setOpen(false)} aria-label="Cerrar NOVA">×</button></div>
      <div className="nova-messages" aria-live="polite" aria-relevant="additions text">
        {messages.map(message=><div key={message.id} className={'nova-message '+message.role}><span className="nova-role">{message.role==='nova'?'NOVA':'VISITANTE'}</span><p>{message.body}</p>{message.projects&&message.projects.length>0&&<div className="nova-results">{message.projects.map(p=><a href={p.links[0]?.href||'#origin-archive'} key={p.id} target={p.links.length?'_blank':undefined} rel={p.links.length?'noopener noreferrer':undefined}><img src={p.image} alt="" loading="lazy"/><span>{p.title}<small>{p.technologies.slice(0,3).join(' · ')}</small></span>↗</a>)}</div>}</div>)}<div ref={bottom}/>
      </div>
      <div className="nova-quick">{suggestions.map(s=><button type="button" key={s} onClick={()=>ask(s)}>{s}</button>)}</div>
      <form className="nova-form" onSubmit={e=>{e.preventDefault();ask(input)}}><label className="sr-only" htmlFor="nova-query">Preguntale a NOVA</label><input ref={field} id="nova-query" value={input} maxLength={250} placeholder="Preguntá por un proyecto o tecnología…" onChange={e=>setInput(e.target.value)}/><button type="submit" disabled={!input.trim()} aria-label="Enviar pregunta">↗</button></form>
      <p className="nova-disclaimer">Respuestas locales basadas en información publicada; sin modelo de IA remoto.</p>
    </section>}
    <button type="button" className="nova-launcher" onClick={()=>setOpen(o=>!o)} aria-expanded={open} aria-label={open?'Cerrar asistente NOVA':'Abrir asistente NOVA'}><span className="nova-orb"/> {open?'CERRAR NOVA':'PREGUNTAR A NOVA'} <span aria-hidden="true">↗</span></button>
  </div>;
}
