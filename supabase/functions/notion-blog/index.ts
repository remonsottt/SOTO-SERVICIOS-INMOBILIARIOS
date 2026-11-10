import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { convertNotionBlocksToMarkdown, generateExcerpt } from './notion-to-markdown.ts';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const PICA_SECRET = Deno.env.get('PICA_SECRET_KEY');
const PICA_CONN = Deno.env.get('PICA_NOTION_CONNECTION_KEY');
const DATABASE_ID = '2cc4fdc2d1b680a796b9f25423376811';

interface BlogPost {
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
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const url = new URL(req.url);
    const slug = url.searchParams.get('slug');

    if (slug) {
      const post = await getSinglePost(slug);

      return new Response(
        JSON.stringify({ success: true, data: post }),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    } else {
      const posts = await getAllPosts();

      return new Response(
        JSON.stringify({ success: true, data: posts }),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }
  } catch (error) {
    console.error('Error fetching blog posts:', error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});

async function getAllPosts(): Promise<BlogPost[]> {
  const databaseRes = await fetch(
    `https://api.picaos.com/v1/passthrough/v1/databases/${DATABASE_ID}`,
    {
      method: "GET",
      headers: {
        "x-pica-secret": PICA_SECRET!,
        "x-pica-connection-key": PICA_CONN!,
        "x-pica-action-id": "conn_mod_def::GHfWYW_uJ4s::iK4x1-LFRzSF3oXLlDdhrA",
        "Content-Type": "application/json"
      }
    }
  );

  if (!databaseRes.ok) {
    throw new Error(`Failed to fetch database: ${databaseRes.statusText}`);
  }

  const database = await databaseRes.json();
  const dataSources = (database.data_sources || []).map((ds: any) => ds.id);

  let allPages: any[] = [];

  for (const dataSourceId of dataSources) {
    const itemsRes = await fetch(
      `https://api.picaos.com/v1/passthrough/data_sources/${dataSourceId}/query`,
      {
        method: "POST",
        headers: {
          "x-pica-secret": PICA_SECRET!,
          "x-pica-connection-key": PICA_CONN!,
          "x-pica-action-id": "conn_mod_def::GHfWZCu-4SU::-mgQyb4cQjeJWdQMXbTlAg",
          "Content-Type": "application/json",
          "Notion-Version": "2025-09-03"
        },
        body: JSON.stringify({})
      }
    );

    if (!itemsRes.ok) {
      throw new Error(`Failed to query data source: ${itemsRes.statusText}`);
    }

    const itemsResult = await itemsRes.json();
    allPages = allPages.concat(itemsResult.results || []);
  }

  const publishedPages = allPages.filter(page => {
    const status = page.properties?.Status?.select?.name || page.properties?.Status?.status?.name;
    return status === 'Published';
  });

  const posts: BlogPost[] = [];

  for (const page of publishedPages) {
    const post = await processPage(page);
    if (post) {
      posts.push(post);
    }
  }

  return posts.sort((a, b) =>
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

async function getSinglePost(slug: string): Promise<BlogPost | null> {
  const allPosts = await getAllPosts();
  return allPosts.find(post => post.slug === slug) || null;
}

async function processPage(page: any): Promise<BlogPost | null> {
  try {
    const props = page.properties;

    const title = props.Title?.title?.[0]?.plain_text || props.Name?.title?.[0]?.plain_text || '';
    const slug = props.Slug?.rich_text?.[0]?.plain_text || '';
    const status = props.Status?.select?.name || props.Status?.status?.name || '';
    const date = props.Date?.date?.start || page.created_time;
    const seoTitle = props['SEO Title']?.rich_text?.[0]?.plain_text;
    const seoDescription = props['SEO Description']?.rich_text?.[0]?.plain_text;

    const coverImageUrl = props['Featured Image']?.files?.[0]?.file?.url ||
                          props['Featured Image']?.files?.[0]?.external?.url ||
                          page.cover?.file?.url ||
                          page.cover?.external?.url ||
                          null;

    const blocksRes = await fetch(
      `https://api.picaos.com/v1/passthrough/v1/blocks/${page.id}/children`,
      {
        method: "GET",
        headers: {
          "x-pica-secret": PICA_SECRET!,
          "x-pica-connection-key": PICA_CONN!,
          "x-pica-action-id": "conn_mod_def::GHfWW7Y1vJI::OhkLT7UYRsulsfhxS031cg",
          "Content-Type": "application/json",
          "Notion-Version": "2022-06-28"
        }
      }
    );

    if (!blocksRes.ok) {
      console.error(`Failed to fetch blocks for page ${page.id}`);
      return null;
    }

    const blocksResult = await blocksRes.json();
    const blocks = blocksResult.results || [];

    const content = convertNotionBlocksToMarkdown(blocks);
    const excerpt = generateExcerpt(blocks);

    return {
      id: page.id,
      title,
      slug,
      coverImage: coverImageUrl,
      excerpt,
      content,
      publishedAt: date,
      seoTitle,
      seoDescription,
      status,
    };
  } catch (error) {
    console.error('Error processing page:', error);
    return null;
  }
}
