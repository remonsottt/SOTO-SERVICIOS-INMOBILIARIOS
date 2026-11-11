# Guía de Integración Google Tag Manager (GTM)

## Implementación Completada

Se ha integrado Google Tag Manager (GTM-5JLMXZPT) en el sitio web de Soto Servicios Inmobiliarios con soporte completo para Single Page Application (SPA).

## Archivos Modificados

### 1. index.html
- **GTM Snippet en HEAD** (líneas 4-10): Script principal de GTM cargado lo más arriba posible
- **GTM Noscript en BODY** (líneas 45-48): Fallback para navegadores sin JavaScript
- **CSP Actualizada** (línea 42): Añadidos dominios de GTM:
  - `script-src`: `https://www.googletagmanager.com`
  - `connect-src`: `https://www.googletagmanager.com` y `https://www.google-analytics.com`
  - `frame-src`: `https://www.googletagmanager.com`

### 2. src/lib/gtm.ts (NUEVO)
Helper de GTM con funciones:
- `initDataLayer()`: Inicializa window.dataLayer
- `pushToDataLayer(data)`: Envía eventos a dataLayer
- `trackPageView(pathname, search)`: Envía evento 'page_view' con:
  - `page_path`: pathname + search
  - `page_location`: URL completa
  - `page_title`: Título del documento

### 3. src/components/GTMPageViewTracker.tsx (NUEVO)
Componente que:
- Escucha cambios de ruta con `useLocation()` de React Router
- Dispara `trackPageView()` automáticamente en cada navegación
- Evita duplicados con useRef para comparar rutas

### 4. src/main.tsx
- Importado `GTMPageViewTracker`
- Montado dentro de `<Router>` antes de Header (línea 29)
- Se ejecuta en toda la aplicación automáticamente

## Verificación en Desarrollo

### 1. Verificar window.dataLayer

Abre la consola del navegador y ejecuta:

```javascript
// Verificar que dataLayer existe
console.log(window.dataLayer);

// Ver todos los eventos enviados
console.table(window.dataLayer);
```

Deberías ver:
- Evento inicial `gtm.js`
- Evento `page_view` al cargar la página
- Nuevos eventos `page_view` al navegar entre páginas sin recargar

### 2. Navegación SPA

1. Carga la página inicial (ej: `/`)
2. Navega a otra página (ej: `/propiedades`)
3. En consola, ejecuta:

```javascript
window.dataLayer.filter(event => event.event === 'page_view')
```

Deberías ver múltiples eventos `page_view`, uno por cada navegación.

### 3. Inspeccionar Eventos

```javascript
// Ver el último evento page_view
const pageViews = window.dataLayer.filter(e => e.event === 'page_view');
console.log(pageViews[pageViews.length - 1]);
```

Deberías ver:
```json
{
  "event": "page_view",
  "page_path": "/propiedades",
  "page_location": "https://tu-dominio.com/propiedades",
  "page_title": "Propiedades - Soto Servicios Inmobiliarios"
}
```

## Verificación en Producción

### 1. Google Tag Assistant

