import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, TrendingUp, FileText, Calculator, Users, Shield } from 'lucide-react';

const services = [
  {
    icon: Home,
    title: 'Compra y Venta',
    description: 'Te ayudamos a encontrar tu hogar ideal o a vender tu piso, sin prisas y con total transparencia.',
    features: ['Valoración gratuita', 'Marketing profesional', 'Negociación experta'],
  },
  {
    icon: TrendingUp,
    title: 'Inversión Inmobiliaria',
    description: 'Asesoramiento especializado para inversores que buscan rentabilidad en el mercado inmobiliario.',
    features: ['Análisis de rentabilidad', 'Oportunidades de inversión', 'Gestión de cartera'],
  },
  {
    icon: FileText,
    title: 'Gestión Legal',
    description: 'Nos encargamos de toda la documentación y trámites legales para que tu operación sea segura.',
    features: ['Documentación completa', 'Trámites oficiales', 'Asesoría jurídica'],
  },
  {
    icon: Calculator,
    title: 'Financiación',
    description: 'Te ayudamos a buscar opciones de hipoteca con condiciones favorables según tu perfil.',
    features: ['Comparativa de bancos', 'Asesoramiento financiero', 'Tramitación completa'],
  },
  {
    icon: Users,
    title: 'Alquiler',
    description: 'Servicios completos de alquiler tanto para propietarios como para inquilinos.',
    features: ['Gestión integral', 'Selección de inquilinos', 'Mantenimiento incluido'],
  },
  {
    icon: Shield,
    title: 'Seguros',
    description: 'Protege tu inversión con los mejores seguros de hogar, vida y protección de pagos.',
    features: ['Seguros de hogar', 'Protección hipotecaria', 'Cobertura completa'],
  },
];

const Services = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const opts = { threshold: 0.12, rootMargin: '0px 0px -40px 0px' };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in'); observer.unobserve(e.target); }
      });
    }, opts);
    document.querySelectorAll('#servicios .sr, #servicios .sr-left, #servicios .sr-right')
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="servicios" className="py-24" style={{ background: '#faf8f5' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-2xl mb-16 sr">
          <p className="font-sans font-semibold text-xs tracking-widest uppercase mb-4" style={{ color: '#998675' }}>
            LO QUE HACEMOS
          </p>
          <h2 className="text-display-sm mb-5" style={{ color: '#0f1f12' }}>
            Nuestros Servicios
          </h2>
          <p className="font-sans text-lg leading-relaxed" style={{ color: '#5e5049' }}>
            Te acompañamos en cada paso: compra, venta, alquiler e inversión, con un proceso claro y bien explicado.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {services.map((service, index) => {
            const Icon = service.icon;
            const delays = [0, 100, 200, 0, 100, 200];
            return (
              <div
                key={index}
                className={`card p-8 sr group`}
                style={{ transitionDelay: `${delays[index]}ms` }}
              >
                {/* Icon chip */}
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: '#f0ece6' }}
                >
                  <Icon className="w-5 h-5 transition-colors duration-300" style={{ color: '#223e28' }} />
                </div>

                <h3 className="font-serif font-semibold text-xl mb-3" style={{ color: '#0f1f12' }}>
                  {service.title}
                </h3>

                <p className="font-sans text-sm leading-relaxed mb-5" style={{ color: '#5e5049' }}>
                  {service.description}
                </p>

                <ul className="space-y-2 mb-6">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2.5 font-sans text-sm" style={{ color: '#3d3530' }}>
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#bfa588' }} />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => navigate('/servicios')}
                  className="font-sans font-medium text-sm cursor-pointer focus-visible:outline-2 focus-visible:outline-forest-700"
                  style={{ color: '#223e28' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#998675')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#223e28')}
                >
                  Más información →
                </button>
              </div>
            );
          })}
        </div>

        {/* CTA banner */}
        <div
          className="sr rounded-2xl p-10 md:p-14 flex flex-col md:flex-row md:items-center md:justify-between gap-8"
          style={{ background: '#223e28' }}
        >
          <div className="max-w-lg">
            <h3 className="font-serif font-semibold text-2xl md:text-3xl text-white mb-3">
              Hablemos de tu caso
            </h3>
            <p className="font-sans text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>
              Cuéntanos qué necesitas y te decimos, con claridad, cuál es la mejor forma de ayudarte.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <button
              className="cursor-pointer focus-visible:outline-2 focus-visible:outline-white"
              onClick={() => navigate('/contacto')}
              style={{
                background: '#fff', color: '#223e28',
                padding: '0.875rem 1.75rem', borderRadius: '0.75rem',
                fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '0.9375rem',
                transition: 'background 200ms ease, transform 200ms ease',
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#f4efe8'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.transform = 'none'; }}
            >
              Solicitar consulta
            </button>
            <button
              className="cursor-pointer focus-visible:outline-2 focus-visible:outline-white"
              onClick={() => window.location.href = 'tel:+34961079963'}
              style={{
                background: 'transparent', color: '#fff',
                padding: '0.875rem 1.75rem', borderRadius: '0.75rem',
                border: '1.5px solid rgba(255,255,255,0.55)',
                fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '0.9375rem',
                transition: 'background 200ms ease, border-color 200ms ease, transform 200ms ease',
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.10)'; e.currentTarget.style.borderColor = '#fff'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.55)'; e.currentTarget.style.transform = 'none'; }}
            >
              Llamar ahora
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
