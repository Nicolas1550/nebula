'use client';
import {useCallback,useEffect,useRef,useState} from 'react';
import dynamic from 'next/dynamic';
import {worlds} from '../components/Universe';
import LaunchSequence from '../components/LaunchSequence';
import HyperspaceTransition from '../components/HyperspaceTransition';
import ProjectsArchive from '../components/ProjectsArchive';
const ProjectMuseum=dynamic(()=>import('../components/v10/ProjectMuseum'),{ssr:false,loading:()=> <div className="museum-loading">PREPARANDO GALERÍA HOLOGRÁFICA…</div>});
const NovaAssistant=dynamic(()=>import('../components/v10/NovaAssistant'),{ssr:false});
const RecruiterTour=dynamic(()=>import('../components/v10/RecruiterTour'),{ssr:false});
const PlanetLanding=dynamic(()=>import('../components/v10/PlanetLanding'),{ssr:false});
const Universe=dynamic(()=>import('../components/Universe'),{ssr:false});
const OriginStation=dynamic(()=>import('../components/OriginStation'),{ssr:false,loading:()=> <div className="station-loading">INICIALIZANDO ESTACIÓN ORIGIN…</div>});
const jobs=[['Botic Partners','Frontend / Full Stack Developer'],['Equilibrio AI','Full Stack Product Engineer'],['Ø UnderTango Club','Project Manager & Tech Lead'],['ChicksX','E2E Engineer'],['Chicks Gold Inc.','Product Engineer'],['Coderhouse','Tutor de desarrollo web e IA']];
function Origin({lowPower=false}:{lowPower?:boolean}){
  const [tab,setTab]=useState<'projects'|'experience'|'skills'>('projects');
  return <div className="inside origin-inside">
    <OriginStation compact={lowPower}/>
    <div className="station-archive" id="origin-archive">
      <div className="section-head"><span className="kicker">01 / ORIGIN · ARCHIVO PERSONAL</span><h2>El humano detrás<br/><em>del código.</em></h2><p>Desarrollador Full Stack · Product Engineer. Construyo experiencias digitales, aplicaciones y productos escalables.</p></div>
      <div className="identity"><img src="/portfolio/photo.webp" alt="Foto profesional"/><div><strong>Nicolás Luciuk</strong><span>FULL STACK DEVELOPER · PRODUCT ENGINEER</span><a href="https://portafolio-web-phi-five.vercel.app/" target="_blank" rel="noreferrer">VER PORTFOLIO ORIGINAL ↗</a></div></div>
      <div className="tabs" role="tablist" aria-label="Secciones de mi portfolio">{(['projects','experience','skills'] as const).map(t=><button role="tab" aria-selected={tab===t} className={tab===t?'active':''} key={t} onClick={()=>setTab(t)}>{({projects:'PROYECTOS',experience:'EXPERIENCIA',skills:'TECNOLOGÍAS'})[t]}</button>)}</div>
      {tab==='projects'&&<><ProjectMuseum lowPower={lowPower}/><ProjectsArchive/></>}
      {tab==='experience'&&<div className="experience-grid">{jobs.map(([company,role],i)=><article key={company}><span>0{i+1}</span><div><h3>{company}</h3><p>{role}</p></div></article>)}</div>}
      {tab==='skills'&&<div className="skills-grid">{['Next.js','React','TypeScript','JavaScript','Node.js','FastAPI','MySQL','Redux','Cypress','Tailwind CSS','Framer Motion','Three.js · NEBULA'].map(s=><span key={s}>{s}</span>)}</div>}
    </div>
  </div>;
}
// Módulos V11 aislados: se descargan sólo al entrar en el planeta correspondiente.
const Nexus=dynamic(()=>import('../components/v11/NexusLab'),{ssr:false,loading:()=> <div className="museum-loading">INICIALIZANDO LABORATORIO NEXUS…</div>});
const Inferno=dynamic(()=>import('../components/v11/InfernoMission'),{ssr:false,loading:()=> <div className="museum-loading">PREPARANDO MISIÓN INFERNO…</div>});
export default function Home(){
  const [selected,setSelected]=useState(1);
  const [quality,setQuality]=useState<'ultra'|'balanced'>('balanced');
  const [lowPower,setLowPower]=useState(false);
  const [focus,setFocus]=useState(false);
  const [showLaunch,setShowLaunch]=useState(true);
  const [entered,setEntered]=useState(false);
  const [descending,setDescending]=useState(false);
  const [warping,setWarping]=useState(false);
  const [landing,setLanding]=useState(false);
  const [tourOpen,setTourOpen]=useState(false);
  const [scanTick,setScanTick]=useState(1);
  const [pulseTick,setPulseTick]=useState(1);
  const [scanMessage,setScanMessage]=useState<'idle'|'scanning'|'complete'>('idle');
  const [reducedMotion,setReducedMotion]=useState(false);
  const w=worlds[selected];
  useEffect(()=>{
    const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setReducedMotion(reduce);
    if(reduce)setShowLaunch(false);
    if(window.matchMedia('(max-width: 700px), (pointer: coarse)').matches)setLowPower(true);
  },[]);
  useEffect(()=>{
    if(!showLaunch)return;
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){setShowLaunch(false);return;}
    const id=window.setTimeout(()=>setShowLaunch(false),4200);
    return()=>window.clearTimeout(id);
  },[showLaunch]);
  useEffect(()=>{
    if(!warping)return;
    const complete=window.setTimeout(()=>{setWarping(false);setDescending(false);setLanding(true)},3700);
    return()=>window.clearTimeout(complete);
  },[warping]);
  const finishLanding=useCallback(()=>{setLanding(false);setEntered(true)},[]);
  useEffect(()=>{
    if(scanMessage!=='scanning')return;
    const id=window.setTimeout(()=>setScanMessage('complete'),2250);
    return()=>window.clearTimeout(id);
  },[scanMessage,scanTick]);
  const details=[
    {title:'TU HISTORIA, TUS PROYECTOS',desc:'Conocé al desarrollador detrás del universo. Experiencia profesional, productos y tecnologías.',kind:'PLANETA TERRESTRE',tech:'ARCHIVO PROFESIONAL',signal:'ESTACIÓN ORIGIN'},
    {title:'LABORATORIO INTERACTIVO',desc:'Tres simulaciones interactivas: reactor, gravedad e interferencia de ondas.',kind:'MUNDO MINERAL',tech:'LABORATORIO VISUAL',signal:'EXPERIMENTO NEXUS'},
    {title:'DESAFÍO ESPACIAL',desc:'Pilotá entre asteroides: recuperá cinco núcleos para escapar de INFERNO.',kind:'MUNDO VOLCÁNICO',tech:'DESAFÍO INTERACTIVO',signal:'MISIÓN INFERNO'},
  ];
  function scan(){setScanTick(n=>n+1);setPulseTick(n=>n+1);setScanMessage('scanning');}
  function selectPlanet(i:number){
    if(warping||landing)return;
    setSelected(i);setFocus(true);setEntered(false);
    setScanTick(n=>n+1);setPulseTick(n=>n+1);setScanMessage('scanning');
  }
  function enterWorld(){
    if(warping||landing)return;
    if(reducedMotion){setEntered(true);return;}
    setShowLaunch(false);setFocus(true);setWarping(true);
  }
  function skipWarp(){setWarping(false);setLanding(false);setDescending(false);setEntered(true);}
  function replay(){setWarping(false);setLanding(false);setTourOpen(false);setEntered(false);setDescending(false);setFocus(false);setShowLaunch(true);}
  function openTour(){setWarping(false);setLanding(false);setShowLaunch(false);setTourOpen(true);}
  function tourToOrigin(){setSelected(0);setEntered(true);setTourOpen(false);setShowLaunch(false);setFocus(false);}
  return <main>
    <div className={showLaunch?'scene scene-preparing':'scene scene-reveal'}>
      {!entered&&!warping&&!landing&&!tourOpen&&<Universe selected={selected} descending={descending} quality={quality} focus={focus} onSelect={selectPlanet} lowPower={lowPower} scanTick={scanTick} pulseTick={pulseTick} onSlow={()=>setLowPower(true)}/>}
    </div>
    <div className="grain"/>
    <header><div className="brand"><span className="brand-mark">✧</span> NEBULA <span className="brand-light">/ BEYOND THE KNOWN</span></div><div className="header-right"><button className="tour-entrance" type="button" onClick={openTour}>◈ RECORRIDO RECLUTADOR · 30S</button><span className="status-dot"/> SYSTEM ONLINE <button className="quality-switch" type="button" title="Cambiar calidad visual" onClick={()=>{setLowPower(false);setQuality(q=>q==='ultra'?'balanced':'ultra')}}>CALIDAD {quality==='ultra'?'ALTA':'EQUILIBRADA'} ⇄</button><span className="edition">PORTFOLIO UNIVERSE / 011</span></div></header>
    {!entered&&!warping&&!landing&&!tourOpen? <>
      <div className="side-label">THREE WORLDS <span> / ONE DEVELOPER</span></div>
      <section className="world-panel">
        <div className="eyebrow">DESTINO SELECCIONADO <span> / 0{selected+1}</span></div>
        <h1>{w.name}<span className="period">.</span></h1>
        <div className="subtitle">{details[selected].title}</div>
        <p>{details[selected].desc}</p>
        <button className="primary v8-entry" onClick={enterWorld}>INICIAR VIAJE A {w.name} <span>⟶</span></button>
        <div className="scan-card">
          <div className="scan-title"><span className="scan-indicator"/> PLANETARY ANALYSIS <strong>0{selected+1}</strong></div>
          <div className="scan-row"><span>TIPO</span><b>{details[selected].kind}</b></div>
          <div className="scan-row"><span>MÓDULO</span><b>{details[selected].tech}</b></div>
          <div className="scan-row"><span>ESTADO</span><b>{scanMessage==='scanning'?'ESCANEANDO…':scanMessage==='complete'?'DATOS DISPONIBLES':'LISTO PARA ESCANEAR'}</b></div>
          {scanMessage==='scanning'&&<div className="scan-progress"><span/></div>}
          <button onClick={scan} className="scan-trigger" type="button">◈ {scanMessage==='scanning'?'REINICIAR ESCÁNER':'ESCANEAR PLANETA'} ↗</button>
        </div>
        {focus&&<button className="overview-link" onClick={()=>setFocus(false)}>↖ VER LOS TRES PLANETAS</button>}
      </section>
      <nav className="planet-nav" aria-label="Seleccionar planeta">{worlds.map((p,i)=><button className={selected===i?'active':''} key={p.name} aria-current={selected===i?'true':undefined} onClick={()=>selectPlanet(i)}><span className="nav-index">0{i+1}</span><span className="nav-name">{p.name}</span><span className="nav-line"/></button>)}</nav>
      <div className="controls-hint">ARRASTRAR PARA ORBITAR <span>•</span> SCROLL PARA ZOOM <span>•</span> ESCANEAR MUNDO</div>
      <span className="universe-live"><i/> DEEP SPACE / LIVE ENVIRONMENT</span>
    </>:entered?<div className="portal"><div className="portal-top"><button onClick={()=>{setEntered(false);setFocus(false);setScanMessage('idle')}}>← VOLVER AL UNIVERSO</button><span>NEBULA / {w.name} / ACTIVE SESSION</span></div><div className="portal-scroll">{selected===0?<Origin lowPower={lowPower}/>:selected===1?<Nexus/>:<Inferno/>}</div></div>:null}
    <footer><span>© 2026 NICOLÁS LUCIUK · NEBULA</span><a href="https://portafolio-web-phi-five.vercel.app/" target="_blank" rel="noreferrer">PORTFOLIO CLÁSICO ↗</a><button onClick={replay}>REPETIR INTRO ↺</button></footer>
    {landing&&<PlanetLanding world={w.name as 'ORIGIN'|'NEXUS'|'INFERNO'} lowPower={lowPower} onComplete={finishLanding} onSkip={skipWarp}/>}
    {tourOpen&&<RecruiterTour onClose={()=>setTourOpen(false)} onExplore={tourToOrigin}/>}
    {!showLaunch&&!warping&&!landing&&!tourOpen&&<NovaAssistant/>}
    {warping&&<HyperspaceTransition key={selected} world={w.name} accent={w.accent} lowPower={lowPower} onSkip={skipWarp}/>}
    {showLaunch&&!warping&&!landing&&!tourOpen&&<LaunchSequence onSkip={()=>setShowLaunch(false)}/>}
  </main>;
}
