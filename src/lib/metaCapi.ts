/**
 * Meta CAPI is optional and retired from the Supabase/Pica path.
 * Browser pixel may still fire when consent + fbq exist; no server hop.
 */

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

interface SendMetaLeadOptions {
  content_name: string;
  email?: string;
  phone?: string;
  utm_source?: string;
  utm_campaign?: string;
}

export async function sendMetaLead(options: SendMetaLeadOptions): Promise<void> {
  const eventId = crypto.randomUUID();
  window.fbq?.('track', 'Lead', { content_name: options.content_name }, { eventID: eventId });
}

export function sendMetaPageView(): void {
  const eventId = crypto.randomUUID();
  window.fbq?.('track', 'PageView', {}, { eventID: eventId });
}
