# Guía de Deployment en Producción

## Problema Solucionado

Las Edge Functions ahora funcionan correctamente tanto en desarrollo como en producción mediante un sistema de detección automática de entorno.

## Arquitectura de la Solución

### En Desarrollo (Preview de Bolt)
- Vite proxy intercepta las llamadas a `/api/*` y las redirige a Supabase Edge Functions
- Configurado en `vite.config.ts`
- No requiere headers de autenticación (el proxy los añade automáticamente)

### En Producción (Dominio Real / Móvil)
- Llamadas directas a `https://zbqmtwfdzuemmleysgmf.supabase.co/functions/v1/{function-name}`
- Headers de autenticación añadidos automáticamente
- Requiere variables de entorno configuradas

## Variables de Entorno Necesarias

### 1. Variables del FRONTEND (En Plataforma de Deploy)

Estas se configuran en tu plataforma de deployment (Bolt, Netlify, Vercel, etc.):

```bash
VITE_SUPABASE_URL=https://zbqmtwfdzuemmleysgmf.supabase.co
VITE_SUPABASE_ANON_KEY=REDACTED
```

**IMPORTANTE:** Sin estas variables, el frontend no podrá llamar a las Edge Functions en producción.

#### Cómo configurarlas en Bolt:
1. Ve a tu proyecto en Bolt
2. Settings → Environment Variables
3. Añade las dos variables arriba
4. Redeploy el proyecto

### 2. Secrets de Edge Functions (En Supabase Dashboard)

Estas se configuran en Supabase Dashboard → Settings → Edge Functions → Secrets:

```bash
# Para notion-properties
PICA_SECRET_KEY_prop=tu-clave-secreta
PICA_NOTION_CONNECTION_KEY_prop=tu-clave-de-conexion

# Para notion-blog
PICA_SECRET_KEY=tu-clave-secreta
PICA_NOTION_CONNECTION_KEY=tu-clave-de-conexion

# Para notion-valuation (ya configuradas)
PICA_SECRET_KEY_val=tu-clave-secreta
PICA_NOTION_CONNECTION_KEY_val=tu-clave-de-conexion

# Para notion-contacts (ya configuradas)
PICA_SECRET_KEY_contact=tu-clave-secreta
PICA_NOTION_CONNECTION_KEY_contact=tu-clave-de-conexion
```

**NOTA:** Si usas la misma conexión de Pica para todas las bases de datos, puedes duplicar las mismas claves.

## Edge Functions Disponibles

| Nombre | Ruta DEV | Ruta PROD | Estado |
|--------|----------|-----------|---------|
| notion-properties | /api/properties | /functions/v1/notion-properties | ✅ |
| notion-blog | /api/blog | /functions/v1/notion-blog | ✅ |
| notion-valuation | /api/valuation-leads | /functions/v1/notion-valuation | ✅ |
| notion-contacts | /api/contacts | /functions/v1/notion-contacts | ✅ |

## Archivos Modificados

### 1. `src/lib/edgeClient.ts`
- Helper central para todas las llamadas a Edge Functions
- Detección automática DEV/PROD
- Validación de variables de entorno
- Logs de diagnóstico en DEV

### 2. `src/components/EdgeDiagnostics.tsx` (NUEVO)
- Panel flotante solo visible en DEV
- Prueba automática de todas las Edge Functions
- Muestra estado, tiempos de respuesta y errores
- Botón en esquina inferior derecha: "🔍 Edge Diagnostics"

### 3. Servicios actualizados
- `src/services/propertyService.ts` - Ya usa edgeClient ✅
- `src/services/blogService.ts` - Ya usa edgeClient ✅
- `src/services/valuationService.ts` - Ya usa edgeClient ✅
- `src/services/contactService.ts` - Ya usa edgeClient ✅

## Verificación de Funcionamiento

### En Desarrollo (Local)
1. Ejecuta `npm run dev`
2. Abre el navegador y ve a cualquier página
3. Busca el botón "🔍 Edge Diagnostics" en la esquina inferior derecha
4. Haz clic para ver el estado de todas las funciones
5. Verifica que todas muestren ✅ (verde)
6. Abre la consola del navegador y verifica logs como:
   ```
   [DEV] EdgeClient → /api/properties
   [DEV] EdgeClient ← Status 200
   ```

### En Producción (Dominio Real / Móvil)
1. Abre el sitio en tu móvil o en el dominio de producción
2. Ve a `/propiedades` - Debe cargar las tarjetas de propiedades
3. Ve a `/blog` - Debe cargar los artículos
4. Envía un formulario de contacto - Debe guardarse en Notion
5. Completa una valoración - Debe guardarse en Notion

**NOTA:** El botón de diagnóstico NO aparece en producción (solo en DEV).

## Troubleshooting

### Error: "Missing Supabase environment variables"
**Causa:** Las variables `VITE_SUPABASE_URL` o `VITE_SUPABASE_ANON_KEY` no están configuradas.
**Solución:** Configúralas en tu plataforma de deployment y redeploy.

### Error: "load failed" en /propiedades o /blog
**Causa:** Variables VITE_ no configuradas en el frontend.
**Solución:**
1. Verifica que las variables estén en Settings → Environment Variables de tu plataforma
2. Asegúrate de que tienen el prefijo `VITE_`
3. Redeploy después de añadirlas

### Error en Edge Function: "Missing Pica env vars"
**Causa:** Los secrets de Pica no están configurados en Supabase.
**Solución:** Ve a Supabase Dashboard → Settings → Edge Functions → Secrets y añádelos.

### Funciona en DEV pero no en PROD
**Causa:** Problema con las variables de entorno del frontend.
**Solución:**
1. Abre la consola del navegador en PROD
2. Escribe: `console.log(import.meta.env.VITE_SUPABASE_URL)`
3. Si muestra `undefined`, las variables no están configuradas correctamente
4. Configúralas en tu plataforma de deployment

## Testing Checklist

Antes de considerar el deployment como exitoso, verifica:

- [ ] DEV: Panel de diagnóstico muestra todas las funciones en verde
- [ ] DEV: Logs en consola muestran rutas `/api/*`
- [ ] PROD: Página de propiedades carga correctamente
- [ ] PROD: Página de blog carga artículos
- [ ] PROD: Formulario de contacto se envía y crea registro en Notion
- [ ] PROD: Formulario de valoración se envía y crea registro en Notion
- [ ] PROD: Formulario de contacto desde una propiedad incluye referencia
- [ ] MÓVIL: Todo lo anterior funciona en Safari y Chrome móvil

## Soporte

Si después de seguir esta guía sigues teniendo problemas:

1. Activa el modo de desarrollo temporalmente para ver el panel de diagnóstico
2. Toma capturas del panel de diagnóstico
3. Copia los logs de la consola del navegador
4. Verifica en Supabase Dashboard → Edge Functions → Logs si hay errores
