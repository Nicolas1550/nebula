'use client';
import {useCallback,useEffect,useRef,useState} from 'react';
import type {PointerEvent as ReactPointerEvent} from 'react';
import {collectCore,createMission,damageShip,startMission,tickMission} from '../../lib/infernoRules';
import type {MissionState} from '../../lib/infernoRules';

type Vessel={x:number,y:number};
type Core={id:number,x:number,y:number,phase:number,velocity:number};
type Hazard={id:number,x:number,y:number,rotation:number,velocity:number,size:number};
type Star={x:number,y:number,depth:number,phase:number};
type Burst={x:number,y:number,age:number,color:string};
const clamp=(x:number,min:number,max:number)=>Math.max(min,Math.min(max,x));
const distance=(a:{x:number,y:number},b:{x:number,y:number})=>Math.hypot(a.x-b.x,a.y-b.y);
const stars:Star[]=Array.from({length:100},(_,i)=>({x:(Math.sin(i*14.43)*1048.34)%1,y:Math.abs(Math.sin(i*33.68)*437.78)%1,depth:.3+((i*37)%13)/13,phase:i*2.1})).map(s=>({...s,x:Math.abs(s.x)}));
let nextId=0;

export default function InfernoMission(){
  const canvasRef=useRef<HTMLCanvasElement>(null);
  const missionRef=useRef<MissionState>(createMission());
  const [view,setView]=useState<MissionState>(createMission());
  const [runId,setRunId]=useState(0);
  const [flash,setFlash]=useState('');
  const keys=useRef({up:false,down:false,left:false,right:false});
  const vessel=useRef<Vessel>({x:.5,y:.79});
  const cores=useRef<Core[]>([]);
  const hazards=useRef<Hazard[]>([]);
  const bursts=useRef<Burst[]>([]);
  const pulse=useRef({time:-20,age:0});
  const immunity=useRef(0);
  const spawn=useRef({core:0,hazard:0});
  const startTime=useRef(0);

  const sync=useCallback(()=>{setView({...missionRef.current})},[]);
  function newGame(){
    missionRef.current=startMission();
    vessel.current={x:.5,y:.79};
    cores.current=[{id:++nextId,x:.5,y:.36,phase:0,velocity:.19},{id:++nextId,x:.24,y:-.08,phase:1,velocity:.18}];
    hazards.current=[];bursts.current=[];pulse.current={time:-20,age:0};immunity.current=0;
    spawn.current={core:0,hazard:0};startTime.current=performance.now();setFlash('');sync();setRunId(v=>v+1);
  }
  const pickup=useCallback((coreId:number)=>{
    if(missionRef.current.status!=='playing')return;
    const index=cores.current.findIndex(c=>c.id===coreId);
    if(index<0)return;
    const item=cores.current[index];cores.current.splice(index,1);
    bursts.current.push({x:item.x,y:item.y,age:0,color:'#ffd18d'});
    missionRef.current=collectCore(missionRef.current);
    // La última recolección decide la victoria AQUÍ, sin esperar otro render.
    setFlash(missionRef.current.status==='won'?'MISIÓN COMPLETADA':'+20% ENERGÍA');
    sync();
  },[sync]);
  const triggerPulse=useCallback(()=>{
    if(missionRef.current.status!=='playing')return;
    const elapsed=(performance.now()-startTime.current)/1000;
    if(elapsed-pulse.current.time<2.1)return;
    pulse.current={time:elapsed,age:.01};
    const nearby=cores.current.filter(c=>distance(c,vessel.current)<.22).map(c=>c.id);
    nearby.forEach(id=>pickup(id));
    if(!nearby.length)setFlash('SIN NÚCLEOS EN EL RADIO');
  },[pickup]);
  useEffect(()=>{
    const down=(e:KeyboardEvent)=>{
      if(missionRef.current.status!=='playing')return;
      const el=e.target;
      if(el instanceof HTMLInputElement||el instanceof HTMLTextAreaElement||el instanceof HTMLSelectElement||el instanceof HTMLButtonElement)return;
      const k=e.key.toLowerCase();
      if(['arrowleft','arrowright','arrowup','arrowdown',' ','w','a','s','d'].includes(k))e.preventDefault();
      if(k==='arrowleft'||k==='a')keys.current.left=true;
      if(k==='arrowright'||k==='d')keys.current.right=true;
      if(k==='arrowup'||k==='w')keys.current.up=true;
      if(k==='arrowdown'||k==='s')keys.current.down=true;
      if(k===' '&&!e.repeat)triggerPulse();
    };
    const up=(e:KeyboardEvent)=>{
      const k=e.key.toLowerCase();
      if(k==='arrowleft'||k==='a')keys.current.left=false;
      if(k==='arrowright'||k==='d')keys.current.right=false;
      if(k==='arrowup'||k==='w')keys.current.up=false;
      if(k==='arrowdown'||k==='s')keys.current.down=false;
    };
    const clear=()=>{keys.current={up:false,down:false,left:false,right:false}};
    window.addEventListener('keydown',down);window.addEventListener('keyup',up);window.addEventListener('blur',clear);
    return()=>{window.removeEventListener('keydown',down);window.removeEventListener('keyup',up);window.removeEventListener('blur',clear)};
  },[triggerPulse]);

  useEffect(()=>{
    const canvas=canvasRef.current,ctx=canvas?.getContext('2d',{alpha:false});if(!canvas||!ctx)return;
    let animation=0,last=0,lastSync=0,alive=true,visible=true;
    const resize=()=>{
      const bounds=canvas.getBoundingClientRect(),pixelRatio=Math.min(1.5,window.devicePixelRatio||1);
      canvas.width=Math.max(1,Math.round(bounds.width*pixelRatio));canvas.height=Math.max(1,Math.round(bounds.height*pixelRatio));
    };
    resize();const ro=new ResizeObserver(resize);ro.observe(canvas);
    const io=new IntersectionObserver(entries=>{visible=entries[0]?.isIntersecting??true},{threshold:.01});io.observe(canvas);
    function render(time:number){
      if(!alive)return;
      animation=requestAnimationFrame(render);
      if(!visible||document.hidden){last=time;return;}
      // 30 fps durante la misión y 10 fps en pantallas de inicio/resultado.
      const isActive=missionRef.current.status==='playing';
      if(time-last < (isActive?32:95) && last>0)return;
      const dt=Math.min((time-(last||time))/1000,.075);last=time;
      const W=canvas!.width,H=canvas!.height;if(W<1||H<1)return;
      const ctx2=ctx!,ratio=Math.min(W/Math.max(1,canvas!.clientWidth),1.5);
      const active=missionRef.current.status==='playing';
      if(active){
        const k=keys.current;
        const dx=Number(k.right)-Number(k.left),dy=Number(k.down)-Number(k.up);
        const normalize=Math.hypot(dx,dy)||1;
        vessel.current.x=clamp(vessel.current.x+dx/normalize*.6*dt,.065,.935);
        vessel.current.y=clamp(vessel.current.y+dy/normalize*.6*dt,.18,.88);
        const gameTime=(time-startTime.current)/1000;
        spawn.current.core+=dt;spawn.current.hazard+=dt;
        if(spawn.current.core>2.25){spawn.current.core=0;cores.current.push({id:++nextId,x:.13+Math.random()*.74,y:-.07,phase:Math.random()*7,velocity:.165+Math.random()*.048});}
        if(spawn.current.hazard>3.3){spawn.current.hazard=0;hazards.current.push({id:++nextId,x:.12+Math.random()*.76,y:-.12,rotation:Math.random()*7,velocity:.19+Math.random()*.035,size:.035+Math.random()*.025});}
        // La recolección funciona por contacto, o mediante el pulso de ESPACIO.
        for(const core of [...cores.current]){
          core.y+=core.velocity*dt;
          core.x=clamp(core.x+Math.sin(gameTime*1.3+core.phase)*.018*dt,.06,.94);
          if(distance(core,vessel.current)<.082)pickup(core.id);
        }
        cores.current=cores.current.filter(c=>c.y<1.11);
        for(const rock of hazards.current){
          rock.y+=rock.velocity*dt;rock.rotation+=dt*.5;
          if(immunity.current<=0&&distance(rock,vessel.current)<rock.size+.05){
            immunity.current=1.5;
            missionRef.current=damageShip(missionRef.current,25);
            bursts.current.push({x:vessel.current.x,y:vessel.current.y,age:0,color:'#ff865c'});
            setFlash('¡IMPACTO! -25% ESCUDO');sync();
          }
        }
        hazards.current=hazards.current.filter(h=>h.y<1.13);
        immunity.current=Math.max(0,immunity.current-dt);
        // tickMission es puro: jamás vuelve a descontar tiempo tras 'won' o 'lost'.
        missionRef.current=tickMission(missionRef.current,dt);
        if(missionRef.current.status!=='playing'){sync();}
        else if(time-lastSync>140){sync();lastSync=time;}
        if(pulse.current.age>0)pulse.current.age+=dt;
        if(pulse.current.age>0.42)pulse.current.age=0;
      }
      bursts.current=bursts.current.filter(b=>b.age<.8);bursts.current.forEach(b=>b.age+=dt);
      const gradient=ctx2.createLinearGradient(0,0,0,H);
      gradient.addColorStop(0,'#030816');gradient.addColorStop(.52,'#0c142b');gradient.addColorStop(1,'#301523');
      ctx2.fillStyle=gradient;ctx2.fillRect(0,0,W,H);
      const horizon=ctx2.createRadialGradient(W*.5,H*1.12,H*.1,W*.5,H*1.12,H*1.02);
      horizon.addColorStop(0,'#e95f2555');horizon.addColorStop(.48,'#8f2a3b20');horizon.addColorStop(1,'#00000000');ctx2.fillStyle=horizon;ctx2.fillRect(0,0,W,H);
      // Nebulosa y planeta en el horizonte: sin cargar modelos 3D ni textura pesada.
      ctx2.save();ctx2.translate(W*.76,H*1.38);ctx2.scale(1,.66);
      const planet=ctx2.createRadialGradient(-W*.08,-H*.1,H*.08,0,0,H*.7);
      planet.addColorStop(0,'#f85f2a');planet.addColorStop(.45,'#75262c');planet.addColorStop(.82,'#291b32');planet.addColorStop(1,'#0a1124');
      ctx2.fillStyle=planet;ctx2.beginPath();ctx2.arc(0,0,H*.68,0,Math.PI*2);ctx2.fill();
      ctx2.strokeStyle='#ff874c99';ctx2.lineWidth=4*ratio;ctx2.stroke();ctx2.restore();
      for(const s of stars){const y=(s.y+(time/1000)*(active?.005:.001)*s.depth)%1;
        ctx2.fillStyle=`rgba(176,213,255,${.14+s.depth*.55})`;ctx2.fillRect(s.x*W,y*H,Math.max(1,1.35*s.depth*ratio),Math.max(1,2*s.depth*ratio));}
      ctx2.strokeStyle='#73a3ec22';ctx2.lineWidth=ratio;
      for(let i=1;i<=4;i++){ctx2.beginPath();ctx2.moveTo(i/5*W,H*.12);ctx2.lineTo(i/5*W,H*.91);ctx2.stroke()}
      for(let i=1;i<=5;i++){const y=i/6*H;ctx2.beginPath();ctx2.moveTo(W*.04,y);ctx2.lineTo(W*.96,y);ctx2.stroke()}
      // Asteroides irregulares, rotación y volumen visual.
      for(const h of hazards.current){const x=h.x*W,y=h.y*H,r=h.size*Math.min(W,H);
        ctx2.save();ctx2.translate(x,y);ctx2.rotate(h.rotation);
        const rg=ctx2.createRadialGradient(-r*.35,-r*.4,2,r*.1,r*.1,r*1.2);rg.addColorStop(0,'#d19277');rg.addColorStop(.48,'#6f403a');rg.addColorStop(1,'#1d1524');ctx2.fillStyle=rg;
        ctx2.beginPath();for(let j=0;j<9;j++){const ang=j/9*Math.PI*2,rad=r*(.75+(j%3)*.14);const xx=Math.cos(ang)*rad,yy=Math.sin(ang)*rad;j?ctx2.lineTo(xx,yy):ctx2.moveTo(xx,yy)}ctx2.closePath();ctx2.fill();ctx2.strokeStyle='#f197674a';ctx2.stroke();ctx2.restore();
      }
      for(const c of cores.current){const x=c.x*W,y=c.y*H,r=Math.max(9,Math.min(W,H)*.024);
        const g=ctx2.createRadialGradient(x,y,2,x,y,r*2.5);g.addColorStop(0,'#ffe29a99');g.addColorStop(1,'#f9893500');ctx2.fillStyle=g;ctx2.beginPath();ctx2.arc(x,y,r*2.5,0,Math.PI*2);ctx2.fill();
        ctx2.save();ctx2.translate(x,y);ctx2.rotate(time/1500+c.phase);ctx2.fillStyle='#ffd17b';ctx2.strokeStyle='#fff8cd';ctx2.lineWidth=2*ratio;ctx2.beginPath();for(let j=0;j<6;j++){const a=j*Math.PI/3;ctx2.lineTo(Math.cos(a)*r,Math.sin(a)*r)}ctx2.closePath();ctx2.fill();ctx2.stroke();ctx2.restore();
      }
      for(const b of bursts.current){const r=b.age*105*ratio;ctx2.beginPath();ctx2.arc(b.x*W,b.y*H,r,0,Math.PI*2);ctx2.globalAlpha=Math.max(0,1-b.age/.8);ctx2.strokeStyle=b.color;ctx2.lineWidth=3*ratio;ctx2.stroke();ctx2.globalAlpha=1}
      if(pulse.current.age>0){const radius=pulse.current.age/.42*.22*Math.min(W,H);ctx2.beginPath();ctx2.arc(vessel.current.x*W,vessel.current.y*H,radius,0,Math.PI*2);ctx2.lineWidth=3*ratio;ctx2.strokeStyle=`rgba(122,226,255,${1-pulse.current.age/.42})`;ctx2.stroke()}
      const sx=vessel.current.x*W,sy=vessel.current.y*H,unit=Math.max(14,Math.min(W,H)*.044);
      if(!(immunity.current>0&&Math.floor(time/100)%2===0)){
        ctx2.save();ctx2.translate(sx,sy);
        const engine=ctx2.createLinearGradient(0,0,0,unit*2);engine.addColorStop(0,'#dbffffbb');engine.addColorStop(.6,'#4cbdff77');engine.addColorStop(1,'#54bbff00');ctx2.fillStyle=engine;
        ctx2.beginPath();ctx2.moveTo(-unit*.27,unit*.58);ctx2.lineTo(0,unit*(1.55+Math.sin(time/86)*.2));ctx2.lineTo(unit*.27,unit*.58);ctx2.fill();
        ctx2.shadowColor='#5bb9ff';ctx2.shadowBlur=15*ratio;ctx2.fillStyle='#d9f4ff';ctx2.strokeStyle='#68bfff';ctx2.lineWidth=2*ratio;
        ctx2.beginPath();ctx2.moveTo(0,-unit);ctx2.lineTo(unit*.33,-unit*.02);ctx2.lineTo(unit*.87,unit*.54);ctx2.lineTo(unit*.2,unit*.38);ctx2.lineTo(0,unit*.67);ctx2.lineTo(-unit*.2,unit*.38);ctx2.lineTo(-unit*.87,unit*.54);ctx2.lineTo(-unit*.33,-unit*.02);ctx2.closePath();ctx2.fill();ctx2.stroke();
        ctx2.shadowBlur=0;ctx2.fillStyle='#132b56';ctx2.beginPath();ctx2.moveTo(0,-unit*.47);ctx2.lineTo(unit*.14,unit*.2);ctx2.lineTo(-unit*.14,unit*.2);ctx2.fill();ctx2.restore();
      }
      // Display data lives outside canvas: readable by assistive technology.
    }
    animation=requestAnimationFrame(render);
    return()=>{alive=false;cancelAnimationFrame(animation);ro.disconnect();io.disconnect()};
  },[runId,pickup,sync]);
  function press(key:'up'|'down'|'left'|'right',pressed:boolean){keys.current[key]=pressed}
  function pointerMove(e:ReactPointerEvent<HTMLCanvasElement>){if(missionRef.current.status!=='playing'||e.pointerType==='mouse'&&e.buttons===0)return;const rect=e.currentTarget.getBoundingClientRect();vessel.current.x=clamp((e.clientX-rect.left)/rect.width,.065,.935);vessel.current.y=clamp((e.clientY-rect.top)/rect.height,.18,.88)}
  const won=view.status==='won',lost=view.status==='lost',ready=view.status==='ready';
  return <div className="inside inferno-v11">
    <div className="section-head"><span className="kicker">03 / INFERNO · OPERATION EMBER / MISSION 01</span><h2>Una misión.<br/><em>Cinco núcleos. Un escape.</em></h2><p>La superficie de INFERNO está colapsando. Pilotá la nave, recuperá cinco núcleos de energía y escapá antes de que el reloj llegue a cero.</p></div>
    <div className="inferno-brief"><span>◈ OPERACIÓN EMBER</span><span>OBJETIVO: 100% ENERGÍA</span><span>ESTADO: {won?'EXTRACCIÓN EXITOSA':lost?'MISIÓN FALLIDA':ready?'EN ESPERA':'MISIÓN ACTIVA'}</span></div>
    <div className="inferno-dashboard">
      <div><small>ENERGÍA RECUPERADA</small><strong className="inferno-energy">{view.energy}%</strong><span className="inferno-bar"><i style={{width:view.energy+'%'}}/></span></div>
      <div><small>ESCUDO</small><strong>{view.hull}%</strong><span className="inferno-bar shield"><i style={{width:view.hull+'%'}}/></span></div>
      <div><small>TIEMPO RESTANTE</small><strong className={view.time<12&&view.status==='playing'?'urgent':''}>{Math.ceil(view.time)}s</strong><span className="inferno-mini">{won?'RELOJ DETENIDO':'MÁXIMO 60 SEGUNDOS'}</span></div>
      <div><small>PUNTUACIÓN</small><strong>{view.score.toLocaleString('es-AR')}</strong><span className="inferno-mini">{view.collected}/5 NÚCLEOS</span></div>
    </div>
    <div className="inferno-arena"><canvas ref={canvasRef} onPointerDown={e=>{e.currentTarget.setPointerCapture(e.pointerId);pointerMove(e)}} onPointerMove={pointerMove} aria-label="Campo espacial arcade. Controlá la nave con WASD o las flechas y activá el pulso con espacio."/>
      <div className="inferno-top-signal"><span>◉ {view.status==='playing'?'LIVE MISSION FEED':won?'MISSION COMPLETED':lost?'MISSION FAILED':'MISSION STANDBY'}</span><span>SECTOR 07 / INFERNO ORBIT</span></div>
      {flash&&view.status==='playing'&&<div className="inferno-alert" key={flash+view.score}>{flash}</div>}
      {view.status!=='playing'&&<div className={'inferno-overlay '+(won?'success':'')}>
        <div className="inferno-overlay-icon">{won?'✦':lost?'✕':'⌁'}</div><span>{won?'MISIÓN 01 / COMPLETADA':lost?'OPERACIÓN EMBER / FALLIDA':'INFERNO / BRIEFING'}</span>
        <h3>{won?'¡EXTRACCIÓN EXITOSA!':lost?'MISIÓN FALLIDA':'RECUPERÁ LA ENERGÍA'}</h3>
        <p>{won?`Los cinco núcleos están asegurados. Lograste ${view.score} puntos y todavía quedaban ${Math.ceil(view.time)} segundos.`:lost?'Se agotó el tiempo o el escudo de la nave. Podés volver a intentarlo.':'Pilotá con WASD o las flechas. Tocá los núcleos o presioná ESPACIO para emitir un pulso magnético cercano. Evitá los asteroides.'}</p>
        {won&&<div className="inferno-win-stats"><span>ENERGÍA <b>100%</b></span><span>PUNTOS <b>{view.score}</b></span><span>TIEMPO <b>{Math.ceil(view.time)} s</b></span></div>}
        <button onClick={newGame} className="inferno-start">{ready?'INICIAR MISIÓN':won?'JUGAR OTRA VEZ':'REINTENTAR MISIÓN'} <span>↗</span></button>
      </div>}
    </div>
    <div className="inferno-control-row"><div className="inferno-mobile-pad"><button aria-label="Mover nave a la izquierda" onPointerDown={e=>{e.preventDefault();e.currentTarget.setPointerCapture(e.pointerId);press('left',true)}} onPointerUp={()=>press('left',false)} onPointerCancel={()=>press('left',false)}>←</button><button aria-label="Mover nave hacia arriba" onPointerDown={e=>{e.preventDefault();e.currentTarget.setPointerCapture(e.pointerId);press('up',true)}} onPointerUp={()=>press('up',false)} onPointerCancel={()=>press('up',false)}>↑</button><button aria-label="Mover nave hacia abajo" onPointerDown={e=>{e.preventDefault();e.currentTarget.setPointerCapture(e.pointerId);press('down',true)}} onPointerUp={()=>press('down',false)} onPointerCancel={()=>press('down',false)}>↓</button><button aria-label="Mover nave a la derecha" onPointerDown={e=>{e.preventDefault();e.currentTarget.setPointerCapture(e.pointerId);press('right',true)}} onPointerUp={()=>press('right',false)} onPointerCancel={()=>press('right',false)}>→</button></div>
      <div className="inferno-legend"><strong>CONTROLES DE VUELO</strong><span>WASD / FLECHAS: mover nave</span><span>ESPACIO: pulso magnético · radio de captura</span></div>
      <button className="inferno-pulse-button" disabled={view.status!=='playing'} onClick={triggerPulse}>◈ ACTIVAR PULSO <small>ESPACIO</small></button>
    </div>
    <div className="inferno-footer-note">✦ Cinco núcleos = victoria inmediata. El cronómetro se detiene al ganar. Optimizado en Canvas 2D para mantener fluidez en notebooks.</div>
  </div>;
}
