import { useState, useCallback, useMemo, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Step1Address } from './ValuationSteps/Step1Address';
import { Step2Neighborhood } from './ValuationSteps/Step2Neighborhood';
import { Step2Type } from './ValuationSteps/Step2Type';
import { Step3Details } from './ValuationSteps/Step3Details';
import { Step4Contact } from './ValuationSteps/Step4Contact';
import { valuationEngine, PropertyData } from '../lib/localValuationEngine';
import { valuationService, LeadData } from '../services/valuationService';
import { antispamService } from '../lib/antispamService';
import { analytics } from '../lib/analytics';

interface FormData {
  street: string;
  number: string;
  noNumber: boolean;
  postalCode: string;
  locality: string;
  neighborhood: string;
  province: string;
  propertyType: string;
  operation: string;
  antiquity: string;
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
  name: string;
  email: string;
  phone: string;
  saleTimeline: string;
  gdprConsent: boolean;
  honeypot: string;
}

const DEMO_DATA: Partial<FormData> = {
  street: 'Av. de Burjassot',
  number: '29',
  noNumber: false,
  postalCode: '46009',
  locality: 'València',
  neighborhood: 'Campanar',
  province: 'València',
  propertyType: 'Piso',
  operation: 'Venta',
  antiquity: 'Segunda mano',
  squareMetersConstructed: 98,
  squareMetersUseful: 88,
  bedrooms: 3,
  bathrooms: 2,
  floor: '4',
  elevator: 'Sí',
  garage: 'Sí',
  terrace: 'Sí',
  yearBuilt: 1995,
  conservationState: 'Bueno',
  others: ['Calefacción', 'A/A'],
  name: 'Demo Usuario',
  email: 'demo@example.com',
  phone: '+34 612 345 678',
  saleTimeline: '1–3 meses',
  gdprConsent: true,
};

const STEPS = [
  { label: 'Dirección', id: 'address' },
  { label: 'Barrio', id: 'neighborhood' },
  { label: 'Información', id: 'info' },
  { label: 'Detalles', id: 'details' },
  { label: 'Tus datos', id: 'contact' },
];

