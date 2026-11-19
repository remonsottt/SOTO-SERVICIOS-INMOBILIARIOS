import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  handleOptions,
  json,
  sanitizeEmail,
  sanitizeNumber,
  sanitizePhone,
  sanitizeString,
} from './_lib/http';
import {
  VALUATION_DB_ID,
  getNotionClient,
  hasNotionToken,
} from './_lib/notionClient';

type ValuationPayload = {
  name: string;
  phone: string;
  email?: string;
  address: string;
  neighborhood?: string;
  city?: string;
  property_type?: string;
  built_m2?: number;
  bedrooms?: number;
  bathrooms?: number;
  valuation_avg?: number;
  valuation_min?: number;
  valuation_max?: number;
  confidence?: string;
  trend_3m?: number;
  dom_days?: number;
  utm?: string;
  notes?: string;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleOptions(req, res)) return;

  if (req.method !== 'POST') {
    return json(res, 405, { success: false, error: 'Method not allowed' });
  }

  if (!hasNotionToken()) {
    console.warn('[api/valuation] NOTION_TOKEN missing — rejecting write (no fake success)');
    return json(res, 503, {
      success: false,
      stage: 'credentials',
      error: 'Formulario no conectado. Falta NOTION_TOKEN en el servidor.',
    });
  }

  try {
    const payload = (req.body || {}) as ValuationPayload;
    const name = sanitizeString(payload.name);
    const phone = sanitizePhone(payload.phone);
    const address = sanitizeString(payload.address);

    if (!name || !phone || !address) {
      return json(res, 400, {
        success: false,
        stage: 'validation',
        error: 'Faltan campos obligatorios: nombre, teléfono o dirección',
      });
    }

    const notion = getNotionClient();
    if (!notion) {
      return json(res, 500, { success: false, error: 'Notion client unavailable' });
    }

    const db = await notion.databases.retrieve({ database_id: VALUATION_DB_ID });
    const schema = (db as { properties: Record<string, { type: string }> }).properties;
    const titlePropName =
      Object.keys(schema).find((k) => schema[k]?.type === 'title') || 'Name';

    const pageProperties: Record<string, unknown> = {
      [titlePropName]: {
        title: [{ text: { content: `Valoración - ${address}` } }],
      },
    };

    const addIfExists = (key: string, value: unknown) => {
      if (schema[key]) pageProperties[key] = value;
    };

    addIfExists('Nombre', { rich_text: [{ text: { content: name } }] });
    addIfExists('Teléfono', { phone_number: phone });
    addIfExists('updated_at', {
      date: { start: new Date().toISOString().slice(0, 10) },
    });
    addIfExists('Dirección', { rich_text: [{ text: { content: address } }] });

    const email = sanitizeEmail(payload.email);
    if (email) addIfExists('Email', { email });

    const neighborhood = sanitizeString(payload.neighborhood);
    if (neighborhood) {
      addIfExists('Barrio', { rich_text: [{ text: { content: neighborhood } }] });
    }

    const city = sanitizeString(payload.city);
    if (city) {
      addIfExists('Municipio', { rich_text: [{ text: { content: city } }] });
    }

    const propertyType = sanitizeString(payload.property_type);
    if (propertyType) {
      addIfExists('Tipo inmueble', { select: { name: propertyType } });
    }

    const builtM2 = sanitizeNumber(payload.built_m2);
    if (builtM2 !== null) addIfExists('M² construidos', { number: builtM2 });

    const bedrooms = sanitizeNumber(payload.bedrooms);
    if (bedrooms !== null) addIfExists('Dormitorios', { number: bedrooms });

    const bathrooms = sanitizeNumber(payload.bathrooms);
    if (bathrooms !== null) addIfExists('Baños', { number: bathrooms });

    const valuationAvg = sanitizeNumber(payload.valuation_avg);
    if (valuationAvg !== null) addIfExists('Valoración media (€)', { number: valuationAvg });

    const valuationMin = sanitizeNumber(payload.valuation_min);
    if (valuationMin !== null) addIfExists('Rango min (€)', { number: valuationMin });

    const valuationMax = sanitizeNumber(payload.valuation_max);
    if (valuationMax !== null) addIfExists('Rango max (€)', { number: valuationMax });

    const confidence = sanitizeString(payload.confidence);
    if (confidence) addIfExists('Confianza', { select: { name: confidence } });

    const trend3m = sanitizeNumber(payload.trend_3m);
    if (trend3m !== null) addIfExists('Tendencia 3m (%)', { number: trend3m });

    const domDays = sanitizeNumber(payload.dom_days);
    if (domDays !== null) addIfExists('DOM (días)', { number: domDays });

    const utm = sanitizeString(payload.utm);
    if (utm) {
      addIfExists('UTM source / medium / campaign', {
        rich_text: [{ text: { content: utm } }],
      });
    }

    const notes = sanitizeString(payload.notes);
    if (notes) addIfExists('Notas', { rich_text: [{ text: { content: notes } }] });

    await notion.pages.create({
      parent: { database_id: VALUATION_DB_ID },
      properties: pageProperties as any,
    });

    return json(res, 200, { success: true });
  } catch (error) {
    console.error('[api/valuation] Error:', error);
    return json(res, 400, {
      success: false,
      stage: 'exception',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
