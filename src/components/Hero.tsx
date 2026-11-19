import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  return (
    <section
      id="inicio"
      className="relative min-h-[100svh] flex flex-col justify-end overflow-hidden"
      aria-label="Portada principal"
    >
      {/* Full-bleed visual plane: compressed stock loop + poster */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <video
          className="absolute inset-0 h-full w-full object-cover object-center hero-ken-burns hero-video"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/assets/video/hero-tour-poster.webp"
        >
          <source src="/assets/video/hero-tour.webm" type="video/webm" />
          <source src="/assets/video/hero-tour.mp4" type="video/mp4" />
        </video>
        <img
          src="/assets/hero-valencia.webp"
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center -z-10"
          fetchPriority="high"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-900/85 via-forest-900/45 to-forest-900/25" />
        <div className="absolute inset-0 bg-gradient-to-r from-forest-900/40 via-transparent to-transparent" />
      </div>

      {/* One composition: brand, headline, support, CTAs */}
      <div className="relative w-full max-w-7xl mx-auto px-6 lg:px-8 pb-16 md:pb-24 pt-36">
        <p
          className="brand-mark text-white mb-5 md:mb-6 max-w-4xl hero-copy-enter"
          style={{ animationDelay: '0.05s' }}
        >
          Soto Servicios Inmobiliarios
        </p>

        <h1
          className="font-serif font-medium text-white/95 text-2xl md:text-4xl lg:text-[2.75rem] leading-snug tracking-tight max-w-2xl mb-5 hero-copy-enter"
          style={{ animationDelay: '0.2s' }}
        >
          Tu hogar en el barrio, con la familia Soto
        </h1>

        <p
          className="text-base md:text-lg text-white/75 font-sans font-light max-w-xl leading-relaxed mb-10 hero-copy-enter"
          style={{ animationDelay: '0.35s' }}
        >
          Más de 10 años acompañando a familias de Campanar, Benimaclet y Marxalenes
          a comprar, vender y alquilar con confianza.
        </p>

        <div
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 hero-copy-enter"
          style={{ animationDelay: '0.5s' }}
        >
          <Link
            to="/propiedades"
            className="inline-flex items-center justify-center gap-2 font-sans font-medium text-[0.9375rem] py-[0.9rem] px-7 rounded-md bg-white text-forest-800 transition-all duration-200 hover:bg-mist-100 hover:-translate-y-px"
          >
            Ver propiedades
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
          <Link to="/valoracion" className="btn-ghost-light justify-center">
            Valorar mi piso
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
