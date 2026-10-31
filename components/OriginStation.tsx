'use client';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

type Props={ compact?:boolean };
const lightBlue='#87dfff';
function StationGeometry(){
  const beacon=useRef<THREE.Mesh>(null);
  const drone=useRef<THREE.Group>(null);
  useFrame(({clock},dt)=>{
    if(beacon.current){beacon.current.rotation.y+=Math.min(dt,.05)*.2;}
    if(drone.current){const t=clock.elapsedTime*.38;drone.current.position.set(Math.sin(t)*4.6,2.45+Math.sin(t*2)*.22,Math.cos(t)*1.9-1);drone.current.rotation.y=-t;}
  });
  const posts=useMemo(()=>Array.from({length:12},(_,i)=>i*Math.PI/6),[]);
  return <group position={[0,-1.65,0]}>
    <mesh position={[0,-.18,0]} receiveShadow><cylinderGeometry args={[3.85,4.1,.4,32]}/><meshStandardMaterial color="#182c43" metalness={.58} roughness={.52}/></mesh>
    <mesh position={[0,.06,0]} rotation={[-Math.PI/2,0,0]}><ringGeometry args={[2.85,3.02,64]}/><meshBasicMaterial color="#43a9ed" side={THREE.DoubleSide} transparent opacity={.8}/></mesh>
    <mesh position={[0,.05,0]} rotation={[-Math.PI/2,0,0]}><ringGeometry args={[1.7,1.77,64]}/><meshBasicMaterial color="#72dbff" transparent opacity={.45} side={THREE.DoubleSide}/></mesh>
    {posts.map((a,i)=><group key={i} position={[Math.cos(a)*3,0,Math.sin(a)*3]}><mesh position={[0,.42,0]}><boxGeometry args={[.15,.82,.15]}/><meshStandardMaterial color="#244c66" metalness={.8} roughness={.24}/></mesh><mesh position={[0,.86,0]}><boxGeometry args={[.2,.06,.2]}/><meshBasicMaterial color={i%3===0?'#bfa8ff':lightBlue}/></mesh></group>)}
    <mesh position={[0,.3,0]}><cylinderGeometry args={[1.8,2.15,.68,12]}/><meshStandardMaterial color="#142b44" metalness={.67} roughness={.3}/></mesh>
    <mesh position={[0,.8,0]}><cylinderGeometry args={[1.6,1.7,.52,12]}/><meshStandardMaterial color="#2e5372" metalness={.7} roughness={.28}/></mesh>
    <mesh position={[0,1.47,0]}><sphereGeometry args={[1.59,32,20,0,Math.PI*2,0,Math.PI/2]}/><meshStandardMaterial color="#142b4b" metalness={.82} roughness={.21} transparent opacity={.88} side={THREE.DoubleSide}/></mesh>
    <mesh position={[0,1.48,0]} rotation={[-Math.PI/2,0,0]}><torusGeometry args={[1.58,.055,8,64]}/><meshBasicMaterial color="#78d2ff"/></mesh>
    <mesh position={[0,1.52,0]} rotation={[0,0,.04]}><cylinderGeometry args={[.035,.035,3.35,6]}/><meshBasicMaterial color="#8edfff" transparent opacity={.7}/></mesh>
    <group position={[0,2.75,0]} ref={beacon}>
      <mesh><sphereGeometry args={[.15,14,12]}/><meshBasicMaterial color="#edffff"/></mesh>
      <mesh rotation={[-Math.PI/2,0,0]}><torusGeometry args={[.45,.017,6,48]}/><meshBasicMaterial color="#8ad4ff"/></mesh>
      <mesh rotation={[0,0,Math.PI/2]}><torusGeometry args={[.32,.016,6,48]}/><meshBasicMaterial color="#b6a2ff"/></mesh>
    </group>
    {[-1,1].map(v=><group key={v} position={[v*3.6,.5,-.6]}>
      <mesh><cylinderGeometry args={[.64,.78,.92,8]}/><meshStandardMaterial color="#263e58" metalness={.62} roughness={.4}/></mesh>
      <mesh position={[0,.5,0]}><cylinderGeometry args={[.55,.55,.09,8]}/><meshBasicMaterial color="#6bdfff"/></mesh>
      <mesh position={[v*.73,.13,0]}><boxGeometry args={[1.18,.17,.34]}/><meshStandardMaterial color="#42627c" metalness={.7} roughness={.29}/></mesh>
    </group>)}
    <group ref={drone}>
      <mesh><sphereGeometry args={[.18,12,10]}/><meshStandardMaterial color="#c7e7ff" metalness={.7} roughness={.2}/></mesh>
      <mesh position={[0,-.13,0]}><sphereGeometry args={[.08,10,8]}/><meshBasicMaterial color="#83cfff"/></mesh>
      <mesh rotation={[0,0,.3]}><boxGeometry args={[.85,.055,.24]}/><meshStandardMaterial color="#345b87" metalness={.6}/></mesh>
    </group>
  </group>;
}
function Landscape(){
  const hills=useMemo(()=>{
    const g=new THREE.PlaneGeometry(90,26,55,18);
    const p=g.getAttribute('position') as THREE.BufferAttribute;
    for(let i=0;i<p.count;i++){
      const x=p.getX(i), y=p.getY(i);
      const h=Math.sin(x*.43)*.9+Math.cos(x*.82+y*.37)*.63+Math.sin(x*1.9-y*.21)*.17;
      p.setZ(i,h*.9+Math.sin(y*.25)*.8);
    }
    g.computeVertexNormals();return g;
  },[]);
  useEffect(()=>()=>hills.dispose(),[hills]);
  return <group>
    <mesh geometry={hills} rotation={[-Math.PI/2,0,0]} position={[0,-3,-14]}><meshStandardMaterial color="#233a51" roughness={1} flatShading/></mesh>
    <mesh position={[0,-3.1,-22]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[150,110]}/><meshStandardMaterial color="#15263b" roughness={1}/></mesh>
  </group>;
}
function StationScene({active}:{active:boolean}){
  const {invalidate}=useThree();
  useEffect(()=>{if(!active)return;const id=window.setInterval(()=>{if(!document.hidden)invalidate()},90);return()=>window.clearInterval(id)},[invalidate,active]);
  return <>
    <color attach="background" args={['#071529']}/>
    <fog attach="fog" args={['#07172c',14,56]}/>
    <ambientLight intensity={.7}/><hemisphereLight args={['#a2d9ff','#1d1d38',1.5]}/>
    <directionalLight position={[-7,10,12]} intensity={2.3} color="#a0dfff"/>
    <pointLight position={[0,3,1]} intensity={14} distance={13} color="#6bd1ff"/>
    <pointLight position={[-7,2,-3]} intensity={8} distance={15} color="#9d78ff"/>
    <Landscape/><StationGeometry/>
  </>;
}
export default function OriginStation({compact=false}:Props){
  const [visible,setVisible]=useState(true);
  const host=useRef<HTMLDivElement>(null);
  useEffect(()=>{const node=host.current;if(!node)return;const watcher=new IntersectionObserver(entries=>setVisible(Boolean(entries[0]?.isIntersecting)),{rootMargin:'80px'});watcher.observe(node);return()=>watcher.disconnect()},[]);
  return <div ref={host} className={`station-hero${compact?' station-static':''}`}>
    {!compact&&<Canvas camera={{position:[8,5.2,12],fov:44,near:.1,far:120}} dpr={[.75,1.15]} frameloop="demand" gl={{antialias:true,alpha:false,powerPreference:'low-power'}}>
      <Suspense fallback={null}><StationScene active={visible}/></Suspense>
    </Canvas>}
    <div className="station-overlays">
      <span className="station-tag"><i/> ORIGIN / ESTACIÓN DE INVESTIGACIÓN</span>
      <div><small>ESTACIÓN 001 · ARCHIVO PROFESIONAL</small><h3>BIENVENIDO A <em>ORIGIN.</em></h3><p>Una base espacial construida para explorar mis proyectos, mi experiencia y las tecnologías detrás de NEBULA.</p><a href="#origin-archive" className="station-open">ABRIR ARCHIVO PERSONAL ↓</a></div>
      <span className="station-coords">SYSTEM READY // 001</span>
    </div>
  </div>;
}
