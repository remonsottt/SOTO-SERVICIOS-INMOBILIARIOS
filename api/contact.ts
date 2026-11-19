import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  handleOptions,
  json,
  sanitizeEmail,
  sanitizePhone,
  sanitizeString,
} from './_lib/http';
import {
  CONTACTS_DB_ID,
  getNotionClient,
  hasNotionToken,
} from './_lib/notionClient';

type ContactPayload = {
  name: string;
  email?: string;
  phone?: string;
  message: string;
  origin?: string;
  property_reference?: string;
  page_url?: string;
  utm?: string;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleOptions(req, res)) return;

  if (req.method !== 'POST') {
    return json(res, 405, { success: false, error: 'Method not allowed' });
  }

  if (!hasNotionToken()) {
    console.warn('[api/contact] NOTION_TOKEN missing — rejecting write (no fake success)');
    return json(res, 503, {
      success: false,
      stage: 'credentials',
      error: 'Formulario no conectado. Falta NOTION_TOKEN en el servidor.',
    });
  }

  try {
    const payload = (req.body || {}) as ContactPayload;
    const name = sanitizeString(payload.name);
    const message = sanitizeString(payload.message);

    if (!name || !message) {
      return json(res, 400, {
        success: false,
        stage: 'validation',
        error: 'Faltan campos obligatorios: nombre o mensaje',
      });
    }

    const notion = getNotionClient();
    if (!notion) {
      return json(res, 500, { success: false, error: 'Notion client unavailable' });
    }

    const rawOrigin = sanitizeString(payload.origin) || 'General';
    const origin =
      rawOrigin === 'General'
        ? 'Contacto web'
        : rawOrigin === 'Property' || rawOrigin === 'Propiedad'
          ? 'Propiedad'
          : 'Contacto web';

    const propertyReference = sanitizeString(payload.property_reference);
    const titleValue =
      origin === 'Propiedad' && propertyReference
        ? `Consulta propiedad - ${propertyReference}`
        : `Contacto - ${name}`;

    const db = await notion.databases.retrieve({ database_id: CONTACTS_DB_ID });
    const schema = (db as { properties: Record<string, { type: string }> }).properties;
    const titlePropName =
      Object.keys(schema).find((k) => schema[k]?.type === 'title') || 'Nombre';

    const pageProperties: Record<string, unknown> = {
      [titlePropName]: {
        title: [{ text: { content: titleValue } }],
      },
    };

    const addIfExists = (key: string, value: unknown) => {
      if (schema[key] && key !== titlePropName) pageProperties[key] = value;
    };

    addIfExists('Nombre', { rich_text: [{ text: { content: name } }] });
    addIfExists('Mensaje', { rich_text: [{ text: { content: message } }] });
    addIfExists('Origen', { select: { name: origin } });

    const phone = sanitizePhone(payload.phone);
    if (phone) addIfExists('Teléfono', { phone_number: phone });

    const email = sanitizeEmail(payload.email);
    if (email) addIfExists('Email', { email });

    if (propertyReference) {
      addIfExists('Referencia propiedad', {
        rich_text: [{ text: { content: propertyReference } }],
      });
    }

    const pageUrl = sanitizeString(payload.page_url);
    if (pageUrl) addIfExists('URL origen', { url: pageUrl });

    const utm = sanitizeString(payload.utm);
    if (utm) {
      addIfExists('UTM source / medium / campaign', {
        rich_text: [{ text: { content: utm } }],
      });
    }

    addIfExists('created_at', {
      date: { start: new Date().toISOString().slice(0, 10) },
    });

    await notion.pages.create({
      parent: { database_id: CONTACTS_DB_ID },
      properties: pageProperties as any,
    });

    return json(res, 200, { success: true });
  } catch (error) {
    console.error('[api/contact] Error:', error);
    return json(res, 400, {
      success: false,
      stage: 'exception',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
