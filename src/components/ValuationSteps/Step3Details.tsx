import { FC } from 'react';
import { X, Plus } from 'lucide-react';

interface Step3DetailsProps {
  data: {
    squareMetersConstructed: number;
    squareMetersUseful: number;
    bedrooms: number;
    bathrooms: number;
    floor: string;
    elevator: string;
    garage: string;
    terrace: string;
    yearBuilt: number;
    conservationState: string;
    others: string[];
  };
  onChange: (field: string, value: string | number | string[]) => void;
  errors: Record<string, string>;
  onNext: () => void;
  onBack: () => void;
  isValid: boolean;
}

export const Step3Details: FC<Step3DetailsProps> = ({
  data,
  onChange,
  errors,
  onNext,
  onBack,
  isValid,
}) => {
  const [otherInput, setOtherInput] = React.useState('');

  const addOther = () => {
    if (otherInput.trim() && !data.others.includes(otherInput.trim())) {
      onChange('others', [...data.others, otherInput.trim()]);
      setOtherInput('');
    }
  };

  const removeOther = (index: number) => {
    onChange('others', data.others.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-8">
        <div className="bg-[#223e28] text-white rounded-full w-10 h-10 flex items-center justify-center font-semibold">
          4
        </div>
        <h2 className="text-2xl font-light text-gray-900">Detalles del piso</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Superficie construida (m²) *
          </label>
          <input
            type="number"
            min="1"
            value={data.squareMetersConstructed || ''}
            onChange={(e) => onChange('squareMetersConstructed', parseFloat(e.target.value) || 0)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#998675] focus:border-transparent transition-all ${
              errors.squareMetersConstructed ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="100"
          />
          {errors.squareMetersConstructed && (
            <p className="text-red-500 text-sm mt-1">{errors.squareMetersConstructed}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Superficie útil (m²)
          </label>
          <input
            type="number"
            min="0"
            value={data.squareMetersUseful || ''}
            onChange={(e) => onChange('squareMetersUseful', parseFloat(e.target.value) || 0)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#998675] focus:border-transparent transition-all"
            placeholder="90"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dormitorios *
          </label>
          <input
            type="number"
            min="0"
            value={data.bedrooms || ''}
            onChange={(e) => onChange('bedrooms', parseInt(e.target.value) || 0)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#998675] focus:border-transparent transition-all ${
              errors.bedrooms ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="3"
          />
          {errors.bedrooms && <p className="text-red-500 text-sm mt-1">{errors.bedrooms}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Baños *
          </label>
          <input
            type="number"
            min="0"
            value={data.bathrooms || ''}
            onChange={(e) => onChange('bathrooms', parseInt(e.target.value) || 0)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#998675] focus:border-transparent transition-all ${
              errors.bathrooms ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="2"
          />
          {errors.bathrooms && <p className="text-red-500 text-sm mt-1">{errors.bathrooms}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Planta
          </label>
          <input
            type="text"
            value={data.floor}
            onChange={(e) => onChange('floor', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#998675] focus:border-transparent transition-all"
            placeholder="4"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Año de construcción
          </label>
          <input
            type="number"
            min="1800"
            max={new Date().getFullYear()}
            value={data.yearBuilt || ''}
            onChange={(e) => onChange('yearBuilt', parseInt(e.target.value) || 0)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#998675] focus:border-transparent transition-all"
            placeholder="1995"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Ascensor *
          </label>
          <select
            value={data.elevator}
            onChange={(e) => onChange('elevator', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#998675] focus:border-transparent transition-all"
          >
            <option value="">Selecciona</option>
            <option value="Sí">Sí</option>
            <option value="No">No</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Plaza de garaje *
          </label>
          <select
            value={data.garage}
            onChange={(e) => onChange('garage', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#998675] focus:border-transparent transition-all"
          >
            <option value="">Selecciona</option>
            <option value="Sí">Sí</option>
            <option value="No">No</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Terraza/Balcón *
          </label>
          <select
            value={data.terrace}
            onChange={(e) => onChange('terrace', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#998675] focus:border-transparent transition-all"
          >
            <option value="">Selecciona</option>
            <option value="Sí">Sí</option>
            <option value="No">No</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Estado de conservación *
        </label>
        <select
          value={data.conservationState}
          onChange={(e) => onChange('conservationState', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#998675] focus:border-transparent transition-all"
        >
          <option value="">Selecciona</option>
          <option value="Excelente">Excelente</option>
          <option value="Bueno">Bueno</option>
          <option value="A reformar">A reformar</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Otros (extras y características)
        </label>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={otherInput}
            onChange={(e) => setOtherInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addOther())}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#998675] focus:border-transparent transition-all"
            placeholder="Ej: A/A, Calefacción, Piscina..."
          />
          <button
            onClick={addOther}
            className="px-4 py-3 bg-[#223e28] text-white rounded-lg hover:bg-[#2d5236] transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {data.others.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
            >
              {tag}
              <button
                onClick={() => removeOther(index)}
                className="hover:text-red-500"
              >
                <X className="w-4 h-4" />
              </button>
            </span>
          ))}
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

import React from 'react';
