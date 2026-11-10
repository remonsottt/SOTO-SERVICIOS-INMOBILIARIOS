import { canon } from './normalize';

export interface DistrictConfig {
  districtId: string;
  districtName: string;
  neighborhoods: string[];
}

export const ALLOWED_DISTRICTS: DistrictConfig[] = [
  {
    districtId: 'la_saidia',
    districtName: 'La Saïdia',
    neighborhoods: ['marxalenes', 'morvedre', 'trinitat', 'tormos'],
  },
  {
    districtId: 'campanar',
    districtName: 'Campanar',
    neighborhoods: ['campanar', 'sant_pau', 'les_tendetes'],
  },
  {
    districtId: 'benimaclet',
    districtName: 'Benimaclet',
    neighborhoods: ['benimaclet', 'cami_de_vera'],
  },
  {
    districtId: 'extramurs',
    districtName: 'Extramurs',
    neighborhoods: ['el_botanic', 'la_roqueta', 'arrancapins', 'la_petxina', 'sant_antoni', 'el_calvari', 'la_carrasca'],
  },
];

export const ALLOWED_NEIGHBORHOOD_IDS = new Set(
  ALLOWED_DISTRICTS.flatMap(d => d.neighborhoods)
);

export const OUT_OF_SCOPE_MESSAGE =
  'Esta zona todavía no está dentro de nuestras áreas de valoración. Contáctanos por WhatsApp para una valoración personalizada.';

export function isNeighborhoodAllowed(areaId: string): boolean {
  const canonAreaId = canon(areaId);
  return ALLOWED_NEIGHBORHOOD_IDS.has(canonAreaId);
}

export function getDistrictForNeighborhood(areaId: string): DistrictConfig | null {
  const canonAreaId = canon(areaId);
  return ALLOWED_DISTRICTS.find(d =>
    d.neighborhoods.some(n => canon(n) === canonAreaId)
  ) || null;
}
