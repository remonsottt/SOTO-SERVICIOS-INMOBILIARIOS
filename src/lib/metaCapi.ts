import { edgeFetch } from './edgeClient';

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  return document.cookie
    .split('; ')
    .find((r) => r.startsWith(name + '='))
    ?.split('=')[1];
}

function getFbc(): string | undefined {
  const fbc = getCookie('_fbc');
  if (fbc) return fbc;
  if (typeof window === 'undefined') return undefined;
  const fbclid = new URLSearchParams(window.location.search).get('fbclid');
  if (fbclid) return `fb.1.${Date.now()}.${fbclid}`;
  return undefined;
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
  const testEventCode = import.meta.env.VITE_META_TEST_EVENT_CODE || undefined;

  // Browser pixel (fires with Consent Mode — Meta handles the consent state)
  window.fbq?.('track', 'Lead', { content_name: options.content_name }, { eventID: eventId });

  // Server-side CAPI (always fires — data is hashed server-side)
  try {
    await edgeFetch('meta-capi', {
      method: 'POST',
      body: JSON.stringify({
        event_name: 'Lead',
        event_id: eventId,
        content_name: options.content_name,
        email: options.email || undefined,
        phone: options.phone || undefined,
        fbp: getCookie('_fbp'),
        fbc: getFbc(),
        event_source_url: window.location.href,
        utm_source: options.utm_source || undefined,
        utm_campaign: options.utm_campaign || undefined,
        test_event_code: testEventCode,
      }),
    });
  } catch (e) {
    console.error('[MetaCAPI] Error:', e);
  }
}

export function sendMetaPageView(): void {
  const eventId = crypto.randomUUID();
  const testEventCode = import.meta.env.VITE_META_TEST_EVENT_CODE || undefined;

  // Browser pixel (fires with Consent Mode — Meta handles the consent state)
  window.fbq?.('track', 'PageView', {}, { eventID: eventId });

  // Server-side CAPI (always fires — recovers PageView signal lost to declined cookie consent)
  edgeFetch('meta-capi', {
    method: 'POST',
    body: JSON.stringify({
      event_name: 'PageView',
      event_id: eventId,
      fbp: getCookie('_fbp'),
      fbc: getFbc(),
      event_source_url: window.location.href,
      test_event_code: testEventCode,
    }),
  }).catch((e) => {
    console.error('[MetaCAPI] PageView error:', e);
  });
}
