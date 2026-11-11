import { useEffect } from 'react';
import { ValuationWidget } from '../components/ValuationWidget';
import { SEO } from '../components/SEO';

interface WindowWithGtag extends Window {
  gtag?: (...args: unknown[]) => void;
}

declare const window: WindowWithGtag;

const ValuationPage = () => {
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, observerOptions);

    const scrollElements = document.querySelectorAll('.scroll-reveal');
    scrollElements.forEach(el => observer.observe(el));

    const handleScroll = () => {
      // Scroll handler - functionality placeholder
    };
    window.addEventListener('scroll', handleScroll);

    const handleVideoPlay = () => {
      if (window.gtag) {
        window.gtag('event', 'video_play', {
          event_category: 'engagement',
          event_label: 'Testimonio Virginia M.'
        });
      }
    };

    const iframe = document.querySelector('iframe');
    if (iframe) {
      iframe.addEventListener('load', () => {
        iframe.contentWindow?.addEventListener('play', handleVideoPlay);
      });
    }

    return () => {
      scrollElements.forEach(el => observer.unobserve(el));
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToWidget = () => {
    const widget = document.getElementById('valuation-widget');
    if (widget) {
      widget.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <SEO
        title="Valoración Gratuita de tu Piso en Valencia | Soto Inmobiliaria"
        description="Valora tu piso gratis en Valencia en 2 minutos. Tasación online para Campanar, Benimaclet, La Zaidía y Marxalenes. Basada en datos reales del mercado local."
        type="website"
      />
      <div className="min-h-screen bg-gray-50">

        {/* SECCIÓN INTRODUCTORIA */}
      <section className="py-12 sm:py-16 md:py-20 bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-full mb-6">
              Gratuito, confidencial y sin compromiso
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-light text-gray-900 mb-6 leading-tight">
            Valora tu Vivienda Online
          </h1>

          <p className="text-base sm:text-lg text-gray-600 mb-4 leading-relaxed max-w-2xl mx-auto">
            Solo disponible para pisos en Campanar, La Zaidia, Marxalenes y Benimaclet.
            <br className="hidden sm:block" />
            Basado en datos de ventas recientes en estos barrios.
          </p>

          <p className="text-base sm:text-lg text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto">
            Obtén una valoración orientativa en pocos pasos, gratuita y sin compromiso,
            basada en el conocimiento real del mercado local.
          </p>

          <button
            onClick={scrollToWidget}
            className="inline-flex items-center px-8 py-4 bg-[#223e28] text-white text-base sm:text-lg font-medium rounded-lg hover:bg-[#2d5236] transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Hacer mi valoración gratuita
          </button>
        </div>
      </section>

      {/* VALORADOR */}
      <div id="valuation-widget" className="scroll-mt-20">
        <ValuationWidget />
      </div>

      {/* BLOQUE DE CONFIANZA */}
      <section className="py-12 sm:py-16 md:py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl p-8 sm:p-12 md:p-16 shadow-sm border border-gray-100 scroll-reveal">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-[#223e28] mb-6">
                ¿Por qué confían en nosotros?
              </h2>

              <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto mb-4">
                No somos una gran plataforma ni un algoritmo.
              </p>

              <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto mb-10">
                Somos una inmobiliaria local con más de 10 años de experiencia ayudando a propietarios de Campanar, La Zaidía, Benimaclet y Marxalenes a vender sin estrés y al precio justo.
              </p>

              <script src="https://elfsightcdn.com/platform.js" async></script>
              <div className="elfsight-app-8ee7d4e8-3b77-4b40-9247-df6301cfcbd7" data-elfsight-app-lazy></div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIO */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-light text-[#223e28] mb-10">
              Testimonio real
            </h3>

            <div className="w-full max-w-4xl mx-auto px-4">
              <div
                className="relative overflow-hidden rounded-2xl shadow-xl bg-gray-900 border border-black/20"
                style={{
                  paddingBottom: '56.25%',
                  height: 0
                }}
              >
                <iframe
                  src="https://drive.google.com/file/d/1P4duOAzGHpIp5yMXOPhpTN5y0vt9oCRn/preview"
                  title="Testimonio Virginia M. | Soto Servicios Inmobiliarios"
                  style={{ border: 0 }}
                  allow="autoplay"
                  allowFullScreen
                  loading="lazy"
                  className="absolute top-0 left-0 w-full h-full"
                />
              </div>
              <div className="mt-6 text-center">
                <a
                  href="https://drive.google.com/file/d/1P4duOAzGHpIp5yMXOPhpTN5y0vt9oCRn/view"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-[#223e28] text-white text-sm font-medium rounded-lg hover:bg-[#2d5236] transition-colors"
                >
                  Ver video en pantalla completa
                </a>
              </div>
            </div>

            <div className="mt-10 max-w-3xl mx-auto scroll-reveal">
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed italic">
                "Dejé mi piso en manos de Katia y su hija, y solo puedo decir excelentes palabras sobre su gestión.
                Son cercanas, profesionales y cuidan cada detalle del alquiler.
                Las recomiendo totalmente — no hay otra inmobiliaria igual."
              </p>
              <p className="text-sm sm:text-base text-gray-500 mt-6">
                — Virginia M., propietaria en Campanar
              </p>
            </div>
          </div>
        </div>
      </section>

      </div>
    </>
  );
};

export default ValuationPage;
