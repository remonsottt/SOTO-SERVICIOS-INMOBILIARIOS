import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Bed, Bath, Square, ChevronLeft, ChevronRight, Building2, Calendar, ArrowUp, Car, TreeDeciduous, CheckCircle2, Mail, Phone, User, MessageSquare, Check, Loader2, AlertCircle } from 'lucide-react';

import { propertyService, type Property } from '../services/propertyService';
import { contactService } from '../services/contactService';
import { SEO } from '../components/SEO';

const PropertyDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    acceptPolicy: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    loadProperty();
  }, [slug]);

  const loadProperty = async () => {
    if (!slug) return;

    try {
      setLoading(true);
      const data = await propertyService.getPropertyBySlug(slug);
      setProperty(data);
    } catch (err) {
      console.error('Error loading property:', err);
      setProperty(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#223e28] animate-spin" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen pt-32 pb-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-light text-gray-900 mb-6">Propiedad no encontrada</h1>
          <p className="text-lg text-gray-600 mb-8">
            Lo sentimos, la propiedad que buscas no está disponible.
          </p>
          <button
            onClick={() => navigate('/propiedades')}
            className="bg-[#223e28] text-white px-8 py-3 rounded-xl hover:bg-[#28352b] transition-all duration-300 font-medium"
          >
            Ver todas las propiedades
          </button>
        </div>
      </div>
    );
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  const getUTMParams = () => {
    const params = new URLSearchParams(window.location.search);
    return {
      utm_source: params.get('utm_source') || undefined,
      utm_medium: params.get('utm_medium') || undefined,
      utm_campaign: params.get('utm_campaign') || undefined,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!property) return;

    setIsSubmitting(true);

    try {
      const utmParams = getUTMParams();

      const referenceParts = [];
      if (property.title) referenceParts.push(property.title);
      if (property.location || property.neighborhood) {
        referenceParts.push(property.location || property.neighborhood);
      }
      if (property.slug) referenceParts.push(`slug:${property.slug}`);

      const propertyReference = referenceParts.join(' | ');

      const result = await contactService.submitContactForm({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message || `Solicito información sobre: ${propertyReference}`,
        origin: 'Propiedad',
        property_reference: propertyReference,
        page_url: window.location.href,
        utm: utmParams,
      });

      if (result.success) {
        navigate('/gracias');
      } else {
        setError(result.error || 'Error al enviar la solicitud');
      }
    } catch (err) {
      console.error('Property contact form error:', err);
      setError('Error al enviar la solicitud. Por favor, intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const isFormValid = formData.name && formData.email && formData.acceptPolicy && !isSubmitting;

  return (
    <>
      <SEO
        title={`${property.title} - Venta en ${property.location}`}
        description={property.description.substring(0, 155)}
        tags={[property.type, property.neighborhood, property.city, `${property.beds} habitaciones`, `${property.area}m²`]}
      />

      <div className="min-h-screen pt-24 pb-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <button
            onClick={() => navigate('/propiedades')}
            className="flex items-center text-gray-600 hover:text-[#223e28] mb-8 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Volver a propiedades
          </button>

          <div className="max-w-4xl mx-auto">
            <div>
              <div className="mb-8">
                <h1 className="text-4xl font-light text-gray-900 mb-4">{property.title}</h1>
                <div className="flex items-center text-gray-600 mb-4">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span className="text-lg">{property.location}</span>
                </div>
                <div className="flex items-center justify-between mb-6">
                  <div className="text-4xl font-medium text-[#223e28]">{property.price}</div>
                  <div className="flex items-center space-x-6 text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Square className="w-5 h-5" />
                      <span className="font-medium">{property.area}m²</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Bed className="w-5 h-5" />
                      <span className="font-medium">{property.beds}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Bath className="w-5 h-5" />
                      <span className="font-medium">{property.baths}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative mb-12 md:mb-16">
                <div className="relative h-[300px] md:h-[500px] rounded-2xl overflow-hidden">
                  <img
                    src={property.images[currentImageIndex] || '/assets/property-fallback-premium.png'}
                    alt={`${property.title} - Imagen ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/assets/property-fallback-premium.png';
                    }}
                  />
                  {property.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-3 rounded-full hover:bg-white transition-all shadow-lg"
                      >
                        <ChevronLeft className="w-6 h-6 text-gray-800" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-3 rounded-full hover:bg-white transition-all shadow-lg"
                      >
                        <ChevronRight className="w-6 h-6 text-gray-800" />
                      </button>
                    </>
                  )}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm">
                    {currentImageIndex + 1} / {property.images.length}
                  </div>
                </div>

                {property.images.length > 1 && (
                  <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                    {property.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden border-2 transition-all ${
                          index === currentImageIndex ? 'border-[#223e28]' : 'border-transparent'
                        }`}
                      >
                        <img
                          src={image || '/assets/property-fallback-premium.png'}
                          alt={`Miniatura ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/assets/property-fallback-premium.png';
                          }}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="mb-12 md:mb-16">
                <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-6">Detalles del inmueble</h2>
                <div className="bg-gray-50 rounded-2xl p-6 md:p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center space-x-3">
                      <Building2 className="w-5 h-5 text-[#223e28]" />
                      <div>
                        <div className="text-sm text-gray-500">Tipo</div>
                        <div className="font-medium text-gray-900">{property.type}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Square className="w-5 h-5 text-[#223e28]" />
                      <div>
                        <div className="text-sm text-gray-500">Superficie construida</div>
                        <div className="font-medium text-gray-900">{property.area} m²</div>
                      </div>
                    </div>
                    {property.usefulArea && (
                      <div className="flex items-center space-x-3">
                        <Square className="w-5 h-5 text-[#223e28]" />
                        <div>
                          <div className="text-sm text-gray-500">Superficie útil</div>
                          <div className="font-medium text-gray-900">{property.usefulArea} m²</div>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center space-x-3">
                      <Bed className="w-5 h-5 text-[#223e28]" />
                      <div>
                        <div className="text-sm text-gray-500">Habitaciones</div>
                        <div className="font-medium text-gray-900">{property.beds}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Bath className="w-5 h-5 text-[#223e28]" />
                      <div>
                        <div className="text-sm text-gray-500">Baños</div>
                        <div className="font-medium text-gray-900">{property.baths}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle2 className="w-5 h-5 text-[#223e28]" />
                      <div>
                        <div className="text-sm text-gray-500">Estado</div>
                        <div className="font-medium text-gray-900">{property.state}</div>
                      </div>
                    </div>
                    {property.floor && (
                      <div className="flex items-center space-x-3">
                        <Building2 className="w-5 h-5 text-[#223e28]" />
                        <div>
                          <div className="text-sm text-gray-500">Planta</div>
                          <div className="font-medium text-gray-900">{property.floor}</div>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center space-x-3">
                      <ArrowUp className="w-5 h-5 text-[#223e28]" />
                      <div>
                        <div className="text-sm text-gray-500">Ascensor</div>
                        <div className="font-medium text-gray-900">{property.elevator ? 'Sí' : 'No'}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Car className="w-5 h-5 text-[#223e28]" />
                      <div>
                        <div className="text-sm text-gray-500">Plaza de garaje</div>
                        <div className="font-medium text-gray-900">{property.garage ? 'Sí' : 'No'}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <TreeDeciduous className="w-5 h-5 text-[#223e28]" />
                      <div>
                        <div className="text-sm text-gray-500">Terraza/Balcón</div>
                        <div className="font-medium text-gray-900">{property.terrace ? 'Sí' : 'No'}</div>
                      </div>
                    </div>
                    {property.yearBuilt && (
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-5 h-5 text-[#223e28]" />
                        <div>
                          <div className="text-sm text-gray-500">Año de construcción</div>
                          <div className="font-medium text-gray-900">{property.yearBuilt}</div>
                        </div>
                      </div>
                    )}
                    {property.energyCertificate && (
                      <div className="flex items-center space-x-3">
                        <CheckCircle2 className="w-5 h-5 text-[#223e28]" />
                        <div>
                          <div className="text-sm text-gray-500">Certificado energético</div>
                          <div className="font-medium text-gray-900">{property.energyCertificate}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-12 md:mb-16">
                <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-6">Descripción</h2>
                <p className="text-gray-600 text-base md:text-lg leading-loose md:leading-relaxed whitespace-pre-line">
                  {property.description}
                </p>
              </div>

              {property.features.length > 0 && (
                <div className="mb-12 md:mb-16">
                  <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-6">Características</h2>
                  <div className="flex flex-wrap gap-3">
                    {property.features.map((feature, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center bg-gray-50 text-gray-700 px-4 py-2 rounded-full text-sm border border-gray-200"
                      >
                        <Check className="w-4 h-4 mr-2 text-[#223e28]" />
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-12 md:mb-16">
                <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-6">Zona</h2>
                <p className="text-gray-600 text-base md:text-lg leading-relaxed">
                  {property.neighborhood} es una de las zonas más destacadas de {property.city},
                  perfectamente comunicada y con todos los servicios necesarios. La zona cuenta con
                  excelentes conexiones de transporte público, supermercados, colegios, centros de salud
                  y una amplia oferta de ocio y restauración.
                </p>
              </div>

              <div id="contact-form" className="bg-gray-50 rounded-2xl p-6 md:p-8">
                <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-6">Más información sobre este inmueble</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <p className="text-red-800 text-sm">{error}</p>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre y apellidos *
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#223e28] focus:border-transparent transition-all"
                          placeholder="Tu nombre completo"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#223e28] focus:border-transparent transition-all"
                          placeholder="tu@email.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Teléfono
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#223e28] focus:border-transparent transition-all"
                          placeholder="600 000 000"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mensaje
                      </label>
                      <div className="relative">
                        <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          rows={4}
                          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#223e28] focus:border-transparent transition-all resize-none"
                          placeholder="Me gustaría recibir más información sobre esta propiedad..."
                        />
                      </div>
                    </div>

                    <div className="flex items-start">
                      <input
                        type="checkbox"
                        name="acceptPolicy"
                        checked={formData.acceptPolicy}
                        onChange={handleChange}
                        required
                        className="mt-1 w-4 h-4 text-[#223e28] border-gray-300 rounded focus:ring-[#223e28]"
                      />
                      <label className="ml-3 text-sm text-gray-600">
                        He leído y acepto la{' '}
                        <a href="/es/privacidad" target="_blank" rel="noopener noreferrer" className="text-[#223e28] hover:underline">
                          Política de Privacidad
                        </a>{' '}
                        *
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={!isFormValid}
                      className="w-full bg-[#223e28] text-white px-8 py-4 rounded-xl hover:bg-[#28352b] transition-all duration-300 font-medium disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Enviando...</span>
                        </>
                      ) : (
                        'Enviar solicitud'
                      )}
                    </button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default PropertyDetailPage;
