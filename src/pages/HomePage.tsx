import React from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import Properties from '../components/Properties';
import BuyerSellerInfo from '../components/BuyerSellerInfo';
import FAQ from '../components/FAQ';
import { SEO } from '../components/SEO';

const HomePage = () => {
  React.useEffect(() => {
    const opts = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };

    const legacyObserver = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('revealed'); });
    }, opts);
    document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale')
      .forEach((el) => legacyObserver.observe(el));

    const newObserver = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); newObserver.unobserve(e.target); } });
    }, opts);
    document.querySelectorAll('.sr, .sr-left, .sr-right')
      .forEach((el) => newObserver.observe(el));

    return () => { legacyObserver.disconnect(); newObserver.disconnect(); };
  }, []);

  return (
    <>
      <SEO
        title="Soto Servicios Inmobiliarios | Inmobiliaria en Valencia"
        description="Inmobiliaria familiar en Valencia con +10 años de experiencia. Compra, venta y alquiler de pisos en Campanar, Benimaclet, La Zaidia y Marxalenes. Valoración gratuita."
        type="website"
      />
      <div>
        <Hero />
        <Properties featuredOnly={true} />

        <section className="relative overflow-hidden py-20 md:py-24 px-6">
          <div
            className="absolute inset-0"
            aria-hidden="true"
            style={{
              background:
                'linear-gradient(135deg, #121814 0%, #28352b 55%, #3f4f43 100%)',
            }}
          />
          <div
            className="absolute inset-0 opacity-30"
            aria-hidden="true"
            style={{
              backgroundImage:
                'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.12), transparent 40%), radial-gradient(circle at 80% 80%, rgba(40,53,43,0.35), transparent 45%)',
            }}
          />
          <div className="relative max-w-5xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-8 text-white">
            <div className="max-w-xl sr">
              <h2 className="font-serif text-3xl md:text-5xl font-semibold leading-tight mb-4">
                ¿Quieres vender tu piso?
              </h2>
              <p className="text-white/70 font-sans font-light text-lg leading-relaxed">
                Valoración gratuita y gestión completa. Sin coste hasta que vendas.
              </p>
            </div>
            <Link
              to="/vender-mi-piso"
              className="inline-flex items-center gap-2 bg-white text-forest-800 font-medium font-sans py-3.5 px-7 rounded-md whitespace-nowrap transition-all duration-200 hover:-translate-y-px hover:bg-mist-100 sr delay-200"
            >
              Vender mi piso →
            </Link>
          </div>
        </section>

        <BuyerSellerInfo />
        <FAQ />
      </div>
    </>
  );
};

export default HomePage;
