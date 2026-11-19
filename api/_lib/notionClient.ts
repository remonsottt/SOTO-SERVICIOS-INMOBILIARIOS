import { Client } from '@notionhq/client';

export const PROPERTIES_DB_ID =
  process.env.NOTION_PROPERTIES_DB_ID || '2cd4fdc2d1b680e18502f3d427883216';
export const BLOG_DB_ID =
  process.env.NOTION_BLOG_DB_ID || '2cc4fdc2d1b680a796b9f25423376811';
export const CONTACTS_DB_ID =
  process.env.NOTION_CONTACTS_DB_ID || '2d34fdc2d1b680e287b2fe9728e0446f';
export const VALUATION_DB_ID =
  process.env.NOTION_VALUATION_DB_ID || '8c333119a6804e209e36fcae9c97e70f';

export function getNotionToken(): string | undefined {
  return process.env.NOTION_TOKEN || undefined;
}

export function getNotionClient(): Client | null {
  const token = getNotionToken();
  if (!token) return null;
  return new Client({ auth: token });
}

export function hasNotionToken(): boolean {
  return Boolean(getNotionToken());
}

type NotionProp = { type: string; [key: string]: unknown };

export function extractPropertyValue(property: NotionProp | undefined): unknown {
  if (!property) return null;

  switch (property.type) {
    case 'title': {
      const title = property.title as Array<{ plain_text?: string }> | undefined;
      return title?.[0]?.plain_text || '';
    }
    case 'rich_text': {
      const rich = property.rich_text as Array<{ plain_text?: string }> | undefined;
      return rich?.[0]?.plain_text || '';
    }
    case 'number':
      return property.number ?? null;
    case 'select': {
      const select = property.select as { name?: string } | null;
      return select?.name || null;
    }
    case 'status': {
      const status = property.status as { name?: string } | null;
      return status?.name || null;
    }
    case 'multi_select': {
      const multi = property.multi_select as Array<{ name: string }> | undefined;
      return multi?.map((item) => item.name) || [];
    }
    case 'checkbox':
      return Boolean(property.checkbox);
    case 'files': {
      const files = property.files as Array<{
        type?: string;
        external?: { url?: string };
        file?: { url?: string };
      }> | undefined;
      return (
        files
          ?.map((file) => {
            if (file.type === 'external') return file.external?.url;
            if (file.type === 'file') return file.file?.url;
            return null;
          })
          .filter(Boolean) || []
      );
    }
    case 'date': {
      const date = property.date as { start?: string } | null;
      return date?.start || null;
    }
    case 'email':
      return property.email || null;
    case 'phone_number':
      return property.phone_number || null;
    case 'url':
      return property.url || null;
    default:
      return null;
  }
}

/** Rewrite Notion signed URLs through our short-lived proxy so the SPA can keep caching. */
export function proxyNotionImageUrl(url: string | null | undefined, origin?: string): string | null {
  if (!url) return null;
  if (url.startsWith('/')) return url;
  const isNotionHosted =
    url.includes('notion.so') ||
    url.includes('amazonaws.com') ||
    url.includes('notion-static.com') ||
    url.includes('prod-files-secure');
  if (!isNotionHosted) return url;
  const base = origin || '';
  return `${base}/api/notion-image?url=${encodeURIComponent(url)}`;
}

export function proxyImageList(
  urls: string[],
  origin?: string
): string[] {
  return urls
    .map((u) => proxyNotionImageUrl(u, origin))
    .filter((u): u is string => Boolean(u));
}
