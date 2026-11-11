# Notion Database Schema for Valuation Widget

## Database ID Configured ✅
**Database ID:** `2a04fdc2d1b681fe98d7e954c87a5b94`
**Integration Token:** Configured in `.env`

---

## Required Database Properties

Your Notion database must have these **30 properties** with exact names and types:

### 1. Lead Information

| Property Name | Type | Description |
|---------------|------|-------------|
| **Fecha de solicitud** | Date | Request timestamp (auto-filled) |
| **Estado del lead** | Select | Options: NEW, PENDING_API, OK |
| **Fuente del lead** | Text | Always: "Widget de valoración" |
| **Observaciones** | Text | Notes about valuation source |

### 2. Property Address

| Property Name | Type | Description |
|---------------|------|-------------|
| **Calle** | Title | Street name (PRIMARY) |
| **Número** | Text | Building number |
| **Código postal** | Text | Postal code (5 digits) |
| **Localidad** | Text | City/locality |
| **Provincia** | Text | Province |

### 3. Property Type & Operation

| Property Name | Type | Description |
|---------------|------|-------------|
| **Tipo de inmueble** | Select | Options: Piso, Casa/Chalet, Dúplex, Estudio, Terreno, Local Comercial, Oficina, Garaje/Trastero, Otro |
| **Operación** | Select | Options: Venta, Alquiler |
| **Antigüedad** | Select | Options: Obra nueva, Segunda mano |

### 4. Property Specifications

| Property Name | Type | Description |
|---------------|------|-------------|
| **Superficie construida (m²)** | Number | Built area |
| **Superficie útil (m²)** | Number | Usable area (optional) |
| **Dormitorios** | Number | Bedroom count |
| **Baños** | Number | Bathroom count |
| **Planta** | Text | Floor number |
| **Año de construcción** | Number | Build year |

### 5. Property Features

| Property Name | Type | Description |
|---------------|------|-------------|
| **Ascensor** | Select | Options: Sí, No |
| **Plaza de garaje** | Select | Options: Sí, No |
| **Terraza o balcón** | Select | Options: Sí, No |
| **Estado de conservación** | Select | Options: Excelente, Bueno, A reformar |
| **Extras** | Multi-select | Tags like: A/A, Calefacción, Ventanas Climalit, Armarios empotrados, Piscina, Jardín, Patio |

### 6. Owner Contact

| Property Name | Type | Description |
|---------------|------|-------------|
| **Nombre del propietario** | Text | Owner name |
| **Email** | Email | Owner email |
| **Teléfono** | Phone Number | Owner phone |
| **Plazo de venta** | Select | Options: Inmediatamente, 1–3 meses, 3–6 meses, 6–12 meses, >12 meses |

### 7. Valuation Results

| Property Name | Type | Description |
|---------------|------|-------------|
| **Valor estimado (€)** | Number | Average valuation |
| **Rango estimado mínimo (€)** | Number | Minimum estimate |
| **Rango estimado máximo (€)** | Number | Maximum estimate |

---

## Step-by-Step Setup Instructions

### Step 1: Create Properties in Your Notion Database

1. Open your database: https://www.notion.so/2a04fdc2d1b681fe98d7e954c87a5b94
2. Click on any column header → Click "+" to add new property
3. Create each property with **exact name** and correct type
4. For Select properties, add the options listed above
5. For Multi-select (Extras), add common features

### Step 2: Set Property as Title

1. Find the "Calle" property
2. Click on it → "Edit property"
3. Change type to "Title" (if not already)

### Step 3: Verify Integration Connection

1. Click on "..." menu (top right of database)
2. Select "Connections"
3. Ensure your integration is connected
4. If not, click "Add connection" and select your integration

---

## Quick Create Script

Copy this to your Notion database as columns:

```
TITLE FIELD:
- Calle (Title)

DATE FIELDS:
- Fecha de solicitud (Date)

TEXT FIELDS:
- Número (Text)
- Código postal (Text)
- Localidad (Text)
- Provincia (Text)
- Planta (Text)
- Nombre del propietario (Text)
- Fuente del lead (Text)
- Observaciones (Text)

EMAIL:
- Email (Email)

PHONE:
- Teléfono (Phone)

NUMBER FIELDS:
- Superficie construida (m²) (Number)
- Superficie útil (m²) (Number)
- Dormitorios (Number)
- Baños (Number)
- Año de construcción (Number)
- Valor estimado (€) (Number)
- Rango estimado mínimo (€) (Number)
- Rango estimado máximo (€) (Number)

SELECT FIELDS (with options):
- Tipo de inmueble: Piso, Casa/Chalet, Dúplex, Estudio, Terreno, Local Comercial, Oficina, Garaje/Trastero, Otro
- Operación: Venta, Alquiler
- Antigüedad: Obra nueva, Segunda mano
- Ascensor: Sí, No
- Plaza de garaje: Sí, No
- Terraza o balcón: Sí, No
- Estado de conservación: Excelente, Bueno, A reformar
- Plazo de venta: Inmediatamente, 1–3 meses, 3–6 meses, 6–12 meses, >12 meses
- Estado del lead: NEW, PENDING_API, OK

MULTI-SELECT:
- Extras: A/A, Calefacción, Ventanas Climalit, Armarios empotrados, Piscina, Jardín, Patio
```

