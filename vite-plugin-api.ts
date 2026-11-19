import type { Plugin, Connect, ViteDevServer } from 'vite';
import type { IncomingMessage, ServerResponse } from 'node:http';
import path from 'node:path';

type Handler = (
  req: IncomingMessage & { query?: Record<string, string | string[]>; body?: unknown },
  res: ServerResponse & {
    status: (code: number) => any;
    json: (body: unknown) => void;
    send: (body: unknown) => void;
    setHeader: (name: string, value: string | number | readonly string[]) => void;
  }
) => Promise<void> | void;

function readBody(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf8');
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch {
        resolve({ raw });
      }
    });
    req.on('error', reject);
  });
}

function wrapRes(res: ServerResponse) {
  const wrapped = res as ServerResponse & {
    status: (code: number) => typeof wrapped;
    json: (body: unknown) => void;
    send: (body: unknown) => void;
  };

  wrapped.status = (code: number) => {
    res.statusCode = code;
    return wrapped;
  };

  wrapped.json = (body: unknown) => {
    if (!res.getHeader('Content-Type')) {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
    }
    res.end(JSON.stringify(body));
  };

  wrapped.send = (body: unknown) => {
    if (Buffer.isBuffer(body)) {
      res.end(body);
      return;
    }
    if (typeof body === 'object') {
      wrapped.json(body);
      return;
    }
    res.end(body == null ? '' : String(body));
  };

  return wrapped;
}

function createMiddleware(
  root: string,
  load: (id: string) => Promise<Record<string, unknown>>
): Connect.NextHandleFunction {
  const routeMap: Record<string, string> = {
    '/api/properties': path.join(root, 'api/properties.ts'),
    '/api/blog': path.join(root, 'api/blog.ts'),
    '/api/contact': path.join(root, 'api/contact.ts'),
    '/api/valuation': path.join(root, 'api/valuation.ts'),
    '/api/notion-image': path.join(root, 'api/notion-image.ts'),
  };

  return async (req, res, next) => {
    try {
      const url = new URL(req.url || '/', 'http://localhost');
      const pathname = url.pathname.replace(/\/$/, '') || '/';
      const file = routeMap[pathname];
      if (!file) return next();

      const mod = await load(file);
      const handler = (mod.default || mod.handler) as Handler;

      const query: Record<string, string> = {};
      url.searchParams.forEach((value, key) => {
        query[key] = value;
      });

      const vercelReq = req as IncomingMessage & {
        query: Record<string, string>;
        body?: unknown;
        method?: string;
      };
      vercelReq.query = query;
      vercelReq.method = req.method;

      if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
        vercelReq.body = await readBody(req);
      }

      await handler(vercelReq, wrapRes(res));
    } catch (error) {
      console.error('[vite-plugin-api]', error);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(
        JSON.stringify({
          error: 'Local API middleware failed',
          message: error instanceof Error ? error.message : 'Unknown error',
        })
      );
    }
  };
}

/** Serves Vercel-style /api/* handlers inside `vite` without the Vercel CLI. */
export function vercelApiPlugin(): Plugin {
  return {
    name: 'soto-vercel-api',
    configureServer(server: ViteDevServer) {
      server.middlewares.use(
        createMiddleware(server.config.root, (id) => server.ssrLoadModule(id))
      );
    },
    configurePreviewServer(server) {
      // Preview serves built assets only; API still needs SSR transform from source.
      server.middlewares.use(
        createMiddleware(server.config.root, async (id) => {
          // Dynamic import of compiled JS is not available in preview; load via vite-node style is complex.
          // Prefer `npm run dev` for API verification. Preview returns a clear error.
          throw new Error(
            `API route ${id} is available in \`npm run dev\` and on Vercel. Use those for /api/* checks.`
          );
        })
      );
    },
  };
}
