import React from 'react';
import About from '../components/About';
import { SEO } from '../components/SEO';

const AboutPage = () => {
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
        title="Sobre Nosotros | Soto Servicios Inmobiliarios Valencia"
        description="Inmobiliaria familiar en Valencia con más de 10 años de experiencia. Conocemos el mercado local de Campanar, Benimaclet, La Zaidía y Marxalenes como nadie."
        type="website"
      />
      <div className="min-h-screen pt-16 md:pt-20">
        <About />
      </div>
    </>
  );
};

export default AboutPage;
