/**
 * Client for Soto Vercel API routes (official Notion API on the server).
 * No Supabase / Pica.
 */

const API_MAP: Record<string, string> = {
  'notion-properties': '/api/properties',
  'notion-blog': '/api/blog',
  'notion-valuation': '/api/valuation',
  'notion-contacts': '/api/contact',
};

export function getApiBaseUrl(): string {
  // Same-origin in both Vite and Vercel production.
  return '';
}

export interface EdgeFetchOptions extends RequestInit {
  params?: Record<string, string>;
}

export async function edgeFetch(
  functionName: string,
  options: EdgeFetchOptions = {}
): Promise<Response> {
  const { params, ...fetchOptions } = options;

  const mapped = API_MAP[functionName];
  if (!mapped) {
    throw new Error(`No API mapping found for function: ${functionName}`);
  }

  let url = `${getApiBaseUrl()}${mapped}`;

  if (params) {
    const queryString = new URLSearchParams(params).toString();
    url = `${url}?${queryString}`;
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((fetchOptions.headers as Record<string, string>) || {}),
  };

  if (import.meta.env.DEV) {
    console.log(`[DEV] API → ${url}`);
  }

  const response = await fetch(url, {
    ...fetchOptions,
    headers,
  });

  if (import.meta.env.DEV) {
    console.log(`[DEV] API ← Status ${response.status}`);
  }

  return response;
}

/** @deprecated Supabase removed in Proposal B. Kept as no-op for leftover diagnostics. */
export function getSupabaseEnv(): null {
  return null;
}
