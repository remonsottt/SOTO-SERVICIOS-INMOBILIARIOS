import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  author?: string;
  tags?: string[];
  noIndex?: boolean;
}

const BASE_URL = 'https://sotoserviciosinmobiliarios.com';

export const SEO = ({
  title,
  description,
  image = 'https://sotoserviciosinmobiliarios.com/imagotipo_verde_6009_definitivo_copy.jpg',
  url,
  type = 'website',
  publishedTime,
  author,
  tags = [],
  noIndex = false
}: SEOProps) => {
  const location = useLocation();

  useEffect(() => {
    document.title = title;

    const canonicalUrl = url || `${BASE_URL}${location.pathname}`;
    const robotsContent = noIndex ? 'noindex, nofollow' : 'index, follow';

    const metaTags = [
      { name: 'description', content: description },
      { name: 'robots', content: robotsContent },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:image', content: image },
      { property: 'og:type', content: type },
      { property: 'og:url', content: canonicalUrl },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: image },
    ];

    metaTags.forEach(({ name, property, content }) => {
      const attribute = name ? 'name' : 'property';
      const value = name || property;
      let element = document.querySelector(`meta[${attribute}="${value}"]`);

      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, value!);
        document.head.appendChild(element);
      }

      element.setAttribute('content', content);
    });

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);

    if (type === 'article') {
      const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: title,
        description: description,
        image: image,
        datePublished: publishedTime,
        author: {
          '@type': 'Person',
          name: author || 'Soto Servicios Inmobiliarios'
        },
        publisher: {
          '@type': 'Organization',
          name: 'Soto Servicios Inmobiliarios',
          logo: {
            '@type': 'ImageObject',
            url: `${BASE_URL}/imagotipo_verde_6009_definitivo_copy.jpg`
          }
        },
        keywords: tags.join(', ')
      };

      let script = document.querySelector('script[type="application/ld+json"]');
      if (!script) {
        script = document.createElement('script');
        script.setAttribute('type', 'application/ld+json');
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(structuredData);
    }
  }, [title, description, image, url, type, publishedTime, author, tags, noIndex, location.pathname]);

  return null;
};
