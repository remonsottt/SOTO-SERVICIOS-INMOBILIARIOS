import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, Home, MapPin, Calendar, Mail, Phone, Download, Share2, Copy, Check, MessageCircle, ChevronDown, ChevronUp, Info } from 'lucide-react';
import type { ValuationResult } from '../lib/localValuationEngine';
import { analytics } from '../lib/analytics';

const ValuationResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result as ValuationResult | null;
  const propertyData = location.state?.propertyData;

  const [copied, setCopied] = useState(false);
  const [showMethodology, setShowMethodology] = useState(false);

  useEffect(() => {
    if (!result) {
      navigate('/valuation');
      return;
    }
    analytics.trackValuationResultView({
      estimatedValue: result.estimatedValue,
      confidence: result.confidence,
      neighborhood: result.neighborhood,
      marketTrend: {
        trend_3m_pct: result.marketTrend.trend_3m_pct ?? undefined,
        trend_12m_pct: result.marketTrend.trend_12m_pct ?? undefined,
      },
    });
    analytics.trackPageView('valuation_result');
  }, [result, navigate]);

  if (!result) {
    return null;
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleCopy = () => {
    const summary = `Valoración de propiedad en ${result.neighborhood.area_name}, ${result.neighborhood.municipality}

Valor estimado: ${formatCurrency(result.estimatedValue)}
Rango: ${formatCurrency(result.valuationRange.min)} - ${formatCurrency(result.valuationRange.max)}
Precio por m²: ${formatCurrency(result.pricePerSqm)}

Soto Servicios Inmobiliarios
+34 961 07 99 63`;

    navigator.clipboard.writeText(summary);
    setCopied(true);
    analytics.trackResultShare('copy');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      `Hola 👋, acabo de realizar una valoración en vuestra web y me gustaría recibir más información sobre mi inmueble en ${result.neighborhood.area_name}.`
    );
    window.open(`https://wa.me/34691822053?text=${message}`, '_blank');
    analytics.trackValuationWhatsAppClick({
      area: result.neighborhood.area_name,
      market: propertyData?.market || 'venta',
      estimatedValue: result.estimatedValue,
    });
  };

  const displayTrend12 = (result.marketTrend.trend_3m_pct ?? 0) * 4;

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-light text-[#223e28] mb-2">
            Valoración de tu propiedad
          </h1>
          <p className="text-gray-600">
            Generada el {formatDate(result.timestamp)}
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8 border border-gray-100">
          <div className="bg-gradient-to-br from-[#223e28] to-[#2d5236] text-white p-12">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-6">
                  <MapPin className="w-6 h-6" />
                  <div>
                    <p className="text-xl font-light opacity-90">
                      {result.neighborhood.area_name}, {result.neighborhood.municipality}
                    </p>
                    {propertyData?.address && (
                      <p className="text-sm opacity-75">{propertyData.address}</p>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm opacity-75 mb-2">Valor estimado</p>
                  <p className="text-6xl font-light mb-2">
                    {formatCurrency(result.estimatedValue)}
                  </p>
                  <p className="text-lg opacity-90">
                    Rango: {formatCurrency(result.valuationRange.min)} - {formatCurrency(result.valuationRange.max)}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-lg opacity-90">
                    {formatCurrency(result.pricePerSqm)}/m²
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleCopy}
                  className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
                  title="Copiar resumen"
                >
                  {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </button>
                <button
                  onClick={() => window.print()}
                  className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
                  title="Descargar PDF"
                >
                  <Download className="w-5 h-5" />
                </button>
                {navigator.share && (
                  <button
                    onClick={() => {
                      navigator.share({
                        title: 'Valoración de propiedad',
                        text: `Valoración estimada: ${formatCurrency(result.estimatedValue)}`,
                      });
                      analytics.trackResultShare('share');
                    }}
                    className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
                    title="Compartir"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="p-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="bg-gray-50 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  {(result.marketTrend.trend_3m_pct ?? 0) >= 0 ? (
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  ) : (
                    <TrendingDown className="w-6 h-6 text-red-600" />
                  )}
                  <h3 className="text-lg font-semibold text-gray-900">Tendencia 3 meses</h3>
                </div>
                <p className={`text-3xl font-bold ${(result.marketTrend.trend_3m_pct ?? 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {(result.marketTrend.trend_3m_pct ?? 0) > 0 ? '+' : ''}{(result.marketTrend.trend_3m_pct ?? 0).toFixed(2)}%
                </p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  {displayTrend12 >= 0 ? (
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  ) : (
                    <TrendingDown className="w-6 h-6 text-red-600" />
                  )}
                  <h3 className="text-lg font-semibold text-gray-900">Tendencia 12 meses</h3>
                </div>
                <p className={`text-3xl font-bold ${displayTrend12 >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {displayTrend12 > 0 ? '+' : ''}{displayTrend12.toFixed(2)}%
                </p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Calendar className="w-6 h-6 text-[#223e28]" />
                  <h3 className="text-lg font-semibold text-gray-900">Días en mercado</h3>
                </div>
                <p className="text-3xl font-bold text-gray-900">
                  ~{result.neighborhood.dom_days} días
                </p>
              </div>
            </div>

            {result.comparables.sold.length > 0 && (
              <div className="mb-12">
                <h3 className="text-2xl font-semibold text-[#223e28] mb-6 flex items-center gap-3">
                  <Home className="w-6 h-6" />
                  Propiedades vendidas recientemente
                </h3>
                <div className="space-y-4">
                  {result.comparables.sold.slice(0, 3).map((comp, idx) => (
                    <div key={idx} className="flex items-center justify-between p-6 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 mb-1">
                          {comp.type} - {comp.built_sqm}m²
                        </p>
                        <p className="text-sm text-gray-600">
                          {comp.bedrooms} hab. • {comp.bathrooms} baños • {comp.area_name}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-[#223e28]">
                          {formatCurrency(comp.price_sold_eur)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatCurrency(comp.price_sold_eur / comp.built_sqm)}/m²
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => setShowMethodology(!showMethodology)}
              className="w-full flex items-center justify-between p-6 bg-gray-50 rounded-xl border border-gray-200 hover:border-[#223e28] transition-colors mb-8"
            >
              <div className="flex items-center gap-3">
                <Info className="w-6 h-6 text-[#223e28]" />
                <span className="text-lg font-semibold text-gray-900">Fuentes y metodología</span>
              </div>
              {showMethodology ? <ChevronUp className="w-5 h-5 text-gray-600" /> : <ChevronDown className="w-5 h-5 text-gray-600" />}
            </button>

            {showMethodology && (
              <div className="bg-gray-50 rounded-xl p-8 mb-8 space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Metodología de valoración</h4>
                  <p className="text-gray-700 mb-2">{result.methodology}</p>
                  <p className="text-sm text-gray-600">
                    Basado en {result.neighborhood.sample_size} transacciones en {result.neighborhood.area_name}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Fuentes de datos</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                    <li>Estadísticas agregadas por barrio (actualización mensual)</li>
                    <li>Transacciones históricas verificadas</li>
                    <li>Listings activos de mercado</li>
                    <li>Ajustes hedónicos por características</li>
                  </ul>
                </div>
              </div>
            )}

            <div className="border-t border-gray-200 pt-8">
              <p className="text-sm text-gray-600">
                Esta valoración es orientativa y se basa en datos agregados del mercado. Para una valoración precisa, contacta con nuestro equipo.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#223e28] to-[#2d5236] text-white rounded-3xl p-12">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-light mb-4">
              ¿Quieres una valoración más precisa?
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Agenda una visita gratuita con nuestro equipo de expertos locales
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-stretch sm:items-center">
              <button
                onClick={handleWhatsApp}
                className="inline-flex items-center justify-center gap-3 bg-[#25D366] text-white px-10 py-5 rounded-2xl text-lg font-semibold hover:bg-[#20BA5A] hover:scale-105 transition-all shadow-lg hover:shadow-xl"
              >
                <MessageCircle className="w-6 h-6" />
                Hablar por WhatsApp
              </button>
              <a
                href="tel:+34691822053"
                onClick={() => analytics.trackContactCTA('phone')}
                className="inline-flex items-center justify-center gap-3 bg-white text-[#223e28] px-8 py-5 rounded-2xl text-lg font-semibold hover:scale-105 transition-all shadow-lg hover:shadow-xl"
              >
                <Phone className="w-6 h-6" />
                +34 691 82 20 53
              </a>
              <a
                href="mailto:estudiomarxalenes@gmail.com"
                onClick={() => analytics.trackContactCTA('email')}
                className="inline-flex items-center justify-center gap-3 bg-white/10 text-white border-2 border-white px-8 py-5 rounded-2xl text-lg font-semibold hover:bg-white/20 transition-colors"
              >
                <Mail className="w-6 h-6" />
                Enviar email
              </a>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-600">
            <p>© 2024 Soto Servicios Inmobiliarios. Todos los derechos reservados.</p>
            <p>Más de 10 años en el barrio sirviendo a familias valencianas.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ValuationResultPage;