---

## Testing Your Setup

### 1. Verify Configuration

Run dev server and check the widget:
```bash
npm run dev
```

Visit: http://localhost:5173/valuation

Look for the configuration badge (dev mode only):
- ✅ "Notion configurado" = Setup correct
- ⚠️ "Notion no configurado" = Check credentials

### 2. Submit Test Lead

1. Click "📝 Rellenar ejemplo" to fill demo data
2. Click through all 5 steps
3. Submit the form
4. Check your Notion database for new entry

### 3. Verify Data in Notion

Expected new row in your database:
- **Calle**: Av. de Burjassot
- **Número**: 29
- **Código postal**: 46009
- **Nombre del propietario**: Demo Usuario
- **Email**: demo@example.com
- **Valor estimado (€)**: ~245000 (varies slightly)
- **Estado del lead**: PENDING_API (mock data)

---

## Troubleshooting

### "Notion not configured" in dev mode

**Check:**
- `.env` file exists with correct variables
- Token starts with `ntn_`
- Database ID is exactly 32 characters
- Dev server was restarted after adding env vars

**Solution:**
```bash
# Stop dev server (Ctrl+C)
# Verify .env content
cat .env

# Restart dev server
npm run dev
```

### Form submits but no data in Notion

**Check browser console for errors:**

1. **401 Unauthorized**
   - Token is invalid or expired
   - Generate new token at: https://www.notion.so/my-integrations

2. **404 Not Found**
   - Database ID is incorrect
   - Check URL format: `https://notion.so/{DATABASE_ID}?v=...`

3. **400 Bad Request - Property not found**
   - Property names don't match exactly (case-sensitive!)
   - Check all 30 properties are created with exact names
   - Spanish characters must match exactly (é, ñ, etc.)

4. **400 Bad Request - Invalid property type**
   - Property type doesn't match (e.g., Text instead of Select)
   - Select options not created
   - Recreate property with correct type

### Integration not showing in Connections

**Solution:**
1. Go to: https://www.notion.so/my-integrations
2. Click your integration
3. Under "Capabilities", ensure:
   - ✅ Read content
   - ✅ Update content
   - ✅ Insert content
4. Save changes
5. Reconnect to database

---

## Example Lead Entry

When you submit the demo data, this is what should appear in Notion:

```
Calle: Av. de Burjassot
Número: 29
Código postal: 46009
Localidad: València
Provincia: València

Tipo de inmueble: Piso
Operación: Venta
Antigüedad: Segunda mano

Superficie construida (m²): 98
Superficie útil (m²): 88
Dormitorios: 3
Baños: 2
Planta: 4
Año de construcción: 1995

Ascensor: Sí
Plaza de garaje: Sí
Terraza o balcón: Sí
Estado de conservación: Bueno
Extras: Calefacción, A/A

Nombre del propietario: Demo Usuario
Email: demo@example.com
Teléfono: +34 612 345 678
Plazo de venta: 1–3 meses

Valor estimado (€): 367500 (approximately)
Rango estimado mínimo (€): 315000
Rango estimado máximo (€): 420000

Estado del lead: PENDING_API
Fuente del lead: Widget de valoración
Observaciones: Valoración estimada (API no disponible)
Fecha de solicitud: 2024-11-03 (today)
```

---

## Production Deployment

Before deploying to production:

1. ✅ Verify all 30 properties created
2. ✅ Test with demo data
3. ✅ Set environment variables in production:
   ```
   VITE_NOTION_INTEGRATION_TOKEN=ntn_...
   VITE_NOTION_DATABASE_ID=2a04fdc2d1b681fe98d7e954c87a5b94
   ```
4. ✅ Test on production with real submission
5. ✅ Set up Notion notifications (optional)
6. ✅ Create views/filters for team

---

## Optional Enhancements

### Email Notifications

In your Notion database:
1. Click "..." → "Automations"
2. Create automation: "When page added"
3. Action: "Send email to..." (your team)
4. Template: Include lead details

### Database Views

Create helpful views:
- **New Leads**: Filter by "Estado del lead" = NEW
- **Pending**: Filter by "Estado del lead" = PENDING_API
- **This Week**: Filter by "Fecha de solicitud" = This week
- **By Timeline**: Group by "Plazo de venta"
- **By Type**: Group by "Tipo de inmueble"

---

## Support

If you continue having issues:

1. Check browser console (F12 → Console tab)
2. Look for red error messages
3. Copy full error message
4. Review property names (must match exactly)
5. Verify integration permissions

Common error codes:
- **401**: Token issue → Regenerate token
- **404**: Database ID issue → Check URL
- **400**: Property mismatch → Check names/types

---

**Your configuration is now complete!** 🎉

Visit `/valuation`, submit the demo data, and check your Notion database.
