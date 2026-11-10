# Corrección de Producción - Completada

## Problema Original
Las Edge Functions funcionaban en el preview de Bolt (DEV) pero fallaban en producción (dominio real/móvil) porque:
- En DEV: Vite proxy redirige `/api/*` a Supabase
- En PROD: No existe proxy, las llamadas a `/api/*` fallan

## Solución Implementada

### 1. EdgeClient Mejorado
**Archivo:** `src/lib/edgeClient.ts`

Ahora detecta automáticamente el entorno:
- **DEV:** Usa `/api/*` (proxy de Vite)
- **PROD:** Usa URL completa de Supabase + headers de autenticación

```typescript
// DEV
/api/properties → Vite proxy → Supabase Edge Function

// PROD
https://zbqmtwfdzuemmleysgmf.supabase.co/functions/v1/notion-properties
  + Authorization: Bearer {ANON_KEY}
```

### 2. Panel de Diagnóstico (Solo DEV)
**Archivo:** `src/components/EdgeDiagnostics.tsx`

Botón flotante en esquina inferior derecha que:
- ✅ Prueba automáticamente las 4 Edge Functions
- ✅ Muestra estado, tiempos de respuesta y errores
- ✅ Solo visible en modo desarrollo
- ✅ Se autocarga al iniciar la app

### 3. Servicios Verificados
Todos los servicios YA usaban correctamente el `edgeClient`:
- ✅ `propertyService.ts` - Propiedades de Notion
- ✅ `blogService.ts` - Blog de Notion
- ✅ `valuationService.ts` - Leads de valoración
- ✅ `contactService.ts` - Leads de contacto

### 4. Documentación Creada
- **PRODUCTION_DEPLOYMENT_GUIDE.md** - Guía completa de deployment
- **.env.example actualizado** - Con comentarios claros sobre qué va dónde

## Lo Que Tienes Que Hacer

### CRÍTICO: Configurar Variables de Entorno en Producción

#### 1. En tu Plataforma de Deploy (Bolt/Netlify/Vercel)
Ve a Settings → Environment Variables y añade:

```bash
VITE_SUPABASE_URL=https://zbqmtwfdzuemmleysgmf.supabase.co
VITE_SUPABASE_ANON_KEY=REDACTED
```

**IMPORTANTE:** Estas variables YA están en tu `.env` local, pero también necesitas configurarlas en la plataforma de deployment para que estén disponibles en producción.

#### 2. Redeploy el Proyecto
Después de añadir las variables, haz un redeploy para que tomen efecto.

## Verificación

### En DEV (Preview Bolt)
1. Ejecuta `npm run dev`
2. Busca el botón verde "🔍 Edge Diagnostics" abajo a la derecha
3. Haz clic y verifica que las 4 funciones muestren ✅

### En PROD (Después de configurar variables y redeploy)
1. Abre el sitio en móvil o en el dominio real
2. Ve a `/propiedades` - Deben cargar las tarjetas
3. Ve a `/blog` - Deben cargar los artículos
4. Envía un contacto - Debe guardarse en Notion
5. Completa una valoración - Debe guardarse en Notion

## ¿Por Qué Ahora Funcionará?

Antes:
```
PROD → /api/properties (404 No existe en producción)
```

Ahora:
```
PROD → https://supabase.co/functions/v1/notion-properties
       + Authorization header
       ✅ Funciona
```

## Archivos Modificados

1. **src/lib/edgeClient.ts** - Lógica de detección de entorno mejorada
2. **src/components/EdgeDiagnostics.tsx** - Panel de diagnóstico (NUEVO)
3. **src/main.tsx** - Añadido EdgeDiagnostics
4. **.env.example** - Actualizado con instrucciones claras
5. **PRODUCTION_DEPLOYMENT_GUIDE.md** - Guía completa (NUEVO)

## Build Status
✅ Compilación exitosa sin errores
✅ TypeScript validado
✅ Listo para deploy

## Próximo Paso
1. Configura las variables `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` en tu plataforma de deployment
2. Redeploy el proyecto
3. Verifica que funcione en producción siguiendo la lista de verificación arriba
