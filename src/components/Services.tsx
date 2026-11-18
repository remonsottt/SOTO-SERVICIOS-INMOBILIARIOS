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
    <section id="servicios" className="py-24 section-mist">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-2xl mb-16 sr">
          <h2 className="text-display-sm mb-5 text-forest-900">
            Nuestros servicios
          </h2>
          <p className="font-sans text-lg leading-relaxed text-mist-600 font-light">
            Te acompañamos en cada paso: compra, venta, alquiler e inversión, con un proceso claro y bien explicado.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12 mb-16">
          {services.map((service, index) => {
            const Icon = service.icon;
            const delays = [0, 100, 200, 0, 100, 200];
            return (
              <div
                key={index}
                className="sr border-t border-forest-100 pt-8"
                style={{ transitionDelay: `${delays[index]}ms` }}
              >
                <Icon className="w-6 h-6 text-forest-600 mb-5" strokeWidth={1.5} />
                <h3 className="font-serif font-semibold text-xl mb-3 text-forest-900">
                  {service.title}
                </h3>
                <p className="font-sans text-sm leading-relaxed mb-5 text-mist-600">
                  {service.description}
                </p>
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2.5 font-sans text-sm text-mist-700">
                      <span className="h-px w-3 flex-shrink-0 bg-forest-400" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => navigate('/servicios')}
                  className="font-sans font-medium text-sm text-forest-700 link-animated cursor-pointer focus-visible:outline-2 focus-visible:outline-forest-700"
                >
                  Más información →
                </button>
              </div>
            );
          })}
        </div>

        <div className="sr relative overflow-hidden rounded-md p-10 md:p-14 flex flex-col md:flex-row md:items-center md:justify-between gap-8 bg-forest-800">
          <div
            className="absolute inset-0 opacity-40 pointer-events-none"
            aria-hidden="true"
            style={{
              backgroundImage:
                'radial-gradient(circle at 15% 20%, rgba(255,255,255,0.1), transparent 40%), radial-gradient(circle at 85% 80%, rgba(61,107,85,0.45), transparent 45%)',
            }}
          />
          <div className="relative max-w-lg">
            <h3 className="font-serif font-semibold text-2xl md:text-3xl text-white mb-3">
              Hablemos de tu caso
            </h3>
            <p className="font-sans text-base leading-relaxed text-white/75">
              Cuéntanos qué necesitas y te decimos, con claridad, cuál es la mejor forma de ayudarte.
            </p>
          </div>
          <div className="relative flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <button
              className="inline-flex items-center justify-center gap-2 font-sans font-medium text-[0.9375rem] py-[0.875rem] px-7 rounded-md bg-white text-forest-800 hover:bg-mist-100 transition-colors"
              onClick={() => navigate('/contacto')}
            >
              Solicitar consulta
            </button>
            <button
              className="btn-ghost-light justify-center"
              onClick={() => { window.location.href = 'tel:+34961079963'; }}
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
