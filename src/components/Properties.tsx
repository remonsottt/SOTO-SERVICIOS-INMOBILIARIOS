import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MapPin, Bed, Bath, Square, Camera, X } from 'lucide-react';
import { propertyService, type Property } from '../services/propertyService';

interface PropertiesProps {
  featuredOnly?: boolean;
}

const Properties: React.FC<PropertiesProps> = ({ featuredOnly = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const sectionRef = useRef<HTMLElement>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('Todas');

  useEffect(() => {
    loadProperties();
  }, [featuredOnly]);

  // IntersectionObserver for property cards
  useEffect(() => {
    if (loading || !sectionRef.current || properties.length === 0) {
      return;
    }

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe all scroll-reveal elements within this section
    const revealElements = sectionRef.current.querySelectorAll('.scroll-reveal');
    revealElements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, [properties, loading]);

  const loadProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = featuredOnly
        ? await propertyService.getFeaturedProperties()
        : await propertyService.getAllProperties();
      setProperties(data);
    } catch (err) {
      console.error('Error loading properties:', err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredProperties = () => {
    let filtered = [...properties];

    const searchParams = new URLSearchParams(location.search);
    const typeParam = searchParams.get('type');
    const locationParam = searchParams.get('location');
    const maxPriceParam = searchParams.get('maxPrice');

    if (typeParam) {
      filtered = filtered.filter(property =>
        property.type?.toLowerCase().includes(typeParam.toLowerCase())
      );
    }

    if (locationParam) {
      filtered = filtered.filter(property =>
        property.location?.toLowerCase().includes(locationParam.toLowerCase()) ||
        property.neighborhood?.toLowerCase().includes(locationParam.toLowerCase())
      );
    }

    if (maxPriceParam) {
      const maxPrice = parseInt(maxPriceParam);
      filtered = filtered.filter(property => {
        const price = parseInt(property.price.replace(/\./g, '').replace('€', '').trim());
        return price <= maxPrice;
      });
    }

    if (activeCategory !== 'Todas') {
      if (activeCategory === 'Apartamentos') {
        filtered = filtered.filter(property =>
          property.type?.toLowerCase().includes('piso') ||
          property.type?.toLowerCase().includes('apartamento')
        );
      } else if (activeCategory === 'Casas') {
        filtered = filtered.filter(property =>
          property.type?.toLowerCase().includes('casa')
        );
      } else if (activeCategory === 'Chalets') {
        filtered = filtered.filter(property =>
          property.type?.toLowerCase().includes('chalet')
        );
      }
    }

    return filtered;
  };

  const hasSearchFilters = () => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.has('type') || searchParams.has('location') || searchParams.has('maxPrice');
  };

  const clearSearchFilters = () => {
    navigate('/propiedades');
  };

  const filteredProperties = getFilteredProperties();

  const categories = ['Todas', 'Apartamentos', 'Casas', 'Chalets'] as const;

  return (
    <section ref={sectionRef} id="propiedades" className="py-24 md:py-32 section-mist">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-3xl mb-14 md:mb-20 scroll-reveal">
          <h2 className="text-display-sm text-forest-900 mb-5">
            Propiedades destacadas
          </h2>
          <p className="text-lg md:text-xl text-mist-600 font-sans font-light leading-relaxed">
            Una selección cuidada de viviendas en Valencia y alrededores. Si quieres algo concreto, dinos qué buscas y lo filtramos contigo.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-12 md:mb-16 scroll-reveal stagger-1" role="tablist" aria-label="Filtrar por tipo">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2.5 rounded-md font-sans text-sm font-medium transition-colors duration-200 ${
                activeCategory === category
                  ? 'bg-forest-700 text-white'
                  : 'bg-transparent text-mist-700 border border-forest-100 hover:border-forest-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {hasSearchFilters() && (
          <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-forest-100 bg-white/60 px-5 py-4 rounded-md">
            <p className="text-forest-800 font-medium font-sans text-sm">
              Filtros aplicados a la búsqueda
            </p>
            <button
              onClick={clearSearchFilters}
              className="inline-flex items-center gap-2 text-sm font-medium text-forest-700 hover:text-forest-900"
            >
              <X className="w-4 h-4" />
              Ver el resto de propiedades
            </button>
          </div>
        )}

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {[0, 1, 2].map((i) => (
              <div key={i} className="overflow-hidden">
                <div className="skeleton h-72 rounded-none" />
                <div className="pt-5 space-y-3">
                  <div className="skeleton skeleton-text w-1/3" />
                  <div className="skeleton skeleton-title" />
                  <div className="flex gap-4">
                    <div className="skeleton skeleton-text w-12" />
                    <div className="skeleton skeleton-text w-12" />
                    <div className="skeleton skeleton-text w-12" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="border border-red-200 bg-red-50/80 p-8 text-center max-w-2xl mx-auto rounded-md">
            <p className="text-red-800 mb-4">{error}</p>
            <button onClick={loadProperties} className="btn-primary">
              Reintentar
            </button>
          </div>
        )}

        {!loading && !error && filteredProperties.length === 0 && properties.length > 0 && (
          <div className="max-w-2xl mx-auto text-center py-16 px-6">
            <MapPin className="w-10 h-10 text-mist-400 mx-auto mb-6" />
            <h3 className="font-serif text-2xl font-semibold text-forest-900 mb-4">
              No disponemos ahora mismo de propiedades con estas características
            </h3>
            <p className="text-lg text-mist-600 mb-8 leading-relaxed font-light">
              Revisa el resto de nuestro catálogo o contacta con nosotros.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button onClick={clearSearchFilters} className="btn-primary justify-center">
                Ver el resto de propiedades
              </button>
              <button
                onClick={() => navigate('/contacto')}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-md border border-forest-700 text-forest-700 font-medium"
              >
                Contactar
              </button>
            </div>
          </div>
        )}

        {!loading && !error && properties.length === 0 && (
          <div className="max-w-2xl mx-auto text-center py-16 px-6">
            <MapPin className="w-10 h-10 text-mist-400 mx-auto mb-6" />
            <h3 className="font-serif text-2xl font-semibold text-forest-900 mb-4">
              No hemos encontrado inmuebles
            </h3>
            <p className="text-lg text-mist-600 mb-8 leading-relaxed font-light">
              Ahora mismo no disponemos de inmuebles con estas características.
              Contacta con nuestro equipo y te avisaremos cuando tengamos una oportunidad similar.
            </p>
            <button onClick={() => navigate('/contacto')} className="btn-primary">
              Contactar con el equipo →
            </button>
          </div>
        )}

        {!loading && !error && filteredProperties.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12">
            {filteredProperties.map((property, index) => (
              <article
                key={property.id}
                className="property-card group cursor-pointer scroll-reveal"
                onClick={() => navigate(`/propiedades/${property.slug}`)}
              >
                <div className="relative overflow-hidden mb-5">
                  <img
                    src={property.images[0] || '/assets/property-fallback-premium.webp'}
                    alt={`${property.title} - ${property.location} - ${property.area}m² ${property.beds} habitaciones`}
                    className="w-full h-72 object-cover property-img"
                    loading={index === 0 ? 'eager' : 'lazy'}
                    fetchPriority={index === 0 ? 'high' : 'auto'}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/assets/property-fallback-premium.webp';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-900/30 to-transparent property-overlay" />
                  {property.featured && (
                    <span className="absolute top-4 left-4 bg-forest-800/90 text-white text-xs font-medium tracking-wide uppercase px-3 py-1.5 rounded-sm">
                      Destacado
                    </span>
                  )}
                  <div className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-white/90 text-mist-700 text-xs font-medium px-2.5 py-1.5 rounded-sm">
                    <Camera className="w-3.5 h-3.5" />
                    {property.photos}
                  </div>
                </div>

                <div className="flex items-center text-mist-500 mb-2">
                  <MapPin className="w-3.5 h-3.5 mr-1.5" />
                  <span className="text-sm font-light">{property.location}</span>
                </div>

                <h3 className="font-serif text-xl font-semibold text-forest-900 mb-3 line-clamp-2 leading-snug group-hover:text-forest-700 transition-colors">
                  {property.title}
                </h3>

                <div className="flex items-center gap-5 text-mist-600 mb-5">
                  <span className="inline-flex items-center gap-1.5 text-sm font-light">
                    <Bed className="w-4 h-4" /> {property.beds}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-sm font-light">
                    <Bath className="w-4 h-4" /> {property.baths}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-sm font-light">
                    <Square className="w-4 h-4" /> {property.area}m²
                  </span>
                </div>

                <div className="flex items-center justify-between border-t border-forest-100 pt-4">
                  <p className="font-serif text-2xl font-semibold text-forest-800 tracking-tight">
                    {property.price}
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/propiedades/${property.slug}`);
                    }}
                    className="text-sm font-medium text-forest-700 link-animated"
                  >
                    Ver detalles
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        {!loading && !error && filteredProperties.length > 0 && (
          <div className="mt-16 md:mt-20 scroll-reveal">
            <button onClick={() => navigate('/propiedades')} className="btn-primary">
              Ver todas las propiedades
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Properties;
