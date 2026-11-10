import { FC } from 'react';
import { AlertCircle } from 'lucide-react';

interface Step4ContactProps {
  data: {
    name: string;
    email: string;
    phone: string;
    saleTimeline: string;
    gdprConsent: boolean;
  };
  onChange: (field: string, value: string | boolean) => void;
  errors: Record<string, string>;
  onNext: () => void;
  onBack: () => void;
  isValid: boolean;
  isLoading: boolean;
}

export const Step4Contact: FC<Step4ContactProps> = ({
  data,
  onChange,
  errors,
  onNext,
  onBack,
  isValid,
  isLoading,
}) => {
  const timelines = [
    'Inmediatamente',
    '1–3 meses',
    '3–6 meses',
    '6–12 meses',
    '>12 meses',
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-8">
        <div className="bg-[#223e28] text-white rounded-full w-10 h-10 flex items-center justify-center font-semibold">
          5
        </div>
        <h2 className="text-2xl font-light text-gray-900">Tus datos de contacto</h2>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nombre y apellidos *
        </label>
        <input
          type="text"
          value={data.name}
          onChange={(e) => onChange('name', e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#998675] focus:border-transparent transition-all ${
            errors.name ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Juan García López"
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email *
        </label>
        <input
          type="email"
          value={data.email}
          onChange={(e) => onChange('email', e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#998675] focus:border-transparent transition-all ${
            errors.email ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="correo@ejemplo.com"
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Teléfono *
        </label>
        <input
          type="tel"
          value={data.phone}
          onChange={(e) => onChange('phone', e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#998675] focus:border-transparent transition-all ${
            errors.phone ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="+34 612 345 678"
        />
        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Plazo de venta previsto *
        </label>
        <select
          value={data.saleTimeline}
          onChange={(e) => onChange('saleTimeline', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#998675] focus:border-transparent transition-all"
        >
          <option value="">Selecciona plazo</option>
          {timelines.map((timeline) => (
            <option key={timeline} value={timeline}>
              {timeline}
            </option>
          ))}
        </select>
        {errors.saleTimeline && <p className="text-red-500 text-sm mt-1">{errors.saleTimeline}</p>}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-blue-800">
          Tus datos se guardarán de forma segura y solo se utilizarán para facilitarte la valoración.
        </p>
      </div>

      <label className="flex items-start space-x-3 cursor-pointer">
        <input
          type="checkbox"
          checked={data.gdprConsent}
          onChange={(e) => onChange('gdprConsent', e.target.checked)}
          className="w-5 h-5 text-[#998675] border-gray-300 rounded focus:ring-2 focus:ring-[#998675] mt-1"
        />
        <span className="text-sm text-gray-700">
          Acepto que Soto Servicios Inmobiliarios me contacte para facilitarme la valoración y asesoramiento. *
        </span>
      </label>
      {errors.gdprConsent && <p className="text-red-500 text-sm">{errors.gdprConsent}</p>}

      <div className="pt-6 flex gap-4 justify-between">
        <button
          onClick={onBack}
          disabled={isLoading}
          className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          Atrás
        </button>
        <button
          onClick={onNext}
          disabled={!isValid || isLoading}
          className="flex-1 px-6 py-3 bg-[#223e28] text-white rounded-lg hover:bg-[#2d5236] transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
          {isLoading ? 'Calculando...' : 'Calcular valoración'}
        </button>
      </div>
    </div>
  );
};
