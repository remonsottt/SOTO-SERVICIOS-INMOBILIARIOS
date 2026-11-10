# Corrección de Content Security Policy (CSP) - Completada

## Problema Identificado

Las Edge Functions de Supabase estaban siendo bloqueadas en producción por la política CSP definida en `index.html`. El error en consola era:

```
Refused to connect to 'https://zbqmtwfdzuemmleysgmf.supabase.co/functions/v1/notion-properties' because it violates the following Content Security Policy directive: "connect-src 'self' https://api.supabase.co https://notion-api.splitbee.io https://api.notion.com"
```

## Ubicación de la CSP

**Archivo:** `index.html` (línea 25)

La CSP se define mediante una etiqueta `<meta http-equiv="Content-Security-Policy">` en el HTML principal, que se propaga al build en `dist/index.html`.

## Cambios Realizados

### BEFORE (CSP Original):

```
connect-src 'self' https://api.supabase.co https://notion-api.splitbee.io https://api.notion.com;
frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://widget.elfsight.com;
script-src 'self' 'unsafe-inline' 'unsafe-eval' https://static.elfsight.com https://elfsightcdn.com https://www.youtube.com https://www.youtube-nocookie.com https://s.ytimg.com;
```

### AFTER (CSP Actualizada):

```
connect-src 'self' https://zbqmtwfdzuemmleysgmf.supabase.co https://*.supabase.co https://api.supabase.co https://notion-api.splitbee.io https://api.notion.com;

frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://widget.elfsight.com https://www.google.com https://maps.google.com https://drive.google.com;

script-src 'self' 'unsafe-inline' 'unsafe-eval' https://static.elfsight.com https://elfsightcdn.com https://www.youtube.com https://www.youtube-nocookie.com https://s.ytimg.com https://bolt.new;
```

### Dominios Añadidos:

#### connect-src (Para llamadas fetch/XHR):
- ✅ `https://zbqmtwfdzuemmleysgmf.supabase.co` - Tu proyecto específico de Supabase
- ✅ `https://*.supabase.co` - Wildcard para cualquier subdominio de Supabase (futuro-proof)

#### frame-src (Para iframes):
- ✅ `https://www.google.com` - Google Maps embeds
- ✅ `https://maps.google.com` - Google Maps (dominio alternativo)
- ✅ `https://drive.google.com` - Google Drive videos

#### script-src (Para scripts externos):
- ✅ `https://bolt.new` - Badge de Bolt (para evitar bloqueos)

## Protección Adicional

Añadido script de manejo de errores defensivo para scripts externos (share-modal.js y badge.js):

```javascript
window.addEventListener('error', function(e) {
  if (e.filename && (e.filename.includes('share-modal') || e.filename.includes('badge.js'))) {
    e.preventDefault();
    console.warn('External script error suppressed:', e.message);
  }
}, true);
```

Este script previene que errores de scripts externos de Bolt rompan la funcionalidad del sitio.

## Verificación de Funcionamiento

### ✅ Build Completado
- Compilación exitosa
- `dist/index.html` generado con CSP actualizada
- Tamaño del bundle: 431.43 kB (comprimido: 117.70 kB)

### 🔍 Qué Verificar en Producción

Después del deploy, verifica:

1. **Consola del navegador:**
   - ❌ NO debe aparecer: "Refused to connect... violates Content Security Policy"
   - ✅ DEBE aparecer: Logs de `[DEV] EdgeClient →` (solo en DEV)

2. **Página de Propiedades (`/es/propiedades`):**
   - ✅ Deben cargar las tarjetas de propiedades desde Notion
   - ✅ Sin errores de red en la pestaña Network

3. **Página de Blog (`/es/blog`):**
   - ✅ Deben cargar los artículos desde Notion
   - ✅ Sin errores de red

4. **Formularios:**
   - ✅ Contacto general debe enviarse a Notion
   - ✅ Contacto desde propiedad debe incluir referencia
   - ✅ Valoración debe guardarse en Notion

5. **Google Maps y Drive:**
   - ✅ Los iframes de Google Maps deben mostrarse correctamente
   - ✅ Los videos de Google Drive deben reproducirse

6. **Errores de Scripts Externos:**
   - ✅ `share-modal.js` y `badge.js` no deben romper la app
   - ⚠️ Pueden aparecer warnings en consola, pero no errores críticos

## Testing Checklist

Ejecuta estas pruebas en producción (móvil y desktop):

- [ ] Abre DevTools → Consola
- [ ] Ve a `/es/propiedades`
- [ ] ¿Cargan las propiedades? SÍ / NO
- [ ] ¿Hay errores CSP en consola? SÍ / NO
- [ ] Ve a `/es/blog`
- [ ] ¿Cargan los artículos? SÍ / NO
- [ ] Envía un formulario de contacto
- [ ] ¿Se guarda en Notion? SÍ / NO
- [ ] Completa una valoración
- [ ] ¿Se guarda en Notion? SÍ / NO
- [ ] ¿Google Maps se muestra correctamente? SÍ / NO

## Arquitectura de la Solución

```
┌─────────────────────────────────────────────────────────┐
│                    PRODUCCIÓN                            │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Frontend (index.html)                                   │
│  ├── CSP permite: zbqmtwfdzuemmleysgmf.supabase.co     │
│  └── CSP permite: *.supabase.co                         │
│                      │                                   │
│                      ▼                                   │
│  EdgeClient (edgeClient.ts)                             │
│  ├── Detecta: !isDev                                    │
│  ├── URL: https://zbqmtwfdzuemmleysgmf.supabase.co     │
│  └── Headers: Authorization + apikey                    │
│                      │                                   │
│                      ▼                                   │
│  Supabase Edge Functions                                │
│  ├── notion-properties                                  │
│  ├── notion-blog                                        │
│  ├── notion-valuation                                   │
│  └── notion-contacts                                    │
│                      │                                   │
│                      ▼                                   │
│  Pica API → Notion Databases                            │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## Archivos Modificados

1. **index.html** (línea 25)
   - Actualizada CSP para incluir dominios de Supabase
   - Añadido script defensivo para errores externos

2. **dist/index.html** (regenerado)
   - Build de producción con nueva CSP

## Comandos Ejecutados

```bash
npm run build
```

## Próximos Pasos

1. **Hacer commit y push** de los cambios
2. **Redeploy** en tu plataforma de hosting (Bolt/Netlify/Vercel)
3. **Verificar** que las variables de entorno estén configuradas:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. **Probar** en producción usando el checklist arriba

## Notas Técnicas

- La CSP se define en el HTML, no en headers del servidor
- El wildcard `*.supabase.co` permite flexibilidad para cambios futuros
- La política sigue siendo restrictiva (no usa `*` en ninguna directiva)
- Se mantienen todos los dominios existentes (YouTube, Elfsight, Notion)
- Los errores de scripts externos se capturan sin romper la app

## Soporte

Si después del deploy sigues viendo errores CSP:

1. Abre DevTools → Consola
2. Copia el error completo que aparece
3. Verifica que el dominio bloqueado esté en la lista de `connect-src`
4. Confirma que las variables `VITE_SUPABASE_*` estén configuradas en producción
