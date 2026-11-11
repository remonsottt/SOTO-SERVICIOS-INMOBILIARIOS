# BACKLOG — Mantenimiento y mejora continua

> Cola de tareas para el loop de auto-mantenimiento.
> Reglas: 1 tarea = 1 commit. Antes de marcar [x]: `npm run build` debe pasar.
> Acciones destructivas o externas (deploy, borrar, push) requieren OK humano.

## 🔴 Bugs (prioridad alta)

- [ ] **Contact.tsx:82 — `analytics` no está definido.** Al enviar el formulario de
      contacto con éxito lanza `ReferenceError`, lo captura el `catch` y el usuario
      NO ve la confirmación. Punto de conversión roto. Detectado por `npm run typecheck`.
      Fix probable: importar el servicio de analytics/GTM correcto o eliminar la llamada.

- [ ] **Vídeo testimonial (GoogleReviews.tsx) no se ve en Chrome/Apple Silicon.**
      Se oye el audio pero el recuadro sale blanco. Diagnóstico: el archivo y el código
      están bien (H.264/AAC, el frame decodifica a canvas con imagen real); es un fallo
      de composición de vídeo por GPU en Chrome (M4). Mitigado con `poster` local, pero
      el play sigue sin pintar en el equipo del cliente. Pendiente de resolver en Bolt.

## 🟡 Rendimiento

- [ ] Ejecutar Lighthouse y registrar LCP/CLS/TBT base de `/` y `/propiedades`.
- [ ] Bundle JS ~458 kB (125 kB gzip) en un solo chunk. Evaluar code-splitting por
      ruta con `React.lazy` + `Suspense` (admin, blog-editor, valuation no son críticos).
- [ ] `npx update-browserslist-db@latest` (aviso en cada build).
- [ ] Revisar imágenes de Pexels en Hero/Properties: servir tamaños responsivos (`srcset`).

## 🟢 CRO / contenido

- [ ] Verificar que el formulario de `/vender-mi-piso` llega a Notion con `origin: 'Vender mi piso'`.
- [ ] A/B del copy del Hero de SellerPage (directo vs. emocional).
- [ ] Añadir prueba social (reseñas Google) a la landing de vendedores.
- [ ] Revisar que GTM/Meta Pixel registran el lead de SellerPage.

## 🔵 Calidad de código / deuda

- [ ] 20 vulnerabilidades de npm (`npm audit`). Revisar cuáles son de prod vs. dev.
- [ ] Consolidar tokens de color: ThankYouPage usa `green-*`/`gray-*` en vez de `forest-*`/`sand-*`.
- [ ] `App.tsx` parece legacy (routing real está en `main.tsx`). Confirmar y eliminar si no se usa.
- [ ] Muchos `.md` de documentación en la raíz; mover a `/docs`.

## ✅ Hecho (iteración CRO — junio 2026)

- [x] PASO 1 — Cache Properties, lazy/priority imágenes, preconnect Supabase.
- [x] PASO 2 — Ocultar valoración de nav (Header + Footer → `/vender-mi-piso`).
- [x] PASO 3 — WhatsAppFloat.
- [x] PASO 4 — Landing `/vender-mi-piso`.
- [x] PASO 8 — CTA vendedores en HomePage.
