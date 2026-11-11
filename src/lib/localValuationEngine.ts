import { canon, canonArea, canonMunicipality, splitMulti, normalizeBoolean, normalizeNumber } from './normalize';
import { areaMappingService } from './areaMapping';
import { OUT_OF_SCOPE_MESSAGE } from './districtConfig';

interface NeighborhoodStat {
  area_id: string;
  area_name: string;
  municipality: string;
  type_supported: string;
  median_price_sqm_3m: number | null;
  median_price_sqm_6m: number | null;
  median_price_sqm_12m: number | null;
  trend_3m_pct: number | null;
  trend_12m_pct: number | null;
  dom_days: number | null;
  sample_size: number;
  updated_at: string;
}

interface SoldTransaction {
  id: string;
  date_sold: string;
  municipality: string;
  area_name: string;
  type: string;
  built_sqm: number;
  bedrooms: number;
  bathrooms: number;
  price_sold_eur: number;
}

interface ActiveListing {
  id: string;
  date_listed: string;
  listing_type: string;
  municipality: string;
  area_name: string;
  type: string;
  built_sqm: number;
  usable_sqm: number | null;
  bedrooms: number;
  bathrooms: number;
  floor: number | null;
  elevator: boolean;
  parking: boolean;
  terrace: boolean;
  condition: string;
  year_built: number | null;
  price_eur: number;
}

export type Market = 'venta' | 'alquiler';

export interface PropertyData {
  address: string;
  municipality: string;
  area: string;
  market: Market;
  type: 'Piso' | 'Ático' | 'Casa/Chalet' | 'Estudio';
  builtSqm: number;
  bedrooms: number;
  bathrooms: number;
  floor?: number;
  elevator?: boolean;
  parking?: boolean;
  terrace?: boolean;
  condition?: string;
  yearBuilt?: number;
}

export interface ValuationResult {
  estimatedValue: number;
  valuationRange: {
    min: number;
    max: number;
  };
  confidence: 'Alta' | 'Media' | 'Baja';
  pricePerSqm: number;
  marketTrend: {
    trend_3m_pct: number | null;
    trend_12m_pct: number | null;
  };
  comparables: {
    sold: SoldTransaction[];
    active: ActiveListing[];
  };
  neighborhood: {
    area_name: string;
    municipality: string;
    median_price_sqm: number;
    dom_days: number | null;
    sample_size: number;
  };
  methodology: string;
  timestamp: string;
}

class LocalValuationEngine {
  private neighborhoodStats: NeighborhoodStat[] = [];
  private soldTransactions: SoldTransaction[] = [];
  private activeListings: ActiveListing[] = [];
  private dataLoaded = false;

  async loadData(): Promise<void> {
    if (this.dataLoaded) return;

    try {
      await areaMappingService.loadMappings();

      const [statsRes, soldRes, listingsRes] = await Promise.all([
        fetch('/data/valuation/neighborhood_stats.csv'),
        fetch('/data/valuation/sold_public.csv'),
        fetch('/data/valuation/listings_active.csv'),
      ]);

      const [statsText, soldText, listingsText] = await Promise.all([
        statsRes.text(),
        soldRes.text(),
        listingsRes.text(),
      ]);

      this.neighborhoodStats = this.parseCSV<NeighborhoodStat>(statsText, this.parseNeighborhoodStat);
      this.soldTransactions = this.parseCSV<SoldTransaction>(soldText, this.parseSoldTransaction);
      this.activeListings = this.parseCSV<ActiveListing>(listingsText, this.parseActiveListing);

      this.dataLoaded = true;

      console.log('Valuation data loaded:', {
        neighborhoodStats: this.neighborhoodStats.length,
        soldTransactions: this.soldTransactions.length,
        activeListings: this.activeListings.length,
      });
    } catch (error) {
      console.error('Error loading valuation data:', error);
      throw new Error('No se pudieron cargar los datos de valoración');
    }
  }

