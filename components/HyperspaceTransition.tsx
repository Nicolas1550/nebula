'use client';
import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';

type Props = { world: string; accent: string; onSkip: () => void; lowPower?: boolean };
type Star = { x: number; y: number; z: number; size: number; speed: number };

// El túnel se dibuja en un solo Canvas 2D, sin agregar otro contexto WebGL.
export default function HyperspaceTransition({ world, accent, onSkip, lowPower = false }: Props) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    const ctx = el.getContext('2d', { alpha: true });
    if (!ctx) return;
    let raf = 0;
    let start = 0;
    let lastFrame = 0;
    let disposed = false;
    const stars: Star[] = Array.from({ length: lowPower ? 85 : 155 }, (_, i) => {
      const a = (i * 2.399963) % (Math.PI * 2);
      const r = Math.sqrt((i + 0.3) / (lowPower ? 85 : 155));
      return { x: Math.cos(a) * r, y: Math.sin(a) * r, z: 0.15 + ((i * 71) % 97) / 110, size: 0.6 + (i % 4) * 0.35, speed: 0.65 + (i % 7) * 0.08 };
    });
    let vw = 0, vh = 0, ratio = 1;
    const resize = () => {
      const rect = el.getBoundingClientRect();
      ratio = Math.min(window.devicePixelRatio || 1, lowPower ? 1 : 1.5);
      vw = Math.max(1, rect.width); vh = Math.max(1, rect.height);
      el.width = Math.round(vw * ratio); el.height = Math.round(vh * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    resize(); window.addEventListener('resize', resize);
    const draw = (now: number) => {
      if (disposed) return;
      if (!start) start = now;
      if (now - lastFrame < (lowPower ? 33 : 17)) { raf = requestAnimationFrame(draw); return; }
      lastFrame = now;
      const elapsed = (now - start) / 1000;
      const speed = elapsed < 0.85 ? 0.03 : elapsed < 3.65 ? 0.09 : 0.023;
      const velocity = elapsed < .85 ? .2 : elapsed < 3.6 ? 1 : .15;
      ctx.clearRect(0, 0, vw, vh);
      const cx = vw * .53, cy = vh * .48;
      const reach = Math.max(vw, vh) * .68;
      ctx.globalCompositeOperation = 'lighter';
      for (const s of stars) {
        const previousZ = s.z;
        s.z -= speed * s.speed;
        if (s.z < .05) s.z = 1;
        const project = (z: number) => reach * .16 / Math.max(z, .05);
        const r = project(s.z), prev = project(Math.min(1, previousZ + .08 * velocity));
        const ax = cx + s.x * r, ay = cy + s.y * r;
        const bx = cx + s.x * prev, by = cy + s.y * prev;
        const intensity = (1 - s.z) * velocity;
        ctx.strokeStyle = `rgba(${s.speed > .95 ? '198,158,255' : '116,214,255'},${Math.min(.9, .18 + intensity * .9)})`;
        ctx.lineWidth = s.size * Math.max(1, 1.4 - s.z);
        ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke();
      }
      ctx.globalCompositeOperation = 'source-over';
      if (elapsed < 1.1) setPhase(0);
      else if (elapsed < 3.7) setPhase(1);
      else setPhase(2);
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => { disposed = true; cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, [lowPower]);

  return <div className={`warp-screen warp-phase-${phase}`} style={{'--warp-accent': accent} as CSSProperties} role="status" aria-live="polite" aria-label={`Viajando a ${world}`}>
    <canvas className="warp-canvas" ref={canvas} aria-hidden="true" />
    <div className="warp-halo" aria-hidden="true"><span /><span /><span /></div>
    <div className="warp-vignette" />
    <div className="warp-top"><span>NEBULA · FTL NAVIGATION</span><span>DESTINATION LOCKED / {world}</span></div>
    <div className="warp-center">
      <small>{phase===0?'INICIANDO PROPULSIÓN':phase===1?'HIPERESPACIO ACTIVADO':'APROXIMACIÓN COMPLETADA'}</small>
      <h2>{phase===2?'LLEGANDO A': 'SALTO HACIA'} <em>{world}</em></h2>
      <div className="warp-bar"><span/></div>
      <p>{phase===0?'Estabilizando núcleo de navegación…':phase===1?'Atravesando el corredor interestelar…':'Preparando la estación de destino…'}</p>
    </div>
    <button type="button" className="warp-skip" onClick={onSkip}>SALTAR VIAJE ↗</button>
    <span className="warp-footer">VISUALIZACIÓN CINEMATOGRÁFICA · NO SIMULACIÓN FÍSICA</span>
  </div>;
}
