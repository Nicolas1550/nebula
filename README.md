> **NEBULA V12 / Archivo completo (22 proyectos):** incorporadas imágenes y enlaces de ATLAS, SYNAPSE, EON, NEBULA, SPEED, FRAME, SENTINEL y QUANTUM. Ver [ACTUALIZACION-22-PROYECTOS.md](./ACTUALIZACION-22-PROYECTOS.md).

# NEBULA V11 — Nexus Research Lab + Inferno: Operation Ember

Versión actualizada del portfolio espacial de Nicolás Luciuk, desarrollada **sobre el ZIP aportado**. Se conservan ORIGIN, los 22 proyectos, el museo 3D, NOVA, el aterrizaje, el recorrido de reclutadores, los planetas 2K y la introducción espacial.

## Cómo probarlo en Windows

1. Descomprimí este ZIP en una carpeta nueva.
2. Abrí esa carpeta en Visual Studio Code. Tiene que contener `package.json`.
3. Ejecutá:

```powershell
npm install
npm run dev
```

4. Visitá <http://localhost:3000>. Podés omitir las intros con los controles de la página.
5. Entrá primero a NEXUS y después a INFERNO.

Para comprobar antes de desplegar:

```powershell
npm run verify
npm run build
```

**Tests adicionales de las reglas del juego (requieren Node.js 22):**

```powershell
npm run test:game
```

## Novedades

### NEXUS: laboratorio interactivo

Sustituye la vista anterior de partículas por tres experimentos independientes:

- **Reactor cuántico:** plasma y trayectorias que reaccionan al cursor.
- **Pozo gravitacional:** mové el mouse o arrastrá para cambiar el centro de atracción.
- **Ondas:** interferencia entre dos emisores y propagación visible.

Cada experimento permite configurar intensidad, velocidad y densidad de partículas; se puede emitir un pulso, pausar y reiniciar. Se dibuja con Canvas 2D a aproximadamente 30 FPS de objetivo para evitar crear otro contexto WebGL y se pausa cuando queda fuera de pantalla. Son simulaciones artísticas/interactivas, **no cálculos físicos científicos**.

### INFERNO: Operation Ember

Reemplaza el juego de cuatro núcleos por un juego arcade de nave:

- 60 segundos, 5 núcleos que aportan 20 % cada uno.
- Movimiento libre con **WASD / flechas**, controles táctiles o arrastrando en el campo de juego.
- Recolección por contacto y **pulso magnético con ESPACIO** (o botón); radio de captura con recarga.
- Asteroides, daño, escudo, puntuación, estados de victoria y derrota.
- **Bug reparado:** al recoger el quinto núcleo el juego cambia a `won` inmediatamente, se muestra la pantalla de victoria y el reloj se congela. No puede transformarse después en derrota.
- Si se agota el tiempo o el escudo, se muestra la pantalla de derrota y se puede reintentar.

Las reglas puras se encuentran en `lib/infernoRules.ts`, con tests en `tests/inferno-rules.test.mjs`.

## Diseño y rendimiento

- Se conserva la arquitectura WebGL del universo y se usan dos escenas **Canvas 2D** livianas para los planetas interiores.
- Se limita la resolución interna de los dos nuevos canvas (DPR máximo 1.5).
- Las animaciones se pausan si el canvas sale de la zona visible o la pestaña está oculta.
- INFERNO apunta a ~30 FPS mientras se juega y ~10 FPS en pantallas de resultado.
- NEXUS limita la cantidad de partículas a 320 y ofrece pausa manual.
- Los módulos se importan dinámicamente, por lo que no cargan en la portada inicial.
- Se conservaron los enlaces de los 22 proyectos originales y se añadieron 8 fichas con portadas y enlaces confirmados.

## Archivos principales modificados

```text
app/page.tsx                    Integración NEXUS e INFERNO V11
app/globals.css                 Interfaces sci-fi y diseño responsive
components/v11/NexusLab.tsx     Laboratorio de tres simulaciones
components/v11/InfernoMission.tsx  Juego arcade con canvas
lib/infernoRules.ts             Reglas puras (victoria, tiempo, daño)
tests/inferno-rules.test.mjs    Pruebas de victoria/derrota
scripts/verify-v11.mjs          Verificación de integración
package.json                    Scripts verify y test:game
```

## Subir la V11 a GitHub/Vercel

Si tenés ya un repositorio en tu PC, copiá **el contenido** de este ZIP a la carpeta de tu repositorio (donde está `package.json`), reemplazando archivos, pero **conservá la carpeta oculta `.git`**. Ejecutá `npm run build` y, si termina sin errores:

```powershell
git add -A
git status
git commit -m "NEBULA V11: Nexus Lab e Inferno Operation Ember"
git push origin main
```

Vercel detectará los cambios si ya está conectado al repositorio. No incluyas `.next`, `node_modules` ni archivos `.env` con secretos; se mantienen excluidos por `.gitignore`.

## Verificación / límites

Pasaron `npm run verify`, los tests de reglas del juego y la comprobación sintáctica de archivos TSX. **No se pudo ejecutar `npm run build` aquí**, porque el entorno no dispone de todas las dependencias en su caché (`zustand`) y no tiene conectividad npm utilizable. Probá la compilación y el juego en tu máquina antes de actualizar el despliegue público.

La V11 no cambia la versión de Next.js ni sustituye las tareas de actualización de seguridad del framework, que deberían revisarse antes del lanzamiento definitivo.
