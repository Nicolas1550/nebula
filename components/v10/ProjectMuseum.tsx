'use client';
import {Canvas, useFrame, useThree} from '@react-three/fiber';
import {Suspense,useEffect,useMemo,useRef,useState} from 'react';
import {useTexture} from '@react-three/drei';
import * as THREE from 'three';
import {portfolioProjects, type PortfolioProject} from '../../data/portfolioProjects';

const width=3.5;
function Exhibit({project,slot,onPick}:{project:PortfolioProject;slot:number;onPick:()=>void}){
  const tex=useTexture(`/portfolio/thumbs/${project.id}.webp`);
  useEffect(()=>{tex.colorSpace=THREE.SRGBColorSpace;tex.anisotropy=4;tex.needsUpdate=true},[tex]);
  const x=slot*3.9;
  return <group position={[x,1.75,slot===0?0:-1.2]} rotation={[0,-slot*.12,0]}>
    <mesh position={[0,0,-.12]}><boxGeometry args={[3.65,2.5,.18]}/><meshStandardMaterial color="#162b44" metalness={.65} roughness={.35}/></mesh>
    <mesh onClick={e=>{e.stopPropagation();onPick()}} onPointerOver={()=>{document.body.style.cursor='pointer'}} onPointerOut={()=>{document.body.style.cursor='auto'}}>
      <planeGeometry args={[width,1.97]}/><meshBasicMaterial map={tex} toneMapped={false}/>
    </mesh>
    <mesh position={[0,-1.34,0]}><boxGeometry args={[3.6,.12,.26]}/><meshBasicMaterial color="#6cc6ff" toneMapped={false}/></mesh>
    <mesh position={[0,1.21,0]}><boxGeometry args={[3.64,.035,.2]}/><meshBasicMaterial color={slot===0?'#acf3ff':'#4c719c'}/></mesh>
    <mesh position={[0,-1.7,0]}><boxGeometry args={[2.2,.35,.55]}/><meshStandardMaterial color="#173452" metalness={.62} roughness={.35}/></mesh>
  </group>;
}
function CameraEase({active}:{active:number}){
  const {camera,invalidate}=useThree();const ref=useRef(0);
  useEffect(()=>{ref.current=1;invalidate()},[active,invalidate]);
  useFrame((_,dt)=>{
    if(ref.current<.001)return;
    const desired=new THREE.Vector3(0,3.2,active===0?12.1:11.4);
    const delta=camera.position.distanceTo(desired);
    camera.position.lerp(desired,Math.min(1,dt*5));camera.lookAt(0,1.7,-.7);
    if(delta>.005){invalidate()}else{ref.current=0;camera.position.copy(desired);}
  });return null;
}
function Room({projects,onPick}:{projects:PortfolioProject[];onPick:(id:string)=>void}){
  return <>
    <color attach="background" args={['#040b18']}/><fog attach="fog" args={['#050e21',12,45]}/>
    <ambientLight intensity={.8}/><hemisphereLight args={['#71bdff','#0b1120',1.4]}/>
    <directionalLight position={[2,9,8]} intensity={2} color="#abdbff"/>
    <pointLight position={[-7,4,3]} intensity={18} distance={22} color="#6574fa"/>
    <pointLight position={[6,4,4]} intensity={15} distance={20} color="#66cfff"/>
    <mesh rotation={[-Math.PI/2,0,0]} position={[0,-.28,-2]}><planeGeometry args={[40,36]}/><meshStandardMaterial color="#081626" roughness={.4} metalness={.55}/></mesh>
    {Array.from({length:9},(_,i)=><mesh key={i} rotation={[-Math.PI/2,0,0]} position={[0,-.26,-i*2]}><planeGeometry args={[32,.018]}/><meshBasicMaterial color="#3386b8" transparent opacity={.25}/></mesh>)}
    {[-1,1].map(s=><group key={s}><mesh position={[s*7.9,2.0,-4]}><boxGeometry args={[.16,5,20]}/><meshStandardMaterial color="#163555" metalness={.75} roughness={.3}/></mesh><mesh position={[s*7.8,4.6,-4]}><boxGeometry args={[.08,.1,20]}/><meshBasicMaterial color="#82c9ff"/></mesh></group>)}
    {projects.map((p,i)=><Exhibit key={p.id} project={p} slot={i-1} onPick={()=>onPick(p.id)}/>)}
    <CameraEase active={projects[1]?1:0}/>
  </>;
}
function MuseumCanvas({projects,onPick}:{projects:PortfolioProject[];onPick:(id:string)=>void}){
  return <Canvas frameloop="demand" dpr={[.8,1.25]} gl={{antialias:true,powerPreference:'low-power',alpha:false}} camera={{position:[0,3.2,12.1],fov:43,near:.1,far:90}} fallback={<div className="museum-fallback">Galería 3D no disponible. Podés explorar todos los proyectos abajo.</div>}>
    <Suspense fallback={null}><Room projects={projects} onPick={onPick}/></Suspense>
  </Canvas>;
}
export default function ProjectMuseum({lowPower=false}:{lowPower?:boolean}){
  const [index,setIndex]=useState(0);
  const [visible,setVisible]=useState(false);
  const host=useRef<HTMLElement>(null);
  useEffect(()=>{
    const node=host.current;if(!node)return;
    const observer=new IntersectionObserver(entries=>setVisible(entries[0]?.isIntersecting??false),{rootMargin:'100px'});
    observer.observe(node);return()=>observer.disconnect();
  },[]);
  const project=portfolioProjects[index];
  const three=useMemo(()=>[-1,0,1].map(delta=>portfolioProjects[(index+delta+portfolioProjects.length)%portfolioProjects.length]),[index]);
  const advance=(delta:number)=>setIndex(i=>(i+delta+portfolioProjects.length)%portfolioProjects.length);
  return <section className="museum" ref={host} aria-labelledby="museum-heading">
    <div className="museum-heading"><div><span className="kicker">ORIGIN / HALL OF WORK / 014</span><h3 id="museum-heading">MUSEO DE <em>PROYECTOS.</em></h3><p>Una galería espacial interactiva con los 14 trabajos reales. Usá las flechas para recorrerlos.</p></div><span className="museum-badge">MÓDULO 3D · ACCESO LIBRE</span></div>
    <div className="museum-stage">
      {!lowPower&&visible?<MuseumCanvas projects={three} onPick={id=>setIndex(portfolioProjects.findIndex(p=>p.id===id))}/>:<div className="museum-static"><img src={'/portfolio/thumbs/'+project.id+'.webp'} alt={'Vista del proyecto '+project.title} loading="lazy"/><span>{lowPower?'VISTA LIGERA ACTIVADA':'GALERÍA DISPONIBLE AL DESPLAZARSE'}</span></div>}
      <div className="museum-frame-label"><span>EXHIBIT / {String(index+1).padStart(2,'0')} OF 14</span><span>ORIGIN / HALL 01</span></div>
    </div>
    <div className="museum-console">
      <button type="button" onClick={()=>advance(-1)} className="museum-arrow" aria-label="Proyecto anterior">←</button>
      <div className="museum-selected"><span className="kicker">ARCHIVO SELECCIONADO / {project.id.toUpperCase()}</span><h4>{project.title}</h4><p>{project.summary}</p><div className="museum-tags">{project.technologies.slice(0,5).map(t=><span key={t}>{t}</span>)}</div>{project.demoNotice&&<div className="project-demo-notice" role="note"><span className="project-demo-notice-label">◉ DEMOSTRACIÓN DISPONIBLE</span><p>{project.demoNotice}</p></div>}<div className="museum-links">{project.links.map(l=><a href={l.href} key={l.href} className={l.label==="VIDEO DEMO"?"project-demo-link":undefined} target="_blank" rel="noopener noreferrer">{l.label==="VIDEO DEMO"?"▶ VER VIDEO DEMO":l.label} ↗</a>)}{!project.links.length&&<span>Sin enlace público publicado</span>}</div></div>
      <button type="button" onClick={()=>advance(1)} className="museum-arrow" aria-label="Siguiente proyecto">→</button>
    </div>
    <div className="museum-index"><label htmlFor="museum-select">IR DIRECTAMENTE A UN PROYECTO</label><select id="museum-select" value={index} onChange={e=>setIndex(Number(e.target.value))}>{portfolioProjects.map((p,i)=><option key={p.id} value={i}>{String(i+1).padStart(2,'0')} / {p.title}</option>)}</select><a href="#all-projects">VER GALERÍA COMPLETA ↓</a></div>
  </section>;
}
