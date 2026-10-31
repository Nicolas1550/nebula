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
function Nexus(){const [count,setCount]=useState(90),[force,setForce]=useState(55),[hue,setHue]=useState(190);const canvas=useRef<HTMLCanvasElement>(null);useEffect(()=>{const el=canvas.current;if(!el)return;const ctx=el.getContext('2d');if(!ctx)return;let raf=0;let t=0;const particles=Array.from({length:count},(_,i)=>({a:i*2.39996,r:Math.sqrt((i+.5)/count),v:.5+Math.random()}));function draw(){if(!el||!ctx)return;const pixelRatio=Math.min(window.devicePixelRatio||1,1.5);const w=Math.max(1,Math.floor(el.clientWidth*pixelRatio)),h=Math.max(1,Math.floor(el.clientHeight*pixelRatio));if(el.width!==w||el.height!==h){el.width=w;el.height=h;}ctx.clearRect(0,0,w,h);const cx=w/2,cy=h/2,scale=Math.min(w,h)*.38;t+=.009;for(const p of particles){const angle=p.a+t*p.v*(force/70);const radius=p.r*scale*(.7+.22*Math.sin(t*2+p.a));const x=cx+Math.cos(angle)*radius,y=cy+Math.sin(angle)*radius*.65;ctx.beginPath();ctx.arc(x,y,(1.3+p.v*1.5)*pixelRatio,0,Math.PI*2);ctx.fillStyle=`hsla(${hue+p.r*65},100%,75%,${.35+.6*(1-p.r)})`;ctx.fill()}raf=requestAnimationFrame(draw)}draw();return()=>cancelAnimationFrame(raf)},[count,force,hue]);return <div className="inside"><div className="section-head"><span className="kicker">02 / NEXUS · EXPERIMENTAL LAB</span><h2>El código también<br/><em>puede sentirse vivo.</em></h2><p>Laboratorio interactivo: una simulación de partículas renderizada en Canvas 2D con parámetros modificables en tiempo real.</p></div><div className="lab-layout"><div className="lab-view"><canvas ref={canvas} aria-label="Simulación animada de partículas"/><span className="lab-corner">LIVE PARTICLE FIELD / EXPERIMENT 001</span></div><div className="lab-controls"><span className="kicker">PARAMETERS / REAL TIME</span><label>PARTÍCULAS <b>{count}</b><input type="range" min="20" max="250" value={count} onChange={e=>setCount(+e.target.value)}/></label><label>VELOCIDAD <b>{force}%</b><input type="range" min="5" max="100" value={force} onChange={e=>setForce(+e.target.value)}/></label><label>COLOR / HUE <b>{hue}°</b><input type="range" min="0" max="360" value={hue} onChange={e=>setHue(+e.target.value)}/></label><button className="outline" onClick={()=>{setCount(90);setForce(55);setHue(190)}}>REINICIAR SIMULACIÓN ↺</button><p>Próxima evolución: WebGL shaders, física y GPU particles.</p></div></div></div>}
function Inferno(){const [playing,setPlaying]=useState(false),[score,setScore]=useState(0),[time,setTime]=useState(30),[pos,setPos]=useState(50);const [targets,setTargets]=useState<number[]>([15,42,70,88]);const keys=useRef({left:false,right:false});useEffect(()=>{if(!playing)return;const id=setInterval(()=>setTime(t=>Math.max(0,t-1)),1000);return()=>clearInterval(id)},[playing]);useEffect(()=>{if(time===0)setPlaying(false)},[time]);useEffect(()=>{if(!playing)return;let id=0;const move=()=>{setPos(p=>Math.max(5,Math.min(95,p+(keys.current.left?-1.1:0)+(keys.current.right?1.1:0))));id=requestAnimationFrame(move)};move();return()=>cancelAnimationFrame(id)},[playing]);useEffect(()=>{const down=(e:KeyboardEvent)=>{if(['ArrowLeft','ArrowRight',' '].includes(e.key))e.preventDefault();if(e.key==='ArrowLeft'||e.key.toLowerCase()==='a')keys.current.left=true;if(e.key==='ArrowRight'||e.key.toLowerCase()==='d')keys.current.right=true;if(e.key===' '&&playing)collect()};const up=(e:KeyboardEvent)=>{if(e.key==='ArrowLeft'||e.key.toLowerCase()==='a')keys.current.left=false;if(e.key==='ArrowRight'||e.key.toLowerCase()==='d')keys.current.right=false};window.addEventListener('keydown',down);window.addEventListener('keyup',up);return()=>{window.removeEventListener('keydown',down);window.removeEventListener('keyup',up)}},[playing,pos,targets]);function collect(){if(!playing)return;const match=targets.findIndex(x=>Math.abs(x-pos)<11);if(match>=0){setScore(s=>s+100);setTargets(t=>t.filter((_,i)=>i!==match));}}function start(){setPlaying(true);setScore(0);setTime(30);setPos(50);setTargets([15,42,70,88])}return <div className="inside"><div className="section-head"><span className="kicker">03 / INFERNO · FLIGHT SIMULATION</span><h2>Tu misión:<br/><em>recuperar la energía.</em></h2><p>Un minijuego arcade experimental. Pilotá la nave y recuperá cuatro núcleos antes de que se termine el tiempo.</p></div><div className="game-hud"><span>SCORE <b>{score.toString().padStart(4,'0')}</b></span><span>ENERGY CORES <b>{4-targets.length}/4</b></span><span>TIME <b>{time}s</b></span></div><div className="game-field"><div className="game-stars"/>{targets.map((x,i)=><button aria-label={'Recoger núcleo '+(i+1)} onClick={()=>{if(playing&&Math.abs(x-pos)<11)collect()}} key={x} className="core" style={{left:x+'%'}}>✦</button>)}<div className="ship" style={{left:pos+'%'}}>▲<span>╱╲</span></div>{!playing&&<div className="game-message"><h3>{time===0?'TIEMPO AGOTADO':targets.length===0?'MISIÓN COMPLETADA':'MISSION READY'}</h3><p>{targets.length===0?'Recuperaste todos los núcleos.':'Mové la nave con A/D o ←/→ y presioná ESPACIO cerca de cada núcleo.'}</p><button className="primary" onClick={start}>{time===30?'INICIAR MISIÓN':'REINTENTAR'} ↗</button></div>}</div><div className="game-actions"><button onPointerDown={()=>keys.current.left=true} onPointerUp={()=>keys.current.left=false} onPointerLeave={()=>keys.current.left=false}>← IZQUIERDA</button><button onClick={collect} disabled={!playing}>RECOGER ✦</button><button onPointerDown={()=>keys.current.right=true} onPointerUp={()=>keys.current.right=false} onPointerLeave={()=>keys.current.right=false}>DERECHA →</button></div><p className="note">Prototipo arcade 2D integrado en el universo 3D. Próxima fase: vuelo espacial 3D y obstáculos.</p></div>}
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
    {title:'LABORATORIO INTERACTIVO',desc:'Explorá experimentos visuales y modificá simulaciones en tiempo real.',kind:'MUNDO MINERAL',tech:'LABORATORIO VISUAL',signal:'EXPERIMENTO NEXUS'},
    {title:'DESAFÍO ESPACIAL',desc:'Una misión arcade para poner a prueba tus reflejos y recuperar energía.',kind:'MUNDO VOLCÁNICO',tech:'DESAFÍO INTERACTIVO',signal:'MISIÓN INFERNO'},
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
    <header><div className="brand"><span className="brand-mark">✧</span> NEBULA <span className="brand-light">/ BEYOND THE KNOWN</span></div><div className="header-right"><button className="tour-entrance" type="button" onClick={openTour}>◈ RECORRIDO RECLUTADOR · 30S</button><span className="status-dot"/> SYSTEM ONLINE <button className="quality-switch" type="button" title="Cambiar calidad visual" onClick={()=>{setLowPower(false);setQuality(q=>q==='ultra'?'balanced':'ultra')}}>CALIDAD {quality==='ultra'?'ALTA':'EQUILIBRADA'} ⇄</button><span className="edition">PORTFOLIO UNIVERSE / 010</span></div></header>
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
