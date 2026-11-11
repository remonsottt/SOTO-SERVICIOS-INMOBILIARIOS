export function stripDiacritics(s: string): string {
  return s.normalize('NFD').replace(/\p{Diacritic}/gu, '');
}

export function canon(s: string): string {
  return stripDiacritics(String(s ?? '')).toLowerCase().trim().replace(/\s+/g, ' ');
}

export function canonMunicipality(s: string): string {
  const c = canon(s);
  if (c === 'valencia' || c === 'valencia ciudad') return 'valencia';
  return c;
}

export function canonArea(s: string): string {
  const c = canon(s)
    .replace(/ruzafa/g, 'russafa')
    .replace(/burjasot/g, 'burjassot');
  return c;
}

export function splitMulti(value?: string): string[] {
  return (value ?? '')
    .split(/[;,/|]/)
    .map(v => canon(v))
    .filter(Boolean);
}

export function normalizeBoolean(value: string | boolean | undefined | null): boolean {
  if (typeof value === 'boolean') return value;
  if (!value) return false;
  const s = String(value).toLowerCase().trim();
  return ['sí', 'si', 'yes', 'true', '1'].includes(s);
}

export function normalizeNumber(value: string | number | undefined | null): number | null {
  if (typeof value === 'number') return isNaN(value) ? null : value;
  if (!value) return null;
  const s = String(value).trim().replace(',', '.');
  const num = parseFloat(s);
  return isNaN(num) ? null : num;
}
