import React from 'react';
import Properties from '../components/Properties';
import { SEO } from '../components/SEO';

const PropertiesPage = () => {
  React.useEffect(() => {
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

    const scrollElements = document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale');
    scrollElements.forEach(el => observer.observe(el));

    return () => {
      scrollElements.forEach(el => observer.unobserve(el));
    };
  }, []);

  return (
    <>
      <SEO
        title="Pisos en Venta en Valencia | Campanar, Benimaclet, Marxalenes"
        description="Encuentra pisos y casas en venta en Valencia. Propiedades en Campanar, La Zaidia, Benimaclet y Marxalenes. Fotos, precios y visitas con inmobiliaria local."
        type="website"
      />
      <div className="min-h-screen pt-16 md:pt-20">
        <Properties />
      </div>
    </>
  );
};

export default PropertiesPage;
