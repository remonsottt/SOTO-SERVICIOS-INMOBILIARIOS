import { FC, useEffect, useState } from 'react';
import { MapPin } from 'lucide-react';
import { areaMappingService } from '../../lib/areaMapping';

interface Step2NeighborhoodProps {
  data: {
    neighborhood: string;
  };
  onChange: (field: string, value: string) => void;
  errors: Record<string, string>;
  onNext: () => void;
  onBack: () => void;
  isValid: boolean;
}

export const Step2Neighborhood: FC<Step2NeighborhoodProps> = ({
  data,
  onChange,
  errors,
  onNext,
  onBack,
  isValid,
}) => {
  const [availableBarrios, setAvailableBarrios] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBarrios = async () => {
      try {
        await areaMappingService.loadMappings();
        const barrios = areaMappingService.getUniqueAreas();
        setAvailableBarrios(barrios);
      } catch (error) {
        console.error('Error loading barrios:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBarrios();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-8">
        <div className="bg-[#223e28] text-white rounded-full w-10 h-10 flex items-center justify-center font-semibold">
          2
        </div>
        <h2 className="text-2xl font-light text-gray-900">Barrio</h2>
      </div>

      <div className="flex items-center justify-center mb-6">
        <MapPin className="w-12 h-12 text-[#223e28]" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          ¿En qué barrio se encuentra tu vivienda? *
        </label>
        <select
          value={data.neighborhood}
          onChange={(e) => onChange('neighborhood', e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#998675] focus:border-transparent transition-all bg-white ${
            errors.neighborhood ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={loading}
        >
          <option value="">
            {loading ? 'Cargando barrios...' : 'Selecciona un barrio'}
          </option>
          {availableBarrios.map((barrio) => (
            <option key={barrio} value={barrio}>
              {barrio}
            </option>
          ))}
        </select>
        {errors.neighborhood && <p className="text-red-500 text-sm mt-1">{errors.neighborhood}</p>}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
        <p className="text-sm text-blue-800">
          Selecciona el barrio donde se ubica tu vivienda. Esta información es clave para calcular una valoración precisa basada en datos de ventas recientes en la zona.
        </p>
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
