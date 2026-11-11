# Valuation Widget Setup Guide

## Overview

The property valuation widget is a complete multi-step form system that:
- Collects property details across 4 steps
- Fetches valuations from Idealista API (with mock fallback)
- Stores leads in Notion database
- Displays instant results on completion
- Includes anti-spam protection (honeypot + rate limiting)

## Installation & Integration

### Location
The widget is mounted in `/valuation` route at `<section id="valuation-widget">` within the ValuationPage component.

### Files Changed
- `src/pages/ValuationPage.tsx` - Replaced old form with ValuationWidget component
- `src/components/ValuationWidget.tsx` - Main widget orchestrator
- `src/components/ValuationSteps/Step1Address.tsx` - Address collection
- `src/components/ValuationSteps/Step2Type.tsx` - Property type selection
- `src/components/ValuationSteps/Step3Details.tsx` - Property details
- `src/components/ValuationSteps/Step4Contact.tsx` - Owner contact info
- `src/components/ValuationSteps/Step5Result.tsx` - Valuation results display
- `src/lib/idealistaService.ts` - Idealista API integration
- `src/lib/notionService.ts` - Notion database lead storage
- `src/lib/antispamService.ts` - Honeypot + rate limiting

## Configuration

### Environment Variables

Add these to your `.env` file:

```env
# Idealista API (optional - falls back to mock if not configured)
VITE_IDEALISTA_API_BASE=https://api.idealista.com
VITE_IDEALISTA_API_KEY=your_idealista_api_key_here

# Notion Integration (required for lead storage)
VITE_NOTION_INTEGRATION_TOKEN=your_notion_bot_token
VITE_NOTION_DATABASE_ID=your_notion_database_id
```

### 1. Idealista API Setup (Optional)

#### Without Configuration
- Widget uses **mock data** for valuations
- Returns realistic ranges based on property type and features
- Lead is saved to Notion with `valuationStatus = 'PENDING_API'`
- Message shown: "No hemos podido obtener la valoración automática en este momento. Te la enviaremos en menos de 24h."

#### With Configuration
To use real Idealista valuations:

1. **Create Idealista Account**
   - Visit https://api.idealista.com
   - Sign up for developer access
   - Get your API credentials

2. **Set Environment Variables**
   ```env
   VITE_IDEALISTA_API_BASE=https://api.idealista.com/v1
   VITE_IDEALISTA_API_KEY=your_key_here
   ```

3. **API Request Format**
   - Base URL: `{IDEALISTA_API_BASE}/valuations`
   - Method: POST
   - Headers: `Authorization: Bearer {IDEALISTA_API_KEY}`
   - Content-Type: `application/json`

### 2. Notion Setup (Required)

#### Step 1: Create Notion Database

Create a new database with these properties:

| Property Name | Type | Description |
|---|---|---|
| Calle | Title | Street name |
| Número | Text | Building number |
| Código postal | Text | Postal code |
| Localidad | Text | City/locality |
| Provincia | Text | Province |
| Tipo de inmueble | Select | Property type |
| Operación | Select | Sale/Rental |
| Antigüedad | Select | New/Second-hand |
| Superficie construida (m²) | Number | Built area |
| Superficie útil (m²) | Number | Usable area |
| Dormitorios | Number | Bedroom count |
| Baños | Number | Bathroom count |
| Planta | Text | Floor number |
| Ascensor | Select | Yes/No |
| Plaza de garaje | Select | Yes/No |
| Terraza o balcón | Select | Yes/No |
| Año de construcción | Number | Build year |
| Estado de conservación | Select | Excellent/Good/Poor |
| Extras | Multi-select | Features (A/C, Heating, etc.) |
| Nombre del propietario | Text | Owner name |
| Email | Email | Owner email |
| Teléfono | Phone Number | Owner phone |
| Plazo de venta | Select | Sale timeline |
| Valor estimado (€) | Number | Average estimate |
| Rango estimado mínimo (€) | Number | Min estimate |
| Rango estimado máximo (€) | Number | Max estimate |
| Estado del lead | Select | NEW/PENDING_API/OK |
| Fuente del lead | Text | Lead source |
| Observaciones | Text | Notes |
| Fecha de solicitud | Date | Request date |

