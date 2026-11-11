import { edgeFetch } from '../lib/edgeClient';

const PLACEHOLDER_IMAGE = '/assets/property-fallback-premium.png';

export interface NotionProperty {
  id: string;
  slug: string;
  estado: string;
  destacado: boolean;
  titulo: string;
  descripcion: string;
  barrio: string;
  ciudad: string;
  provincia: string;
  precio: number;
  superficieM2: number;
  habitaciones: number;
  banos: number;
  planta: number | null;
  ascensor: boolean;
  garaje: boolean;
  terraza: boolean;
  estadoInmueble: string | null;
  fechaPublicacion: string | null;
  anoConstruccion: number | null;
  imagenPortada: string | null;
  galeria: string[];
  plano: string | null;
  updatedAt: string;
}

export interface Property {
  id: string;
  slug: string;
  title: string;
  location: string;
  neighborhood: string;
  city: string;
  price: string;
  beds: number;
  baths: number;
  area: number;
  usefulArea?: number;
  images: string[];
  featured: boolean;
  photos: number;
  description: string;
  type: string;
  floor?: string;
  elevator: boolean;
  garage: boolean;
  terrace: boolean;
  yearBuilt?: number;
  state: string;
  energyCertificate?: string;
  features: string[];
}

function formatPrice(amount: number, currency: string): string {
  const formatter = new Intl.NumberFormat('es-ES', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const symbol = currency === 'EUR' ? '€' : currency;
  return `${formatter.format(amount)}${symbol}`;
}

function transformNotionToProperty(notionProp: NotionProperty): Property {
  console.log('🔍 RAW NOTION PROPERTY:', {
    titulo: notionProp.titulo,
    imagenPortada: notionProp.imagenPortada,
    galeria: notionProp.galeria,
    imagenPortadaType: typeof notionProp.imagenPortada,
    galeriaType: typeof notionProp.galeria,
    galeriaIsArray: Array.isArray(notionProp.galeria),
  });

  const locationStr = [
    notionProp.barrio,
    notionProp.ciudad
  ].filter(Boolean).join(', ');

  let images: string[] = [];
  if (notionProp.galeria && notionProp.galeria.length > 0) {
    images = notionProp.galeria.filter(img => img && img.trim() !== '');
    console.log('✅ Using galeria:', images);
  } else if (notionProp.imagenPortada && notionProp.imagenPortada.trim() !== '') {
    images = [notionProp.imagenPortada];
    console.log('✅ Using imagenPortada:', images);
  }

  if (images.length === 0) {
    images = [PLACEHOLDER_IMAGE];
    console.log('⚠️ Using PLACEHOLDER:', images);
  }

  return {
    id: notionProp.id,
    slug: notionProp.slug,
    title: notionProp.titulo || 'Sin título',
    location: locationStr || 'Valencia',
    neighborhood: notionProp.barrio || '',
    city: notionProp.ciudad || 'Valencia',
    price: formatPrice(notionProp.precio || 0, 'EUR'),
    beds: notionProp.habitaciones || 0,
    baths: notionProp.banos || 0,
    area: notionProp.superficieM2 || 0,
    usefulArea: notionProp.superficieM2 || 0,
    images: images,
    featured: notionProp.destacado || false,
    photos: images.length,
    description: notionProp.descripcion || '',
    type: notionProp.estadoInmueble || 'Propiedad',
    floor: notionProp.planta?.toString(),
    elevator: notionProp.ascensor || false,
    garage: notionProp.garaje || false,
    terrace: notionProp.terraza || false,
    yearBuilt: notionProp.anoConstruccion || undefined,
    state: notionProp.estadoInmueble || 'Buen estado',
    energyCertificate: undefined,
    features: [],
  };
}

let cachedProperties: Property[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000;

async function fetchPropertiesFromNotion(): Promise<Property[]> {
  const now = Date.now();

  if (cachedProperties && (now - cacheTimestamp) < CACHE_DURATION) {
    console.log('Returning cached properties:', cachedProperties.length);
    return cachedProperties;
  }

  try {
    const response = await edgeFetch('notion-properties', {
      method: 'GET',
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('Number of properties returned:', data?.items?.length || 0);

    if (!data || !data.items || !Array.isArray(data.items)) {
      console.error('Invalid data structure:', data);
      throw new Error('Invalid response format from API');
    }

    const properties = data.items.map(transformNotionToProperty);

    cachedProperties = properties;
    cacheTimestamp = now;

    return properties;
  } catch (error) {
    console.error('Error fetching properties from Notion:', error);
    throw error;
  }
}

export const propertyService = {
  getAllProperties: async (): Promise<Property[]> => {
    return fetchPropertiesFromNotion();
  },

  getFeaturedProperties: async (): Promise<Property[]> => {
    const properties = await fetchPropertiesFromNotion();
    return properties.filter(p => p.featured).slice(0, 6);
  },

  getPropertyBySlug: async (slug: string): Promise<Property | null> => {
    const properties = await fetchPropertiesFromNotion();
    return properties.find(p => p.slug === slug) || null;
  },

  filterPropertiesByNeighborhood: async (neighborhood: string): Promise<Property[]> => {
    const properties = await fetchPropertiesFromNotion();
    if (!neighborhood) return properties;
    return properties.filter(p =>
      p.neighborhood.toLowerCase().includes(neighborhood.toLowerCase())
    );
  },

  clearCache: () => {
    cachedProperties = null;
    cacheTimestamp = 0;
  },
};
