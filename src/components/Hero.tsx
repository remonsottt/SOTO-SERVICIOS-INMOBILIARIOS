import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin } from 'lucide-react';

const STATS = [
  { number: '250+', label: 'Propiedades vendidas' },
  { number: '10+',  label: 'Años en el barrio'   },
  { number: '4.5★', label: 'Reseñas en Google'    },
];

const Hero = () => {
  const navigate = useNavigate();
  const [propertyType, setPropertyType] = useState('Todos los tipos');
  const [location,     setLocation]     = useState('');
  const [maxPrice,     setMaxPrice]     = useState('Sin límite');
  const parallaxRef = useRef<HTMLDivElement>(null);
  const isMobile = useRef(typeof window !== 'undefined' && window.innerWidth < 768);

  useEffect(() => {
    if (isMobile.current) return;
    const onScroll = () => {
      if (parallaxRef.current) {
        parallaxRef.current.style.transform = `translateY(${window.scrollY * 0.35}px) scale(1.05)`;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (propertyType !== 'Todos los tipos') params.append('type', propertyType);
    if (location.trim())                     params.append('location', location.trim());
    if (maxPrice !== 'Sin límite') {
      const priceMap: Record<string, string> = {
        'Hasta 200.000€': '200000',
        'Hasta 300.000€': '300000',
        'Hasta 500.000€': '500000',
        'Más de 500.000€': '500000',
      };
      params.append('maxPrice', priceMap[maxPrice]);
    }
    navigate(`/propiedades${params.toString() ? `?${params}` : ''}`);
  };

  const inputClass =
    'w-full bg-white border border-sand-200 text-forest-900 placeholder-forest-900/35 rounded-xl px-4 py-3.5 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-forest-700/30 focus:border-forest-700 transition-colors duration-200';

  return (
    <section
      id="inicio"
      className="relative min-h-screen flex flex-col justify-end pb-20 md:pb-28 overflow-hidden"
      aria-label="Portada principal"
    >
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div ref={parallaxRef} className="absolute inset-0 will-change-transform" style={{ transform: 'scale(1.05)' }}>
          <img
            src="/assets/hero-valencia.png"
            alt=""
            className="w-full h-[115%] object-cover object-center"
            fetchPriority="high"
            loading="eager"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-forest-900/30 via-forest-900/50 to-forest-900/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-forest-900/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 w-full pt-36">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white/80 text-xs font-sans font-medium px-4 py-2 rounded-full mb-8 page-enter" style={{ animationDelay: '0.1s' }}>
          <span className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0 live-pulse" aria-hidden="true" />
          Inmobiliaria familiar en Valencia · +10 años
        </div>

        {/* Headline with text reveal */}
        <h1 className="text-display text-white mb-6 max-w-4xl">
          <span className="text-reveal">
            <span className="text-reveal-inner" style={{ animationDelay: '0.2s' }}>Tu hogar{' '}</span>
          </span>
          <span className="text-reveal">
            <span className="text-reveal-inner" style={{ animationDelay: '0.35s', color: '#d6c5b0' }}>
              perfecto
            </span>
          </span>
          <br />
          <span className="text-reveal">
            <span className="text-reveal-inner" style={{ animationDelay: '0.5s' }}>te espera</span>
          </span>
        </h1>

        <p className="text-lg md:text-xl text-white/75 font-sans font-light max-w-xl leading-relaxed mb-12 page-enter" style={{ animationDelay: '0.6s' }}>
          Más de 10 años acompañando a familias de Campanar, Benimaclet y Marxalenes a
          comprar, vender y alquilar con confianza.
        </p>

        {/* Search form */}
        <form
          onSubmit={handleSearch}
          className="bg-white/95 backdrop-blur-sm rounded-2xl p-5 md:p-6 shadow-glass max-w-4xl page-enter"
          aria-label="Buscador de propiedades"
          style={{ border: '1px solid rgba(255,255,255,0.3)', animationDelay: '0.7s' }}
        >
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_auto] gap-3 items-end">
            <div>
              <label htmlFor="hero-type" className="block text-xs font-medium font-sans text-forest-900/60 mb-1.5">
                Tipo
              </label>
              <select
                id="hero-type"
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className={inputClass}
              >
                <option>Todos los tipos</option>
                <option>Apartamento</option>
                <option>Casa</option>
                <option>Chalet</option>
                <option>Local Comercial</option>
              </select>
            </div>

            <div>
              <label htmlFor="hero-location" className="block text-xs font-medium font-sans text-forest-900/60 mb-1.5">
                Ubicación
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-900/35" aria-hidden="true" />
                <input
                  id="hero-location"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Valencia, España"
                  className={`${inputClass} pl-9`}
                />
              </div>
            </div>

            <div>
              <label htmlFor="hero-price" className="block text-xs font-medium font-sans text-forest-900/60 mb-1.5">
                Precio máximo
              </label>
              <select
                id="hero-price"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className={inputClass}
              >
                <option>Sin límite</option>
                <option>Hasta 200.000€</option>
                <option>Hasta 300.000€</option>
                <option>Hasta 500.000€</option>
                <option>Más de 500.000€</option>
              </select>
            </div>

            <button
              type="submit"
              className="btn-primary justify-center w-full md:w-auto whitespace-nowrap"
            >
              <Search className="w-4 h-4" aria-hidden="true" />
              Buscar
            </button>
          </div>
        </form>

        {/* Stats */}
        <div className="flex flex-wrap gap-8 md:gap-16 mt-12 page-enter" style={{ animationDelay: '0.9s' }}>
          {STATS.map(({ number, label }) => (
            <div key={label}>
              <p className="text-3xl md:text-4xl font-serif font-bold text-white leading-none mb-1">
                {number}
              </p>
              <p className="text-sm font-sans text-white/60">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-white/40 page-enter"
        aria-hidden="true"
        style={{ animationDelay: '1.2s' }}
      >
        <span className="text-xs font-sans tracking-widest uppercase">scroll</span>
        <span className="w-px h-10 bg-gradient-to-b from-white/40 to-transparent" />
      </div>
    </section>
  );
};

export default Hero;
