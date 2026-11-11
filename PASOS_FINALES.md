# ✅ Pasos Finales para Ver el Preview

## Estado Actual

**Código actualizado:** ✅ Todos los componentes ahora usan las rutas correctas
**Build exitoso:** ✅ El proyecto compila sin errores
**Imágenes en public:** ❌ Faltan las imágenes físicas

---

## Por Qué No Ves el Preview

El código está correcto y apunta a las imágenes correctas, pero las imágenes físicas aún no están en la carpeta `public/` del proyecto. Por eso el sitio carga pero las imágenes no se muestran.

---

## Solución Rápida (3 pasos)

### Paso 1: Renombra tus archivos

Necesitas renombrar los archivos que me enviaste con estos nombres exactos:

1. **Logo:** `imagotipo_verde_6009_definitivo_copy.jpg`
2. **Equipo completo:** `foto_equipo.jpeg`
3. **Katia:** `foto_katia.jpeg`
4. **Raúl:** `foto_raul_.jpeg` ⚠️ (nota el guion bajo `_` al final)
5. **Carol:** `foto_carolim_.jpeg` ⚠️ (nota el guion bajo `_` al final)

### Paso 2: Coloca los archivos en la carpeta public/

En el explorador de archivos de Bolt:
1. Ve a la carpeta `public/`
2. Arrastra y suelta los 5 archivos renombrados
3. Bolt los guardará automáticamente

### Paso 3: Recarga el preview

- Haz clic en el botón de recarga del preview de Bolt
- O presiona Ctrl + F5 (Windows/Linux) o Cmd + Shift + R (Mac)

---

## Nombres Exactos Requeridos

```
public/
├── imagotipo_verde_6009_definitivo_copy.jpg  ← Logo para header y footer
├── foto_equipo.jpeg                          ← Foto del equipo completo
├── foto_katia.jpeg                           ← Foto de Katia
├── foto_raul_.jpeg                           ← Foto de Raúl (con _ al final)
└── foto_carolim_.jpeg                        ← Foto de Carol (con _ al final)
```

**⚠️ Importante:** Los nombres deben ser EXACTOS (incluyendo mayúsculas, minúsculas y guiones bajos).

---

## Verificación

Una vez que hayas colocado las imágenes:

✅ **Header:** Logo visible en la parte superior izquierda
✅ **Footer:** Logo visible en la parte inferior
✅ **Página "Nosotros":**
   - Foto grupal en la sección principal
   - Fotos individuales de Katia, Raúl y Carol

---

## Si Algo No Funciona

### El logo no aparece:
- Verifica que el archivo se llame exactamente: `imagotipo_verde_6009_definitivo_copy.jpg`
- Asegúrate de que esté en `public/`, no en una subcarpeta
- Limpia la caché del navegador

### Las fotos del equipo no aparecen:
- Verifica los guiones bajos (`_`) al final de `foto_raul_.jpeg` y `foto_carolim_.jpeg`
- Confirma que todas tengan extensión `.jpeg` (no `.jpg`)
- Verifica que estén en `public/`

---

## Cambios Realizados en el Código

Todos estos archivos ya fueron actualizados:

✅ `src/components/Header.tsx` - Logo actualizado
✅ `src/components/Footer.tsx` - Logo + Schema.org actualizados
✅ `src/components/About.tsx` - 4 fotos actualizadas

**No necesitas tocar el código, solo colocar las imágenes.**

---

## Resumen

1. **Renombra** los 5 archivos con los nombres exactos
2. **Arrastra** a la carpeta `public/` en Bolt
3. **Recarga** el preview
4. **¡Listo!** Todas las imágenes deberían mostrarse

---

**El código está 100% listo. Solo faltan las imágenes físicas en la carpeta public/.**
