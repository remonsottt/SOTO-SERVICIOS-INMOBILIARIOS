import { FC } from 'react';

interface Step1AddressProps {
  data: {
    street: string;
    number: string;
    noNumber: boolean;
    postalCode: string;
    locality: string;
    neighborhood: string;
    province: string;
  };
  onChange: (field: string, value: string | boolean) => void;
  errors: Record<string, string>;
  onNext: () => void;
  onBack?: () => void;
  isValid: boolean;
}

export const Step1Address: FC<Step1AddressProps> = ({
  data,
  onChange,
  errors,
  onNext,
  onBack,
  isValid,
}) => {

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-8">
        <div className="bg-[#223e28] text-white rounded-full w-10 h-10 flex items-center justify-center font-semibold">
          1
        </div>
        <h2 className="text-2xl font-light text-gray-900">Dirección del inmueble</h2>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Calle *
        </label>
        <input
          type="text"
          value={data.street}
          onChange={(e) => onChange('street', e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#998675] focus:border-transparent transition-all ${
            errors.street ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Ej: Av. de Burjassot"
        />
        {errors.street && <p className="text-red-500 text-sm mt-1">{errors.street}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Número {data.noNumber && '(opcional)'}
          </label>
          <input
            type="text"
            value={data.number}
            onChange={(e) => onChange('number', e.target.value)}
            disabled={data.noNumber}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#998675] focus:border-transparent transition-all disabled:bg-gray-100"
            placeholder="Ej: 29"
          />
        </div>

        <div className="flex items-end">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={data.noNumber}
              onChange={(e) => onChange('noNumber', e.target.checked)}
              className="w-4 h-4 text-[#998675] border-gray-300 rounded focus:ring-2 focus:ring-[#998675]"
            />
            <span className="text-sm text-gray-600">Sin número</span>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Código Postal *
          </label>
          <input
            type="text"
            value={data.postalCode}
            onChange={(e) => onChange('postalCode', e.target.value.replace(/[^\d]/g, '').slice(0, 5))}
            maxLength={5}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#998675] focus:border-transparent transition-all ${
              errors.postalCode ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="46009"
          />
          {errors.postalCode && <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Localidad *
          </label>
          <input
            type="text"
            value={data.locality}
            onChange={(e) => onChange('locality', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#998675] focus:border-transparent transition-all bg-gray-50"
            placeholder="Valencia"
            readOnly
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Provincia *
        </label>
        <input
          type="text"
          value={data.province}
          onChange={(e) => onChange('province', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#998675] focus:border-transparent transition-all bg-gray-50"
          placeholder="Valencia"
          readOnly
        />
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
