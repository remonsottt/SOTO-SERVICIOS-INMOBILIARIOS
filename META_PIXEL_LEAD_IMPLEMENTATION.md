# Implementación del Evento Lead de Meta Pixel

## Resumen

Se ha implementado correctamente el evento estándar **Lead** de Facebook Pixel (ID: 1659734765113421) siguiendo las recomendaciones de Meta AI.

## Cambios Realizados

### 1. Servicio de Analytics (`src/lib/analytics.ts`)

Se añadió un nuevo método `trackLead()` que:
- Envía el evento estándar `Lead` a Facebook Pixel usando `fbq('track', 'Lead')`
- Incluye datos contextuales como tipo de lead, categoría y parámetros UTM
- También registra el evento en el sistema de analytics interno (GTM)

```typescript
trackLead(leadType: 'contact' | 'valuation', additionalData?: Record<string, unknown>): void {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Lead', {
      content_name: leadType === 'contact' ? 'Formulario de Contacto' : 'Formulario de Valoración',
      content_category: leadType,
      ...additionalData,
      ...this.utmParams,
    });
  }

  this.track('lead_generated', {
    lead_type: leadType,
    ...additionalData,
  });
}
```

### 2. Formulario de Contacto (`src/components/Contact.tsx`)

**ANTES:** No se enviaba ningún evento Lead a Facebook
**DESPUÉS:** Se dispara el evento Lead SOLO cuando el formulario se envía exitosamente

```typescript
if (result.success) {
  analytics.trackLead('contact', {
    subject: formData.subject,
  });
  // ... resto del código
}
```

### 3. Widget de Valoración (`src/components/ValuationWidget.tsx`)

**ANTES:**
- El evento se disparaba en el intento de envío (línea 366)
- No se verificaba si el guardado en Notion fue exitoso

**DESPUÉS:**
- Se eliminó el tracking prematuro
- Se dispara el evento Lead SOLO cuando `saveResult.success === true`
- Se incluyen datos relevantes de la propiedad para mejor segmentación

```typescript
if (!saveResult.success) {
  console.error('Failed to save lead:', saveResult.error);
} else {
  analytics.trackLead('valuation', {
    property_type: formData.propertyType,
    operation: formData.operation,
    locality: formData.locality,
    neighborhood: formData.neighborhood,
    estimated_value: valuationResult.estimatedValue,
    built_sqm: formData.squareMetersConstructed,
    bedrooms: formData.bedrooms,
  });
}
```

## Beneficios de la Implementación

### 1. Optimización de Campañas
- Facebook puede optimizar las campañas publicitarias basándose en conversiones reales
- Mejor ROI en Facebook Ads al enfocarse en usuarios que realmente convierten

### 2. Datos Precisos
- Solo se registran leads que fueron guardados exitosamente en Notion
- No se contabilizan intentos fallidos, spam o errores como conversiones
- Parámetros UTM incluidos automáticamente para tracking de origen

### 3. Audiencias y Retargeting
- Capacidad de crear audiencias similares (Lookalike) basadas en leads reales
- Retargeting más efectivo con usuarios que completaron el proceso
- Mejor segmentación en Facebook Events Manager

### 4. Información Adicional
Cada evento Lead incluye:
- **Formulario de Contacto:**
  - Tipo de consulta (subject)
  - Parámetros UTM de origen

- **Formulario de Valoración:**
  - Tipo de propiedad
  - Operación (venta/alquiler)
  - Localización y barrio
  - Valor estimado
  - Características (m², dormitorios)
  - Parámetros UTM de origen

## Verificación

### Herramientas para Verificar
1. **Meta Pixel Helper** (extensión de Chrome)
   - Verifica que el evento Lead se dispare correctamente
   - Muestra los parámetros enviados

2. **Facebook Events Manager**
   - Dashboard → Events Manager
   - Verifica que los eventos lleguen en tiempo real
   - Revisa los datos de cada lead

3. **Consola del Navegador**
   - Busca logs `[Analytics]` con el evento `lead_generated`
   - Verifica que se llame a `fbq('track', 'Lead')`

### Flujo de Verificación

**Formulario de Contacto:**
1. Rellena el formulario
2. Envía el formulario
3. Si el envío es exitoso → se dispara `fbq('track', 'Lead')`
4. Si falla → NO se dispara ningún evento Lead

**Widget de Valoración:**
1. Completa todos los pasos
2. Envía el formulario final
3. Si se guarda en Notion → se dispara `fbq('track', 'Lead')`
4. Si falla el guardado → NO se dispara ningún evento Lead

## Configuración Actual del Pixel

El código base del pixel ya estaba correctamente instalado en `index.html`:

```html
<!-- Meta Pixel Code -->
<script>
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', '1659734765113421');
  fbq('track', 'PageView');
</script>
```

## Próximos Pasos Recomendados

1. **Probar en producción** y verificar en Facebook Events Manager
2. **Crear conversiones personalizadas** en Facebook Ads basadas en el evento Lead
3. **Configurar campañas de optimización** para conversiones Lead
4. **Crear audiencias similares** cuando tengas suficientes leads (mínimo 100)
5. **Monitorear el valor de los leads** para calcular el ROAS real

## Notas Técnicas

- El evento Lead se dispara de forma asíncrona y no bloquea la navegación
- Se incluyen verificaciones de `typeof window !== 'undefined'` para SSR compatibility
- Los parámetros UTM se capturan automáticamente y persisten en sessionStorage
- El sistema mantiene compatibilidad con Google Tag Manager (GTM)
