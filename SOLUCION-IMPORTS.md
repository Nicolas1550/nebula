# NEBULA — corrección del error `lib/app/page.tsx`

El ZIP original `nebula(4).zip` contenía una copia accidental completa del proyecto anidada bajo `lib/`.
Dicha copia incluye `lib/app/page.tsx` pero no `lib/components/Universe.tsx`. El compilador de
TypeScript intentaba resolver el import `../components/Universe` desde esa copia y fallaba.

**Este ZIP ya está limpio**: `app/page.tsx` y `components/Universe.tsx` están en la raíz correcta.
Además `tsconfig.json` excluye los archivos de proyecto duplicados bajo `lib/` que puedan
quedar si pegás archivos nuevos sobre una instalación antigua.

## Para corregir tu carpeta existente (PowerShell)

Abrí PowerShell en la raíz del proyecto, donde se encuentra `package.json`, y ejecutá:

```powershell
Remove-Item -Recurse -Force .\lib\app -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .\lib\data -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .\lib\lib -ErrorAction SilentlyContinue
Remove-Item -Force .\lib\next-env.d.ts -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .\.next -ErrorAction SilentlyContinue
npm install
npm run verify
npm run build
```

**Importante:** NO borres la carpeta `lib` entera. `lib/infernoRules.ts` es parte del juego INFERNO.

La opción más limpia es descomprimir este ZIP en una carpeta nueva, y luego trasladar tu
`.git`/configuración local a esa carpeta o reemplazar el contenido de tu proyecto existente
sin conservar carpetas duplicadas. Conservá tus archivos `.env` privados localmente y NO los subas a Git.

## Estructura esperada

```text
nebula-beyond/
  app/page.tsx
  components/Universe.tsx
  data/portfolioProjects.ts
  lib/infernoRules.ts
  public/portfolio/thumbs/p01.webp ... p22.webp
```

Comprobación en entorno de preparación: `npm run verify` y `npm run test:game` pasan.
El build completo de Next.js no se ha confirmado aquí porque npm no pudo instalar
sus dependencias en este entorno.
