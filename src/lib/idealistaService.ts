export interface ValuationRequest {
  address: string;
  number: string;
  postalCode: string;
  locality: string;
  province: string;
  propertyType: string;
  operation: string;
  antiquity: string;
  squareMetersConstructed: number;
  squareMetersUseful?: number;
  bedrooms: number;
  bathrooms: number;
  floor?: string;
  elevator: string;
  garage: string;
  terrace: string;
  yearBuilt?: number;
  conservationState: string;
  others?: string[];
}

export interface ValuationResult {
  estimateMin: number;
  estimateMax: number;
  estimateAvg: number;
  currency: string;
  comps?: Array<{
    title: string;
    area: number;
    price: number;
    date: string;
  }>;
  source: 'api' | 'mock';
}

const MOCK_VALUATION_DATA: Record<string, { min: number; max: number; avg: number }> = {
  piso: { min: 210000, max: 280000, avg: 245000 },
  casa: { min: 350000, max: 550000, avg: 450000 },
  duplex: { min: 280000, max: 420000, avg: 350000 },
  estudio: { min: 120000, max: 180000, avg: 150000 },
  terreno: { min: 100000, max: 500000, avg: 300000 },
  comercial: { min: 150000, max: 400000, avg: 275000 },
  oficina: { min: 180000, max: 450000, avg: 315000 },
  garaje: { min: 30000, max: 80000, avg: 55000 },
};

function generateMockValuation(request: ValuationRequest): ValuationResult {
  const typeKey = request.propertyType.toLowerCase();
  const baseData = MOCK_VALUATION_DATA[typeKey] || { min: 200000, max: 300000, avg: 250000 };

  let multiplier = 1;
  if (request.squareMetersConstructed > 100) {
    multiplier += (request.squareMetersConstructed - 100) * 0.005;
  }
  if (request.bedrooms > 2) {
    multiplier += (request.bedrooms - 2) * 0.08;
  }
  if (request.bathrooms > 1) {
    multiplier += (request.bathrooms - 1) * 0.05;
  }
  if (request.elevator === 'Sí') {
    multiplier += 0.1;
  }
  if (request.garage === 'Sí') {
    multiplier += 0.15;
  }
  if (request.terrace === 'Sí') {
    multiplier += 0.12;
  }
  if (request.conservationState === 'Excelente') {
    multiplier += 0.15;
  } else if (request.conservationState === 'A reformar') {
    multiplier -= 0.15;
  }

  const min = Math.floor(baseData.min * multiplier);
  const max = Math.floor(baseData.max * multiplier);
  const avg = Math.floor(baseData.avg * multiplier);

  return {
    estimateMin: min,
    estimateMax: max,
    estimateAvg: avg,
    currency: 'EUR',
    comps: [
      {
        title: `Piso similar en ${request.locality}`,
        area: request.squareMetersConstructed,
        price: avg,
        date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      },
      {
        title: `${request.bedrooms}H ${request.bathrooms}B en zona céntrica`,
        area: request.squareMetersConstructed + 10,
        price: Math.floor(avg * 1.05),
        date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      },
      {
        title: `Inmueble comparable en ${request.province}`,
        area: request.squareMetersConstructed - 5,
        price: Math.floor(avg * 0.98),
        date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      },
    ],
    source: 'mock',
  };
}

async function callRealIdealista(request: ValuationRequest): Promise<ValuationResult> {
  const apiBase = import.meta.env.VITE_IDEALISTA_API_BASE;
  const apiKey = import.meta.env.VITE_IDEALISTA_API_KEY;

  if (!apiBase || !apiKey) {
    console.warn('Idealista API credentials not configured, using mock data');
    return generateMockValuation(request);
  }

  try {
    const response = await fetch(`${apiBase}/valuations`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address: request.address,
        number: request.number,
        postalCode: request.postalCode,
        locality: request.locality,
        province: request.province,
        propertyType: request.propertyType,
        operation: request.operation,
        antiquity: request.antiquity,
        squareMetersConstructed: request.squareMetersConstructed,
        squareMetersUseful: request.squareMetersUseful,
        bedrooms: request.bedrooms,
        bathrooms: request.bathrooms,
        floor: request.floor,
        elevator: request.elevator === 'Sí',
        garage: request.garage === 'Sí',
        terrace: request.terrace === 'Sí',
        yearBuilt: request.yearBuilt,
        conservationState: request.conservationState,
      }),
    });

    if (!response.ok) {
      throw new Error(`Idealista API error: ${response.status}`);
    }

    const data = await response.json();
    return {
      estimateMin: data.estimate_min,
      estimateMax: data.estimate_max,
      estimateAvg: data.estimate_avg,
      currency: 'EUR',
      comps: data.comps?.map((c: { title: string; area: number; price: number; date: string }) => ({
        title: c.title,
        area: c.area,
        price: c.price,
        date: c.date,
      })),
      source: 'api',
    };
  } catch (error) {
    console.error('Idealista API call failed:', error);
    return generateMockValuation(request);
  }
}

export const idealistaService = {
  fetchValuation: async (request: ValuationRequest): Promise<ValuationResult> => {
    return callRealIdealista(request);
  },

  isConfigured: (): boolean => {
    return !!(import.meta.env.VITE_IDEALISTA_API_BASE && import.meta.env.VITE_IDEALISTA_API_KEY);
  },
};
