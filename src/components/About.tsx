import { useEffect, useRef, useState } from 'react';
import { Check } from 'lucide-react';

const stats = [
  { number: 10,  suffix: '+', label: 'Años en el barrio' },
  { number: 250, suffix: '+', label: 'Familias satisfechas' },
  { number: 4.5, suffix: '',  label: 'Valoración media', decimals: 1 },
];

const team = [
  {
    name: 'Katia Soto',
    role: 'Gerente',
    image: '/foto_katia.jpeg',
    bio: 'Dirige la estrategia comercial de la agencia y acompaña personalmente cada operación. Con más de una década en el sector, su criterio de mercado marca la diferencia a la hora de fijar precios realistas y cerrar ventas con éxito.',
  },
  {
    name: 'Raúl Soto',
    role: 'Agente comercial y marketing',
    image: '/data/foto_raul.png',
    bio: 'Se encarga de la captación y la estrategia comercial. Trabaja codo con codo con el equipo para que cada vivienda llegue al comprador adecuado, combinando conocimiento de zona con las herramientas de marketing actuales.',
  },
  {
    name: 'Carol Soto',
    role: 'Coordinadora',
    image: '/foto_carolim_.jpeg',
    bio: 'Se encarga de que cada cliente tenga información clara en todo momento. Coordina visitas, documentación y seguimiento para que el proceso sea fluido de principio a fin, sin sorpresas ni tiempos muertos.',
  },
];

const bullets = [
  'Asesoramiento personalizado y profesional',
  'Transparencia total en todas nuestras operaciones',
  'Compromiso con la satisfacción del cliente',
];

function AnimatedStat({ number, suffix, label, decimals = 0 }: { number: number; suffix: string; label: string; decimals?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const duration = 1800;
          const step = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(eased * number);
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [number]);

  const display = decimals > 0 ? count.toFixed(decimals) : Math.round(count).toString();

  return (
    <div ref={ref} className="text-center">
      <p className="font-serif font-bold text-3xl md:text-4xl mb-1 text-forest-800">
        {display}{suffix}
      </p>
      <p className="font-sans text-sm text-mist-600">{label}</p>
    </div>
  );
}

const About = () => {
  useEffect(() => {
    const opts = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in'); observer.unobserve(e.target); }
      });
    }, opts);
    document.querySelectorAll('#nosotros .sr, #nosotros .sr-left, #nosotros .sr-right')
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="nosotros" className="py-24 section-paper">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-3xl mb-16 sr">
          <h2 className="text-display-sm mb-6 text-forest-900">
            Una familia.{' '}
            <em className="font-serif not-italic text-forest-500">Tu barrio.</em>
          </h2>
          <p className="font-sans text-base leading-relaxed mb-4 text-mist-600">
            Somos una inmobiliaria familiar con más de 10 años en el barrio. Conocemos cada rincón
            de Campanar, La Zaidía, Benimaclet y Marxalenes porque aquí es donde trabajamos, vivimos
            y ayudamos a nuestros vecinos a encontrar su hogar.
          </p>
          <p className="font-sans text-base leading-relaxed text-mist-600">
            Nos importa cada persona que cruza nuestra puerta. No somos una gran cadena, somos un
            equipo cercano que te acompaña en cada paso: desde la primera visita hasta la firma,
            con honestidad y sin prisas.
          </p>
        </div>

        <div className="max-w-3xl mb-16 sr">
          <ul className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {bullets.map((text) => (
              <li key={text} className="flex items-start gap-3 font-sans text-sm text-mist-700">
                <span className="mt-0.5 w-5 h-5 rounded-sm flex items-center justify-center flex-shrink-0 bg-forest-700">
                  <Check className="w-3 h-3 text-white" strokeWidth={3} />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        <div className="border border-forest-100 bg-mist-50/80 px-8 py-10 grid grid-cols-3 gap-8 mb-20 sr">
          {stats.map((stat) => (
            <AnimatedStat
              key={stat.label}
              number={stat.number}
              suffix={stat.suffix}
              label={stat.label}
              decimals={stat.decimals}
            />
          ))}
        </div>

        <div className="mb-12 sr">
          <h3 className="text-display-sm mb-3 text-forest-900">Nuestro equipo</h3>
          <p className="font-sans text-lg text-mist-600 font-light">
            Un equipo familiar que te acompaña de principio a fin
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 max-w-5xl">
          {team.map(({ name, role, image, bio }, i) => (
            <div
              key={name}
              className="sr"
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              <img
                src={image}
                alt={`${name} — ${role} en Soto Servicios Inmobiliarios`}
                className="w-full aspect-[4/5] object-cover mb-6"
                style={{ objectPosition: 'top' }}
                loading="lazy"
              />
              <h4 className="font-serif font-semibold text-xl mb-1 text-forest-900">{name}</h4>
              <p className="font-sans font-medium text-sm mb-3 text-forest-500">{role}</p>
              <p className="font-sans text-sm leading-relaxed text-mist-600">{bio}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
