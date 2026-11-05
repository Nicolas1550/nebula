'use client';
import {useEffect,useRef,useState} from 'react';
import {portfolioProjects} from '../../data/portfolioProjects';
const highlights=portfolioProjects.filter(p=>p.featured).slice(0,3);
const duration=5000;
const slides=[
 {eyebrow:'00 / EXPEDITION BRIEF',title:'NO ES UN PORTFOLIO NORMAL.',subtitle:`Tres mundos, ${portfolioProjects.length} proyectos y una experiencia interactiva construida con código real.`,image:'/social/nebula-v8-cover.jpg'},
 {eyebrow:'01 / THE DEVELOPER',title:'NICOLÁS LUCIUK',subtitle:'Full Stack Developer · Product Engineer · Desarrollo, producto y experiencia de usuario.',image:'/portfolio/photo.webp'},
 {eyebrow:'02 / ENGINEERING',title:'PROYECTOS QUE EXISTEN.',subtitle:'Aplicaciones web, e-commerce, QA y proyectos profesionales. Cada ficha incluye tecnologías y enlaces publicados.',image:highlights[0]?.image??'/social/nebula-v10-cover.jpg'},
 {eyebrow:'03 / FEATURED WORK',title:'DEL DISEÑO AL PRODUCTO.',subtitle:'Trabajos seleccionados con un enfoque en rendimiento, funcionalidad, integraciones y calidad.',image:highlights[1]?.image??'/social/nebula-v10-cover.jpg'},
 {eyebrow:'04 / TECH STACK',title:'TECNOLOGÍA APLICADA.',subtitle:'React, Next.js, TypeScript, APIs, bases de datos y automatización E2E. NEBULA suma WebGL y gráficos 3D.',image:highlights[2]?.image??'/social/nebula-v10-cover.jpg'},
 {eyebrow:'05 / YOUR NEXT CONNECTION',title:'¿CONSTRUIMOS ALGO?',subtitle:`Explorá los ${portfolioProjects.length} proyectos, probá los experimentos y descubrí el trabajo detrás de NEBULA.`,image:'/social/origin-preview.webp'},
];
export default function RecruiterTour({onClose,onExplore}:{onClose:()=>void;onExplore:()=>void}){
  const [step,setStep]=useState(0),[elapsed,setElapsed]=useState(0),[paused,setPaused]=useState(false),[finished,setFinished]=useState(false);
  const time=useRef(0);const lastPaint=useRef(0);
  useEffect(()=>{const onVisibility=()=>{if(document.hidden)setPaused(true)};document.addEventListener('visibilitychange',onVisibility);return()=>document.removeEventListener('visibilitychange',onVisibility)},[]);
  useEffect(()=>{
    if(paused||finished)return;
    let last=0;let raf=0;
    const tick=(now:number)=>{if(!last)last=now;const dt=Math.min(now-last,150);last=now;time.current+=dt;
      const n=Math.min(slides.length-1,Math.floor(time.current/duration));
      if(n!==step)setStep(n);
      if(now-lastPaint.current>=90){lastPaint.current=now;setElapsed(Math.min(30000,time.current));}
      if(time.current>=30000){setFinished(true);setPaused(true);return;}
      raf=requestAnimationFrame(tick);
    };raf=requestAnimationFrame(tick);return()=>cancelAnimationFrame(raf);
  },[paused,finished,step]);
  const choose=(i:number)=>{const target=Math.max(0,Math.min(slides.length-1,i));time.current=target*duration;setElapsed(time.current);setStep(target);setFinished(false)};
  const current=slides[step];
  return <section className="tour" role="dialog" aria-modal="true" aria-label="Recorrido para reclutadores de 30 segundos">
    <div className="tour-backdrop" style={{backgroundImage:`linear-gradient(90deg,#030914ef 6%,#0309145a 100%),url('${current.image}')`}}/>
    <div className="tour-top"><div className="tour-brand">✧ NEBULA <span>/ RECRUITER MODE</span></div><div className="tour-tools"><span>{String(Math.ceil(Math.max(0,30000-elapsed)/1000)).padStart(2,'0')}s RESTANTES</span><button type="button" onClick={()=>setPaused(p=>!p)} aria-label={paused?'Reanudar recorrido':'Pausar recorrido'}>{paused?'REANUDAR ▶':'PAUSA ❚❚'}</button><button type="button" onClick={onClose}>CERRAR ×</button></div></div>
    <div className="tour-content" key={step}><span className="kicker">{current.eyebrow}</span><h2>{current.title}</h2><p>{current.subtitle}</p>
      {step===2||step===3?<div className="tour-projects">{highlights.map(p=><a href={p.links[0]?.href??'#'} target="_blank" rel="noopener noreferrer" key={p.id}><img src={p.image} alt=""/><span>{p.title}<small>{p.technologies.slice(0,3).join(' · ')}</small></span>↗</a>)}</div>:null}
      {step===4&&<div className="tour-tech">{['React','Next.js','TypeScript','Node.js','Cypress','Three.js','MySQL'].map(t=><span key={t}>{t}</span>)}</div>}
      {step===5&&<div className="tour-call"><button type="button" onClick={onExplore}>EXPLORAR PORTFOLIO COMPLETO ↗</button><a href="https://portafolio-web-phi-five.vercel.app/" target="_blank" rel="noopener noreferrer">PORTFOLIO ORIGINAL ↗</a></div>}
    </div>
    <div className="tour-bottom"><div className="tour-dots" aria-label="Diapositivas del recorrido">{slides.map((s,i)=><button type="button" key={s.eyebrow} title={s.eyebrow} aria-label={'Ver parte '+(i+1)} aria-current={i===step?'step':undefined} onClick={()=>choose(i)}><span style={{width:i<step?'100%':i===step?`${Math.min(100,Math.max(0,elapsed/duration-i)*100)}%`:'0%'}}/></button>)}</div><div className="tour-nav"><span>0{step+1} / 06</span><button type="button" onClick={()=>choose(step-1)} disabled={step===0}>← ANTERIOR</button><button type="button" onClick={()=>{if(step===5){onExplore()}else choose(step+1)}}>{step===5?'IR A ORIGIN ↗':'SIGUIENTE →'}</button></div></div>
  </section>;
}
