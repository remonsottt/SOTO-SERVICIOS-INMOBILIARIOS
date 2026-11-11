# Integración de Propiedades con Notion vía Pica

## Resumen

Se ha implementado la integración completa de propiedades desde Notion usando la API de Pica. Las propiedades ahora se cargan dinámicamente desde tu base de datos de Notion en lugar de usar datos estáticos.

## Componentes Implementados

### 1. Edge Function: `notion-properties`

**Ubicación**: `supabase/functions/notion-properties/index.ts`

Esta función serverless:
- Se conecta a la API de Pica para obtener la base de datos de Notion
- Obtiene todos los elementos (páginas) de la base de datos
- Normaliza los datos de Notion al formato esperado por la aplicación
- Filtra solo las propiedades publicadas
- Devuelve las propiedades ordenadas por fecha de última edición

**ID de Base de Datos**: `2cd4fdc2d1b680e18502f3d427883216`

### 2. Servicio de Propiedades

**Ubicación**: `src/services/propertyService.ts`

Funciones disponibles:
- `getAllProperties()` - Obtiene todas las propiedades publicadas
- `getFeaturedProperties()` - Obtiene propiedades destacadas (máximo 6)
- `getPropertyBySlug(slug)` - Obtiene una propiedad por su slug
- `filterPropertiesByNeighborhood(neighborhood)` - Filtra por barrio
- `clearCache()` - Limpia la caché de propiedades

**Caché**: Las propiedades se almacenan en caché durante 5 minutos para optimizar el rendimiento.

### 3. Componentes Actualizados

#### Properties.tsx
- Carga propiedades dinámicamente desde Notion
- Muestra indicador de carga mientras obtiene datos
- Manejo de errores con opción de reintentar
- Mensaje cuando no hay propiedades disponibles

#### PropertyDetailPage.tsx
- Carga propiedad específica por slug
- Indicador de carga durante la búsqueda
- Página de error 404 cuando la propiedad no existe

## Mapeo de Columnas de Notion

Las siguientes columnas de Notion son mapeadas a la aplicación:

| Columna Notion | Tipo | Uso |
|----------------|------|-----|
| Título | Text | Título principal de la propiedad |
| Slug | Text | URL amigable (/propiedades/[slug]) |
| Estado | Select | Filtra solo "Publicada" |
| Publicado | Checkbox | Alternativa a Estado (true = publicado) |
| Destacado | Checkbox | Propiedades destacadas en Home |
| Barrio | Select | Ubicación - barrio |
| Ciudad | Text | Ubicación - ciudad (default: Valencia) |
| Provincia | Text | Ubicación - provincia (default: Valencia) |
| Precio | Number | Precio de la propiedad |
| Moneda | Select | Moneda del precio (default: EUR) |
| Superficie m² | Number | Metros cuadrados construidos |
| Habitaciones | Number | Número de habitaciones |
| Baños | Number | Número de baños |
| Planta | Number | Número de planta (opcional) |
| Ascensor | Checkbox | Si tiene ascensor |
| Año de construcción | Number | Año de construcción (opcional) |
| Estado del inmueble | Select | Condición (Nuevo, Reformado, etc.) |
| Resumen corto | Text | Descripción breve para cards |
| Descripción | Long text | Descripción completa para página de detalle |
| Características | Multi-select | Lista de características |
| Certificado energético | Select | Certificación energética (A-G) |
| Imagen portada | Files | Imagen principal de la propiedad |
| Galería | Files | Todas las imágenes de la propiedad |
| Plano | Files | Plano de la propiedad (opcional) |

## Variables de Entorno Requeridas

### Variables de Supabase (Ya configuradas)
```env
VITE_SUPABASE_URL=https://zbqmtwfdzuemmleysgmf.supabase.co
VITE_SUPABASE_ANON_KEY=REDACTED
```

### Variables de Pica (Configurar en Supabase Edge Functions)

Las siguientes variables deben estar configuradas en tu proyecto de Supabase para que el Edge Function funcione:

```bash
PICA_SECRET_KEY=tu_pica_secret_key
PICA_NOTION_CONNECTION_KEY=tu_pica_notion_connection_key
```

**IMPORTANTE**: Estas variables NO se configuran en el archivo `.env` local, sino en Supabase:

1. Ve a tu proyecto en Supabase Dashboard
2. Navega a Edge Functions → Settings
3. Agrega las variables de entorno en la sección de "Secrets"

## Reglas de Filtrado

### Propiedades Publicadas
Solo se muestran propiedades donde:
- `Estado = "Publicada"` O `Publicado = true`

### Propiedades Destacadas (Home)
- Deben estar publicadas Y `Destacado = true`
- Máximo 6 propiedades destacadas

### Ordenamiento
- Por defecto: Fecha de última edición (más recientes primero)

## Rutas Implementadas

- `/` - Home con propiedades destacadas
- `/propiedades` - Listado completo de propiedades
- `/propiedades/[slug]` - Página de detalle de propiedad individual

## Características Implementadas

✅ Carga dinámica desde Notion
✅ Caché de 5 minutos para optimizar rendimiento
✅ Indicadores de carga en todos los componentes
✅ Manejo de errores con opción de reintentar
✅ Página 404 para propiedades no encontradas
✅ Galería de imágenes con slider
✅ Formulario de contacto (fase 1: sin integración)
✅ SEO optimizado por propiedad
✅ Diseño responsive
✅ Mantenimiento de estética actual

## Próximos Pasos

### Fase 2: Integración de Leads
Implementar `submitLeadToNotion(payload)` para guardar consultas de propiedades en Notion.

### Fase 3: Filtros Avanzados
Agregar filtros funcionales en la página de propiedades:
- Por barrio
- Por tipo de propiedad
- Por rango de precio
- Por número de habitaciones

## Notas Técnicas

- Los datos de Notion se obtienen a través del Edge Function para mantener las credenciales seguras
- Las imágenes se sirven directamente desde Notion/Pica (sin descarga)
- El componente maneja automáticamente propiedades sin imágenes
- El slug se genera automáticamente si no existe en Notion (a partir del título)
- Las propiedades eliminadas o despublicadas en Notion desaparecen automáticamente del sitio

## Solución de Problemas

### "No se pudieron cargar las propiedades"
1. Verifica que el Edge Function esté desplegado
2. Confirma que las variables de entorno de Pica estén configuradas
3. Revisa los logs del Edge Function en Supabase Dashboard

### Propiedades no aparecen
1. Verifica que tengan `Estado = "Publicada"` o `Publicado = true`
2. Confirma que tengan un título y slug válidos
3. Revisa la consola del navegador para errores

### Imágenes no cargan
1. Verifica que las URLs de Pica/Notion sean accesibles
2. Confirma que las propiedades tengan imágenes en la columna correspondiente
3. Las propiedades sin imágenes mostrarán un espacio vacío (considera agregar placeholder)
