import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getCached, setCached, PROPERTIES_CACHE_TTL_MS } from './_lib/cache';
import { handleOptions, json, getRequestOrigin } from './_lib/http';
import { MOCK_PROPERTIES } from './_lib/mockData';
import {
  PROPERTIES_DB_ID,
  extractPropertyValue,
  getNotionClient,
  hasNotionToken,
  proxyImageList,
  proxyNotionImageUrl,
} from './_lib/notionClient';

type NotionPage = {
  id: string;
  properties: Record<string, { type: string; [key: string]: unknown }>;
  cover?: {
    type: string;
    external?: { url: string };
    file?: { url: string };
  } | null;
  last_edited_time: string;
};

function normalizeProperty(page: NotionPage, origin: string) {
  const props = page.properties;

  const titulo =
    (extractPropertyValue(props['PROPIEDAD']) as string) ||
    (extractPropertyValue(props['Título']) as string) ||
    (extractPropertyValue(props['Title']) as string) ||
    (extractPropertyValue(props['Name']) as string) ||
    '';
  const slug = (extractPropertyValue(props['Slug']) as string) || '';
  const estado = extractPropertyValue(props['Estado']) as string | null;
  const destacado = Boolean(extractPropertyValue(props['Destacado']));
  const fechaPublicacion =
    (extractPropertyValue(props['Fecha de publicación']) as string) || page.last_edited_time;

  if (estado !== 'Publicada') return null;

  const barrio = (extractPropertyValue(props['Barrio']) as string) || '';
  const ciudad = (extractPropertyValue(props['Ciudad']) as string) || 'Valencia';
  const provincia = (extractPropertyValue(props['Provincia']) as string) || 'Valencia';
  const precio = (extractPropertyValue(props['Precio']) as number) || 0;
  const superficie = (extractPropertyValue(props['Superficie m²']) as number) || 0;
  const habitaciones = (extractPropertyValue(props['Habitaciones']) as number) || 0;
  const banos = (extractPropertyValue(props['Baños']) as number) || 0;
  const planta = extractPropertyValue(props['Planta']) as number | null;
  const ascensor = Boolean(extractPropertyValue(props['Ascensor']));
  const garaje = Boolean(extractPropertyValue(props['Plaza de garaje']));
  const terraza = Boolean(extractPropertyValue(props['Terraza o Balcón']));
  const anoConstruct = extractPropertyValue(props['Año de construcción']) as number | null;
  const estadoInmueble = extractPropertyValue(props['Estado del inmueble']) as string | null;
  const descripcionCorta = (extractPropertyValue(props['Descripcion']) as string) || '';

  const imagenPortada = extractPropertyValue(props['Imagen portada']) as string[];
  const galeria = (extractPropertyValue(props['Galería']) as string[]) || [];
  const plano = extractPropertyValue(props['Plano']) as string[];

  const coverRaw =
    imagenPortada?.[0] ||
    (page.cover?.type === 'external'
      ? page.cover.external?.url
      : page.cover?.file?.url) ||
    null;
  const galleryRaw = galeria.length > 0 ? galeria : coverRaw ? [coverRaw] : [];

  const coverImage = proxyNotionImageUrl(coverRaw, origin);
  const galleryImages = proxyImageList(galleryRaw, origin);

  return {
    id: page.id,
    slug:
      slug ||
      titulo
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, ''),
    estado,
    destacado,
    titulo,
    descripcion: descripcionCorta,
    barrio,
    ciudad,
    provincia,
    precio,
    superficieM2: superficie,
    habitaciones,
    banos,
    planta,
    ascensor,
    garaje,
    terraza,
    estadoInmueble,
    fechaPublicacion,
    anoConstruccion: anoConstruct,
    imagenPortada: coverImage,
    galeria: galleryImages,
    plano: proxyNotionImageUrl(plano?.[0] || null, origin),
    updatedAt: page.last_edited_time,
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleOptions(req, res)) return;

  if (req.method !== 'GET') {
    return json(res, 405, { error: 'Method not allowed' });
  }

  const origin = getRequestOrigin(req);
  const cacheKey = `properties:${PROPERTIES_DB_ID}`;

  if (!hasNotionToken()) {
    console.warn('[api/properties] NOTION_TOKEN missing — returning mock listings');
    return json(res, 200, { ...MOCK_PROPERTIES, mock: true }, {
      'Cache-Control': 'public, max-age=30',
      'X-Soto-Data': 'mock',
    });
  }

  const cached = getCached<{ items: unknown[] }>(cacheKey);
  if (cached) {
    return json(res, 200, cached, {
      'Cache-Control': `public, max-age=${Math.floor(PROPERTIES_CACHE_TTL_MS / 1000)}`,
      'X-Soto-Cache': 'HIT',
    });
  }

  try {
    const notion = getNotionClient();
    if (!notion) {
      return json(res, 500, { error: 'Notion client unavailable' });
    }

    const pages: NotionPage[] = [];
    let cursor: string | undefined;

    do {
      const response = await notion.databases.query({
        database_id: PROPERTIES_DB_ID,
        start_cursor: cursor,
        page_size: 100,
        filter: {
          property: 'Estado',
          select: { equals: 'Publicada' },
        },
        sorts: [{ timestamp: 'last_edited_time', direction: 'descending' }],
      });
      pages.push(...(response.results as unknown as NotionPage[]));
      cursor = response.has_more ? response.next_cursor || undefined : undefined;
    } while (cursor);

    const items = pages
      .map((page) => normalizeProperty(page, origin))
      .filter((item): item is NonNullable<typeof item> => item !== null);

    const payload = { items };
    setCached(cacheKey, payload, PROPERTIES_CACHE_TTL_MS);

    return json(res, 200, payload, {
      'Cache-Control': `public, max-age=${Math.floor(PROPERTIES_CACHE_TTL_MS / 1000)}`,
      'X-Soto-Cache': 'MISS',
      'X-Soto-Data': 'notion',
    });
  } catch (error) {
    console.error('[api/properties] Error:', error);
    return json(res, 500, {
      error: 'Failed to fetch properties',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
