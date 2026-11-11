import { FC } from 'react';
import { Home } from 'lucide-react';

interface Step2TypeProps {
  data: {
    propertyType: string;
    operation: string;
    antiquity: string;
  };
  onChange: (field: string, value: string) => void;
  errors: Record<string, string>;
  onNext: () => void;
  onBack: () => void;
  isValid: boolean;
}

export const Step2Type: FC<Step2TypeProps> = ({
  data,
  onChange,
  errors,
  onNext,
  onBack,
  isValid,
}) => {
  const operations = ['Venta', 'Alquiler'];
  const antiquities = ['Obra nueva', 'Segunda mano'];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-8">
        <div className="bg-[#223e28] text-white rounded-full w-10 h-10 flex items-center justify-center font-semibold">
          3
        </div>
        <h2 className="text-2xl font-light text-gray-900">Información básica</h2>
      </div>

      <div className="flex items-center justify-center mb-6">
        <Home className="w-12 h-12 text-[#223e28]" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            ¿Quieres vender o alquilar? *
          </label>
          <select
            value={data.operation}
            onChange={(e) => onChange('operation', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#998675] focus:border-transparent transition-all ${
              errors.operation ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Selecciona una operación</option>
            {operations.map((op) => (
              <option key={op} value={op}>
                {op}
              </option>
            ))}
          </select>
          {errors.operation && <p className="text-red-500 text-sm mt-1">{errors.operation}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            ¿Obra nueva o segunda mano? *
          </label>
          <select
            value={data.antiquity}
            onChange={(e) => onChange('antiquity', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#998675] focus:border-transparent transition-all ${
              errors.antiquity ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Selecciona antigüedad</option>
            {antiquities.map((ant) => (
              <option key={ant} value={ant}>
                {ant}
              </option>
            ))}
          </select>
          {errors.antiquity && <p className="text-red-500 text-sm mt-1">{errors.antiquity}</p>}
        </div>
      </div>

      <div className="pt-6 flex gap-4 justify-between">
        <button
          onClick={onBack}
          className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        >
          Atrás
        </button>
        <button
          onClick={onNext}
          disabled={!isValid}
          className="flex-1 px-6 py-3 bg-[#223e28] text-white rounded-lg hover:bg-[#2d5236] transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};
