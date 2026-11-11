import { hasAnalyticsConsent } from './consent';

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

export function initDataLayer(): void {
  if (typeof window !== 'undefined' && hasAnalyticsConsent()) {
    window.dataLayer = window.dataLayer || [];
  }
}

export function pushToDataLayer(data: Record<string, unknown>): void {
  if (typeof window !== 'undefined' && hasAnalyticsConsent() && window.dataLayer) {
    window.dataLayer.push(data);
  }
}

export function trackPageView(pathname: string, search: string = ''): void {
  const fullPath = pathname + search;

  pushToDataLayer({
    event: 'page_view',
    page_path: fullPath,
    page_location: window.location.href,
    page_title: document.title
  });
}

initDataLayer();
