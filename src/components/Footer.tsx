import React from 'react';
import { Phone, Mail, MapPin, ArrowUpRight } from 'lucide-react';

const schemaData = {
  '@context': 'https://schema.org',
  '@type': 'RealEstateAgent',
  name: 'Soto Servicios Inmobiliarios',
  image: 'https://sotoserviciosinmobiliarios.com/imagotipo_verde_6009_definitivo_copy.jpg',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Avinguda de Burjassot',
    addressLocality: 'Valencia',
    addressRegion: 'Valencia',
    postalCode: '46009',
    addressCountry: 'ES',
  },
  telephone: ['+34961079963', '+34691822053'],
  email: 'estudiomarxalenes@gmail.com',
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday'], opens: '09:30', closes: '14:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday'], opens: '17:00', closes: '20:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Friday', opens: '09:30', closes: '14:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Friday', opens: '17:00', closes: '19:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '10:00', closes: '13:00' },
  ],
  geo: { '@type': 'GeoCoordinates', latitude: '39.4899', longitude: '-0.3763' },
  url: 'https://sotoserviciosinmobiliarios.com',
  priceRange: '$$',
  areaServed: ['Campanar', 'La Zaidia', 'Benimaclet', 'Marxalenes', 'Valencia'],
  aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.5', reviewCount: '64' },
};

const colLabel = (text: string) => (
  <p
    className="font-sans font-semibold text-xs tracking-widest uppercase mb-5"
    style={{ color: 'rgba(255,255,255,0.35)' }}
  >
    {text}
  </p>
);

const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <li>
    <a
      href={href}
      className="font-sans text-sm transition-colors duration-200"
      style={{ color: 'rgba(255,255,255,0.50)' }}
      onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
      onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.50)')}
    >
      {children}
    </a>
  </li>
);

/* Half-star via SVG linearGradient */
const StarRating = () => (
  <svg width="96" height="18" viewBox="0 0 96 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="half" x1="0" x2="1" y1="0" y2="0">
        <stop offset="50%" stopColor="#FBBF24" />
        <stop offset="50%" stopColor="rgba(255,255,255,0.20)" />
      </linearGradient>
    </defs>
    {[0,1,2,3].map((i) => (
      <path
        key={i}
        d="M9 1l2.09 4.26L16 6.27l-3.5 3.41L13.18 15 9 12.77 4.82 15l.68-5.32L2 6.27l4.91-.71z"
        fill="#FBBF24"
        transform={`translate(${i * 20}, 0)`}
      />
    ))}
    <path
      d="M9 1l2.09 4.26L16 6.27l-3.5 3.41L13.18 15 9 12.77 4.82 15l.68-5.32L2 6.27l4.91-.71z"
      fill="url(#half)"
      transform="translate(80, 0)"
    />
  </svg>
);

const Footer = () => (
  <footer style={{ background: '#0f1f12', color: '#fff' }}>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

        {/* Brand */}
        <div>
          <a href="/" className="inline-block mb-6">
            <img
              src="/imagotipo_blanco+_6009_definitivo_copy.png"
              alt="Soto Servicios Inmobiliarios"
              className="h-10 w-auto"
              loading="lazy"
              style={{ padding: '2px 0' }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          </a>
          <p className="font-sans text-sm leading-relaxed mb-4 max-w-xs" style={{ color: 'rgba(255,255,255,0.50)' }}>
            Inmobiliaria familiar en Valencia. Ayudamos a propietarios a vender su vivienda con claridad, cercanía y criterio de mercado.
          </p>
          <p className="font-sans text-xs mb-5" style={{ color: 'rgba(255,255,255,0.35)' }}>
            4,5/5 en Google · 64 reseñas · +250 viviendas vendidas · +10 años en el barrio
          </p>
          <div className="flex items-center gap-2 mb-6">
            <StarRating />
            <span className="font-sans text-xs" style={{ color: 'rgba(255,255,255,0.40)' }}>4.5 (64 reseñas)</span>
          </div>
          <a
            href="https://wa.me/34691822053"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-sans font-medium text-sm px-5 py-2.5 rounded-xl cursor-pointer"
            style={{ background: '#25D366', color: '#fff', transition: 'opacity 200ms ease' }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            Contactar por WhatsApp
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>

        {/* Inmuebles */}
        <div>
          {colLabel('Inmuebles')}
          <ul className="space-y-3">
            <FooterLink href="/propiedades">Comprar</FooterLink>
            <FooterLink href="/propiedades">Alquilar</FooterLink>
            <FooterLink href="/vender-mi-piso">Vender</FooterLink>
            <FooterLink href="/propiedades">Búsqueda avanzada</FooterLink>
          </ul>
        </div>

        {/* Empresa */}
        <div>
          {colLabel('Empresa')}
          <ul className="space-y-3">
            <FooterLink href="/nosotros">Quiénes somos</FooterLink>
            <FooterLink href="/nosotros#equipo">Equipo</FooterLink>
            <FooterLink href="/contacto">Contacto</FooterLink>
            <FooterLink href="/blog">Blog</FooterLink>
          </ul>
        </div>

        {/* Contacto */}
        <div>
          {colLabel('Contacto')}
          <ul className="space-y-4">
            <li>
              <a
                href="tel:+34961079963"
                className="flex items-start gap-2.5 font-sans text-sm"
                style={{ color: 'rgba(255,255,255,0.50)' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.50)')}
              >
                <Phone className="w-4 h-4 flex-shrink-0 mt-0.5" />
                +34 961 079 963
              </a>
            </li>
            <li>
              <a
                href="mailto:estudiomarxalenes@gmail.com"
                className="flex items-start gap-2.5 font-sans text-sm break-all"
                style={{ color: 'rgba(255,255,255,0.50)' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.50)')}
              >
                <Mail className="w-4 h-4 flex-shrink-0 mt-0.5" />
                estudiomarxalenes@gmail.com
              </a>
            </li>
            <li className="flex items-start gap-2.5 font-sans text-sm" style={{ color: 'rgba(255,255,255,0.50)' }}>
              <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
              Avinguda de Burjassot, Valencia 46009
            </li>
            <li className="font-sans text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.35)' }}>
              Lun–Jue 9:30–14h · 17–20h<br />
              Vie 9:30–14h · 17–19h<br />
              Sáb 10–13h
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4"
        style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
      >
        <p className="font-sans text-xs" style={{ color: 'rgba(255,255,255,0.30)' }}>
          &copy; 2025 Soto Servicios Inmobiliarios. Todos los derechos reservados.
        </p>
        <nav className="flex gap-6">
          {[
            { href: '/es/privacidad', label: 'Política de Privacidad' },
            { href: '/es/aviso-legal', label: 'Aviso Legal' },
            { href: '/es/cookies', label: 'Cookies' },
          ].map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="font-sans text-xs transition-colors duration-200"
              style={{ color: 'rgba(255,255,255,0.30)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.70)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.30)')}
            >
              {label}
            </a>
          ))}
        </nav>
      </div>
    </div>
  </footer>
);

export default Footer;
