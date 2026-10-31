'use client';
import {Canvas, useFrame} from '@react-three/fiber';
import {useEffect,useMemo,useRef,useState,type MutableRefObject} from 'react';
import * as THREE from 'three';

type Props={world:'ORIGIN'|'NEXUS'|'INFERNO';lowPower:boolean;onComplete:()=>void;onSkip:()=>void};
const palettes={ORIGIN:{sky:'#16426a',fog:'#1a4167',ground:'#385d62',rocks:'#283d4e',glow:'#8ce6ff'},NEXUS:{sky:'#311f5b',fog:'#35205c',ground:'#45416c',rocks:'#3c305b',glow:'#c1a0ff'},INFERNO:{sky:'#672a22',fog:'#652c28',ground:'#37262b',rocks:'#271c27',glow:'#ff9a64'}};
function seeded(i:number){return ((Math.sin(i*78.233+12.39)*43758.5453)%1+1)%1;}
function LandingTerrain({world,progress}:{world:Props['world'];progress:MutableRefObject<number>}){
  const mesh=useMemo(()=>{
    const g=new THREE.PlaneGeometry(170,155,52,44);
    const pos=g.getAttribute('position') as THREE.BufferAttribute;
    for(let i=0;i<pos.count;i++){
      const x=pos.getX(i),y=pos.getY(i);
      const waves=Math.sin(x*.19+y*.11)*1.15+Math.cos(x*.41-y*.27)*1.2+Math.sin(x*.88+y*.59)*.34;
      const valley=Math.exp(-Math.pow(x/12,2))*4.9;
      pos.setZ(i,Math.max(-1.4,waves*1.35+Math.abs(x)*.13-valley-2));
    }
    g.computeVertexNormals();return g;
  },[]);
  useEffect(()=>()=>mesh.dispose(),[mesh]);
  return <group>
    <mesh geometry={mesh} rotation={[-Math.PI/2,0,0]} position={[0,-1,-30]}><meshStandardMaterial color={palettes[world].ground} roughness={1} flatShading/></mesh>
    {Array.from({length:16},(_,i)=>{
      const side=i%2===0?-1:1;const depth=-6-Math.floor(i/2)*12;
      const x=side*(10+seeded(i)*15);
      const height=5+seeded(i+31)*8;
      return <mesh key={i} position={[x,(height/2)-.4,depth]} rotation={[0,seeded(i+11)*3,0]}><coneGeometry args={[2+seeded(i+9)*2,height,5]}/><meshStandardMaterial color={palettes[world].rocks} roughness={1} flatShading/></mesh>
    })}
    <group position={[0,.4,-30]}>
      <mesh position={[0,-.1,0]}><cylinderGeometry args={[4.2,4.5,.6,24]}/><meshStandardMaterial color="#16283b" metalness={.7} roughness={.4}/></mesh>
      <mesh position={[0,.22,0]} rotation={[-Math.PI/2,0,0]}><torusGeometry args={[3.5,.12,8,48]}/><meshBasicMaterial color={palettes[world].glow} toneMapped={false}/></mesh>
      <mesh position={[0,1.5,0]}><cylinderGeometry args={[1.6,2.2,2.6,8]}/><meshStandardMaterial color="#304257" metalness={.65} roughness={.35}/></mesh>
      <mesh position={[0,3,0]}><sphereGeometry args={[1.48,24,12,0,Math.PI*2,0,Math.PI/2]}/><meshStandardMaterial color="#668aab" metalness={.8} roughness={.25} transparent opacity={.7} side={THREE.DoubleSide}/></mesh>
      <mesh position={[0,4.8,0]}><sphereGeometry args={[.22,12,12]}/><meshBasicMaterial color={palettes[world].glow}/></mesh>
      <pointLight position={[0,4,1]} intensity={8} distance={15} color={palettes[world].glow}/>
    </group>
  </group>;
}
function LandingFlight({world,lowPower,onProgress}:{world:Props['world'];lowPower:boolean;onProgress:(progress:number)=>void}){
  const start=useRef<number|null>(null),lastUpdate=useRef(0),progress=useRef(0);
  useFrame(({clock,camera},dt)=>{
    if(start.current===null)start.current=clock.elapsedTime;
    const t=Math.min(1,(clock.elapsedTime-start.current)/4.1);
    progress.current=t;
    const ease=t*t*(3-2*t);
    camera.position.set(.9*(1-ease),14-10*ease,34-54*ease);
    camera.lookAt(0,2.0,-29);
    if(t-lastUpdate.current>.045||t===1){lastUpdate.current=t;onProgress(t)}
  });
  return <>
    <color attach="background" args={[palettes[world].sky]}/><fog attach="fog" args={[palettes[world].fog,18,97]}/>
    <ambientLight intensity={.65}/><hemisphereLight args={['#b4d8ff','#1c192a',1.6]}/>
    <directionalLight position={[-15,22,-20]} intensity={3.4} color={world==='INFERNO'?'#ffac7c':'#d7e9ff'}/>
    <LandingTerrain world={world} progress={progress}/>
  </>;
}
export default function PlanetLanding({world,lowPower,onComplete,onSkip}:Props){
  const [progress,setProgress]=useState(0);
  const [reduced,setReduced]=useState(false);
  useEffect(()=>{const media=window.matchMedia('(prefers-reduced-motion: reduce)');setReduced(media.matches)},[]);
  useEffect(()=>{const timeout=window.setTimeout(onComplete,reduced?600:4400);return()=>window.clearTimeout(timeout)},[onComplete,reduced]);
  return <div className={'landing-screen landing-'+world.toLowerCase()} role="status" aria-label={'Aterrizaje en '+world}>
    {!reduced&&!lowPower&&<div className="landing-webgl"><Canvas camera={{position:[.9,14,34],fov:63,near:.1,far:200}} dpr={[.75,1.15]} gl={{antialias:false,powerPreference:'low-power'}} fallback={<div className="landing-static"/>}><LandingFlight world={world} lowPower={lowPower} onProgress={setProgress}/></Canvas></div>}
    {(reduced||lowPower)&&<div className="landing-static" style={{backgroundImage:`linear-gradient(180deg,transparent,#040814f2),url(/social/${world.toLowerCase()}-preview.webp)`}}/>}
    <div className="landing-clouds" aria-hidden="true"/><div className="landing-sweep" aria-hidden="true"/>
    <div className="landing-top"><span>NEBULA / ATMOSPHERIC ENTRY</span><span>DESTINO: {world}</span></div>
    <div className="landing-center"><small>{progress<.32?'ATRAVESANDO ATMÓSFERA':progress<.79?'SUPERFICIE DETECTADA':'APROXIMACIÓN A LA ESTACIÓN'}</small><h2>BIENVENIDO A <em>{world}</em></h2><p>{world==='ORIGIN'?'Cargando la estación y el archivo profesional…':world==='NEXUS'?'Preparando el laboratorio experimental…':'Inicializando misión espacial…'}</p><div className="landing-progress"><span style={{width:`${Math.max(5,progress*100)}%`}}/></div></div>
    <button className="landing-skip" type="button" onClick={onSkip}>SALTAR ATERRIZAJE ↗</button>
    <span className="landing-bottom">DESCENSO CINEMATOGRÁFICO · ESCENA 3D PROCEDURAL</span>
  </div>;
}