export const ValuationWidget = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    analytics.trackValuationStepView(currentStep, STEPS[currentStep]?.label || 'unknown');
  }, [currentStep]);
  const [formData, setFormData] = useState<FormData>({
    street: '',
    number: '',
    noNumber: false,
    postalCode: '',
    locality: 'València',
    neighborhood: '',
    province: 'València',
    propertyType: 'Piso',
    operation: '',
    antiquity: '',
    squareMetersConstructed: 0,
    squareMetersUseful: 0,
    bedrooms: 0,
    bathrooms: 0,
    floor: '',
    elevator: '',
    garage: '',
    terrace: '',
    yearBuilt: 0,
    conservationState: '',
    others: [],
    name: '',
    email: '',
    phone: '',
    saleTimeline: '',
    gdprConsent: false,
    honeypot: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [, setExpandedStep] = useState<number | null>(null);

  const validateStep1 = useCallback((showAllErrors = false): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.street || formData.street.length < 3) {
      newErrors.street = 'La calle debe tener al menos 3 caracteres';
    }

    if (!formData.noNumber && !formData.number) {
      newErrors.number = 'Especifica el número o marca "Sin número"';
    }

    if (!formData.postalCode || !/^\d{5}$/.test(formData.postalCode)) {
      newErrors.postalCode = 'Código postal válido (5 dígitos)';
    }

    if (!formData.locality) {
      newErrors.locality = 'La localidad es requerida';
    }

    if (!showAllErrors) {
      const filteredErrors: Record<string, string> = {};
      Object.keys(newErrors).forEach(key => {
        if (touchedFields.has(key)) {
          filteredErrors[key] = newErrors[key];
        }
      });
      setErrors(filteredErrors);
      return Object.keys(newErrors).length === 0;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, touchedFields]);

  const validateStep2 = useCallback((showAllErrors = false): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.neighborhood) {
      newErrors.neighborhood = 'El barrio/zona es requerido';
    }

    if (!showAllErrors) {
      const filteredErrors: Record<string, string> = {};
      Object.keys(newErrors).forEach(key => {
        if (touchedFields.has(key)) {
          filteredErrors[key] = newErrors[key];
        }
      });
      setErrors(filteredErrors);
      return Object.keys(newErrors).length === 0;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, touchedFields]);

  const validateStep3 = useCallback((showAllErrors = false): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.operation) {
      newErrors.operation = 'Selecciona una operación';
    }
    if (!formData.antiquity) {
      newErrors.antiquity = 'Selecciona la antigüedad';
    }

    if (!showAllErrors) {
      const filteredErrors: Record<string, string> = {};
      Object.keys(newErrors).forEach(key => {
        if (touchedFields.has(key)) {
          filteredErrors[key] = newErrors[key];
        }
      });
      setErrors(filteredErrors);
      return Object.keys(newErrors).length === 0;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, touchedFields]);

  const validateStep4 = useCallback((showAllErrors = false): boolean => {
    const newErrors: Record<string, string> = {};

    if (formData.squareMetersConstructed <= 0) {
      newErrors.squareMetersConstructed = 'La superficie debe ser mayor a 0';
    }
    if (formData.bedrooms < 0) {
      newErrors.bedrooms = 'Dormitorios inválidos';
    }
    if (formData.bathrooms < 0) {
      newErrors.bathrooms = 'Baños inválidos';
    }
    if (!formData.elevator) {
      newErrors.elevator = 'Especifica si hay ascensor';
    }
    if (!formData.garage) {
      newErrors.garage = 'Especifica si hay garaje';
    }
    if (!formData.terrace) {
      newErrors.terrace = 'Especifica si hay terraza';
    }
    if (!formData.conservationState) {
      newErrors.conservationState = 'Selecciona estado de conservación';
    }

    if (!showAllErrors) {
      const filteredErrors: Record<string, string> = {};
      Object.keys(newErrors).forEach(key => {
        if (touchedFields.has(key)) {
          filteredErrors[key] = newErrors[key];
        }
      });
      setErrors(filteredErrors);
      return Object.keys(newErrors).length === 0;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, touchedFields]);

  const validateStep5 = useCallback((showAllErrors = false): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name || formData.name.length < 3) {
      newErrors.name = 'Nombre inválido';
    }
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    if (!formData.phone || !/^[0-9+\s\-()]{9,}$/.test(formData.phone)) {
      newErrors.phone = 'Teléfono inválido';
    }
    if (!formData.saleTimeline) {
      newErrors.saleTimeline = 'Selecciona plazo de venta';
    }
    if (!formData.gdprConsent) {
      newErrors.gdprConsent = 'Debes aceptar el consentimiento GDPR';
    }

    if (!showAllErrors) {
      const filteredErrors: Record<string, string> = {};
      Object.keys(newErrors).forEach(key => {
        if (touchedFields.has(key)) {
          filteredErrors[key] = newErrors[key];
        }
      });
      setErrors(filteredErrors);
      return Object.keys(newErrors).length === 0;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, touchedFields]);

  const isStepValid = useMemo(() => {
    switch (currentStep) {
      case 0:
        return validateStep1();
      case 1:
        return validateStep2();
      case 2:
        return validateStep3();
      case 3:
        return validateStep4();
      case 4:
        return validateStep5();
      default:
        return true;
    }
  }, [currentStep, validateStep1, validateStep2, validateStep3, validateStep4, validateStep5]);

  const handleFieldChange = (field: string, value: string | number | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setTouchedFields(prev => new Set(prev).add(field));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleNext = async () => {
    let isValid = false;

    switch (currentStep) {
      case 0:
        isValid = validateStep1(true);
        break;
      case 1:
        isValid = validateStep2(true);
        break;
      case 2:
        isValid = validateStep3(true);
        break;
      case 3:
        isValid = validateStep4(true);
        break;
      case 4:
        isValid = validateStep5(true);
        break;
      default:
        isValid = true;
    }

    if (currentStep < 4) {
      if (isValid) {
        setCurrentStep(currentStep + 1);
        setExpandedStep(currentStep + 1);
      }
    } else if (currentStep === 4) {
      if (isValid) {
        await handleSubmit();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setExpandedStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!antispamService.checkRateLimit()) {
      setApiError('Demasiadas solicitudes. Intenta de nuevo más tarde.');
      return;
    }

    if (!antispamService.validateHoneypot(formData as unknown as Record<string, unknown>)) {
      console.warn('Honeypot triggered');
      setCurrentStep(4);
      return;
    }

    setIsLoading(true);
    setApiError(null);

    try {
      const normalizedMunicipality = formData.locality.toLowerCase() === 'valencia' ? 'València' : formData.locality;

      const market = formData.operation.toLowerCase() === 'venta' ? 'venta' : 'alquiler';

      const propertyData: PropertyData = {
        address: `${formData.street} ${formData.number}, ${formData.postalCode} ${formData.locality}`,
        municipality: normalizedMunicipality,
        area: formData.neighborhood || formData.locality,
        market: market as 'venta' | 'alquiler',
        type: formData.propertyType as 'Piso' | 'Ático' | 'Casa/Chalet' | 'Estudio',
        builtSqm: formData.squareMetersConstructed,
        bedrooms: formData.bedrooms,
        bathrooms: formData.bathrooms,
        floor: formData.floor ? parseInt(formData.floor) : undefined,
        elevator: formData.elevator === 'Sí',
        parking: formData.garage === 'Sí',
        terrace: formData.terrace === 'Sí',
        condition: formData.conservationState ? formData.conservationState.toLowerCase() : 'bueno',
        yearBuilt: formData.yearBuilt || undefined,
      };

      const valuationResult = await valuationEngine.valuate(propertyData);

      const utmParams = analytics.getUTMParams();

      const leadData: LeadData = {
        address: propertyData.address,
        number: formData.number,
        postalCode: formData.postalCode,
        locality: formData.locality,
        province: formData.province,
        propertyType: formData.propertyType,
        operation: formData.operation,
        antiquity: formData.antiquity,
        squareMetersConstructed: formData.squareMetersConstructed,
        squareMetersUseful: formData.squareMetersUseful,
        bedrooms: formData.bedrooms,
        bathrooms: formData.bathrooms,
        floor: formData.floor,
        elevator: formData.elevator,
        garage: formData.garage,
        terrace: formData.terrace,
        yearBuilt: formData.yearBuilt,
        conservationState: formData.conservationState,
        others: formData.others,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        saleTimeline: formData.saleTimeline,
        valuation: valuationResult,
        valuationStatus: 'OK',
        notes: `Valoración basada en datos locales. UTM: ${JSON.stringify(utmParams)}`,
      };

      const saveResult = await valuationService.saveLead(leadData);

      if (!saveResult.success) {
        console.error('Failed to save lead:', saveResult.error);
      } else {
        analytics.trackLead('valuation', {
          property_type: formData.propertyType,
          operation: formData.operation,
          locality: formData.locality,
          neighborhood: formData.neighborhood,
          estimated_value: valuationResult.estimatedValue,
          built_sqm: formData.squareMetersConstructed,
          bedrooms: formData.bedrooms,
        });
      }

      navigate('/valuation/result', {
        state: {
          result: valuationResult,
          propertyData: propertyData,
        },
      });
    } catch (error) {
      console.error('Submission error:', error);
      analytics.trackError('valuation_submit_error', String(error), formData);
      setApiError(error instanceof Error ? error.message : 'Error procesando tu solicitud. Intenta de nuevo.');
      setIsLoading(false);
    }
  };

  const loadDemoData = () => {
    setFormData(prev => ({ ...prev, ...DEMO_DATA }));
    setCurrentStep(0);
    setExpandedStep(0);
  };

  return (
    <section id="valuation-widget" className="py-12 sm:py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="sticky top-0 z-40 bg-white border-b border-gray-100 overflow-x-auto">
            <div className="flex min-w-max md:min-w-0 md:grid md:grid-cols-5 gap-1 p-4">
              {STEPS.map((step, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (index <= currentStep || (index === 4 && currentStep === 4)) {
                      setCurrentStep(index);
                    }
                  }}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap md:whitespace-normal ${
                    index <= currentStep
                      ? index === currentStep
                        ? 'bg-[#223e28] text-white'
                        : 'bg-gray-100 text-gray-700'
                      : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {step.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-8 md:p-12">
            {apiError && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{apiError}</p>
              </div>
            )}

            {currentStep === 0 && (
              <Step1Address
                data={{
                  street: formData.street,
                  number: formData.number,
                  noNumber: formData.noNumber,
                  postalCode: formData.postalCode,
                  locality: formData.locality,
                  neighborhood: formData.neighborhood,
                  province: formData.province,
                }}
                onChange={handleFieldChange}
                errors={errors}
                onNext={handleNext}
                onBack={undefined}
                isValid={isStepValid}
              />
            )}

            {currentStep === 1 && (
              <Step2Neighborhood
                data={{
                  neighborhood: formData.neighborhood,
                }}
                onChange={handleFieldChange}
                errors={errors}
                onNext={handleNext}
                onBack={handleBack}
                isValid={isStepValid}
              />
            )}

            {currentStep === 2 && (
              <Step2Type
                data={{
                  propertyType: formData.propertyType,
                  operation: formData.operation,
                  antiquity: formData.antiquity,
                }}
                onChange={handleFieldChange}
                errors={errors}
                onNext={handleNext}
                onBack={handleBack}
                isValid={isStepValid}
              />
            )}

            {currentStep === 3 && (
              <Step3Details
                data={{
                  squareMetersConstructed: formData.squareMetersConstructed,
                  squareMetersUseful: formData.squareMetersUseful,
                  bedrooms: formData.bedrooms,
                  bathrooms: formData.bathrooms,
                  floor: formData.floor,
                  elevator: formData.elevator,
                  garage: formData.garage,
                  terrace: formData.terrace,
                  yearBuilt: formData.yearBuilt,
                  conservationState: formData.conservationState,
                  others: formData.others,
                }}
                onChange={handleFieldChange}
                errors={errors}
                onNext={handleNext}
                onBack={handleBack}
                isValid={isStepValid}
              />
            )}

            {currentStep === 4 && (
              <Step4Contact
                data={{
                  name: formData.name,
                  email: formData.email,
                  phone: formData.phone,
                  saleTimeline: formData.saleTimeline,
                  gdprConsent: formData.gdprConsent,
                }}
                onChange={handleFieldChange}
                errors={errors}
                onNext={handleNext}
                onBack={handleBack}
                isValid={isStepValid}
                isLoading={isLoading}
              />
            )}

          </div>

          {process.env.NODE_ENV === 'development' && (
            <div className="border-t border-gray-100 p-4 bg-gray-50 flex gap-2">
              <button
                onClick={loadDemoData}
                className="px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                📝 Rellenar ejemplo
              </button>
              <div className="text-xs text-gray-600 flex-1 flex items-center">
                {valuationService.isConfigured() ? '✅ Sistema configurado' : '⚠️ Sistema no configurado'}
              </div>
            </div>
          )}
        </div>

        <input
          type="text"
          name={antispamService.getHoneypotFieldName()}
          value={formData.honeypot}
          onChange={(e) => handleFieldChange('honeypot', e.target.value)}
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
    </section>
  );
};
