'use client';
import {useEffect, useRef, useState} from 'react';
import type {CSSProperties} from 'react';

type Mode = 'reactor' | 'gravity' | 'waves';
type Particle = { x: number; y: number; vx: number; vy: number; seed: number; size: number };
const MODE_INFO: Record<Mode,{name:string,code:string,desc:string,metric:string,accent:string}> = {
  reactor:{name:'REACTOR CUÁNTICO',code:'EXP / 001',desc:'Plasma confinado en un campo magnético. Mové el mouse para perturbar las trayectorias.',metric:'PLASMA STABILITY',accent:'#a989ff'},
  gravity:{name:'POZO GRAVITACIONAL',code:'EXP / 002',desc:'Un campo de gravedad reordena las partículas. Arrastrá el núcleo para modificar la atracción.',metric:'FIELD STRENGTH',accent:'#6de4ff'},
  waves:{name:'INTERFERENCIA DE ONDAS',code:'EXP / 003',desc:'Ondas de energía se propagan desde dos emisores. Experimentá con la frecuencia y la intensidad.',metric:'WAVE RESONANCE',accent:'#ffc28b'},
};
function seeded(n:number){const s=Math.sin(n*78.233+34.231)*43758.5453;return s-Math.floor(s)}
function makeParticles(n:number):Particle[]{return Array.from({length:n},(_,i)=>{
  const a=i*2.399963,r=Math.sqrt((i+.5)/n)*.46;
  return {x:.5+Math.cos(a)*r,y:.5+Math.sin(a)*r,vx:(seeded(i+7)-.5)*.12,vy:(seeded(i+19)-.5)*.12,seed:seeded(i+42),size:.6+seeded(i+63)*1.4};
})}
function ring(ctx:CanvasRenderingContext2D,cx:number,cy:number,rx:number,ry:number,color:string,alpha:number,lineWidth=1){ctx.beginPath();ctx.ellipse(cx,cy,rx,ry,0,0,Math.PI*2);ctx.strokeStyle=color;ctx.globalAlpha=alpha;ctx.lineWidth=lineWidth;ctx.stroke();ctx.globalAlpha=1;}
export default function NexusLab(){
  const canvasRef=useRef<HTMLCanvasElement>(null);
  const [mode,setMode]=useState<Mode>('reactor');
  const [density,setDensity]=useState(185);
  const [power,setPower]=useState(62);
  const [speed,setSpeed]=useState(48);
  const [paused,setPaused]=useState(false);
  const [pulse,setPulse]=useState(0);
  const [reset,setReset]=useState(0);
  const [interaction,setInteraction]=useState('CAMPO ESTABLE');
  useEffect(()=>{
    const canvas=canvasRef.current, ctx=canvas?.getContext('2d',{alpha:false});if(!canvas||!ctx)return;
    let particles=makeParticles(density),frame=0,last=0,t=0,visible=true,alive=true;
    const pointer={x:.5,y:.5,active:false,down:false};
    let shock=pulse>0?1:0;
    const resize=()=>{const r=canvas.getBoundingClientRect();if(r.width<1||r.height<1)return;const dpr=Math.min(devicePixelRatio||1,1.5);canvas.width=Math.round(r.width*dpr);canvas.height=Math.round(r.height*dpr)};
    resize();const ro=new ResizeObserver(resize);ro.observe(canvas);
    const observer=new IntersectionObserver(entries=>{visible=entries[0]?.isIntersecting??true},{threshold:.05});observer.observe(canvas);
    function onPointer(e:PointerEvent){const rect=canvas!.getBoundingClientRect();pointer.x=Math.min(1,Math.max(0,(e.clientX-rect.left)/rect.width));pointer.y=Math.min(1,Math.max(0,(e.clientY-rect.top)/rect.height));pointer.active=true;}
    function onDown(e:PointerEvent){pointer.down=true;onPointer(e);canvas!.setPointerCapture(e.pointerId)}
    function onUp(){pointer.down=false}
    function onLeave(){pointer.active=false;pointer.down=false}
    canvas.addEventListener('pointermove',onPointer);canvas.addEventListener('pointerdown',onDown);canvas.addEventListener('pointerup',onUp);canvas.addEventListener('pointercancel',onLeave);canvas.addEventListener('pointerleave',onLeave);
    const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
    const draw=(ms:number)=>{
      if(!alive)return;
      frame=requestAnimationFrame(draw);
      if(!visible||document.hidden)return;
      if(ms-last<33 && !reduced)return;const dt=Math.min((ms-(last||ms))/1000,.06);last=ms;
      if(!paused&&!reduced)t+=dt*(.38+speed/75);
      const W=canvas.width,H=canvas.height;if(!W||!H)return;
      const dpr=Math.min(devicePixelRatio||1,1.5);
      const cx=W*.5,cy=H*.5,min=Math.min(W,H),pr=min*.275;
      ctx.fillStyle='#030a19';ctx.fillRect(0,0,W,H);
      const bg=ctx.createRadialGradient(cx,cy,2,cx,cy,min*.76);
      bg.addColorStop(0,mode==='reactor'?'#261450':mode==='gravity'?'#0b2a46':'#382017');bg.addColorStop(.48,'#09182d');bg.addColorStop(1,'#030914');ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
      // Scientific grid: lightweight canvas strokes rather than expensive CSS filters.
      ctx.lineWidth=1;ctx.strokeStyle='#53739a19';const cell=Math.max(28,Math.floor(45*dpr));
      for(let x=(W*.5)%cell;x<W;x+=cell){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke()}
      for(let y=(H*.5)%cell;y<H;y+=cell){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke()}
      const col=MODE_INFO[mode].accent;
      ctx.save();ctx.translate(cx,cy);ctx.rotate(t*.045);
      for(let i=0;i<3;i++){
        ctx.setLineDash(i===1?[4*dpr,10*dpr]:[]);ring(ctx,0,0,pr*(.92+i*.21),pr*(.92+i*.21),col,.16+i*.07,i===0?2*dpr:1*dpr);
      }
      ctx.setLineDash([]);
      for(let i=0;i<32;i++){const a=i/32*Math.PI*2;const r=pr*1.32;ctx.beginPath();ctx.moveTo(Math.cos(a)*r,Math.sin(a)*r);ctx.lineTo(Math.cos(a)*(r+(i%4===0?13:5)*dpr),Math.sin(a)*(r+(i%4===0?13:5)*dpr));ctx.strokeStyle=col;ctx.globalAlpha=i%4===0?.56:.2;ctx.stroke();}
      ctx.restore();ctx.globalAlpha=1;
      const focusX=mode==='gravity'&&pointer.active?pointer.x*W:cx;
      const focusY=mode==='gravity'&&pointer.active?pointer.y*H:cy;
      if(mode==='waves'){
        for(let emitter=0;emitter<2;emitter++){
          const ex=cx+min*(emitter===0?-.18:.18),ey=cy;
          for(let i=0;i<8;i++){const phase=((t*(power/45)+i/8) %1);ring(ctx,ex,ey,phase*min*.57,phase*min*.57,col,(1-phase)*.22,1.4*dpr)}
          ctx.beginPath();ctx.arc(ex,ey,5*dpr,0,Math.PI*2);ctx.fillStyle=col;ctx.fill();
        }
      } else {
        const glow=ctx.createRadialGradient(focusX,focusY,2,focusX,focusY,pr*.52);
        glow.addColorStop(0,mode==='reactor'?'#c6a1ffbb':'#7bdcffbb');glow.addColorStop(.2,mode==='reactor'?'#8a49ff44':'#359fe844');glow.addColorStop(1,'#00000000');ctx.fillStyle=glow;ctx.beginPath();ctx.arc(focusX,focusY,pr*.52,0,Math.PI*2);ctx.fill();
        ring(ctx,focusX,focusY,pr*.15,pr*.15,col,.9,1.2*dpr);
      }
      
      if(shock>0){ring(ctx,cx,cy,(1-shock)*min*.68,(1-shock)*min*.68,col,shock*.65,3*dpr);shock=Math.max(0,shock-.06)}
      for(let i=0;i<particles.length;i++){
        const p=particles[i];
        if(!paused&&!reduced){
          const x=p.x*W,y=p.y*H;
          if(mode==='reactor'){
            const dx=cx-x,dy=cy-y;const dist=Math.hypot(dx,dy)+1;
            const tangent=power*.000007;
            p.vx+=(dy/dist)*(-tangent*W*dt*25)+(dx/dist)*(dist-pr*.75)*.000003*dt*W;
            p.vy+=(dx/dist)*(tangent*H*dt*25)+(dy/dist)*(dist-pr*.75)*.000003*dt*H;
          } else if(mode==='gravity'){
            const dx=focusX-x,dy=focusY-y;const d=Math.hypot(dx,dy)+min*.08;
            const accel=power*.0000016*dt;
            p.vx+=dx/d*accel*W;p.vy+=dy/d*accel*H;
            // angular momentum creates an orbit instead of a singular collapse
            p.vx+=-dy/d*.000045*dt*W;p.vy+=dx/d*.000045*dt*H;
          } else {
            const dx=p.x-.5,dy=p.y-.5;
            const wave=Math.sin((Math.hypot(dx+.18,dy)+Math.hypot(dx-.18,dy))*24-(t*power/11));
            p.vx+=(dx+Math.cos(t+i))*.000012*W*dt;
            p.vy+=(wave*.02-dy*.07)*.0015*H*dt;
          }
          if(pointer.active&&mode==='reactor'){
            const dx=pointer.x-p.x,dy=pointer.y-p.y,d=Math.hypot(dx,dy)+.04;
            p.vx+=dx/d*(pointer.down?.026:.005)*dt;p.vy+=dy/d*(pointer.down?.026:.005)*dt;
          }
          p.vx*=.987;p.vy*=.987;
          p.x+=p.vx*dt*(.6+speed/55);p.y+=p.vy*dt*(.6+speed/55);
          if(p.x<-.05||p.x>1.05||p.y<-.05||p.y>1.05){const a=p.seed*Math.PI*2;p.x=.5+Math.cos(a)*.36;p.y=.5+Math.sin(a)*.36;p.vx=0;p.vy=0;}
        }
        const px=p.x*W,py=p.y*H;
        const alpha=.33+p.seed*.6;
        ctx.beginPath();ctx.arc(px,py,p.size*dpr*(mode==='waves'?1.5:1),0,Math.PI*2);ctx.fillStyle=mode==='reactor'?`rgba(185,148,255,${alpha})`:mode==='gravity'?`rgba(108,224,255,${alpha})`:`rgba(255,188,125,${alpha})`;ctx.fill();
        if(i%7===0){ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(px-p.vx*42*dpr,py-p.vy*42*dpr);ctx.strokeStyle=col;ctx.globalAlpha=.2;ctx.stroke();ctx.globalAlpha=1}
      }
      // Dynamic central glyph and scientific crosshair.
      ctx.strokeStyle=col;ctx.lineWidth=1.5*dpr;ctx.globalAlpha=.65;
      ctx.beginPath();ctx.moveTo(cx-8*dpr,cy);ctx.lineTo(cx+8*dpr,cy);ctx.moveTo(cx,cy-8*dpr);ctx.lineTo(cx,cy+8*dpr);ctx.stroke();ctx.globalAlpha=1;
    };
    frame=requestAnimationFrame(draw);
    return()=>{alive=false;cancelAnimationFrame(frame);ro.disconnect();observer.disconnect();canvas.removeEventListener('pointermove',onPointer);canvas.removeEventListener('pointerdown',onDown);canvas.removeEventListener('pointerup',onUp);canvas.removeEventListener('pointercancel',onLeave);canvas.removeEventListener('pointerleave',onLeave)};
  },[mode,density,power,speed,paused,reset,pulse]);
  function triggerPulse(){setInteraction('PULSO EMITIDO');setPulse(n=>n+1)}
  return <div className="inside nexus-v11">
    <div className="section-head"><span className="kicker">02 / NEXUS · RESEARCH DIVISION / 2026</span><h2>La física se<br/><em>convierte en código.</em></h2><p>Un laboratorio visual interactivo. Elegí un experimento, alterá sus parámetros y modificá el comportamiento de un sistema de partículas en tiempo real.</p></div>
    <div className="nexus-mode-tabs" role="tablist" aria-label="Experimentos de NEXUS">{(Object.keys(MODE_INFO) as Mode[]).map((id,i)=><button key={id} role="tab" aria-selected={mode===id} className={mode===id?'active':''} onClick={()=>{setMode(id);setInteraction('CAMPO ESTABLE')}}><span>0{i+1} / {MODE_INFO[id].code}</span><strong>{MODE_INFO[id].name}</strong></button>)}</div>
    <div className="nexus-console">
      <div className="nexus-visual" style={{'--nexus-accent':MODE_INFO[mode].accent} as CSSProperties}>
        <canvas ref={canvasRef} aria-label={'Simulación interactiva: '+MODE_INFO[mode].name}/>
        <div className="nexus-corner nexus-topleft"><span className="nexus-status-dot"/> LIVE SIMULATION <b>· {paused?'PAUSED':'RUNNING'}</b></div>
        <div className="nexus-corner nexus-bottomleft">COORDINATES / 0.52 : 0.48 <span>↗ MOVER CURSOR PARA ALTERAR CAMPO</span></div>
        <div className="nexus-corner nexus-topright">{MODE_INFO[mode].code} <span>NEXUS SYSTEMS</span></div>
      </div>
      <aside className="nexus-controls">
        <span className="nexus-control-title">◈ CONTROL DE SISTEMA <span>LIVE</span></span>
        <h3>{MODE_INFO[mode].name}</h3><p>{MODE_INFO[mode].desc}</p>
        <div className="nexus-metric"><small>{MODE_INFO[mode].metric}</small><b>{paused?'PAUSA':power+'%'}</b><div className="nexus-meter"><span style={{width:power+'%'}}/></div></div>
        <label>INTENSIDAD DEL CAMPO <b>{power}%</b><input type="range" min="10" max="100" value={power} onChange={e=>setPower(Number(e.target.value))}/></label>
        <label>VELOCIDAD DE SIMULACIÓN <b>{speed}%</b><input type="range" min="5" max="100" value={speed} onChange={e=>setSpeed(Number(e.target.value))}/></label>
        <label>DENSIDAD DE PARTÍCULAS <b>{density}</b><input type="range" min="60" max="320" step="10" value={density} onChange={e=>setDensity(Number(e.target.value))}/></label>
        <div className="nexus-actions"><button onClick={triggerPulse}>✦ PULSO ENERGÉTICO</button><button onClick={()=>setPaused(p=>!p)}>{paused?'▶ REANUDAR':'Ⅱ PAUSAR'}</button><button onClick={()=>{setReset(n=>n+1);setInteraction('SISTEMA REINICIADO')}}>↺ REINICIAR</button></div>
        <div className="nexus-readout"><span>● {interaction}</span><span>CANVAS 2D · 30 FPS OBJETIVO</span></div>
      </aside>
    </div>
    <div className="nexus-tech"><div><strong>03</strong><span>SIMULACIONES INTERACTIVAS</span></div><div><strong>30</strong><span>FPS OBJETIVO PARA NOTEBOOKS</span></div><div><strong>NO GPU</strong><span>SEGUNDO CONTEXTO WEBGL EVITADO</span></div></div>
  </div>
}
