import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createHash } from "node:crypto";

const PIXEL_ID = Deno.env.get("META_PIXEL_ID")!;
const TOKEN = Deno.env.get("META_CAPI_TOKEN")!;
const API_VERSION = "v21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

const sha256 = (v: string) => createHash("sha256").update(v).digest("hex");

function normEmail(e: string): string {
  return e.trim().toLowerCase();
}

function normPhone(p: string): string {
  let d = p.replace(/[^0-9]/g, "");
  if (d.length === 9) d = "34" + d;
  return d;
}

interface RequestBody {
  event_name?: string;
  event_id: string;
  content_name?: string;
  email?: string;
  phone?: string;
  fbp?: string;
  fbc?: string;
  event_source_url?: string;
  utm_source?: string;
  utm_campaign?: string;
  test_event_code?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (!PIXEL_ID || !TOKEN) {
    return new Response(
      JSON.stringify({ error: "Missing META_PIXEL_ID or META_CAPI_TOKEN" }),
      { status: 500, headers: { ...corsHeaders, "content-type": "application/json" } }
    );
  }

  try {
    const b: RequestBody = await req.json();
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
    const ua = req.headers.get("user-agent") ?? undefined;

    const user_data: Record<string, unknown> = {};
    if (b.email) user_data.em = [sha256(normEmail(b.email))];
    if (b.phone) user_data.ph = [sha256(normPhone(b.phone))];
    if (b.fbp) user_data.fbp = b.fbp;
    if (b.fbc) user_data.fbc = b.fbc;
    if (ip) user_data.client_ip_address = ip;
    if (ua) user_data.client_user_agent = ua;

    const event = {
      event_name: b.event_name ?? "Lead",
      event_time: Math.floor(Date.now() / 1000),
      event_id: b.event_id,
      action_source: "website",
      event_source_url: b.event_source_url,
      user_data,
      custom_data: {
        ...(b.content_name ? { content_name: b.content_name } : {}),
        ...(b.utm_source ? { utm_source: b.utm_source } : {}),
        ...(b.utm_campaign ? { utm_campaign: b.utm_campaign } : {}),
      },
    };

    const payload: Record<string, unknown> = { data: [event] };
    if (b.test_event_code) payload.test_event_code = b.test_event_code;

    const res = await fetch(
      `https://graph.facebook.com/${API_VERSION}/${PIXEL_ID}/events?access_token=${TOKEN}`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const result = await res.json();
    return new Response(JSON.stringify(result), {
      status: res.ok ? 200 : 400,
      headers: { ...corsHeaders, "content-type": "application/json" },
    });
  } catch (e) {
    return new Response(
      JSON.stringify({ error: String(e) }),
      { status: 400, headers: { ...corsHeaders, "content-type": "application/json" } }
    );
  }
});
