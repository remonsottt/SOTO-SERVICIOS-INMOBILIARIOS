import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, Eye, ArrowLeft, X, Plus } from 'lucide-react';
import { blogStorage, generateSlug, calculateReadTime } from '../lib/blogStorage';

export const BlogEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    excerpt: '',
    content: '',
    coverImage: '',
    author: 'Equipo Soto Inmobiliaria',
    category: '',
    tags: [] as string[],
    status: 'draft' as 'draft' | 'published',
    seoTitle: '',
    seoDescription: ''
  });
  const [tagInput, setTagInput] = useState('');
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    if (id) {
      const posts = blogStorage.getAllPosts();
      const post = posts.find(p => p.id === id);
      if (post) {
        setFormData({
          title: post.title ?? '',
          subtitle: post.subtitle ?? '',
          excerpt: post.excerpt ?? '',
          content: post.content ?? '',
          coverImage: post.coverImage ?? '',
          author: post.author ?? 'Equipo Soto Inmobiliaria',
          category: post.category ?? '',
          tags: post.tags ?? [],
          status: post.status ?? 'draft',
          seoTitle: post.seoTitle ?? '',
          seoDescription: post.seoDescription ?? ''
        });
      }
    }
  }, [id]);

  const handleSubmit = (status: 'draft' | 'published') => {
    if (!formData.title || !formData.content) {
      alert('El título y el contenido son obligatorios');
      return;
    }

    const slug = generateSlug(formData.title);
    const readTime = calculateReadTime(formData.content);

    const postData = {
      ...formData,
      slug,
      readTime,
      status,
      publishedAt: status === 'published' ? new Date().toISOString() : formData.excerpt,
      seoTitle: formData.seoTitle || formData.title,
      seoDescription: formData.seoDescription || formData.excerpt,
      views: 0
    };

    if (id) {
      blogStorage.updatePost(id, postData);
    } else {
      blogStorage.createPost(postData);
    }

    navigate('/blog');
  };

  const addTag = () => {
    if (tagInput && !formData.tags.includes(tagInput)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const insertFormatting = (tag: string) => {
    const textarea = document.getElementById('content') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = formData.content.substring(start, end);
    let newText = '';

    switch (tag) {
      case 'h2':
        newText = `<h2>${selectedText || 'Título'}</h2>`;
        break;
      case 'h3':
        newText = `<h3>${selectedText || 'Subtítulo'}</h3>`;
        break;
      case 'p':
        newText = `<p>${selectedText || 'Párrafo'}</p>`;
        break;
      case 'ul':
        newText = `<ul>\n<li>${selectedText || 'Item'}</li>\n</ul>`;
        break;
      case 'blockquote':
        newText = `<blockquote>${selectedText || 'Cita'}</blockquote>`;
        break;
      case 'strong':
        newText = `<strong>${selectedText || 'Texto en negrita'}</strong>`;
        break;
    }

    const before = formData.content.substring(0, start);
    const after = formData.content.substring(end);

    setFormData(prev => ({
      ...prev,
      content: before + newText + after
    }));

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + newText.length, start + newText.length);
    }, 0);
  };

  if (preview) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <button
            onClick={() => setPreview(false)}
            className="mb-8 flex items-center gap-2 text-[#998675] hover:text-[#223e28]"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al editor
          </button>

          <div className="mb-8">
            <div className="inline-block bg-[#223e28] text-white px-4 py-1 rounded-full text-sm mb-4">
              {formData.category}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-[#223e28] mb-4">
              {formData.title}
            </h1>
            {formData.subtitle && (
              <p className="text-xl text-gray-600 mb-6">{formData.subtitle}</p>
            )}
          </div>

          {formData.coverImage && (
            <img
              src={formData.coverImage}
              alt={formData.title}
              className="w-full h-auto rounded-2xl shadow-lg mb-12"
            />
          )}

          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: formData.content }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/blog')}
              className="flex items-center gap-2 text-gray-600 hover:text-[#223e28]"
            >
              <ArrowLeft className="w-4 h-4" />
              Cancelar
            </button>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setPreview(true)}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Eye className="w-4 h-4" />
                Vista previa
              </button>

              <button
                onClick={() => handleSubmit('draft')}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Guardar borrador
              </button>

              <button
                onClick={() => handleSubmit('published')}
                className="flex items-center gap-2 px-6 py-2 bg-[#223e28] text-white rounded-lg hover:bg-[#2d5236] transition-colors"
              >
                <Save className="w-4 h-4" />
                Publicar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-3 text-2xl font-bold border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#998675] focus:border-transparent"
                placeholder="Título del artículo"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subtítulo
              </label>
              <input
                type="text"
                value={formData.subtitle}
                onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#998675] focus:border-transparent"
                placeholder="Subtítulo del artículo"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Extracto
              </label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#998675] focus:border-transparent"
                placeholder="Breve descripción del artículo"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contenido * (HTML)
              </label>

              <div className="mb-2 flex flex-wrap gap-2">
                <button
                  onClick={() => insertFormatting('h2')}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
                >
                  H2
                </button>
                <button
                  onClick={() => insertFormatting('h3')}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
                >
                  H3
                </button>
                <button
                  onClick={() => insertFormatting('p')}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
                >
                  Párrafo
                </button>
                <button
                  onClick={() => insertFormatting('ul')}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
                >
                  Lista
                </button>
                <button
                  onClick={() => insertFormatting('blockquote')}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
                >
                  Cita
                </button>
                <button
                  onClick={() => insertFormatting('strong')}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
                >
                  Negrita
                </button>
              </div>

              <textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                rows={20}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#998675] focus:border-transparent font-mono text-sm"
                placeholder="Contenido del artículo en HTML..."
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">Configuración</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Imagen de portada (URL)
                  </label>
                  <input
                    type="text"
                    value={formData.coverImage}
                    onChange={(e) => setFormData(prev => ({ ...prev, coverImage: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#998675] focus:border-transparent text-sm"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Autor
                  </label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#998675] focus:border-transparent text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoría
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#998675] focus:border-transparent text-sm"
                    placeholder="Ej: Guías de Venta"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Etiquetas
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#998675] focus:border-transparent text-sm"
                      placeholder="Nueva etiqueta"
                    />
                    <button
                      onClick={addTag}
                      className="px-3 py-2 bg-[#223e28] text-white rounded-lg hover:bg-[#2d5236]"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map(tag => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-sm"
                      >
                        {tag}
                        <button onClick={() => removeTag(tag)}>
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">SEO</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título SEO
                  </label>
                  <input
                    type="text"
                    value={formData.seoTitle}
                    onChange={(e) => setFormData(prev => ({ ...prev, seoTitle: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#998675] focus:border-transparent text-sm"
                    placeholder="Título optimizado para SEO"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción SEO
                  </label>
                  <textarea
                    value={formData.seoDescription}
                    onChange={(e) => setFormData(prev => ({ ...prev, seoDescription: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#998675] focus:border-transparent text-sm"
                    placeholder="Descripción para motores de búsqueda"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
