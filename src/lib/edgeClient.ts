const isDevelopment = import.meta.env.DEV;

const DEV_PROXY_MAP: Record<string, string> = {
  'notion-properties': '/api/properties',
  'notion-blog': '/api/blog',
  'notion-valuation': '/api/valuation-leads',
  'notion-contacts': '/api/contacts',
  'meta-capi': '/api/meta-capi',
};

export function getSupabaseEnv(): { url: string; key: string } | null {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!url || !key) {
    if (isDevelopment) {
      console.error('[EdgeClient] CRITICAL: Missing Supabase credentials', {
        hasUrl: !!url,
        hasKey: !!key,
      });
    }
    return null;
  }

  return { url, key };
}

export function getEdgeBaseUrl(): string {
  if (isDevelopment) {
    return '';
  }

  const env = getSupabaseEnv();
  if (!env) {
    console.error('[EdgeClient] Cannot build edge URL: missing Supabase env vars');
    return '';
  }

  return `${env.url}/functions/v1`;
}

export interface EdgeFetchOptions extends RequestInit {
  params?: Record<string, string>;
}

export async function edgeFetch(
  functionName: string,
  options: EdgeFetchOptions = {}
): Promise<Response> {
  const { params, ...fetchOptions } = options;

  let url: string;

  if (isDevelopment) {
    const proxyPath = DEV_PROXY_MAP[functionName];
    if (!proxyPath) {
      throw new Error(`No proxy mapping found for function: ${functionName}`);
    }
    url = proxyPath;
  } else {
    const env = getSupabaseEnv();
    if (!env) {
      throw new Error('Missing Supabase environment variables. Please check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
    }
    url = `${env.url}/functions/v1/${functionName}`;
  }

  if (params) {
    const queryString = new URLSearchParams(params).toString();
    url = `${url}?${queryString}`;
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(fetchOptions.headers as Record<string, string> || {}),
  };

  if (!isDevelopment) {
    const env = getSupabaseEnv();
    if (env) {
      headers['apikey'] = env.key;
      headers['Authorization'] = `Bearer ${env.key}`;
    }
  }

  if (isDevelopment) {
    console.log(`[DEV] EdgeClient → ${url}`);
  }

  const response = await fetch(url, {
    ...fetchOptions,
    headers,
  });

  if (isDevelopment) {
    console.log(`[DEV] EdgeClient ← Status ${response.status}`);
    if (!response.ok) {
      const text = await response.text();
      console.error(`[DEV] EdgeClient Error Response:`, text);
      return new Response(text, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      });
    }
  }

  return response;
}
