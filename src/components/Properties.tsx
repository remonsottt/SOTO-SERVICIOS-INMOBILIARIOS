import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MapPin, Bed, Bath, Square, Heart, Camera, X } from 'lucide-react';
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

  return (
    <section ref={sectionRef} id="propiedades" className="py-32 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-24 scroll-reveal">
          <h2 className="text-5xl font-light text-gray-900 mb-6 tracking-tight">
            Propiedades Destacadas
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto font-light leading-relaxed">
            Una selección cuidada de viviendas en Valencia y alrededores. Si quieres algo concreto, dinos qué buscas y lo filtramos contigo.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-20 scroll-reveal stagger-1">
          <button
            onClick={() => setActiveCategory('Todas')}
            className={`px-8 py-4 rounded-xl font-medium apple-button shadow-apple hover-lift transition-all duration-300 ${
              activeCategory === 'Todas'
                ? 'bg-[#223e28] text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-100'
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setActiveCategory('Apartamentos')}
            className={`px-8 py-4 rounded-xl font-medium apple-button shadow-apple hover-lift transition-all duration-300 ${
              activeCategory === 'Apartamentos'
                ? 'bg-[#223e28] text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-100'
            }`}
          >
            Apartamentos
          </button>
          <button
            onClick={() => setActiveCategory('Casas')}
            className={`px-8 py-4 rounded-xl font-medium apple-button shadow-apple hover-lift transition-all duration-300 ${
              activeCategory === 'Casas'
                ? 'bg-[#223e28] text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-100'
            }`}
          >
            Casas
          </button>
          <button
            onClick={() => setActiveCategory('Chalets')}
            className={`px-8 py-4 rounded-xl font-medium apple-button shadow-apple hover-lift transition-all duration-300 ${
              activeCategory === 'Chalets'
                ? 'bg-[#223e28] text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-100'
            }`}
          >
            Chalets
          </button>
        </div>

        {/* Active Search Filters */}
        {hasSearchFilters() && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8 flex items-center justify-between">
            <p className="text-blue-800 font-medium">
              Filtros aplicados a la búsqueda
            </p>
            <button
              onClick={clearSearchFilters}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all duration-300 font-medium flex items-center space-x-2"
            >
              <X className="w-4 h-4" />
              <span>Ver el resto de propiedades</span>
            </button>
          </div>
        )}

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[0, 1, 2].map((i) => (
              <div key={i} className="bg-white rounded-3xl overflow-hidden border border-gray-100">
                <div className="skeleton h-72 rounded-none" />
                <div className="p-8 space-y-4">
                  <div className="skeleton skeleton-text w-1/3" />
                  <div className="skeleton skeleton-title" />
                  <div className="flex gap-4">
                    <div className="skeleton skeleton-text w-12" />
                    <div className="skeleton skeleton-text w-12" />
                    <div className="skeleton skeleton-text w-12" />
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <div className="skeleton skeleton-text w-24 h-6" />
                    <div className="skeleton h-10 w-28 rounded-xl" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center max-w-2xl mx-auto">
            <p className="text-red-800 mb-4">{error}</p>
            <button
              onClick={loadProperties}
              className="bg-[#223e28] text-white px-6 py-3 rounded-xl hover:bg-[#28352b] transition-all duration-300 font-medium"
            >
              Reintentar
            </button>
          </div>
        )}

        {!loading && !error && filteredProperties.length === 0 && properties.length > 0 && (
          <div className="max-w-2xl mx-auto text-center py-20 px-6">
            <div className="bg-white rounded-3xl shadow-apple p-12 border border-gray-100">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                No disponemos ahora mismo de propiedades con estas características
              </h3>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Revisa el resto de nuestro catálogo o contacta con nosotros.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={clearSearchFilters}
                  className="bg-[#223e28] text-white px-8 py-4 rounded-xl hover:bg-[#28352b] transition-all duration-300 font-semibold shadow-apple hover-lift inline-flex items-center justify-center space-x-2"
                >
                  <span>Ver el resto de propiedades</span>
                </button>
                <button
                  onClick={() => navigate('/contacto')}
                  className="bg-white text-[#223e28] border-2 border-[#223e28] px-8 py-4 rounded-xl hover:bg-gray-50 transition-all duration-300 font-semibold shadow-apple hover-lift inline-flex items-center justify-center space-x-2"
                >
                  <span>Contactar</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {!loading && !error && properties.length === 0 && (
          <div className="max-w-2xl mx-auto text-center py-20 px-6">
            <div className="bg-white rounded-3xl shadow-apple p-12 border border-gray-100">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                No hemos encontrado inmuebles
              </h3>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Ahora mismo no disponemos de inmuebles con estas características.
                Contacta con nuestro equipo y te avisaremos cuando tengamos una oportunidad similar.
              </p>
              <button
                onClick={() => navigate('/contacto')}
                className="bg-[#223e28] text-white px-8 py-4 rounded-xl hover:bg-[#28352b] transition-all duration-300 font-semibold shadow-apple hover-lift inline-flex items-center space-x-2"
              >
                <span>Contactar con el equipo</span>
                <span>→</span>
              </button>
            </div>
          </div>
        )}

        {/* Properties Grid */}
        {!loading && !error && filteredProperties.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredProperties.map((property, index) => (
            <div key={property.id} className="bg-white rounded-3xl overflow-hidden border border-gray-100 property-card scroll-reveal">
              <div className="relative cursor-pointer overflow-hidden" onClick={() => navigate(`/propiedades/${property.slug}`)}>
                <img
                  src={property.images[0] || '/assets/property-fallback-premium.png'}
                  alt={`${property.title} - ${property.location} - ${property.area}m² ${property.beds} habitaciones`}
                  className="w-full h-72 object-cover property-img"
                  loading={index === 0 ? 'eager' : 'lazy'}
                  fetchPriority={index === 0 ? 'high' : 'auto'}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/assets/property-fallback-premium.png';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent property-overlay" />
                {property.featured && (
                  <div className="absolute top-6 left-6 bg-[#223e28] text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-apple">
                    Destacado
                  </div>
                )}
                <div className="absolute top-6 right-6 flex space-x-3">
                  <button className="bg-white/90 backdrop-blur-apple p-3 rounded-full hover:bg-white transition-all duration-300 shadow-apple">
                    <Heart className="w-5 h-5 text-gray-600" />
                  </button>
                  <div className="bg-white/90 backdrop-blur-apple px-4 py-2 rounded-full flex items-center space-x-2 shadow-apple">
                    <Camera className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-600">{property.photos}</span>
                  </div>
                </div>
              </div>
              
              <div className="p-8">
                <div className="flex items-center text-gray-500 mb-3">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="text-sm font-light">{property.location}</span>
                </div>
                
                <h3 className="text-xl font-medium text-gray-900 mb-4 line-clamp-2 leading-tight">
                  {property.title}
                </h3>
                
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-6 text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Bed className="w-4 h-4" />
                      <span className="text-sm font-light">{property.beds}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Bath className="w-4 h-4" />
                      <span className="text-sm font-light">{property.baths}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Square className="w-4 h-4" />
                      <span className="text-sm font-light">{property.area}m²</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-medium text-[#223e28] tracking-tight">
                    {property.price}
                  </div>
                  <button
                    onClick={() => navigate(`/propiedades/${property.slug}`)}
                    className="btn-primary text-sm py-2.5 px-5"
                  >
                    Ver Detalles
                  </button>
                </div>
              </div>
            </div>
            ))}
          </div>
        )}

        {!loading && !error && filteredProperties.length > 0 && (
          <div className="text-center mt-20 scroll-reveal">
            <button
              onClick={() => navigate('/propiedades')}
              className="bg-[#223e28] text-white px-12 py-4 rounded-xl hover:bg-[#28352b] transition-all duration-300 font-medium apple-button shadow-apple text-lg hover-lift"
            >
              Ver Todas las Propiedades
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Properties;
