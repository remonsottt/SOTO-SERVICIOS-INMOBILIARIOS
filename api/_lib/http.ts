import type { VercelRequest, VercelResponse } from '@vercel/node';

export function setCors(res: VercelResponse): void {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

export function handleOptions(req: VercelRequest, res: VercelResponse): boolean {
  setCors(res);
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return true;
  }
  return false;
}

export function json(
  res: VercelResponse,
  status: number,
  body: unknown,
  extraHeaders?: Record<string, string>
): void {
  setCors(res);
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  if (extraHeaders) {
    for (const [k, v] of Object.entries(extraHeaders)) {
      res.setHeader(k, v);
    }
  }
  res.status(status).json(body);
}

export function getRequestOrigin(req: VercelRequest): string {
  const proto = (req.headers['x-forwarded-proto'] as string) || 'https';
  const host = (req.headers['x-forwarded-host'] as string) || req.headers.host || 'localhost:5173';
  return `${proto}://${host}`;
}

export function sanitizeString(value: unknown): string | null {
  if (value === null || value === undefined || value === '') return null;
  return String(value).trim();
}

export function sanitizePhone(value: unknown): string | null {
  const str = sanitizeString(value);
  if (!str) return null;
  return str.replace(/[^\d+\s()-]/g, '').trim();
}

export function sanitizeEmail(value: unknown): string | null {
  const str = sanitizeString(value);
  if (!str || !str.includes('@')) return null;
  return str;
}

export function sanitizeNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === '') return null;
  const num = Number(value);
  if (Number.isNaN(num) || !Number.isFinite(num)) return null;
  return num;
}
