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

        {/* CTA vendedores */}
        <section className="bg-forest-700 text-white py-16 px-6">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div>
              <h2 className="text-2xl md:text-3xl font-serif font-bold mb-2">
                ¿Quieres vender tu piso?
              </h2>
              <p className="text-white/80 font-sans font-light">
                Valoración gratuita y gestión completa. Sin coste hasta que vendas.
              </p>
            </div>
            <Link
              to="/vender-mi-piso"
              className="inline-flex items-center gap-2 bg-white text-forest-700 font-medium font-sans py-4 px-8 rounded-xl whitespace-nowrap transition-all duration-200 hover:-translate-y-px hover:opacity-90"
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
