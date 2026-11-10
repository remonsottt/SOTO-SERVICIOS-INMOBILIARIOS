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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!navRef.current) return;
    const activeLink = navRef.current.querySelector(`[data-active="true"]`) as HTMLElement | null;
    if (activeLink) {
      const navRect = navRef.current.getBoundingClientRect();
      const linkRect = activeLink.getBoundingClientRect();
      setPillStyle({ left: linkRect.left - navRect.left, width: linkRect.width });
    } else {
      setPillStyle(null);
    }
  }, [pathname]);

  const baseStyle: React.CSSProperties = {
    position: 'fixed',
    zIndex: 50,
    left: scrolled ? 0 : '1rem',
    right: scrolled ? 0 : '1rem',
    top: scrolled ? 0 : '1rem',
    borderRadius: scrolled ? 0 : '1rem',
    background: 'rgba(250,248,245,0.92)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderBottom: scrolled ? '1px solid rgba(153,134,117,0.15)' : '1px solid rgba(153,134,117,0.2)',
    boxShadow: scrolled ? 'none' : '0 4px 24px -4px rgba(15,31,18,0.10)',
    transition: 'left 300ms ease, right 300ms ease, top 300ms ease, border-radius 300ms ease, box-shadow 300ms ease',
  };

  return (
    <header style={baseStyle}>
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="flex items-center justify-between py-3 md:py-4">
          <Link to="/" className="flex-shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-forest-700">
            <img
              src="/imagotipo_verde_6009_definitivo_copy.jpg"
              alt="Soto Servicios Inmobiliarios"
              className="h-10 w-auto"
              loading="eager"
              style={{ padding: '2px 0' }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
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
                  style={{ color: active ? '#223e28' : '#5e5049' }}
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
              style={{ background: '#998675' }}
              className="inline-flex items-center gap-2 text-white text-sm font-medium font-sans py-3 px-6 rounded-xl cursor-pointer transition-all duration-200 hover:opacity-90 hover:-translate-y-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sand-500"
            >
              Vender mi piso
            </Link>
          </nav>

          <div className="md:hidden flex items-center gap-3">
            <Link
              to="/vender-mi-piso"
              style={{ background: '#998675' }}
              className="inline-flex items-center text-white text-xs font-medium font-sans py-2 px-4 rounded-xl cursor-pointer transition-opacity duration-200 hover:opacity-90"
            >
              Vender
            </Link>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 cursor-pointer focus-visible:outline-2 focus-visible:outline-forest-700"
              aria-label={isMenuOpen ? 'Cerrar menu' : 'Abrir menu'}
              style={{ color: '#223e28' }}
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
          <div className="py-5 border-t" style={{ borderColor: 'rgba(153,134,117,0.15)' }}>
            <nav className="flex flex-col gap-5">
              {navLinks.map(({ to, label }, i) => (
                <Link
                  key={to}
                  to={to}
                  className="font-sans font-medium text-base cursor-pointer menu-item-enter"
                  style={{
                    color: pathname === to ? '#223e28' : '#5e5049',
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
