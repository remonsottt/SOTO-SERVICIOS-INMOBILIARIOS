import { useState, useEffect, useRef } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const navLinks = [
  { to: '/propiedades', label: 'Propiedades' },
  { to: '/servicios',   label: 'Servicios' },
  { to: '/nosotros',    label: 'Nosotros' },
  { to: '/blog',        label: 'Blog' },
  { to: '/contacto',   label: 'Contacto' },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const navRef = useRef<HTMLElement>(null);
  const [pillStyle, setPillStyle] = useState<{ left: number; width: number } | null>(null);
  const isHome = pathname === '/';
  const overHero = isHome && !scrolled && !isMenuOpen;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!navRef.current) return;
    const activeLink = navRef.current.querySelector(`[data-active="true"]`) as HTMLElement | null;
    if (activeLink && !overHero) {
      const navRect = navRef.current.getBoundingClientRect();
      const linkRect = activeLink.getBoundingClientRect();
      setPillStyle({ left: linkRect.left - navRect.left, width: linkRect.width });
    } else {
      setPillStyle(null);
    }
  }, [pathname, overHero]);

  const baseStyle: React.CSSProperties = {
    position: 'fixed',
    zIndex: 50,
    left: 0,
    right: 0,
    top: 0,
    background: overHero
      ? 'linear-gradient(180deg, rgba(26,34,28,0.45) 0%, rgba(26,34,28,0) 100%)'
      : 'rgba(247,248,247,0.92)',
    backdropFilter: overHero ? 'none' : 'blur(18px)',
    WebkitBackdropFilter: overHero ? 'none' : 'blur(18px)',
    borderBottom: overHero ? '1px solid transparent' : '1px solid rgba(40,53,43,0.08)',
    transition: 'background 280ms ease, border-color 280ms ease, backdrop-filter 280ms ease',
  };

  const linkColor = overHero ? 'rgba(255,255,255,0.88)' : '#47534c';
  const activeColor = overHero ? '#fff' : '#28352b';
  const iconColor = overHero ? '#fff' : '#28352b';

  return (
    <header style={baseStyle}>
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="flex items-center justify-between py-3 md:py-4">
          <Link
            to="/"
            className="flex-shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-forest-700"
            aria-label="Soto Servicios Inmobiliarios — inicio"
          >
            <img
              src={
                overHero
                  ? '/imagotipo_blanco_transparente.png'
                  : '/imagotipo_blanco+_6009_definitivo_copy.png'
              }
              alt="Soto Servicios Inmobiliarios"
              className="h-9 md:h-10 w-auto"
              loading="eager"
              style={{ padding: '2px 0' }}
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                // Prefer white transparent on hero; fall back to two-tone if missing
                if (overHero && !img.dataset.fallback) {
                  img.dataset.fallback = '1';
                  img.src = '/imagotipo_blanco+_6009_definitivo_copy.png';
                } else {
                  img.style.display = 'none';
                }
              }}
            />
          </Link>

          <nav ref={navRef} className="hidden md:flex items-center gap-8 relative">
            {navLinks.map(({ to, label }) => {
              const active = pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  data-active={active}
                  className="relative font-sans font-medium text-[0.9375rem] cursor-pointer focus-visible:outline-2 focus-visible:outline-forest-700 link-animated transition-colors duration-200"
                  style={{ color: active ? activeColor : linkColor }}
                >
                  {label}
                </Link>
              );
            })}
            {pillStyle && (
              <span className="nav-pill" style={{ left: pillStyle.left, width: pillStyle.width }} />
            )}
            <Link
              to="/vender-mi-piso"
              className="inline-flex items-center gap-2 text-sm font-medium font-sans py-2.5 px-5 cursor-pointer transition-all duration-200 hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-500"
              style={{
                background: overHero ? 'rgba(255,255,255,0.14)' : '#28352b',
                color: '#fff',
                border: overHero ? '1px solid rgba(255,255,255,0.35)' : '1px solid transparent',
                borderRadius: '0.375rem',
              }}
            >
              Vender mi piso
            </Link>
          </nav>

          <div className="md:hidden flex items-center gap-3">
            <Link
              to="/vender-mi-piso"
              className="inline-flex items-center text-xs font-medium font-sans py-2 px-3.5 cursor-pointer transition-opacity duration-200 hover:opacity-90"
              style={{
                background: overHero ? 'rgba(255,255,255,0.14)' : '#28352b',
                color: '#fff',
                border: overHero ? '1px solid rgba(255,255,255,0.35)' : 'none',
                borderRadius: '0.375rem',
              }}
            >
              Vender
            </Link>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 cursor-pointer focus-visible:outline-2 focus-visible:outline-forest-700"
              aria-label={isMenuOpen ? 'Cerrar menu' : 'Abrir menu'}
              style={{ color: iconColor }}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        <div
          className="md:hidden overflow-hidden"
          style={{
            maxHeight: isMenuOpen ? '320px' : '0',
            opacity: isMenuOpen ? 1 : 0,
            transition: 'max-height 0.4s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease',
          }}
        >
          <div className="py-5 border-t" style={{ borderColor: 'rgba(40,53,43,0.1)' }}>
            <nav className="flex flex-col gap-5">
              {navLinks.map(({ to, label }, i) => (
                <Link
                  key={to}
                  to={to}
                  className="font-sans font-medium text-base cursor-pointer menu-item-enter"
                  style={{
                    color: pathname === to ? '#28352b' : '#47534c',
                    animationDelay: isMenuOpen ? `${i * 60}ms` : '0ms',
                  }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
