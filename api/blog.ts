import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getCached, setCached, BLOG_CACHE_TTL_MS } from './_lib/cache';
import { handleOptions, json, getRequestOrigin } from './_lib/http';
import { convertNotionBlocksToMarkdown, generateExcerpt } from './_lib/markdown';
import { MOCK_BLOG_POSTS } from './_lib/mockData';
import {
  BLOG_DB_ID,
  getNotionClient,
  hasNotionToken,
  proxyNotionImageUrl,
} from './_lib/notionClient';

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  coverImage: string | null;
  excerpt: string;
  content: string;
  publishedAt: string;
  seoTitle?: string;
  seoDescription?: string;
  status: string;
};

type NotionPage = {
  id: string;
  properties: Record<string, any>;
  cover?: { file?: { url?: string }; external?: { url?: string } } | null;
  created_time: string;
};

async function fetchBlocks(pageId: string) {
  const notion = getNotionClient();
  if (!notion) return [];

  const blocks: any[] = [];
  let cursor: string | undefined;
  do {
    const response = await notion.blocks.children.list({
      block_id: pageId,
      start_cursor: cursor,
      page_size: 100,
    });
    blocks.push(...response.results);
    cursor = response.has_more ? response.next_cursor || undefined : undefined;
  } while (cursor);

  return blocks;
}

async function processPage(page: NotionPage, origin: string): Promise<BlogPost | null> {
  try {
    const props = page.properties;
    const title =
      props.Title?.title?.[0]?.plain_text ||
      props.Name?.title?.[0]?.plain_text ||
      '';
    const slug = props.Slug?.rich_text?.[0]?.plain_text || '';
    const status = props.Status?.select?.name || props.Status?.status?.name || '';
    const date = props.Date?.date?.start || page.created_time;
    const seoTitle = props['SEO Title']?.rich_text?.[0]?.plain_text;
    const seoDescription = props['SEO Description']?.rich_text?.[0]?.plain_text;

    const coverRaw =
      props['Featured Image']?.files?.[0]?.file?.url ||
      props['Featured Image']?.files?.[0]?.external?.url ||
      page.cover?.file?.url ||
      page.cover?.external?.url ||
      null;

    const blocks = await fetchBlocks(page.id);
    const content = convertNotionBlocksToMarkdown(blocks);
    const excerpt = generateExcerpt(blocks);

    return {
      id: page.id,
      title,
      slug,
      coverImage: proxyNotionImageUrl(coverRaw, origin),
      excerpt,
      content,
      publishedAt: date,
      seoTitle,
      seoDescription,
      status,
    };
  } catch (error) {
    console.error('[api/blog] processPage error:', error);
    return null;
  }
}

async function getAllPosts(origin: string): Promise<BlogPost[]> {
  const notion = getNotionClient();
  if (!notion) return [];

  const pages: NotionPage[] = [];
  let cursor: string | undefined;

  do {
    const response = await notion.databases.query({
      database_id: BLOG_DB_ID,
      start_cursor: cursor,
      page_size: 100,
    });
    pages.push(...(response.results as unknown as NotionPage[]));
    cursor = response.has_more ? response.next_cursor || undefined : undefined;
  } while (cursor);

  const published = pages.filter((page) => {
    const status =
      page.properties?.Status?.select?.name || page.properties?.Status?.status?.name;
    return status === 'Published';
  });

  const posts: BlogPost[] = [];
  for (const page of published) {
    const post = await processPage(page, origin);
    if (post) posts.push(post);
  }

  return posts.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleOptions(req, res)) return;

  if (req.method !== 'GET') {
    return json(res, 405, { success: false, error: 'Method not allowed' });
  }

  const origin = getRequestOrigin(req);
  const slug = typeof req.query.slug === 'string' ? req.query.slug : undefined;

  if (!hasNotionToken()) {
    console.warn('[api/blog] NOTION_TOKEN missing — returning mock posts');
    if (slug) {
      const post = MOCK_BLOG_POSTS.data.find((p) => p.slug === slug) || null;
      return json(res, 200, { success: true, data: post, mock: true });
    }
    return json(res, 200, MOCK_BLOG_POSTS);
  }

  const cacheKey = slug ? `blog:slug:${slug}` : `blog:all:${BLOG_DB_ID}`;
  const cached = getCached<unknown>(cacheKey);
  if (cached) {
    return json(res, 200, cached, {
      'Cache-Control': `public, max-age=${Math.floor(BLOG_CACHE_TTL_MS / 1000)}`,
      'X-Soto-Cache': 'HIT',
    });
  }

  try {
    const posts = await getAllPosts(origin);

    if (slug) {
      const post = posts.find((p) => p.slug === slug) || null;
      const payload = { success: true, data: post };
      setCached(cacheKey, payload, BLOG_CACHE_TTL_MS);
      return json(res, 200, payload, {
        'Cache-Control': `public, max-age=${Math.floor(BLOG_CACHE_TTL_MS / 1000)}`,
        'X-Soto-Data': 'notion',
      });
    }

    const payload = { success: true, data: posts };
    setCached(cacheKey, payload, BLOG_CACHE_TTL_MS);
    return json(res, 200, payload, {
      'Cache-Control': `public, max-age=${Math.floor(BLOG_CACHE_TTL_MS / 1000)}`,
      'X-Soto-Data': 'notion',
    });
  } catch (error) {
    console.error('[api/blog] Error:', error);
    return json(res, 500, {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