#### Step 2: Create Notion Integration

1. Go to https://www.notion.so/my-integrations
2. Click "Create new integration"
3. Name: "Soto Valuations" (or similar)
4. Select capabilities: Read, Update, Insert
5. Copy the integration token

#### Step 3: Add Integration to Database

1. In your Notion database, click "...  more"
2. Select "Connections"
3. Find your integration and click "Connect"

#### Step 4: Get Database ID

Database URL format: `https://notion.so/...?v=...`
- Extract the ID between `/` and `?`
- Format: `123abc456def789...` (32 characters)

#### Step 5: Configure Environment

```env
VITE_NOTION_INTEGRATION_TOKEN=secret_abc123...
VITE_NOTION_DATABASE_ID=123abc456def789...
```

### 3. Verify Configuration (Development Only)

In development mode, a debug panel appears at the bottom of the form showing:
- ✅ Configuration status
- Button to fill demo data

## Feature Details

### Multi-Step Form

**Step 1: Address**
- Street (required, min 3 chars)
- Number (optional or checkbox "Sin número")
- Postal code (required, 5 digits)
- Locality (default: Valencia)
- Province (default: Valencia)

**Step 2: Property Type**
- Type (Piso, Casa/Chalet, Dúplex, etc.)
- Operation (Venta, Alquiler)
- Antiquity (Obra nueva, Segunda mano)

**Step 3: Details**
- Built area m² (required, > 0)
- Usable area m² (optional)
- Bedrooms (required)
- Bathrooms (required)
- Floor (optional)
- Year built (optional, 1800-current)
- Elevator (required, Yes/No)
- Garage (required, Yes/No)
- Terrace (required, Yes/No)
- Conservation state (required)
- Extras/features (tags, optional)

**Step 4: Contact**
- Name (required, min 3 chars)
- Email (required, valid format)
- Phone (required, Spanish format)
- Sale timeline (required)
- GDPR consent (required checkbox)

**Step 5: Results**
- Estimated value (range + average)
- Property summary
- Comparable properties (if available)
- CTA buttons:
  - "Quiero una valoración presencial" (scrolls to contact)
  - "Hablar por WhatsApp" (pre-filled message)
- "Valorar otro inmueble" button

### Anti-Spam Protection

1. **Honeypot Field**
   - Hidden field: `website_url`
   - If filled, silently passes through
   - No error shown to user

2. **Rate Limiting**
   - 3 submissions per 60 seconds per browser
   - Stored in localStorage
   - Shows friendly message if exceeded

### Valuation Logic

**Mock Valuation** (when API unavailable):
- Base ranges by property type
- Multipliers applied for:
  - Square meters (+0.5% per m² over 100)
  - Bedrooms (+8% per room over 2)
  - Bathrooms (+5% per bathroom over 1)
  - Elevator (+10%)
  - Garage (+15%)
  - Terrace (+12%)
  - State (Excellent: +15%, Poor: -15%)

Example:
```
Piso base: 210k - 280k
98 m², 3 bedrooms, 2 bathrooms, elevator, garage
Result: ~245k average
```

### Lead Storage Format

Notion request payload includes:

```json
{
  "parent": { "database_id": "..." },
  "properties": {
    "Calle": { "title": [{ "text": { "content": "street" } }] },
    "Email": { "email": "email@example.com" },
    "Teléfono": { "phone_number": "+34..." },
    // ... all other mapped fields
  }
}
```

Error handling:
- If Notion fails: Show "Hemos recibido tus datos; si algo falla, te contactamos igualmente."
- Lead still shows as submitted to user
- Error logged to console

## Testing

### Demo Data

