# Soto Servicios Inmobiliarios — web (Proposal B)

React + Vite SPA on **Vercel**, CMS via **official Notion API** (`@notionhq/client`).  
No Pica. No Supabase CMS bridge. No Bolt/Netlify production path.

## Stack

- Frontend: Vite 5 + React 18 + Tailwind (forest `#28352b` / taupe `#998675`)
- API: Vercel serverless routes in `/api/*`
- CMS: Notion DBs (properties + blog); forms write to contacts + valuation DBs
- Media: compressed hero loop/poster; Notion images proxied via `/api/notion-image`

## Local development

```bash
export PATH="$HOME/.nvm/versions/node/v22.23.5/bin:$PATH"
cp .env.example .env.local   # add NOTION_TOKEN when available
npm install
npm run dev                  # http://127.0.0.1:5173 — /api/* served by vite-plugin-api
```

Without `NOTION_TOKEN`, listings/blog return **mock** data; contact/valuation forms return 503 (no fake success).

## Environment variables (Vercel)

| Name | Required | Notes |
|---|---|---|
| `NOTION_TOKEN` | **Yes** for production | Internal integration token; share all 4 DBs |
| `NOTION_PROPERTIES_DB_ID` | Optional | Default `2cd4fdc2d1b680e18502f3d427883216` |
| `NOTION_BLOG_DB_ID` | Optional | Default `2cc4fdc2d1b680a796b9f25423376811` |
| `NOTION_CONTACTS_DB_ID` | Optional | Default `2d34fdc2d1b680e287b2fe9728e0446f` |
| `NOTION_VALUATION_DB_ID` | Optional | Default `8c333119a6804e209e36fcae9c97e70f` |

## Deploy to Vercel + domain

1. Import GitHub repo `remonsottt/SOTO-SERVICIOS-INMOBILIARIOS` in Vercel.
2. Framework preset: Vite. Root directory: `.` (repo root).
3. Add `NOTION_TOKEN` (Production + Preview).
4. Deploy. Confirm `/api/properties` returns `{ items: [...] }` with `"X-Soto-Data: notion"`.
5. Domains → add `sotoserviciosinmobiliarios.com` + `www` → point DNS as Vercel instructs.
6. Retire Bolt/Netlify project and cancel Supabase/Pica billing.

`vercel.json` already includes SPA rewrites, security headers, asset cache, and **301s** for `/valuation`, `/free-valuation`, `/es/*`, `/admin/*`, `/blog-editor`.

## Retired

- `supabase/functions/*` Pica passthrough (kept in tree as historical reference only; not deployed)
- Public `/admin/*` and `/blog-editor` SPA routes
- `VITE_SUPABASE_*` / `PICA_*` env vars

Local Claude Astro `soto-web/` remains **reference only** (tokens, Notion field map, motion ideas) — not this production app.
