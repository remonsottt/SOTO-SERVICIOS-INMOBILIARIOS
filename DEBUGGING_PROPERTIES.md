# Guía de Diagnóstico - Propiedades No Aparecen

## Problema
Las propiedades no aparecen en el sitio web a pesar de tener 3 propiedades con estado "Publicada" en Notion.

## Solución Paso a Paso

### 1. Verificar Variables de Entorno en Supabase

**CRÍTICO**: Las variables de entorno de Pica deben estar configuradas en Supabase, no en el archivo `.env` local.

1. Ve a tu Dashboard de Supabase: https://supabase.com/dashboard
2. Selecciona tu proyecto
3. Navega a: **Edge Functions** → **Settings** → **Secrets**
4. Verifica que estas variables estén configuradas:
   - `PICA_SECRET_KEY`
   - `PICA_NOTION_CONNECTION_KEY`

Si NO están configuradas, agrégalas ahora con tus credenciales de Pica.

### 2. Ver Logs en la Consola del Navegador

He agregado logging detallado para diagnosticar el problema:

1. Abre tu sitio web en el navegador
2. Presiona **F12** (o clic derecho → Inspeccionar)
3. Ve a la pestaña **Console**
4. Recarga la página (F5)
5. Busca estos mensajes:

```
Fetching properties from: https://...
Response status: 200
Raw data from Notion: {...}
Number of properties returned: X
Transformed properties: [...]
```

### 3. Interpretar los Mensajes

#### ✅ Caso Exitoso
```
Fetching properties from: https://zbqmtwfdzuemmleysgmf.supabase.co/functions/v1/notion-properties
Response status: 200
Number of properties returned: 3
Transformed properties: [{...}, {...}, {...}]
```
**Acción**: Si ves esto pero no aparecen propiedades, el problema está en el frontend. Revisa que las propiedades tengan imágenes válidas.

#### ❌ Error 500 - Variables no configuradas
```
Response status: 500
Error response: {"error":"Failed to fetch properties","message":"Failed to fetch database: ..."}
```
**Acción**: Las variables de entorno de Pica NO están configuradas en Supabase. Ve al paso 1.

#### ❌ Error 404
```
Response status: 404
```
**Acción**: El edge function no está desplegado correctamente. Corre:
```bash
# (Ya lo desplegué, pero si aparece este error, avísame)
```

#### ❌ CORS Error
```
Access to fetch at '...' from origin '...' has been blocked by CORS policy
```
**Acción**: El edge function tiene problemas de CORS (ya está configurado correctamente, pero si aparece, avísame).

#### ⚠️ 0 Propiedades Devueltas
```
Response status: 200
Number of properties returned: 0
```
**Acción**: El edge function funciona pero no encuentra propiedades publicadas. Verifica en Notion:
- Las propiedades tienen la columna "Estado" = "Publicada" (exactamente así, con mayúscula)
- O tienen la columna "Publicado" = checkbox marcado

### 4. Verificar Estructura de Notion

Las columnas EXACTAS que necesitas en tu base de datos de Notion:

**Columnas Obligatorias:**
- **Título** (tipo: Text) - El nombre de la propiedad
- **Slug** (tipo: Text) - URL amigable (ej: "piso-ruzafa")
- **Estado** (tipo: Select) - Debe tener la opción "Publicada"
  O alternativamente:
- **Publicado** (tipo: Checkbox) - Marcado para publicar

**Verifica que:**
1. Tus 3 propiedades tienen exactamente `Estado = "Publicada"` (con mayúscula P)
2. Si usas checkbox, debe llamarse exactamente "Publicado" y estar marcado
3. Las propiedades tienen al menos un Título

### 5. Probar el Edge Function Directamente

Puedes probar el edge function directamente desde el navegador o Postman:

```
GET https://zbqmtwfdzuemmleysgmf.supabase.co/functions/v1/notion-properties
```

Deberías recibir:
```json
{
  "properties": [
    {
      "id": "...",
      "title": "...",
      "slug": "...",
      ...
    }
  ]
}
```

### 6. Errores Comunes

#### Error: "Título vacío"
**Síntoma**: Las propiedades no aparecen
**Causa**: La columna de título en Notion tiene un nombre diferente
**Solución**: El edge function busca estas columnas en orden:
1. "Título"
2. "Title"
3. "Name"

Asegúrate de que al menos una exista y tenga valor.

#### Error: "Slug vacío"
**Síntoma**: Propiedades aparecen pero no se puede acceder a la página de detalle
**Causa**: No hay columna "Slug" en Notion
**Solución**: El sistema genera slugs automáticamente del título, pero es mejor agregar la columna "Slug" manualmente.

#### Error: "Sin imágenes"
**Síntoma**: Tarjetas vacías sin imagen
**Causa**: Las propiedades no tienen imágenes en las columnas "Imagen portada" o "Galería"
**Solución**: Agrega imágenes a tus propiedades en Notion.

## Próximos Pasos

Después de seguir estos pasos, **copia los mensajes de la consola** y envíamelos para poder ayudarte mejor.

### Mensajes que necesito ver:

1. El mensaje completo de "Fetching properties from:"
2. El "Response status:"
3. El "Number of properties returned:"
4. Cualquier error en rojo

## Notas Técnicas

- **Caché**: Las propiedades se cachean durante 5 minutos. Si haces cambios en Notion, espera 5 minutos o recarga con Ctrl+Shift+R
- **Database ID**: Estoy usando el ID `2cd4fdc2d1b680e18502f3d427883216` - verifica que sea correcto
- **JWT**: El edge function ahora NO requiere autenticación JWT (es público)
