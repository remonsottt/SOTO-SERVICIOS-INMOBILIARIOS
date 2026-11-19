import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, Clock, Tag, ArrowLeft, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';
import { marked } from 'marked';
import { blogService } from '../services/blogService';
import type { BlogPost as BlogPostType } from '../lib/blogStorage';
import { SEO } from '../components/SEO';

export const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPostType[]>([]);
  const [showShareMenu, setShowShareMenu] = useState(false);

  useEffect(() => {
    if (!slug) return;

    const loadPost = async () => {
      const foundPost = await blogService.getPostBySlug(slug);
      if (!foundPost) {
        navigate('/blog');
        return;
      }

      setPost(foundPost);
      await blogService.incrementViews(slug);

      const allPosts = await blogService.getPublishedPosts();
      const related = allPosts
        .filter(p =>
          p.id !== foundPost.id &&
          (p.category === foundPost.category ||
           p.tags?.some(tag => foundPost.tags?.includes(tag)))
        )
        .slice(0, 3);

      setRelatedPosts(related);
      window.scrollTo(0, 0);
    };

    loadPost();
  }, [slug, navigate]);

  if (!post) {
    return <div className="min-h-screen flex items-center justify-center">
      <p className="text-xl text-mist-600">Cargando...</p>
    </div>;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const shareUrl = window.location.href;
  const shareTitle = post.title;

  const handleShare = (platform: string) => {
    const urls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
    };

    window.open(urls[platform], '_blank', 'width=600,height=400');
    setShowShareMenu(false);
  };

  return (
    <div className="min-h-screen bg-mist-50">
      <SEO
        title={post.seoTitle || post.title}
        description={post.seoDescription || post.excerpt}
        image={post.coverImage || undefined}
        url={shareUrl}
        type="article"
        publishedTime={post.publishedAt}
        author={post.author}
        tags={post.tags}
      />

      <article className="max-w-3xl mx-auto px-4 md:px-6 py-12">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-[#998675] hover:text-[#28352b] mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al blog
        </Link>

        <div className="mb-8">
          {post.category && (
            <div className="inline-block bg-[#28352b] text-white px-4 py-1 rounded-full text-sm mb-4">
              {post.category}
            </div>
          )}

          <h1 className="text-4xl md:text-5xl font-bold text-[#28352b] mb-4 leading-tight">
            {post.title}
          </h1>

          {post.subtitle && (
            <p className="text-xl text-mist-600 mb-6">
              {post.subtitle}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-6 text-mist-600 mb-6">
            {post.author && (
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-[#998675] rounded-full flex items-center justify-center text-white font-semibold">
                  {post.author.charAt(0)}
                </div>
                <span className="font-medium">{post.author}</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(post.publishedAt)}</span>
            </div>

            {post.readTime && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{post.readTime} min de lectura</span>
              </div>
            )}

            <div className="relative ml-auto">
              <button
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="flex items-center gap-2 px-4 py-2 bg-mist-200 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <Share2 className="w-4 h-4" />
                Compartir
              </button>

              {showShareMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-mist-50 rounded-lg shadow-xl border border-mist-300 py-2 z-10">
                  <button
                    onClick={() => handleShare('facebook')}
                    className="w-full px-4 py-2 text-left hover:bg-mist-100 flex items-center gap-3"
                  >
                    <Facebook className="w-4 h-4" />
                    Facebook
                  </button>
                  <button
                    onClick={() => handleShare('twitter')}
                    className="w-full px-4 py-2 text-left hover:bg-mist-100 flex items-center gap-3"
                  >
                    <Twitter className="w-4 h-4" />
                    Twitter
                  </button>
                  <button
                    onClick={() => handleShare('linkedin')}
                    className="w-full px-4 py-2 text-left hover:bg-mist-100 flex items-center gap-3"
                  >
                    <Linkedin className="w-4 h-4" />
                    LinkedIn
                  </button>
                </div>
              )}
            </div>
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 text-sm bg-mist-200 text-mist-800 px-3 py-1 rounded-full"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {post.coverImage && (
          <div className="mb-12">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-auto rounded-2xl shadow-lg"
            />
          </div>
        )}

        <div className="notion-content-wrapper">
          <div
            className="notion-content"
            dangerouslySetInnerHTML={{ __html: marked(post.content) }}
          />
        </div>
      </article>

      {relatedPosts.length > 0 && (
        <div className="bg-mist-100 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-[#28352b] mb-8">Artículos Relacionados</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  to={`/blog/${relatedPost.slug}`}
                  className="bg-mist-50 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group"
                >
                  {relatedPost.coverImage && (
                    <div className="relative overflow-hidden aspect-[16/10]">
                      <img
                        src={relatedPost.coverImage}
                        alt={relatedPost.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-[#28352b] mb-2 group-hover:text-[#998675] transition-colors line-clamp-2">
                      {relatedPost.title}
                    </h3>
                    <p className="text-mist-600 text-sm line-clamp-2">
                      {relatedPost.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
