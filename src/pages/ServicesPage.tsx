import React from 'react';
import Services from '../components/Services';
import { SEO } from '../components/SEO';

const ServicesPage = () => {
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
        title="Servicios Inmobiliarios en Valencia | Soto Inmobiliaria"
        description="Compraventa, alquiler, valoraciones, financiación y gestión legal en Valencia. Servicios inmobiliarios completos con atención personalizada y profesional."
        type="website"
      />
      <div className="min-h-screen pt-16 md:pt-20">
        <Services />
      </div>
    </>
  );
};

export default ServicesPage;