  private parseCSV<T>(text: string, rowParser: (values: string[], headers: string[]) => T | null): T[] {
    const textClean = text.replace(/^\uFEFF/, '');
    const lines = textClean.trim().split('\n');

    if (lines.length < 2) return [];

    const headers = lines[0].replace(/"/g, '').split(',').map(h => h.trim());
    const rows: T[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].replace(/"/g, '');
      const values = line.split(',').map(v => v.trim());

      const row = rowParser(values, headers);
      if (row) {
        rows.push(row);
      }
    }

    return rows;
  }

  private parseNeighborhoodStat(values: string[], headers: string[]): NeighborhoodStat | null {
    if (values.length < headers.length) return null;

    const get = (name: string) => values[headers.indexOf(name)] || '';

    return {
      area_id: get('area_id'),
      area_name: get('area_name'),
      municipality: get('municipality'),
      type_supported: get('type_supported'),
      median_price_sqm_3m: normalizeNumber(get('median_price_sqm_3m')),
      median_price_sqm_6m: normalizeNumber(get('median_price_sqm_6m')),
      median_price_sqm_12m: normalizeNumber(get('median_price_sqm_12m')),
      trend_3m_pct: normalizeNumber(get('trend_3m_pct')),
      trend_12m_pct: normalizeNumber(get('trend_12m_pct')),
      dom_days: normalizeNumber(get('dom_days')),
      sample_size: normalizeNumber(get('sample_size')) || 0,
      updated_at: get('updated_at'),
    };
  }

  private parseSoldTransaction(values: string[], headers: string[]): SoldTransaction | null {
    if (values.length < headers.length) return null;

    const get = (name: string) => values[headers.indexOf(name)] || '';

    return {
      id: get('id'),
      date_sold: get('date_sold'),
      municipality: get('municipality'),
      area_name: get('area_name'),
      type: get('type'),
      built_sqm: normalizeNumber(get('built_sqm')) || 0,
      bedrooms: normalizeNumber(get('bedrooms')) || 0,
      bathrooms: normalizeNumber(get('bathrooms')) || 0,
      price_sold_eur: normalizeNumber(get('price_sold_eur')) || 0,
    };
  }

  private parseActiveListing(values: string[], headers: string[]): ActiveListing | null {
    if (values.length < headers.length) return null;

    const get = (name: string) => values[headers.indexOf(name)] || '';

    return {
      id: get('id'),
      date_listed: get('date_listed'),
      listing_type: get('listing_type'),
      municipality: get('municipality'),
      area_name: get('area_name'),
      type: get('type'),
      built_sqm: normalizeNumber(get('built_sqm')) || 0,
      usable_sqm: normalizeNumber(get('usable_sqm')),
      bedrooms: normalizeNumber(get('bedrooms')) || 0,
      bathrooms: normalizeNumber(get('bathrooms')) || 0,
      floor: normalizeNumber(get('floor')),
      elevator: normalizeBoolean(get('elevator')),
      parking: normalizeBoolean(get('parking')),
      terrace: normalizeBoolean(get('terrace')),
      condition: get('condition'),
      year_built: normalizeNumber(get('year_built')),
      price_eur: normalizeNumber(get('price_eur')) || 0,
    };
  }

  private findNeighborhoodRow(areaId: string, market: Market, municipality: string): NeighborhoodStat | null {
    const mkt = canon(market);
    const mun = canonMunicipality(municipality);

    console.log('Finding neighborhood row:', {
      areaId,
      market,
      municipality,
      canonMarket: mkt,
      canonMunicipality: mun,
    });

    const isMarketSupported = (r: NeighborhoodStat) => {
      const types = splitMulti(r.type_supported);
      if (types.length === 0) return true;
      const hasMarketTokens = types.some(t => ['venta', 'alquiler', 'sale', 'rent'].includes(t));
      if (!hasMarketTokens) return true;
      return types.includes(mkt);
    };

    let row = this.neighborhoodStats.find(r =>
      canon(r.area_id) === canon(areaId) &&
      canonMunicipality(r.municipality) === mun &&
      isMarketSupported(r)
    );

    if (row) {
      console.log('Found exact area_id + municipality match:', row);
      return row;
    }

    console.log('Trying match by area_name instead of area_id');
    row = this.neighborhoodStats.find(r =>
      canonArea(r.area_name) === canonArea(areaId) &&
      canonMunicipality(r.municipality) === mun &&
      isMarketSupported(r)
    );

    if (row) {
      console.log('Found area_name + municipality match:', row);
      return row;
    }

    console.log('Trying fallback: municipality-level stats');
    row = this.neighborhoodStats.find(r =>
      (canon(r.area_name) === mun || canon(r.area_id) === `${mun}_city`) &&
      isMarketSupported(r)
    );

    if (row) {
      console.log('Found municipality-level row:', row);
      return row;
    }

    console.log('Trying fallback: valencia_city aggregate');
    row = this.neighborhoodStats.find(r =>
      canon(r.area_id) === 'valencia_city' &&
      isMarketSupported(r)
    );

    if (row) {
      console.log('Found valencia_city row:', row);
      return row;
    }

    console.log('Trying fallback: province/region level');
    const fallbackIds = ['valencia_province', 'valencia_region', 'comunitat_valenciana', 'provincia_de_valencia'];
    row = this.neighborhoodStats.find(r =>
      fallbackIds.includes(canon(r.area_id)) &&
      isMarketSupported(r)
    );

    if (row) {
      console.log('Found province/region row:', row);
      return row;
    }

    console.log('No neighborhood stats found', {
      tried: {
        area_id: areaId,
        market,
        municipality,
      },
      notes: 'no area/municipality/city/province match',
    });
    return null;
  }

  async valuate(propertyData: PropertyData): Promise<ValuationResult> {
    await this.loadData();

    if (!propertyData.type) {
      throw new Error('Tipo de propiedad es requerido');
    }

    if (!propertyData.area || !propertyData.municipality) {
      throw new Error('Área y municipio son requeridos');
    }

    if (!propertyData.builtSqm || propertyData.builtSqm <= 0) {
      throw new Error('Superficie construida debe ser mayor a 0');
    }

    console.log('Valuating property:', propertyData);

    const areaMapping = areaMappingService.resolveArea(propertyData.area, propertyData.municipality);

    if (!areaMapping) {
      throw new Error('No se pudo identificar el área. Por favor, verifica la dirección.');
    }

    if (!areaMapping.isAllowed) {
      throw new Error(OUT_OF_SCOPE_MESSAGE);
    }

    console.log('Area mapping resolved:', areaMapping);

    const stats = this.findNeighborhoodRow(areaMapping.area_id, propertyData.market, areaMapping.municipality);

    if (!stats) {
      throw new Error(`No hay datos suficientes para realizar la valoración en ${areaMapping.area_name}, ${areaMapping.municipality} para operación de ${propertyData.market}.`);
    }

    const medianPriceSqm = stats.median_price_sqm_3m ?? stats.median_price_sqm_6m ?? stats.median_price_sqm_12m;

    if (!medianPriceSqm || medianPriceSqm <= 0) {
      throw new Error('No hay datos de precios suficientes para realizar la valoración.');
    }

    const basePrice = this.calculateBasePrice(propertyData, medianPriceSqm);
    const adjustedPrice = this.applyHedonicAdjustments(propertyData, basePrice);
    const { min, max } = this.calculateRange(adjustedPrice, stats.sample_size);
    const confidence = this.calculateConfidence(stats.sample_size, stats.dom_days);

    const comparables = this.findComparables(propertyData, areaMapping);

    let trend3m = stats.trend_3m_pct;
    const trend12m = stats.trend_12m_pct;

    if (trend3m !== null && trend12m !== null && trend3m > trend12m) {
      trend3m = trend12m;
    }

    return {
      estimatedValue: Math.round(adjustedPrice),
      valuationRange: {
        min: Math.round(min),
        max: Math.round(max),
      },
      confidence,
      pricePerSqm: Math.round(adjustedPrice / propertyData.builtSqm),
      marketTrend: {
        trend_3m_pct: trend3m,
        trend_12m_pct: trend12m,
      },
      comparables,
      neighborhood: {
        area_name: stats.area_name,
        municipality: stats.municipality,
        median_price_sqm: medianPriceSqm,
        dom_days: stats.dom_days,
        sample_size: stats.sample_size,
      },
      methodology: 'Valoración basada en datos de mercado local con ajustes hedónicos',
      timestamp: new Date().toISOString(),
    };
  }

  private calculateBasePrice(property: PropertyData, medianPriceSqm: number): number {
    const MARKET_CORRECTION_FACTOR = 0.82;
    return property.builtSqm * medianPriceSqm * MARKET_CORRECTION_FACTOR;
  }

  private applyHedonicAdjustments(property: PropertyData, basePrice: number): number {
    let adjustedPrice = basePrice;
    let totalAdjustment = 0;

    if (property.bedrooms && property.bedrooms > 3) {
      totalAdjustment += 0.02;
    } else if (property.bedrooms && property.bedrooms < 2) {
      totalAdjustment -= 0.02;
    }

    if (property.bathrooms && property.bathrooms > 1) {
      totalAdjustment += 0.015;
    }

    if (property.elevator) {
      totalAdjustment += 0.01;
    }

    if (property.parking) {
      totalAdjustment += 0.025;
    }

    if (property.terrace) {
      totalAdjustment += 0.02;
    }

    if (property.condition) {
      const conditionAdjustments: Record<string, number> = {
        'nuevo': 0.04,
        'reformado': 0.015,
        'bueno': 0,
        'a reformar': -0.05,
      };
      totalAdjustment += conditionAdjustments[property.condition] || 0;
    }

    if (property.yearBuilt) {
      const age = new Date().getFullYear() - property.yearBuilt;
      if (age < 5) totalAdjustment += 0.025;
      else if (age > 30) totalAdjustment -= 0.03;
    }

    if (property.floor !== undefined) {
      if (property.floor === 0) totalAdjustment -= 0.015;
      else if (property.floor > 5) totalAdjustment += 0.01;
    }

    totalAdjustment = Math.max(-0.07, Math.min(0.07, totalAdjustment));

    adjustedPrice = basePrice * (1 + totalAdjustment);

    return adjustedPrice;
  }

  private calculateRange(estimatedValue: number, sampleSize: number): { min: number; max: number } {
    let rangePercent = 0.08;

    if (sampleSize < 20) rangePercent = 0.08;
    else if (sampleSize < 50) rangePercent = 0.06;
    else if (sampleSize >= 50) rangePercent = 0.05;

    return {
      min: estimatedValue * (1 - rangePercent),
      max: estimatedValue * (1 + rangePercent),
    };
  }

  private calculateConfidence(sampleSize: number, domDays: number | null): 'Alta' | 'Media' | 'Baja' {
    if (sampleSize > 80 && domDays && domDays < 60) return 'Alta';
    if (sampleSize > 40 && (!domDays || domDays < 90)) return 'Media';
    return 'Baja';
  }

  private findComparables(property: PropertyData, areaMapping: { area_id: string; area_name: string; municipality: string }): {
    sold: SoldTransaction[];
    active: ActiveListing[];
  } {
    const canonAreaId = canon(areaMapping.area_id);
    const canonAreaName = canonArea(areaMapping.area_name);
    const canonMuni = canonMunicipality(areaMapping.municipality);
    const canonType = canon(property.type);

    const sold = this.soldTransactions
      .filter(t =>
        (canon(t.area_name) === canonAreaId || canonArea(t.area_name) === canonAreaName) &&
        canonMunicipality(t.municipality) === canonMuni &&
        canon(t.type) === canonType &&
        t.built_sqm > 0 &&
        Math.abs(t.built_sqm - property.builtSqm) / property.builtSqm < 0.3
      )
      .sort((a, b) => new Date(b.date_sold).getTime() - new Date(a.date_sold).getTime())
      .slice(0, 5);

    const active = this.activeListings
      .filter(l =>
        (canon(l.area_name) === canonAreaId || canonArea(l.area_name) === canonAreaName) &&
        canonMunicipality(l.municipality) === canonMuni &&
        canon(l.type) === canonType &&
        l.built_sqm > 0 &&
        Math.abs(l.built_sqm - property.builtSqm) / property.builtSqm < 0.3
      )
      .sort((a, b) => new Date(b.date_listed).getTime() - new Date(a.date_listed).getTime())
      .slice(0, 5);

    return { sold, active };
  }
}

export const valuationEngine = new LocalValuationEngine();
