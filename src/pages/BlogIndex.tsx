import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, Clock, Tag, ArrowRight } from 'lucide-react';
import { blogService } from '../services/blogService';
import type { BlogPost } from '../lib/blogStorage';
import { SEO } from '../components/SEO';

export const BlogIndex = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const allPosts = await blogService.getPublishedPosts();
        setPosts(allPosts);
        setFilteredPosts(allPosts);
      } catch (error) {
        console.error('Error loading posts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  useEffect(() => {
    let filtered = posts;

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = posts.filter(post =>
        post.title.toLowerCase().includes(lowerQuery) ||
        post.excerpt.toLowerCase().includes(lowerQuery)
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    if (selectedTag !== 'all') {
      filtered = filtered.filter(post => post.tags?.includes(selectedTag));
    }

    setFilteredPosts(filtered);
  }, [searchQuery, selectedCategory, selectedTag, posts]);

  const categories = Array.from(new Set(posts.map(post => post.category).filter(Boolean)));
  const allTags = Array.from(new Set(posts.flatMap(post => post.tags || [])));

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Cargando artículos...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Blog Inmobiliario Valencia | Consejos Compra Venta Pisos"
        description="Consejos, tendencias y novedades del mercado inmobiliario en Valencia. Guias practicas para comprar, vender o alquilar tu vivienda en Campanar y Benimaclet."
        type="website"
      />

      <div className="bg-gradient-to-b from-gray-50 to-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-light text-[#223e28] mb-4">
            Blog Inmobiliario Valencia
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Consejos, tendencias y novedades del sector inmobiliario en Valencia
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar artículos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#998675] focus:border-transparent"
              />
            </div>

            {categories.length > 0 && (
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#998675] focus:border-transparent"
              >
                <option value="all">Todas las Categorías</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            )}

            {allTags.length > 0 && (
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#998675] focus:border-transparent"
              >
                <option value="all">Todas las Etiquetas</option>
                {allTags.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            )}
          </div>

          {(searchQuery || selectedCategory !== 'all' || selectedTag !== 'all') && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Mostrando {filteredPosts.length} de {posts.length} artículos</span>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedTag('all');
                }}
                className="text-[#998675] hover:underline ml-2"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </div>

        {filteredPosts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-600">No se encontraron artículos</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group"
              >
                <Link to={`/blog/${post.slug}`}>
                  {post.coverImage && (
                    <div className="relative overflow-hidden aspect-[16/10]">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {post.category && (
                        <div className="absolute top-4 left-4">
                          <span className="bg-[#223e28] text-white px-3 py-1 rounded-full text-sm">
                            {post.category}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </Link>

                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(post.publishedAt)}</span>
                    </div>
                    {post.readTime && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{post.readTime} min</span>
                      </div>
                    )}
                  </div>

                  <Link to={`/blog/${post.slug}`}>
                    <h2 className="text-2xl font-bold text-[#223e28] mb-3 group-hover:text-[#998675] transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                  </Link>

                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.slice(0, 3).map(tag => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                        >
                          <Tag className="w-3 h-3" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <Link
                    to={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-2 text-[#998675] font-semibold hover:gap-3 transition-all"
                  >
                    Leer más
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
