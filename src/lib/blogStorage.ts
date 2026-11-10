export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  author?: string;
  publishedAt: string;
  status?: 'draft' | 'published';
  tags?: string[];
  category?: string;
  readTime?: number;
  seoTitle?: string;
  seoDescription?: string;
  views?: number;
}

const STORAGE_KEY = 'blog_posts';

export const blogStorage = {
  getAllPosts: (): BlogPost[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  getPublishedPosts: (): BlogPost[] => {
    return blogStorage.getAllPosts()
      .filter(post => post.status === 'published')
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  },

  getPostBySlug: (slug: string): BlogPost | null => {
    const posts = blogStorage.getAllPosts();
    return posts.find(post => post.slug === slug) || null;
  },

  createPost: (post: Omit<BlogPost, 'id'>): BlogPost => {
    const posts = blogStorage.getAllPosts();
    const newPost: BlogPost = {
      ...post,
      id: Date.now().toString(),
    };
    posts.push(newPost);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    return newPost;
  },

  updatePost: (id: string, updates: Partial<BlogPost>): BlogPost | null => {
    const posts = blogStorage.getAllPosts();
    const index = posts.findIndex(post => post.id === id);
    if (index === -1) return null;

    posts[index] = { ...posts[index], ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    return posts[index];
  },

  deletePost: (id: string): boolean => {
    const posts = blogStorage.getAllPosts();
    const filtered = posts.filter(post => post.id !== id);
    if (filtered.length === posts.length) return false;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  },

  searchPosts: (query: string): BlogPost[] => {
    const posts = blogStorage.getPublishedPosts();
    const lowerQuery = query.toLowerCase();
    return posts.filter(post =>
      post.title.toLowerCase().includes(lowerQuery) ||
      post.excerpt.toLowerCase().includes(lowerQuery) ||
      (post.tags && post.tags.some(tag => tag.toLowerCase().includes(lowerQuery)))
    );
  },

  getPostsByCategory: (category: string): BlogPost[] => {
    return blogStorage.getPublishedPosts()
      .filter(post => post.category === category);
  },

  getPostsByTag: (tag: string): BlogPost[] => {
    return blogStorage.getPublishedPosts()
      .filter(post => post.tags && post.tags.includes(tag));
  },

  incrementViews: (slug: string): void => {
    const posts = blogStorage.getAllPosts();
    const post = posts.find(p => p.slug === slug);
    if (post) {
      post.views = (post.views || 0) + 1;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    }
  }
};

export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

export const calculateReadTime = (content: string): number => {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};

export const seedBlogPosts = (): void => {
  const existingPosts = blogStorage.getAllPosts();
  if (existingPosts.length > 0) return;

  const samplePosts: Omit<BlogPost, 'id'>[] = [
    {
      slug: 'guia-completa-vender-piso-valencia-2024',
      title: 'Guía Completa para Vender tu Piso en Valencia en 2024',
      subtitle: 'Todo lo que necesitas saber para vender tu propiedad al mejor precio',
      excerpt: 'Descubre las estrategias clave, documentación necesaria y mejores prácticas para vender tu piso en Valencia de manera exitosa.',
      content: `<h2>Preparación de la Vivienda</h2>
<p>Antes de poner tu piso en el mercado, es fundamental prepararlo adecuadamente. Una buena presentación puede aumentar el valor percibido hasta un 10%.</p>

<h3>Mejoras que Aumentan el Valor</h3>
<ul>
<li>Pintura fresca en tonos neutros</li>
<li>Reparación de pequeños desperfectos</li>
<li>Mejora de la iluminación</li>
<li>Actualización de electrodomésticos en la cocina</li>
<li>Renovación del baño si es necesario</li>
</ul>

<h2>Documentación Necesaria</h2>
<p>Reunir toda la documentación con antelación agiliza el proceso de venta:</p>
<ul>
<li>Escrituras de la propiedad</li>
<li>Certificado de eficiencia energética</li>
<li>IBI y recibos de comunidad al día</li>
<li>Cédula de habitabilidad</li>
<li>Planos y licencias de obra</li>
</ul>

<h2>Estrategia de Precio</h2>
<p>El precio es el factor más importante. Un precio bien ajustado puede reducir el tiempo de venta en un 50%. En Soto Servicios Inmobiliarios realizamos tasaciones profesionales basadas en:</p>
<ul>
<li>Análisis comparativo de mercado</li>
<li>Estado de la vivienda</li>
<li>Ubicación y servicios cercanos</li>
<li>Tendencias actuales del mercado valenciano</li>
</ul>

<blockquote>"Un precio realista desde el inicio genera más visitas y mejores ofertas que un precio inicial alto que luego se reduce."</blockquote>

<h2>Marketing y Promoción</h2>
<p>La visibilidad es clave. Utilizamos:</p>
<ul>
<li>Fotografía profesional de alta calidad</li>
<li>Tours virtuales 360°</li>
<li>Publicación en principales portales inmobiliarios</li>
<li>Promoción en redes sociales</li>
<li>Base de datos de clientes potenciales</li>
</ul>`,
      coverImage: 'https://images.pexels.com/photos/1546168/pexels-photo-1546168.jpeg?auto=compress&cs=tinysrgb&w=1200',
      author: 'Equipo Soto Inmobiliaria',
      publishedAt: '2024-03-15T10:00:00Z',
      status: 'published',
      tags: ['Vender', 'Consejos', 'Valencia', 'Tasación'],
      category: 'Guías de Venta',
      readTime: 8,
      seoTitle: 'Cómo Vender tu Piso en Valencia 2024 - Guía Completa',
      seoDescription: 'Guía paso a paso para vender tu piso en Valencia: preparación, documentación, precio, marketing y cierre de venta con expertos.',
      views: 0
    },
    {
      slug: 'mejores-barrios-vivir-valencia-familias',
      title: 'Los Mejores Barrios de Valencia para Vivir en Familia',
      subtitle: 'Descubre las zonas más familiares de la ciudad',
      excerpt: 'Analizamos los barrios de Valencia con mejores colegios, parques, servicios y calidad de vida para familias.',
      content: `<h2>Campanar: Tranquilidad y Conectividad</h2>
<p>Campanar se ha convertido en uno de los barrios más demandados por familias. Combina la tranquilidad de una zona residencial con excelente conectividad al centro.</p>

<h3>Ventajas de Campanar</h3>
<ul>
<li>Numerosos colegios públicos y privados</li>
<li>Parque de Cabecera a pocos minutos</li>
<li>Buena conexión de metro y autobús</li>
<li>Comercio local y centros comerciales cercanos</li>
<li>Ambiente tranquilo y seguro</li>
</ul>

<h2>Benimaclet: Carácter de Pueblo</h2>
<p>Este barrio mantiene un ambiente de pueblo dentro de la ciudad, con una fuerte comunidad vecinal.</p>

<h3>Lo que hace especial a Benimaclet</h3>
<ul>
<li>Plaza del pueblo con mercado tradicional</li>
<li>Ambiente bohemio y cultural</li>
<li>Precios más asequibles que el centro</li>
<li>Cercanía a universidades</li>
<li>Vida de barrio activa</li>
</ul>

<h2>Ciutat de les Arts i les Ciències</h2>
<p>La zona moderna por excelencia, ideal para familias que buscan viviendas nuevas y servicios modernos.</p>

<blockquote>"Valencia ofrece barrios para todos los gustos: desde el encanto tradicional hasta la modernidad más vanguardista."</blockquote>

<h2>Factores a Considerar</h2>
<p>Al elegir barrio para tu familia, considera:</p>
<ul>
<li>Proximidad a colegios de calidad</li>
<li>Espacios verdes y zonas de juego</li>
<li>Transporte público</li>
<li>Comercios y servicios básicos</li>
<li>Seguridad del entorno</li>
<li>Comunidad y ambiente vecinal</li>
</ul>`,
      coverImage: 'https://images.pexels.com/photos/2462015/pexels-photo-2462015.jpeg?auto=compress&cs=tinysrgb&w=1200',
      author: 'María González',
      publishedAt: '2024-03-10T09:00:00Z',
      status: 'published',
      tags: ['Valencia', 'Barrios', 'Familias', 'Comprar'],
      category: 'Vivir en Valencia',
      readTime: 6,
      seoTitle: 'Mejores Barrios de Valencia para Familias 2024',
      seoDescription: 'Guía de los barrios más familiares de Valencia: Campanar, Benimaclet y más. Colegios, parques y calidad de vida.',
      views: 0
    },
    {
      slug: 'inversion-inmobiliaria-valencia-rentabilidad',
      title: 'Inversión Inmobiliaria en Valencia: ¿Qué Rentabilidad Esperar?',
      subtitle: 'Análisis del mercado de inversión inmobiliaria valenciano',
      excerpt: 'Datos actualizados sobre rentabilidad, zonas de inversión y tendencias del mercado inmobiliario para inversores.',
      content: `<h2>El Mercado de Inversión en Valencia</h2>
<p>Valencia se ha consolidado como una de las ciudades más atractivas para la inversión inmobiliaria en España, con rentabilidades superiores a la media nacional.</p>

<h3>Rentabilidad Actual por Alquiler</h3>
<ul>
<li>Centro histórico: 5-6% bruto anual</li>
<li>Ruzafa y Benimaclet: 5.5-7% bruto anual</li>
<li>Playa de la Malvarrosa: 4.5-5.5% bruto anual</li>
<li>Zona universitaria: 6-8% bruto anual</li>
</ul>

<h2>Zonas con Mayor Potencial</h2>
<p>Las áreas con mejor proyección de revalorización incluyen:</p>

<h3>Cabanyal-Canyamelar</h3>
<p>Barrio en plena transformación con importante inversión pública y privada. Precios aún accesibles con alta proyección de crecimiento.</p>

<h3>Benicalap</h3>
<p>Zona residencial con buena conectividad y servicios, precios atractivos y demanda estable de alquiler.</p>

<h2>Tipos de Inversión</h2>

<h3>Alquiler Tradicional</h3>
<ul>
<li>Rentabilidad: 4-6% neto anual</li>
<li>Estabilidad: Alta</li>
<li>Gestión: Media</li>
<li>Ideal para: Inversión a largo plazo</li>
</ul>

<h3>Alquiler Turístico</h3>
<ul>
<li>Rentabilidad: 6-10% neto anual</li>
<li>Estabilidad: Media</li>
<li>Gestión: Alta</li>
<li>Ideal para: Inversores activos</li>
</ul>

<blockquote>"La clave de una buena inversión inmobiliaria está en elegir la ubicación correcta y entender el público objetivo."</blockquote>

<h2>Factores de Éxito</h2>
<p>Para maximizar la rentabilidad de tu inversión:</p>
<ul>
<li>Analiza la demanda real de la zona</li>
<li>Considera los costes de mantenimiento y comunidad</li>
<li>Valora la fiscalidad del alquiler</li>
<li>Estudia la competencia en la zona</li>
<li>Planifica el estado y posibles reformas</li>
</ul>

<h2>Conclusión</h2>
<p>Valencia ofrece oportunidades interesantes para inversores, con rentabilidades superiores a otras grandes ciudades españolas y un mercado en crecimiento sostenido.</p>`,
      coverImage: 'https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?auto=compress&cs=tinysrgb&w=1200',
      author: 'Carlos Martínez',
      publishedAt: '2024-03-05T11:00:00Z',
      status: 'published',
      tags: ['Inversión', 'Rentabilidad', 'Alquiler', 'Análisis de Mercado'],
      category: 'Inversión',
      readTime: 7,
      seoTitle: 'Inversión Inmobiliaria Valencia: Rentabilidad y Oportunidades 2024',
      seoDescription: 'Análisis completo del mercado de inversión inmobiliaria en Valencia: rentabilidades, mejores zonas y consejos para inversores.',
      views: 0
    }
  ];

  samplePosts.forEach(post => blogStorage.createPost(post));
};
