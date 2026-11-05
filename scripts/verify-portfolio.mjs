import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const read=(p)=>fs.readFileSync(path.join(root,p),'utf8');
const data=read('data/portfolioProjects.ts');
const ids=[...data.matchAll(/"id": "(p\d\d)"/g)].map(m=>m[1]);
assert.equal(ids.length,22,'Deben existir exactamente 22 fichas');
assert.equal(new Set(ids).size,22,'Hay IDs duplicados');
for(let i=1;i<=22;i++){
  const id=`p${String(i).padStart(2,'0')}`;
  assert.ok(ids.includes(id),`Falta ${id}`);
  const filename=path.join(root,'public/portfolio/thumbs',id+'.webp');
  assert.ok(fs.existsSync(filename),`Falta portada ${id}`);
  const binary=fs.readFileSync(filename);
  assert.ok(binary.length>3000,`Portada vacía ${id}`);
  assert.equal(binary.toString('ascii',0,4),'RIFF');
  assert.equal(binary.toString('ascii',8,12),'WEBP');
}
for(const id of ['atlas','synapse','eon','nebula','speedv2','frame','sentinel','trading']){
  assert.ok(data.toLowerCase().includes(id.toLowerCase()),`Falta el proyecto ${id}`);
}
for(const url of [
  'https://atlas-gamma-blue.vercel.app/',
  'https://synapse-le8l.vercel.app/',
  'https://eon-three-henna.vercel.app/',
  'https://nebula-chi-two.vercel.app/',
  'https://speedv2-7rrl.vercel.app/',
  'https://frame-sandy-nine.vercel.app/',
  'https://sentinel-sooty-two.vercel.app/',
  'https://trading-indol-tau.vercel.app/',
  'https://github.com/Nicolas1550/sentinel',
  'https://github.com/Nicolas1550/trading',
])assert.ok(data.includes(url),`Enlace ausente ${url}`);
for(const file of ['components/ProjectsArchive.tsx','components/v10/ProjectMuseum.tsx','components/v10/NovaAssistant.tsx','components/v10/RecruiterTour.tsx']){
  const source=read(file);
  assert.ok(source.includes('portfolioProjects'),`${file} no usa catálogo único`);
  assert.ok(!source.includes('los 14 proyectos')&&!source.includes('los 17 proyectos')&&!source.includes('catorce proyectos'),`${file} conserva contador obsoleto`);
}
console.log('✓ NEBULA: 22 fichas, 22 imágenes WebP y enlaces configurados correctamente');