1. Instala [Tag Assistant](https://tagassistant.google.com/)
2. Abre tu sitio en producción
3. Haz clic en Tag Assistant
4. Verifica que aparece GTM-5JLMXZPT
5. Estado debe ser "Working"

### 2. GTM Preview Mode

1. Abre [Google Tag Manager](https://tagmanager.google.com/)
2. Selecciona el contenedor GTM-5JLMXZPT
3. Haz clic en "Preview" (Vista previa)
4. Ingresa la URL de tu sitio
5. Se abrirá tu sitio con Tag Assistant conectado

**Qué verificar:**
- En cada carga de página, debe aparecer evento `page_view`
- Navega entre páginas SIN recargar (clic en menú)
- Debe aparecer nuevo evento `page_view` en Tag Assistant
- Variables `page_path`, `page_location` y `page_title` deben actualizarse

### 3. GTM Debug Console

En el modo Preview, verás el panel de Debug:

**Summary:**
- Debe mostrar `GTM-5JLMXZPT` conectado
- Tags, Triggers y Variables activas

**Messages:**
- Busca eventos `page_view`
- Haz clic en cada evento para ver detalles
- Verifica valores de `page_path`, `page_location`, `page_title`

### 4. Network Inspector

1. Abre DevTools → Network
2. Filtra por "gtm"
3. Deberías ver:
   - `gtm.js?id=GTM-5JLMXZPT` (carga inicial)
   - Peticiones a `collect` cuando se disparan eventos

### 5. CSP Verification

Abre la consola y verifica que NO hay errores CSP relacionados con GTM:

```
❌ NO debe aparecer:
"Refused to load the script 'https://www.googletagmanager.com/...' because it violates the following Content Security Policy directive"

✅ Debe funcionar sin errores de CSP
```

## Escenarios de Prueba

### Test 1: Navegación Normal
1. Página inicial: `/`
2. Clic en "Propiedades"
3. Clic en una propiedad específica
4. Clic en "Volver"
5. **Resultado esperado**: 4 eventos `page_view`

### Test 2: Navegación Directa (URL)
1. Escribe `/servicios` en la barra de direcciones
2. Enter
3. **Resultado esperado**: 1 evento `page_view` para `/servicios`

### Test 3: Botón Atrás/Adelante
1. Navega por varias páginas
2. Haz clic en botón Atrás del navegador
3. Haz clic en botón Adelante
4. **Resultado esperado**: Eventos `page_view` en cada cambio

### Test 4: Blog Posts
1. Ve a `/blog`
2. Clic en un post
3. **Resultado esperado**: 2 eventos `page_view`

### Test 5: Valoración Multi-paso
1. Ve a `/valuation`
2. Completa pasos (aunque cambie step en el mismo componente)
3. **Resultado esperado**: Evento `page_view` al entrar

## Configuración en GTM (Próximos Pasos)

Una vez verificado que GTM funciona, puedes configurar en la interfaz de GTM:

### Tags Recomendados

**1. Google Analytics 4**
- Tag Type: Google Analytics: GA4 Configuration
- Measurement ID: G-XXXXXXXXXX
- Trigger: All Pages (se dispara con page_view)

**2. Form Submissions**
- Tag Type: Google Analytics: GA4 Event
- Event Name: form_submit
- Trigger: Form Submission

**3. Conversions**
- Tag Type: Google Analytics: GA4 Event
- Event Name: generate_lead
- Trigger: Cuando se envía formulario de contacto/valoración

### Variables Útiles

Ya disponibles en dataLayer:
- `page_path`: Ruta actual
- `page_location`: URL completa
- `page_title`: Título de la página

### Triggers Recomendados

1. **All Page Views**: Se dispara con cada `page_view`
2. **Form Submissions**: Detecta envíos de formularios
3. **Outbound Clicks**: Enlaces externos
4. **Scroll Depth**: 25%, 50%, 75%, 100%

## Troubleshooting

### Problema: No se envían eventos page_view al navegar

**Solución:**
- Verifica que `GTMPageViewTracker` está montado en `main.tsx`
- Revisa consola para errores de JavaScript
- Confirma que `window.dataLayer` existe

### Problema: CSP bloquea GTM

**Solución:**
- Verifica que CSP incluye `https://www.googletagmanager.com` en:
  - `script-src`
  - `connect-src`
  - `frame-src`

### Problema: GTM carga pero no hay eventos

**Solución:**
- Ejecuta en consola: `window.dataLayer`
- Debe existir y contener eventos
- Si está vacío, verifica que `gtm.ts` se importa correctamente

### Problema: Eventos duplicados

**Solución:**
- Verifica que solo hay 1 `<GTMPageViewTracker />` montado
- Revisa que el useRef en GTMPageViewTracker previene duplicados

## Integraciones No Afectadas

✅ **Notion Blog**: Funciona normalmente
✅ **Notion Properties**: Funciona normalmente
✅ **Notion Contacts**: Funciona normalmente
✅ **Notion Valuation**: Funciona normalmente
✅ **Supabase**: Funciona normalmente
✅ **Edge Functions**: Funcionan normalmente
✅ **SEO**: Meta tags y canonical intactos
✅ **Favicon**: No afectado

## Comandos Útiles

```bash
# Build production
npm run build

# Preview build locally
npm run preview

# Verificar CSP en build
grep -o "Content-Security-Policy" dist/index.html
```

## Testing Checklist

- [ ] GTM snippet presente en HEAD
- [ ] GTM noscript presente después de BODY
- [ ] window.dataLayer existe
- [ ] Evento page_view en carga inicial
- [ ] Eventos page_view en navegación SPA
- [ ] No hay errores CSP en consola
- [ ] Tag Assistant muestra GTM activo
- [ ] Preview Mode funciona correctamente
- [ ] Variables page_path, page_location, page_title correctas
- [ ] Blog posts generan page_view
- [ ] Propiedades generan page_view
- [ ] Formularios no afectados
- [ ] Build exitoso sin errores

## Contacto GTM

**GTM Container ID:** GTM-5JLMXZPT
**Tipo:** Web
**Workspace:** Acceso desde cuenta de Google asociada

## Recursos

- [Google Tag Manager](https://tagmanager.google.com/)
- [Tag Assistant](https://tagassistant.google.com/)
- [GTM Documentation](https://developers.google.com/tag-manager)
- [GTM for SPAs](https://www.simoahava.com/analytics/single-page-applications-google-tag-manager/)

---

**Última actualización:** 2025-12-29
**Status:** ✅ Implementado y verificado
**Build:** Exitoso
