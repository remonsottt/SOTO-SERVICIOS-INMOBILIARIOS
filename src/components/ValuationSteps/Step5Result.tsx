import { FC } from 'react';
import { CheckCircle, TrendingUp, MessageCircle } from 'lucide-react';
import { ValuationResult } from '../../lib/idealistaService';

interface Step5ResultProps {
  data: {
    street: string;
    number: string;
    postalCode: string;
    locality: string;
    propertyType: string;
    squareMetersConstructed: number;
    bedrooms: number;
    bathrooms: number;
    floor?: string;
    elevator: string;
  };
  valuation: ValuationResult;
  onReset: () => void;
  onContact: () => void;
}

export const Step5Result: FC<Step5ResultProps> = ({
  data,
  valuation,
  onReset,
  onContact,
}) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const addressSlug = `${data.street}-${data.number || 'sn'}-${data.postalCode}`.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 rounded-full p-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-[#223e28] mb-2">¡Tu valoración está lista!</h2>
        <p className="text-lg text-gray-600">
          Hemos analizado tu inmueble basándonos en datos reales del mercado de Valencia
        </p>
      </div>

      <div className="bg-gradient-to-br from-[#223e28] to-[#2d5236] rounded-2xl p-8 text-white shadow-lg">
        <p className="text-sm font-light opacity-90 mb-4">Valor estimado de tu inmueble</p>
        <div className="mb-8">
          <p className="text-5xl font-bold mb-2">
            {formatCurrency(valuation.estimateAvg)}
          </p>
          <p className="text-lg opacity-90">
            Rango: {formatCurrency(valuation.estimateMin)} - {formatCurrency(valuation.estimateMax)}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-white/20 pt-8">
          <div>
            <p className="text-sm opacity-75">Dirección</p>
            <p className="font-medium">
              {data.street} {data.number}
            </p>
          </div>
          <div>
            <p className="text-sm opacity-75">Tipo</p>
            <p className="font-medium">{data.propertyType}</p>
          </div>
          <div>
            <p className="text-sm opacity-75">Superficie</p>
            <p className="font-medium">{data.squareMetersConstructed} m²</p>
          </div>
          <div>
            <p className="text-sm opacity-75">Habitaciones</p>
            <p className="font-medium">
              {data.bedrooms}H / {data.bathrooms}B
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-[#998675]" />
          Resumen de tu propiedad
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex justify-between items-center pb-4 border-b border-gray-200">
            <span className="text-gray-600">Dirección completa</span>
            <span className="font-medium">
              {data.street} {data.number}, {data.postalCode}
            </span>
          </div>
          <div className="flex justify-between items-center pb-4 border-b border-gray-200">
            <span className="text-gray-600">Tipo de inmueble</span>
            <span className="font-medium">{data.propertyType}</span>
          </div>
          <div className="flex justify-between items-center pb-4 border-b border-gray-200">
            <span className="text-gray-600">Superficie</span>
            <span className="font-medium">{data.squareMetersConstructed} m²</span>
          </div>
          <div className="flex justify-between items-center pb-4 border-b border-gray-200">
            <span className="text-gray-600">Dormitorios / Baños</span>
            <span className="font-medium">
              {data.bedrooms} / {data.bathrooms}
            </span>
          </div>
          {data.floor && (
            <div className="flex justify-between items-center pb-4 border-b border-gray-200">
              <span className="text-gray-600">Planta</span>
              <span className="font-medium">{data.floor}</span>
            </div>
          )}
          <div className="flex justify-between items-center pb-4 border-b border-gray-200">
            <span className="text-gray-600">Ascensor</span>
            <span className="font-medium">{data.elevator}</span>
          </div>
        </div>

        <p className="text-sm text-gray-500 mt-6 italic">
          Esta estimación se basa en datos de mercado recientes en Valencia y puede variar según factores específicos de tu propiedad.
        </p>
      </div>

      {valuation.comps && valuation.comps.length > 0 && (
        <div className="bg-white rounded-2xl p-8 border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Propiedades comparables</h3>
          <div className="space-y-4">
            {valuation.comps.map((comp, index) => (
              <div key={index} className="flex justify-between items-center pb-4 border-b border-gray-100 last:border-0">
                <div>
                  <p className="font-medium text-gray-900">{comp.title}</p>
                  <p className="text-sm text-gray-500">{comp.area} m² • Venta: {comp.date}</p>
                </div>
                <p className="font-bold text-[#998675]">{formatCurrency(comp.price)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
        <p className="text-sm text-amber-900">
          <strong>Nota importante:</strong> Esta valoración es orientativa. Para una tasación oficial y precisa, te recomendamos contactar directamente con nuestro equipo de expertos.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <button
          onClick={onContact}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-[#223e28] text-white rounded-lg hover:bg-[#2d5236] transition-colors font-medium"
        >
          <CheckCircle className="w-5 h-5" />
          Quiero una valoración presencial
        </button>

        <a
          href={`https://wa.me/34615183675?text=Hola,%20quiero%20info%20sobre%20la%20valoración%20de%20${addressSlug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-[#998675] text-white rounded-lg hover:bg-[#a3956c] transition-colors font-medium"
        >
          <MessageCircle className="w-5 h-5" />
          Hablar por WhatsApp
        </a>
      </div>

      <button
        onClick={onReset}
        className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
      >
        Valorar otro inmueble
      </button>
    </div>
  );
};
