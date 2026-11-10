export type CookieConsentPreferences = {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
};

export const COOKIE_CONSENT_KEY = 'cookieConsent';

const DEFAULT_CONSENT: CookieConsentPreferences = {
  necessary: true,
  analytics: false,
  marketing: false,
};

export function readCookieConsent(): CookieConsentPreferences | null {
  if (typeof window === 'undefined') return null;

  const raw = window.localStorage.getItem(COOKIE_CONSENT_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<CookieConsentPreferences>;

    return {
      necessary: true,
      analytics: Boolean(parsed.analytics),
      marketing: Boolean(parsed.marketing),
    };
  } catch {
    return null;
  }
}

export function getCookieConsent(): CookieConsentPreferences {
  return readCookieConsent() ?? DEFAULT_CONSENT;
}

export function hasAnalyticsConsent(): boolean {
  return getCookieConsent().analytics;
}

export function hasMarketingConsent(): boolean {
  return getCookieConsent().marketing;
}

export function storeCookieConsent(preferences: CookieConsentPreferences): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(preferences));
}
