import { hasAnalyticsConsent, hasMarketingConsent } from './consent';

interface AnalyticsEvent {
  event: string;
  properties?: Record<string, unknown>;
  timestamp: string;
}

interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
}

interface WindowWithAnalytics extends Window {
  gtag?: (...args: unknown[]) => void;
  fbq?: (...args: unknown[]) => void;
}

declare const window: WindowWithAnalytics;

const META_STANDARD_EVENTS = new Set([
  'PageView', 'Lead', 'ViewContent', 'Contact', 'CompleteRegistration',
  'Search', 'AddToCart', 'Purchase', 'Subscribe', 'InitiateCheckout',
]);

class AnalyticsService {
  private sessionId: string;
  private utmParams: UTMParams = {};

  constructor() {
    this.sessionId = this.generateSessionId();
    this.captureUTMParams();
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private captureUTMParams(): void {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);

    const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
    utmKeys.forEach(key => {
      const value = params.get(key);
      if (value) {
        this.utmParams[key as keyof UTMParams] = value;
        sessionStorage.setItem(key, value);
      } else {
        const stored = sessionStorage.getItem(key);
        if (stored) {
          this.utmParams[key as keyof UTMParams] = stored;
        }
      }
    });
  }

  getUTMParams(): UTMParams {
    return { ...this.utmParams };
  }

  private track(event: string, properties?: Record<string, unknown>): void {
    const analyticsEvent: AnalyticsEvent = {
      event,
      properties: {
        ...properties,
        ...this.utmParams,
        session_id: this.sessionId,
        page_url: typeof window !== 'undefined' ? window.location.href : '',
        page_title: typeof document !== 'undefined' ? document.title : '',
      },
      timestamp: new Date().toISOString(),
    };

    console.log('[Analytics]', analyticsEvent);

    if (typeof window !== 'undefined' && hasAnalyticsConsent() && window.gtag) {
      window.gtag('event', event, analyticsEvent.properties);
    }

    if (typeof window !== 'undefined' && hasMarketingConsent() && window.fbq) {
      if (META_STANDARD_EVENTS.has(event)) {
        window.fbq('track', event, analyticsEvent.properties);
      } else {
        window.fbq('trackCustom', event, analyticsEvent.properties);
      }
    }
  }

  trackValuationStepView(step: number, stepName: string): void {
    this.track('valuation_step_view', {
      step_number: step,
      step_name: stepName,
    });
  }

  trackValuationSubmitAttempt(formData: { propertyType?: string; locality?: string; squareMetersConstructed?: number; bedrooms?: number }): void {
    this.track('valuation_submit_attempt', {
      property_type: formData.propertyType,
      locality: formData.locality,
      built_sqm: formData.squareMetersConstructed,
      bedrooms: formData.bedrooms,
    });
  }

  trackValuationResultView(result: { estimatedValue?: number; confidence?: string; neighborhood?: { municipality?: string; area_name?: string }; marketTrend?: { trend_3m_pct?: number; trend_12m_pct?: number } }): void {
    this.track('valuation_result_view', {
      estimated_value: result.estimatedValue,
      confidence: result.confidence,
      municipality: result.neighborhood?.municipality,
      area_name: result.neighborhood?.area_name,
      trend_3m_pct: result.marketTrend?.trend_3m_pct,
      trend_12m_pct: result.marketTrend?.trend_12m_pct,
    });
  }

  trackContactCTA(ctaType: 'phone' | 'email' | 'whatsapp'): void {
    this.track('contact_cta_clicked', {
      cta_type: ctaType,
    });
  }

  trackValuationWhatsAppClick(data: { area: string; market: string; estimatedValue: number }): void {
    this.track('valuation_whatsapp_click', {
      area: data.area,
      market: data.market,
      estimated_value: data.estimatedValue,
    });
  }

  trackResultShare(method: 'copy' | 'share'): void {
    this.track('result_shared', {
      share_method: method,
    });
  }

  trackPageView(pageName: string): void {
    this.track('page_view', {
      page_name: pageName,
    });
  }

  trackError(errorType: string, errorMessage: string, context?: unknown): void {
    this.track('error_occurred', {
      error_type: errorType,
      error_message: errorMessage,
      context,
    });
  }

  trackLead(leadType: 'contact' | 'valuation', additionalData?: Record<string, unknown>): void {
    this.track('lead_generated', {
      lead_type: leadType,
      ...additionalData,
    });
  }
}

export const analytics = new AnalyticsService();