In development mode, click "📝 Rellenar ejemplo" button to populate:
```
Address: Av. de Burjassot 29, 46009, Valencia
Type: Piso, Venta, Segunda mano
Details: 98 m², 3H 2B, Planta 4, Ascensor Sí, Garaje Sí
Owner: Demo Usuario, demo@example.com, +34 612 345 678
Timeline: 1–3 meses
```

### Manual Testing Checklist

- [ ] All 5 steps display correctly
- [ ] Validation errors show inline
- [ ] "Siguiente" button disabled until valid
- [ ] Back button works
- [ ] Mock valuation returns range
- [ ] Result screen displays
- [ ] WhatsApp link generates correctly
- [ ] Reset clears form
- [ ] Rate limiting blocks after 3 requests
- [ ] Notion saves successfully (if configured)

## Customization

### Modify Valuation Ranges

Edit `src/lib/idealistaService.ts`:

```typescript
const MOCK_VALUATION_DATA: Record<string, { min: number; max: number; avg: number }> = {
  piso: { min: 210000, max: 280000, avg: 245000 }, // Adjust these
  // ...
};
```

### Change Property Types

Edit property type options in `Step2Type.tsx`:

```typescript
const propertyTypes = [
  'Piso',
  'Casa/Chalet',
  // Add more types here
];
```

### Modify Step Labels or Copy

All strings are Spanish by default. To change:
- Edit `STEPS` array in `ValuationWidget.tsx`
- Update label text in each Step component
- Modify Notion property mappings

### Add Fields to a Step

1. Add field to `FormData` interface in `ValuationWidget.tsx`
2. Initialize in state
3. Add input to Step component
4. Add validation logic
5. Map to Notion property

## Performance

- Lazy loads services on demand
- Mock data: instant response (~10ms)
- Idealista API: typically 500-2000ms
- Notion save: 1-2 seconds
- LocalStorage for rate limiting: instant

## Security

✅ **GDPR Consent**
- Explicit opt-in checkbox required
- Text: "Acepto que Soto Servicios Inmobiliarios me contacte..."

✅ **Anti-Spam**
- Honeypot field (hidden)
- Rate limiting per browser
- No public API keys exposed (env vars only)

✅ **Data Privacy**
- No cookies set
- Phone numbers not logged except to Notion
- Email used only for Notion lead storage

⚠️ **Rate Limiting Bypass**
- Uses localStorage (can be cleared)
- For production: implement server-side rate limiting

## Troubleshooting

### Notion Not Saving

1. Check `VITE_NOTION_INTEGRATION_TOKEN` is set
2. Check `VITE_NOTION_DATABASE_ID` is correct (32 chars)
3. Verify integration has Read/Write/Insert permissions
4. Check browser console for API error response
5. Verify database property names match exactly

### Valuations Always Show as "Pending API"

1. Check if `VITE_IDEALISTA_API_BASE` and `VITE_IDEALISTA_API_KEY` are set
2. Verify API credentials are correct
3. Check Idealista API status/limits
4. Mock data will always be used if API fails

### Form Not Submitting

1. Check honeypot field is empty
2. Verify rate limit not exceeded (3 per minute)
3. Check all validations pass
4. Check browser console for JavaScript errors

### Rate Limit False Positives

1. Clear localStorage: `localStorage.removeItem('valuation_requests')`
2. Implement server-side rate limiting for production

## Migration Path

To move from mock → real data:

1. Set up Idealista account and get credentials
2. Add `VITE_IDEALISTA_API_*` env vars
3. Deploy
4. Update Notion lead status to check `valuationStatus` field

To move from localStorage → Supabase:

1. Create Supabase table mirroring Notion schema
2. Create API route that calls Supabase
3. Replace `notionService` with `supabaseService`
4. Data automatically syncs

## Support

For issues with:
- **Idealista API**: Contact https://api.idealista.com
- **Notion API**: See https://developers.notion.com
- **Widget logic**: Check console for error messages, review component logic

---

**Last Updated:** 2024-11-03
**Widget Version:** 1.0.0
