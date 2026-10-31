# NEBULA — corrección para el despliegue en Vercel

## Problema solucionado

La compilación fallaba con:

```
components/OriginStation.tsx: Type 'RefObject<Mesh<...>>' is not assignable to type 'Ref<Group<...>>'
```

En `StationGeometry` se cambió la referencia `beacon` de `useRef<THREE.Mesh>(null)` a `useRef<THREE.Group>(null)`, porque se utiliza en `<group ref={beacon}>`.

Además se reemplazó `align-items:start` por `align-items:flex-start` en `app/globals.css` para eliminar la advertencia de Autoprefixer.

Se completó `.gitignore` para excluir `.next`, `node_modules` y archivos de entorno.

## Subir a GitHub y volver a desplegar

1. Copiá los archivos de este ZIP sobre **la misma carpeta de tu repositorio Git**, conservando `.git`.
2. En PowerShell, dentro de esa carpeta:

   ```powershell
   npm install
   npm run verify
   npm run build
   ```

3. Si `.next` se agregó alguna vez a Git, desindexala con `git rm -r --cached .next` (solo si `git ls-files .next` muestra archivos).
4. Subí las modificaciones:

   ```powershell
   git add -A
   git status
   git commit -m "Fix Vercel build: OriginStation group ref"
   git push origin main
   ```

5. Vercel debería iniciar un despliegue automático si el proyecto está vinculado al repositorio. También podés ejecutar un redeploy desde Vercel.

**Verificación en el entorno de preparación:** scripts `npm run verify` y sintaxis TS/TSX. No se pudo ejecutar el build completo aquí porque la red no permite descargar paquetes de npm. Si aparece otro error de tipos durante `npm run build`, copiá el siguiente mensaje de error.
