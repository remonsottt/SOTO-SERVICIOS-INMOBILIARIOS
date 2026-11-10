const HONEYPOT_FIELD_NAME = 'website_url';
const RATE_LIMIT_KEY = 'valuation_requests';
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 3;

export const antispamService = {
  validateHoneypot: (formData: Record<string, unknown>): boolean => {
    const honeypot = formData[HONEYPOT_FIELD_NAME];
    return !honeypot || (typeof honeypot === 'string' && honeypot.trim() === '');
  },

  checkRateLimit: (): boolean => {
    try {
      const stored = localStorage.getItem(RATE_LIMIT_KEY);
      if (!stored) {
        antispamService.recordRequest();
        return true;
      }

      const data = JSON.parse(stored);
      const now = Date.now();
      const windowStart = now - RATE_LIMIT_WINDOW_MS;

      const recentRequests = data.timestamps.filter((ts: number) => ts > windowStart);

      if (recentRequests.length >= RATE_LIMIT_MAX_REQUESTS) {
        return false;
      }

      recentRequests.push(now);
      localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify({ timestamps: recentRequests }));
      return true;
    } catch (error) {
      console.error('Rate limit check error:', error);
      return true;
    }
  },

  recordRequest: (): void => {
    try {
      const now = Date.now();
      localStorage.setItem(
        RATE_LIMIT_KEY,
        JSON.stringify({ timestamps: [now] })
      );
    } catch (error) {
      console.error('Error recording request:', error);
    }
  },

  getHoneypotFieldName: (): string => {
    return HONEYPOT_FIELD_NAME;
  },
};
