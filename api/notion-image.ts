import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleOptions, setCors } from './_lib/http';

const ALLOWED_HOST_FRAGMENTS = [
  'notion.so',
  'notion-static.com',
  'amazonaws.com',
  'prod-files-secure',
  's3.us-west-2.amazonaws.com',
  'secure.notion-static.com',
];

function isAllowedNotionUrl(raw: string): boolean {
  try {
    const url = new URL(raw);
    if (url.protocol !== 'https:') return false;
    return ALLOWED_HOST_FRAGMENTS.some((fragment) => url.hostname.includes(fragment) || raw.includes(fragment));
  } catch {
    return false;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleOptions(req, res)) return;

  if (req.method !== 'GET') {
    setCors(res);
    res.status(405).end('Method not allowed');
    return;
  }

  const rawUrl = typeof req.query.url === 'string' ? req.query.url : '';
  if (!rawUrl || !isAllowedNotionUrl(rawUrl)) {
    setCors(res);
    res.status(400).json({ error: 'Invalid or disallowed image URL' });
    return;
  }

  try {
    const upstream = await fetch(rawUrl, {
      headers: {
        Accept: 'image/*,*/*',
        'User-Agent': 'SotoWebImageProxy/1.0',
      },
    });

    if (!upstream.ok) {
      setCors(res);
      res.status(upstream.status).json({ error: 'Upstream image fetch failed' });
      return;
    }

    const contentType = upstream.headers.get('content-type') || 'image/jpeg';
    const buffer = Buffer.from(await upstream.arrayBuffer());

    setCors(res);
    res.setHeader('Content-Type', contentType);
    // Short TTL: Notion signed URLs expire ~1h; keep proxy cache short so clients re-hit via API lists.
    res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=300');
    res.status(200).send(buffer);
  } catch (error) {
    console.error('[api/notion-image] Error:', error);
    setCors(res);
    res.status(502).json({
      error: 'Failed to proxy Notion image',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
