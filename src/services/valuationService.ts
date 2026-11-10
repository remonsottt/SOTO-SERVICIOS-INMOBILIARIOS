import { ValuationResult } from '../lib/localValuationEngine';
import { edgeFetch } from '../lib/edgeClient';

export interface SellerLeadData {
  name: string;
  phone: string;
  email?: string;
  address: string;
  propertyType: string;
  notes?: string;
  utm?: string;
}

export interface LeadData {
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
  name: string;
  email: string;
  phone: string;
  saleTimeline: string;
  valuation: ValuationResult | Record<string, unknown>;
  valuationStatus: 'NEW' | 'PENDING_API' | 'OK';
  notes?: string;
}

const toNumber = (value: unknown): number | null => {
  if (value === null || value === undefined || value === '') return null;

  if (typeof value === 'number') return value;

  if (typeof value === 'string') {
    const cleaned = (value as string)
      .replace(/[€$\s]/g, '')
      .replace(/\./g, '')
      .replace(',', '.');

    const parsed = Number(cleaned);
    return isNaN(parsed) ? null : parsed;
  }

  return null;
};

export const valuationService = {
  saveLead: async (lead: LeadData): Promise<{ success: boolean; error?: string }> => {
    try {
      const valuation = lead.valuation as {
        estimatedValue?: number;
        valuationRange?: { min?: number; max?: number };
        marketTrend?: { trend_3m_pct?: number; dom_days?: number };
      };
      const valuationAvg = toNumber(valuation?.estimatedValue);
      const valuationMin = toNumber(valuation?.valuationRange?.min);
      const valuationMax = toNumber(valuation?.valuationRange?.max);
      const trend3m = toNumber(valuation?.marketTrend?.trend_3m_pct);
      const domDays = toNumber(valuation?.marketTrend?.dom_days);

      const payload = {
        name: lead.name,
        phone: lead.phone,
        email: lead.email,
        address: lead.address,
        neighborhood: lead.locality || '',
        city: lead.locality || 'València',
        property_type: lead.propertyType,
        built_m2: lead.squareMetersConstructed,
        bedrooms: lead.bedrooms,
        bathrooms: lead.bathrooms,
        valuation_avg: valuationAvg,
        valuation_min: valuationMin,
        valuation_max: valuationMax,
        confidence: lead.valuation?.confidence || 'Media',
        trend_3m: trend3m,
        dom_days: domDays,
        utm: lead.notes || '',
      };

      if (import.meta.env.DEV) {
        console.log('Payload before sending to Notion:', {
          valuation_avg: valuationAvg,
          valuation_min: valuationMin,
          valuation_max: valuationMax,
          confidence: payload.confidence,
          trend_3m: trend3m,
          dom_days: domDays,
          fullPayload: payload,
        });
      }

      const response = await edgeFetch('notion-valuation', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        if (import.meta.env.DEV) {
          console.error('Failed to save lead to Notion:', {
            stage: result.stage,
            status: result.status,
            error: result.error,
            details: result.details,
          });
        }
        return { success: false, error: result.error || 'Failed to save lead' };
      }

      if (import.meta.env.DEV) {
        console.log('Lead saved to Notion successfully');
      }

      return { success: true };
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error saving lead:', error);
      }
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  },

  saveSellerLead: async (lead: SellerLeadData): Promise<{ success: boolean; error?: string }> => {
    try {
      const payload = {
        name: lead.name,
        phone: lead.phone,
        email: lead.email,
        address: lead.address,
        property_type: lead.propertyType,
        notes: lead.notes,
        utm: lead.utm,
      };

      const response = await edgeFetch('notion-valuation', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        return { success: false, error: result.error || 'Failed to save lead' };
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  },

  isConfigured: (): boolean => {
    return true;
  },
};
