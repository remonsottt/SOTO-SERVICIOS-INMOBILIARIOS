import { canonArea, canonMunicipality } from './normalize';
import { isNeighborhoodAllowed } from './districtConfig';

interface AreaMapping {
  user_input: string;
  area_id: string;
  area_name: string;
  municipality: string;
}

export interface ResolvedArea {
  area_id: string;
  area_name: string;
  municipality: string;
  isAllowed: boolean;
}

class AreaMappingService {
  private byUserInput = new Map<string, ResolvedArea>();
  private byAreaMunicipality = new Map<string, ResolvedArea>();
  private allMappings: AreaMapping[] = [];
  private loaded = false;

  async loadMappings(): Promise<void> {
    if (this.loaded) return;

    try {
      const response = await fetch('/data/valuation/mapping_barrios.csv');
      const text = await response.text();

      const lines = text.trim().split('\n');
      if (lines.length < 2) {
        throw new Error('Mapping file is empty or invalid');
      }

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].replace(/"/g, '');
        const values = line.split(',').map(v => v.trim());

        if (values.length < 4) continue;

        const mapping: AreaMapping = {
          user_input: values[0] || '',
          area_id: values[1] || '',
          area_name: values[2] || '',
          municipality: values[3] || '',
        };

        if (!mapping.area_id || !mapping.area_name) continue;

        this.allMappings.push(mapping);

        const isAllowed = isNeighborhoodAllowed(mapping.area_id);

        const resolved: ResolvedArea = {
          area_id: mapping.area_id,
          area_name: mapping.area_name,
          municipality: mapping.municipality,
          isAllowed,
        };

        if (mapping.user_input) {
          const key = canonArea(mapping.user_input);
          if (!this.byUserInput.has(key)) {
            this.byUserInput.set(key, resolved);
          }
        }

        const compositeKey = `${canonArea(mapping.area_name)}|${canonMunicipality(mapping.municipality)}`;
        if (!this.byAreaMunicipality.has(compositeKey)) {
          this.byAreaMunicipality.set(compositeKey, resolved);
        }
      }

      this.loaded = true;
      console.log('Area mappings loaded:', {
        totalMappings: this.allMappings.length,
        uniqueUserInputs: this.byUserInput.size,
        uniqueAreaMunicipality: this.byAreaMunicipality.size,
      });
    } catch (error) {
      console.error('Error loading area mappings:', error);
      throw new Error('No se pudieron cargar los mapeos de áreas');
    }
  }

  resolveArea(userInputArea: string, municipalityInput: string): ResolvedArea | null {
    if (!userInputArea) return null;

    const canonUserArea = canonArea(userInputArea);
    const canonMuni = canonMunicipality(municipalityInput);

    console.log('Resolving area:', {
      userInputArea,
      municipalityInput,
      canonUserArea,
      canonMuni,
    });

    const hit1 = this.byUserInput.get(canonUserArea);
    if (hit1 && canonMunicipality(hit1.municipality) === canonMuni) {
      console.log('Found by user input:', hit1);
      return hit1;
    }

    const compositeKey = `${canonUserArea}|${canonMuni}`;
    const hit2 = this.byAreaMunicipality.get(compositeKey);
    if (hit2) {
      console.log('Found by area+municipality:', hit2);
      return hit2;
    }

    const candidates = [...this.byAreaMunicipality.entries()]
      .filter(([k]) => k.startsWith(`${canonUserArea}|`));

    if (candidates.length === 1) {
      console.log('Found single candidate:', candidates[0][1]);
      return candidates[0][1];
    }

    if (candidates.length > 1) {
      console.log('Multiple candidates found, returning first:', candidates[0][1]);
      return candidates[0][1];
    }

    console.log('No area mapping found for:', { canonUserArea, canonMuni });
    return null;
  }

  getUniqueAreas(): string[] {
    const areas = new Set<string>();
    for (const mapping of this.allMappings) {
      if (mapping.area_name) {
        areas.add(mapping.area_name);
      }
    }
    return Array.from(areas).sort();
  }

  getUniqueMunicipalities(): string[] {
    const municipalities = new Set<string>();
    for (const mapping of this.allMappings) {
      if (mapping.municipality) {
        municipalities.add(mapping.municipality);
      }
    }
    return Array.from(municipalities).sort();
  }
}

export const areaMappingService = new AreaMappingService();
