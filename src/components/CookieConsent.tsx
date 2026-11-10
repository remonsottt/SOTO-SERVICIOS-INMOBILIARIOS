import { useState, useEffect } from 'react';
import { X, Cookie, Settings } from 'lucide-react';
import {
  getCookieConsent,
  storeCookieConsent,
  type CookieConsentPreferences,
} from '../lib/consent';

const GA_ID = 'G-2JL8QHSB9J';
const META_PIXEL_ID = '1659734765113421';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: ((...args: unknown[]) => void) & {
      callMethod?: (...args: unknown[]) => void;
      queue?: unknown[][];
      loaded?: boolean;
      version?: string;
    };
    _fbq?: Window['fbq'];
  }
}

export const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookieConsentPreferences>({
    necessary: true,
    analytics: false,
    marketing: false
  });

  const loadGoogleAnalytics = () => {
    if (typeof window === 'undefined') return;
    if (document.getElementById('gtag-js')) return;

    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function gtag(...args: unknown[]) {
      window.dataLayer?.push(args);
    };

    const script = document.createElement('script');
    script.id = 'gtag-js';
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(script);

    window.gtag('js', new Date());
    window.gtag('config', GA_ID);
  };

  const loadMetaPixel = () => {
    if (typeof window === 'undefined') return;
    if (document.getElementById('meta-pixel-js')) return;

    if (!window.fbq) {
      const fbqStub = ((...args: unknown[]) => {
        const currentFbq = window.fbq as NonNullable<Window['fbq']>;

        if (currentFbq.callMethod) {
          currentFbq.callMethod(...args);
        } else {
          currentFbq.queue = currentFbq.queue || [];
          currentFbq.queue.push(args);
        }
      }) as NonNullable<Window['fbq']>;

      fbqStub.queue = [];
      fbqStub.loaded = true;
      fbqStub.version = '2.0';
      window.fbq = fbqStub;
      window._fbq = fbqStub;
    }

    window.fbq?.('consent', 'revoke');

    const script = document.createElement('script');
    script.id = 'meta-pixel-js';
    script.async = true;
    script.src = 'https://connect.facebook.net/en_US/fbevents.js';
    document.head.appendChild(script);

    window.fbq?.('init', META_PIXEL_ID);
    window.fbq?.('track', 'PageView');
  };

  const grantMetaConsent = () => {
    if (typeof window === 'undefined') return;
    window.fbq?.('consent', 'grant');
  };

  const loadConsentAwareScripts = (nextPreferences: CookieConsentPreferences) => {
    if (nextPreferences.analytics) {
      loadGoogleAnalytics();
    }

    loadMetaPixel();

    if (nextPreferences.marketing) {
      grantMetaConsent();
    }
  };

  useEffect(() => {
    const consent = getCookieConsent();
    setPreferences(consent);

    if (!window.localStorage.getItem('cookieConsent')) {
      loadMetaPixel();
      setShowBanner(true);
      return;
    }

    loadConsentAwareScripts(consent);
  }, []);

  const acceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true
    };
    storeCookieConsent(allAccepted);
    loadConsentAwareScripts(allAccepted);
    setShowBanner(false);
    setShowSettings(false);
  };

  const rejectNonEssential = () => {
    const onlyNecessary = {
      necessary: true,
      analytics: false,
      marketing: false
    };
    storeCookieConsent(onlyNecessary);
    setShowBanner(false);
    setShowSettings(false);
  };

  const savePreferences = () => {
    storeCookieConsent(preferences);
    loadConsentAwareScripts(preferences);
    setShowBanner(false);
    setShowSettings(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center pointer-events-none">
      <div className="pointer-events-auto w-full max-w-7xl mx-4 mb-4 bg-white rounded-2xl shadow-2xl border border-gray-200 animate-slide-up">
        {!showSettings ? (
          <div className="p-6 md:p-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-[#223e28]/10 rounded-full flex items-center justify-center">
                <Cookie className="w-6 h-6 text-[#223e28]" />
              </div>

              <div className="flex-1">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                  Utilizamos cookies
                </h3>
                <p className="text-sm md:text-base text-gray-600 mb-4">
                  Utilizamos cookies propias y de terceros para mejorar tu experiencia de navegación,
                  analizar el tráfico del sitio y personalizar el contenido. Puedes aceptar todas las
                  cookies, rechazar las no esenciales o configurar tus preferencias.
                </p>
                <p className="text-xs text-gray-500 mb-4">
                  Al hacer clic en "Aceptar todas", aceptas el almacenamiento de cookies en tu dispositivo.
                  Consulta nuestra{' '}
                  <a href="/es/cookies" className="text-[#223e28] hover:underline">
                    Política de Cookies
                  </a>
                  {' '}y{' '}
                  <a href="/es/privacidad" className="text-[#223e28] hover:underline">
                    Política de Privacidad
                  </a>
                  {' '}para más información.
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={acceptAll}
                    className="px-6 py-3 bg-[#223e28] text-white rounded-lg hover:bg-[#28352b] transition-colors font-medium"
                  >
                    Aceptar todas
                  </button>
                  <button
                    onClick={rejectNonEssential}
                    className="px-6 py-3 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    Rechazar no esenciales
                  </button>
                  <button
                    onClick={() => setShowSettings(true)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    <Settings className="w-4 h-4" />
                    Configurar
                  </button>
                </div>
              </div>

              <button
                onClick={rejectNonEssential}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 md:p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                  Configuración de cookies
                </h3>
                <p className="text-sm text-gray-600">
                  Gestiona tus preferencias de cookies. Las cookies necesarias siempre están activas.
                </p>
              </div>
              <button
                onClick={() => setShowSettings(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Cookies necesarias</h4>
                  <p className="text-sm text-gray-600">
                    Esenciales para el funcionamiento del sitio web. No se pueden desactivar.
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <span className="text-sm text-gray-500 font-medium">Siempre activas</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Cookies analíticas</h4>
                  <p className="text-sm text-gray-600">
                    Nos ayudan a entender cómo interactúas con el sitio web para mejorarlo.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.analytics}
                    onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#223e28]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#223e28]"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Cookies de marketing</h4>
                  <p className="text-sm text-gray-600">
                    Se utilizan para rastrear a los visitantes y mostrar anuncios relevantes.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.marketing}
                    onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#223e28]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#223e28]"></div>
                </label>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={savePreferences}
                className="px-6 py-3 bg-[#223e28] text-white rounded-lg hover:bg-[#28352b] transition-colors font-medium"
              >
                Guardar preferencias
              </button>
              <button
                onClick={acceptAll}
                className="px-6 py-3 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Aceptar todas
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
