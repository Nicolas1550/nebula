'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, useTexture } from '@react-three/drei';
import { Suspense, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

export const worlds = [
  { name:'ORIGIN', subtitle:'THE FIRST SIGNAL', color:'#3d9fff', accent:'#90e4ff', position:[-5.8,0,0] as [number,number,number], size:1.32, description:'El inicio de la exploración.' },
  { name:'NEXUS', subtitle:'THE ORBITAL NETWORK', color:'#a36aff', accent:'#e1b6ff', position:[0,0,-1.8] as [number,number,number], size:1.60, description:'El centro de conexión del sistema.' },
  { name:'INFERNO', subtitle:'THE BURNING FRONTIER', color:'#ff7548', accent:'#ffc18c', position:[5.8,0,0] as [number,number,number], size:1.24, description:'El límite de lo que conocemos.' },
] as const;

type Quality = 'balanced' | 'ultra';
type Name = 'origin' | 'nexus' | 'inferno';
const names:Name[] = ['origin','nexus','inferno'];

// Los planetas oscilan suavemente en el universo: la cámara utiliza la misma función.
function worldPosition(index:number, time:number, target:THREE.Vector3) {
  const p=worlds[index].position;
  return target.set(
    p[0] + Math.sin(time*.18 + index*2.1)*.28,
    p[1] + Math.sin(time*.28 + index*1.7)*.19,
    p[2] + Math.cos(time*.16 + index*2.2)*.22,
  );
}

const planetTextures:Record<Name,string[]> = {
  origin:['/space/origin-color-2k.webp','/space/origin-normal-1k.webp','/space/origin-roughness-1k.webp'],
  nexus:['/space/nexus-color-2k.webp','/space/nexus-normal-1k.webp','/space/nexus-roughness-1k.webp'],
  inferno:['/space/inferno-color-2k.webp','/space/inferno-normal-1k.webp','/space/inferno-roughness-1k.webp'],
};

function PlanetMaterial({index}:{index:number}) {
  const name=names[index];
  const [color,normal,roughness]=useTexture(planetTextures[name]);
  // Origin no tiene zonas incandescentes; reutilizamos su color sin hacer otra descarga.
  const emissive=useTexture(index===0 ? planetTextures.origin[0] : `/space/${name}-emissive-1k.webp`);
  useEffect(()=>{
    color.colorSpace=THREE.SRGBColorSpace;
    normal.colorSpace=THREE.NoColorSpace;
    roughness.colorSpace=THREE.NoColorSpace;
    emissive.colorSpace=THREE.SRGBColorSpace;
    for(const t of [color,normal,roughness,emissive]){
      t.anisotropy=Math.min(4, t.anisotropy || 1);
      t.needsUpdate=true;
    }
  },[color,normal,roughness,emissive]);
  return <meshStandardMaterial
    map={color}
    normalMap={normal}
    normalScale={new THREE.Vector2(index===0?.32:.45,index===0?.32:.45)}
    roughnessMap={roughness}
    roughness={.92}
    metalness={0}
    emissive={index===0?'#000000':'#ffffff'}
    emissiveMap={index===0?null:emissive}
    emissiveIntensity={index===1?.82:index===2?1.15:0}
  />;
}

function Planet({index,selected,onSelect,quality,scanTick,pulseTick,lowPower}:{index:number;selected:number;onSelect:(index:number)=>void;quality:Quality;scanTick:number;pulseTick:number;lowPower:boolean}) {
  const w=worlds[index];
  const root=useRef<THREE.Group>(null);
  const surface=useRef<THREE.Mesh>(null);
  // 96x64 alcanza para un globo a esta distancia; sin displacement evitamos el aspecto derretido.
  const geometry=useMemo(()=>new THREE.SphereGeometry(w.size,quality==='ultra'?128:96,quality==='ultra'?96:64),[w.size,quality]);
  useEffect(()=>()=>geometry.dispose(),[geometry]);
  const tmp=useMemo(()=>new THREE.Vector3(),[]);
  useFrame(({clock},dt)=>{
    if(root.current) root.current.position.copy(worldPosition(index,clock.elapsedTime,tmp));
    if(surface.current) surface.current.rotation.y+=Math.min(dt,.05)*(.018+index*.005);
  });
  return <group ref={root} position={w.position}>
    <mesh ref={surface} geometry={geometry} onClick={e=>{e.stopPropagation();onSelect(index);}}>
      <Suspense fallback={<meshStandardMaterial color={w.color} roughness={1}/> }><PlanetMaterial index={index}/></Suspense>
    </mesh>
    <Atmosphere size={w.size} color={w.accent} selected={index===selected}/>
    {index===selected&&<PlanetScanner size={w.size} color={w.accent} scanTick={scanTick} lowPower={lowPower}/>}
    {index===selected&&<EnergyPulse size={w.size} color={w.accent} pulseTick={pulseTick}/>}
    {index===selected&&!lowPower&&<OrbitalProbe size={w.size}/>}
    {index===0&&<Suspense fallback={null}><Clouds size={w.size}/></Suspense>}
    {index===1&&<Suspense fallback={null}><NexusRing/></Suspense>}
    {quality==='ultra'&&index!==0&&<AsteroidField amount={index===1?90:40} seed={index} size={w.size}/>}
  </group>;
}

const auraVertex=`varying vec3 vNormal; varying vec3 vEye;
void main(){vec4 mv=modelViewMatrix*vec4(position,1.);vNormal=normalize(normalMatrix*normal);vEye=normalize(-mv.xyz);gl_Position=projectionMatrix*mv;}`;
const auraFragment=`uniform vec3 glowColor;uniform float intensity;varying vec3 vNormal;varying vec3 vEye;
void main(){float facing=max(dot(normalize(vNormal),normalize(vEye)),0.);float rim=pow(1.-facing,5.);float a=clamp(rim*.5*intensity,0.,.35);gl_FragColor=vec4(glowColor*.67,a);}`;
function Atmosphere({size,color,selected}:{size:number;color:string;selected:boolean}) {
  const uniforms=useMemo(()=>({glowColor:{value:new THREE.Color(color)},intensity:{value:selected?1.1:.85}}),[color,selected]);
  return <mesh scale={size*1.075} renderOrder={2}>
    <sphereGeometry args={[1,48,32]}/>
    <shaderMaterial uniforms={uniforms} vertexShader={auraVertex} fragmentShader={auraFragment}
      transparent blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.FrontSide}/>
  </mesh>;
}
function Clouds({size}:{size:number}) {
  const texture=useTexture('/space/origin-clouds-1k.webp');
  const mesh=useRef<THREE.Mesh>(null);
  useEffect(()=>{texture.colorSpace=THREE.SRGBColorSpace;texture.needsUpdate=true},[texture]);
  useFrame((_,dt)=>{if(mesh.current)mesh.current.rotation.y+=Math.min(dt,.05)*.008});
  return <mesh ref={mesh} scale={size*1.025}>
    <sphereGeometry args={[1,64,48]}/>
    <meshStandardMaterial map={texture} alphaMap={texture} alphaTest={.12} transparent
      opacity={.52} depthWrite={false} roughness={1}/>
  </mesh>;
}
function NexusRing(){
  const texture=useTexture('/space/nexus-rings-1k.webp');
  useEffect(()=>{texture.colorSpace=THREE.SRGBColorSpace;texture.needsUpdate=true},[texture]);
  return <mesh rotation={[1.24,.1,.18]}>
    <planeGeometry args={[6.2,6.2]}/>
    <meshBasicMaterial map={texture} transparent opacity={.72} depthWrite={false} side={THREE.DoubleSide}/>
  </mesh>;
}
function AsteroidField({amount,seed,size}:{amount:number;seed:number;size:number}) {
  const mesh=useRef<THREE.InstancedMesh>(null);
  const geo=useMemo(()=>new THREE.IcosahedronGeometry(.07,0),[]);
  const mat=useMemo(()=>new THREE.MeshStandardMaterial({color:seed===1?'#747084':'#6e4b3d',roughness:1}),[seed]);
  useEffect(()=>{
    const obj=new THREE.Object3D();let value=seed*223+17;
    const rnd=()=>{value=(value*1664525+1013904223)>>>0;return value/4294967296};
    for(let i=0;i<amount;i++){
      const a=rnd()*Math.PI*2;const r=size*(1.57+rnd()*.93);
      obj.position.set(Math.cos(a)*r,(rnd()-.5)*.22,Math.sin(a)*r);
      obj.rotation.set(rnd()*6,rnd()*6,rnd()*6);
      const s=.18+rnd()*1.05;obj.scale.set(s,s*.65,s*1.3);obj.updateMatrix();mesh.current?.setMatrixAt(i,obj.matrix);
    }
    if(mesh.current)mesh.current.instanceMatrix.needsUpdate=true;
  },[amount,seed,size]);
  useEffect(()=>()=>{geo.dispose();mat.dispose()},[geo,mat]);
  return <instancedMesh ref={mesh} args={[geo,mat,amount]}/>;
}
function Galaxies(){
  const [violet,blue]=useTexture(['/space/galaxy-violet.webp','/space/galaxy-blue.webp']);
  useEffect(()=>{violet.colorSpace=THREE.SRGBColorSpace;blue.colorSpace=THREE.SRGBColorSpace;violet.needsUpdate=true;blue.needsUpdate=true},[violet,blue]);
  return <group>
    <mesh position={[10,5,-33]} rotation={[0,0,-.18]}><planeGeometry args={[13,13]}/><meshBasicMaterial map={violet} transparent opacity={.61} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false}/></mesh>
    <mesh position={[-12,-5,-43]} rotation={[0,0,.33]}><planeGeometry args={[17,17]}/><meshBasicMaterial map={blue} transparent opacity={.36} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false}/></mesh>
  </group>;
}
// Antena orbital y escáner 3D: el barrido se ejecuta sólo al solicitar un escaneo.
function PlanetScanner({size,color,scanTick,lowPower}:{size:number;color:string;scanTick:number;lowPower:boolean}){
  const rig=useRef<THREE.Group>(null);
  const scan=useRef<THREE.Mesh>(null);
  const scanMat=useRef<THREE.MeshBasicMaterial>(null);
  const elapsed=useRef(9);
  useEffect(()=>{elapsed.current=0},[scanTick]);
  useFrame((_,dt)=>{
    elapsed.current+=Math.min(.05,dt);
    if(rig.current)rig.current.rotation.y+=dt*.045;
    const t=Math.min(1,elapsed.current/2.3);
    if(scan.current){
      const y=size*1.12*(1-2*t);
      scan.current.position.y=y;
      const radius=Math.sqrt(Math.max(.01,(size*1.11)**2-y*y));
      scan.current.scale.setScalar(radius);
      scan.current.visible=t<1;
    }
    if(scanMat.current)scanMat.current.opacity=Math.max(0,.84*(1-t));
  });
  return <group ref={rig}>
    <mesh rotation={[Math.PI/2+.3,0,.22]}><torusGeometry args={[size*1.3,.009,4,120]}/><meshBasicMaterial color={color} transparent opacity={lowPower?.25:.46} depthWrite={false}/></mesh>
    <mesh rotation={[.45,0,.42]}><torusGeometry args={[size*1.44,.007,4,120]}/><meshBasicMaterial color={color} transparent opacity={lowPower?.13:.25} depthWrite={false}/></mesh>
    <mesh scale={size*1.065}><sphereGeometry args={[1,28,16]}/><meshBasicMaterial color={color} wireframe transparent opacity={lowPower?.015:.042} depthWrite={false}/></mesh>
    <mesh ref={scan} rotation={[Math.PI/2,0,0]}><torusGeometry args={[1,.011,5,100]}/><meshBasicMaterial ref={scanMat} color={color} transparent opacity={.8} depthWrite={false}/></mesh>
  </group>;
}
// El pulso al seleccionar un mundo se expande y desaparece. No necesita postprocesado.
function EnergyPulse({size,color,pulseTick}:{size:number;color:string;pulseTick:number}){
  const a=useRef<THREE.Mesh>(null);
  const b=useRef<THREE.Mesh>(null);
  const matA=useRef<THREE.MeshBasicMaterial>(null);
  const matB=useRef<THREE.MeshBasicMaterial>(null);
  const age=useRef(5);
  useEffect(()=>{age.current=0},[pulseTick]);
  useFrame((_,dt)=>{
    age.current+=Math.min(.05,dt);
    const t=Math.min(1,age.current/1.5);
    const t2=Math.max(0,Math.min(1,(age.current-.2)/1.6));
    if(a.current)a.current.scale.setScalar(size*(1.24+t*1.85));
    if(b.current)b.current.scale.setScalar(size*(1.22+t2*2.1));
    if(matA.current)matA.current.opacity=(1-t)**2*.73;
    if(matB.current)matB.current.opacity=(1-t2)**2*.38;
  });
  return <group>
    <mesh ref={a} rotation={[Math.PI/2+.26,0,.18]}><torusGeometry args={[1,.013,5,100]}/><meshBasicMaterial ref={matA} color={color} transparent depthWrite={false} opacity={0}/></mesh>
    <mesh ref={b} rotation={[.38,0,-.17]}><torusGeometry args={[1,.009,5,100]}/><meshBasicMaterial ref={matB} color={color} transparent depthWrite={false} opacity={0}/></mesh>
  </group>;
}
function OrbitalProbe({size}:{size:number}){
  const satellite=useRef<THREE.Group>(null);
  useFrame(({clock})=>{
    const t=clock.elapsedTime*.14;
    if(satellite.current){satellite.current.position.set(Math.cos(t)*size*1.7,Math.sin(t*1.4)*size*.58,Math.sin(t)*size*1.7);satellite.current.rotation.y=-t;}
  });
  return <group ref={satellite}>
    <mesh><boxGeometry args={[.12,.12,.18]}/><meshStandardMaterial color="#b5d4ed" metalness={.7}/></mesh>
    {[-1,1].map(side=><mesh key={side} position={[side*.23,0,0]}><boxGeometry args={[.26,.014,.13]}/><meshStandardMaterial color="#28639e" metalness={.35} roughness={.3}/></mesh>)}
    <pointLight color="#8fdcff" intensity={.35} distance={1}/>
  </group>;
}
function SpaceTraffic({lowPower}:{lowPower:boolean}){
  const movers=useRef<THREE.Group[]>([]);
  useFrame(({clock})=>{
    const t=clock.elapsedTime;
    movers.current.forEach((m,i)=>{
      const span=33;
      const x=((t*(.95+i*.17)+i*13)%span)-span/2;
      m.position.set(x,i===0?4.5:i===1?-3.6:2.3,-12-i*4);
      m.rotation.z=-.08-i*.04;
    });
  });
  if(lowPower)return null;
  return <group>
    {[0,1,2].map(i=><group key={i} ref={node=>{if(node)movers.current[i]=node}}>
      <mesh><sphereGeometry args={[.035,8,8]}/><meshBasicMaterial color={i===1?'#ffc6a1':'#d3ebff'} toneMapped={false}/></mesh>
      <mesh position={[-.65,0,0]} rotation={[0,0,Math.PI/2]}><coneGeometry args={[.04,1.3,5]}/><meshBasicMaterial color={i===1?'#ffb18c':'#89c7ff'} transparent opacity={.23} depthWrite={false}/></mesh>
    </group>)}
  </group>;
}
function CameraRig({selected,descending,focus}:{selected:number;descending:boolean;focus:boolean}){
  const {camera}=useThree();
  const controls=useRef<any>(null);
  const previous=useRef('');
  const transition=useRef(0);
  const progress=useRef(0);
  const center=useMemo(()=>new THREE.Vector3(),[]);
  const desired=useMemo(()=>new THREE.Vector3(),[]);
  const overview=useMemo(()=>new THREE.Vector3(0,1.65,17.8),[]);
  const overviewTarget=useMemo(()=>new THREE.Vector3(0,0,-.7),[]);
  useFrame(({clock},dt)=>{
    if(!controls.current) return;
    const delta=Math.min(dt,.05);
    const mode=`${selected}/${focus}/${descending}`;
    if(previous.current!==mode){previous.current=mode;transition.current=2.2;if(!descending)progress.current=0;}
    worldPosition(selected,clock.elapsedTime,center);
    if(descending){
      controls.current.enabled=false;
      progress.current=Math.min(1,progress.current+delta/5.8);
      const t=progress.current*progress.current*(3-2*progress.current);
      desired.copy(center).add(new THREE.Vector3(.8*(1-t),.7*(1-t),THREE.MathUtils.lerp(9,wSize(selected)*.8,t)));
      camera.position.lerp(desired,1-Math.exp(-delta*3.1));
      controls.current.target.lerp(center,1-Math.exp(-delta*4));
    }else if(transition.current>0){
      transition.current=Math.max(0,transition.current-delta);
      controls.current.enabled=false;
      if(focus){desired.copy(center).add(new THREE.Vector3(.8,1,8.7));controls.current.target.lerp(center,1-Math.exp(-delta*3));}
      else{desired.copy(overview);controls.current.target.lerp(overviewTarget,1-Math.exp(-delta*3));}
      camera.position.lerp(desired,1-Math.exp(-delta*2.7));
    }else {
      controls.current.enabled=true;
      if(focus)controls.current.target.lerp(center,.015);
    }
    controls.current.update();
  });
  return <OrbitControls ref={controls} target={[0,0,-.7]} enablePan={false} minDistance={2.5} maxDistance={27} enableDamping dampingFactor={.07} enableZoom={!descending}/>;
}
function wSize(i:number){return worlds[i].size}
function FrameRateGuard({onSlow}:{onSlow:()=>void}){
  const seconds=useRef(0);const frames=useRef(0);const sent=useRef(false);
  useFrame((_,dt)=>{
    if(sent.current)return;
    // Ignorar la carga inicial: medir solo cuando el navegador ya estabilizó el render.
    seconds.current+=Math.min(dt,.1);
    if(seconds.current<3.5)return;
    frames.current++;
    if(seconds.current>7.5){
      if(frames.current/4<38){sent.current=true;onSlow();}
      else sent.current=true;
    }
  });
  return null;
}
export default function Universe({selected,onSelect,descending=false,quality='balanced',focus=false,lowPower=false,paused=false,scanTick=0,pulseTick=0,onSlow}:{selected:number;onSelect:(n:number)=>void;descending?:boolean;quality?:Quality;focus?:boolean;lowPower?:boolean;paused?:boolean;scanTick?:number;pulseTick?:number;onSlow?:()=>void}) {
  return <Canvas
    fallback={<div className="space-fallback" role="group" aria-label="Selección de mundos en modo sin gráficos 3D">{worlds.map((world,i)=><button key={world.name} type="button" onClick={()=>onSelect(i)} className={selected===i?'chosen':''}><img src={`/social/${names[i]}-preview.webp`} alt={`Vista del planeta ${world.name}`}/><span>0{i+1} · {world.name}</span></button>)}</div>}
    frameloop={paused?'demand':'always'}
    camera={{position:[0,1.65,17.8],fov:46,near:.08,far:250}}
    dpr={lowPower?[.75,1]:quality==='ultra'?[1,1.65]:[.9,1.25]}
    gl={{antialias:true,alpha:true,powerPreference:'high-performance'}}
    onCreated={({gl})=>{gl.toneMapping=THREE.ACESFilmicToneMapping;gl.toneMappingExposure=1.05;gl.outputColorSpace=THREE.SRGBColorSpace;}}
  >
    <ambientLight intensity={.37}/>
    <hemisphereLight args={['#a1b7de','#191322',.4]}/>
    <directionalLight position={[-7,5,9]} intensity={2.8} color="#eef5ff"/>
    <Stars radius={110} depth={55} count={quality==='ultra'?2600:1550} factor={2.4} saturation={.4} fade speed={.04}/>
    <Suspense fallback={null}><Galaxies/></Suspense>
    <SpaceTraffic lowPower={lowPower}/>
    {worlds.map((_,i)=><Planet key={i} index={i} selected={selected} onSelect={onSelect} quality={quality} scanTick={scanTick} pulseTick={pulseTick} lowPower={lowPower}/>)}
    <CameraRig selected={selected} descending={descending} focus={focus}/>
    {onSlow&&<FrameRateGuard onSlow={onSlow}/>}
  </Canvas>;
}
