import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const must=['components/v11/NexusLab.tsx','components/v11/InfernoMission.tsx','lib/infernoRules.ts','tests/inferno-rules.test.mjs'];
let failed=false;
for(const f of must){const p=path.join(root,f);if(!fs.existsSync(p)){console.error('FALTA '+f);failed=true}else console.log('✓ '+f)}
const page=fs.readFileSync(path.join(root,'app/page.tsx'),'utf8');
if(!page.includes("import('../components/v11/NexusLab')")||!page.includes("import('../components/v11/InfernoMission')")){console.error('Falta integración de ambos planetas en app/page.tsx');failed=true}
const rules=fs.readFileSync(path.join(root,'lib/infernoRules.ts'),'utf8');
if(!rules.includes("status: energy >= 100 ? 'won' : 'playing'")){console.error('Falta finalización inmediata de INFERNO');failed=true}
if(failed)process.exit(1);
console.log('✓ Integración V11 y regla de victoria comprobadas');
