import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const check=(p,label)=>{assert.ok(fs.existsSync(path.join(root,p)),`${label} ausente: ${p}`);console.log('✓',label,p)};
for(const c of ['Universe.tsx','OriginStation.tsx','HyperspaceTransition.tsx','LaunchSequence.tsx'])check(`components/${c}`,'Componente');
for(const c of ['app/page.tsx','app/layout.tsx','app/globals.css'])check(c,'Aplicación');
for(const name of ['origin','nexus','inferno']){
 check(`public/space/${name}-color-2k.webp`,'Textura espacial');
 check(`public/social/${name}-preview.webp`,'Planeta fallback');
}
check('public/social/nebula-v8-cover.jpg','Portada para LinkedIn');
const home=read('app/page.tsx');
for(const n of ['ORIGIN','NEXUS','INFERNO'])assert.ok(home.includes(n),`Falta mundo ${n}`);
for(const name of ['HyperspaceTransition','OriginStation','scanTick','pulseTick','LaunchSequence','Origin lowPower','Nexus','Inferno'])assert.ok(home.includes(name),`Falta integración: ${name}`);
const universe=read('components/Universe.tsx');
for(const name of ['PlanetScanner','EnergyPulse','OrbitalProbe','SpaceTraffic','fallback='])assert.ok(universe.includes(name),`Falta efecto: ${name}`);
for(const name of ['photo.webp','bici.webp','equilibrio.png','tangoWeb.png'])check(`public/portfolio/${name}`,'Imagen de proyecto');
const pkg=JSON.parse(read('package.json'));
assert.ok(pkg.scripts.build.includes('next build'));
console.log('\nVerificación de estructura e integración correcta.');
console.log('Nota: esto no reemplaza npm run build ni una prueba visual de WebGL.');

// V9: catálogo completo de proyectos recibido en el ZIP del portfolio original.
check('data/portfolioProjects.ts','Catálogo profesional completo');
check('components/ProjectsArchive.tsx','Galería de proyectos');
const data=read('data/portfolioProjects.ts');
const ids=[...data.matchAll(/"id": "(p\d\d)"/g)].map(m=>m[1]);
assert.equal(ids.length,22,`Se esperaban 22 proyectos, se encontraron ${ids.length}`);
assert.equal(new Set(ids).size,22,'IDs de proyectos duplicados');
for(const id of ids)check(`public/portfolio/thumbs/${id}.webp`,'Miniatura optimizada');
assert.ok(home.includes('ProjectsArchive'),'ORIGIN no integra la galería completa');
assert.ok(!data.includes('github.com/user/project3'),'El repositorio de ejemplo no debe publicarse');
console.log('✓ Archivo profesional completo: 22 proyectos y 22 miniaturas.');
