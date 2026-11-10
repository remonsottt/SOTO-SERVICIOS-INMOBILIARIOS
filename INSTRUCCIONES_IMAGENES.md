# Instrucciones para Restaurar las Imágenes del Sitio Web

## Resumen

He actualizado todas las referencias de imágenes en el código para que usen archivos permanentes. El proyecto compila correctamente y está listo para funcionar una vez que coloques las imágenes en la carpeta `public/`.

---

## Cambios Realizados

### 1. Header (src/components/Header.tsx)
- **Antes:** `/imagotipo blanco+ 6009 definitivo   copy.png`
- **Ahora:** `/imagotipo_verde_6009_definitivo_copy.jpg`
- **Añadido:** Manejo de errores con `onError` para ocultar imagen si no carga

### 2. Footer (src/components/Footer.tsx)
- **Antes:** `/imagotipo letras blancas definitivo   copy.png`
- **Ahora:** `/imagotipo_verde_6009_definitivo_copy.jpg`
- **Schema.org:** Actualizado a la nueva URL
- **Añadido:** Manejo de errores con `onError`

### 3. About (src/components/About.tsx)

#### Foto del Equipo Completo:
- **Antes:** `/photo-2025-11-21-13-46-23.jpg`
- **Ahora:** `/foto_equipo.jpeg`
- **Añadido:** Manejo de errores con `onError`

#### Fotos Individuales:
- **Raúl Soto:** `/foto_raul_.jpeg` (antes: `/photo-raul.jpg`)
- **Katia Soto:** `/foto_katia.jpeg` (antes: `/photo-katia.jpg`)
- **Carol Soto:** `/foto_carolim_.jpeg` (antes: `/photo-carolim.jpg`)

---

## Archivos que Necesitas Colocar

Necesitas copiar los siguientes archivos a la carpeta `public/` del proyecto:

### Logos (1 archivo)
```
imagotipo_verde_6009_definitivo_copy.jpg
```
**Uso:** Header y Footer (todas las páginas)

### Fotos del Equipo (4 archivos)
```
foto_equipo.jpeg         (Foto grupal - Página Nosotros)
foto_katia.jpeg          (Foto individual - Katia Soto)
foto_raul_.jpeg          (Foto individual - Raúl Soto)
foto_carolim_.jpeg       (Foto individual - Carol Soto)
```

---

## Cómo Colocar las Imágenes

### Opción 1: Desde la Interfaz de Bolt

1. En Bolt, ve a la carpeta `public/` en el explorador de archivos
2. Arrastra y suelta cada una de las 5 imágenes que te proporcioné
3. Asegúrate de que los nombres sean exactamente como se indican arriba
4. Bolt guardará los archivos automáticamente

### Opción 2: Usando el Panel de Carga que Creé

Si prefieres usar el sistema de almacenamiento en Supabase:

1. Accede a `http://localhost:5173/admin/upload`
2. Sube cada imagen usando el panel
3. El sistema las guardará en Supabase Storage de forma permanente

**Nota:** Si usas esta opción, las URLs serán diferentes y necesitarás actualizar las referencias en el código.

---

## Verificación

Después de colocar las imágenes:

1. **Recarga el navegador** (Ctrl + F5 o Cmd + Shift + R)
2. **Verifica el Header:** Logo visible en la parte superior izquierda
3. **Verifica el Footer:** Logo visible en la parte inferior
4. **Ve a la página "Nosotros":**
   - Foto grupal visible en la sección principal
   - Fotos individuales de Katia, Raúl y Carol en la sección "Nuestro Equipo"

---

## Manejo de Errores

He añadido código para que si una imagen no carga:
- Se oculta automáticamente (no aparece el icono de imagen rota)
- No rompe el diseño del sitio
- El resto de la página funciona normalmente

---

## Estado del Proyecto

✅ **Build exitoso:** El proyecto compila correctamente
✅ **Referencias actualizadas:** Todos los componentes usan los nuevos nombres
✅ **Manejo de errores:** Imágenes que no cargan no rompen el layout
✅ **Sin modificaciones a lógica:** Solo se cambiaron URLs de imágenes

---

## Próximos Pasos

1. Coloca las 5 imágenes en la carpeta `public/`
2. Verifica que los nombres sean exactos
3. Recarga el navegador
4. Confirma que todas las imágenes se muestran correctamente

---

## Nombres Exactos Requeridos

Para evitar errores, aquí están los nombres exactos que el código espera:

```
public/
├── imagotipo_verde_6009_definitivo_copy.jpg  ← Logo (Header + Footer)
├── foto_equipo.jpeg                           ← Foto grupal
├── foto_katia.jpeg                            ← Katia
├── foto_raul_.jpeg                            ← Raúl (nota el guion bajo al final)
└── foto_carolim_.jpeg                         ← Carol (nota el guion bajo al final)
```

**Importante:** Los guiones bajos (`_`) al final de los nombres de Raúl y Carol son necesarios. Asegúrate de incluirlos.

---

## Solución de Problemas

### Si el logo no aparece:
1. Verifica que el archivo se llame exactamente `imagotipo_verde_6009_definitivo_copy.jpg`
2. Confirma que está en la carpeta `public/`, no en una subcarpeta
3. Recarga con Ctrl + F5 para limpiar la caché

### Si las fotos del equipo no aparecen:
1. Verifica los nombres exactos (incluyendo los guiones bajos finales)
2. Confirma el formato `.jpeg` (no `.jpg`)
3. Asegúrate de que están en `public/`, no en subcarpetas

### Si todo falla:
1. Abre la consola del navegador (F12)
2. Ve a la pestaña "Network"
3. Recarga la página
4. Busca errores 404 para ver qué imágenes no se encuentran
5. Verifica que los nombres coincidan exactamente

---

## Resumen de Archivos Modificados

Los siguientes archivos fueron modificados (solo referencias de imágenes):

- `src/components/Header.tsx` (1 referencia)
- `src/components/Footer.tsx` (2 referencias)
- `src/components/About.tsx` (4 referencias)

**Total:** 7 referencias actualizadas en 3 archivos

---

**Estado Final:** ✅ Código actualizado y listo. Solo falta colocar las imágenes en `public/`
