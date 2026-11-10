import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { sendMetaLead } from '../lib/metaCapi';

const PHONE = '34691822053';
const BRAND = '#223e28';

/** Devuelve el mensaje de WhatsApp segun la ruta actual. */
function messageForPath(pathname: string): string {
  if (pathname.startsWith('/propiedades/')) {
    const slug = decodeURIComponent(pathname.replace('/propiedades/', '').replace(/\/$/, ''));
    return `Hola, me interesa la propiedad ${slug}. ¿Podéis darme más información?`;
  }
  if (pathname.startsWith('/vender-mi-piso')) {
    return 'Hola, quiero vender mi piso y me gustaría que me contactéis';
  }
  if (pathname.startsWith('/valuation') || pathname.startsWith('/free-valuation')) {
    return 'Hola, me interesa la valoración gratuita de mi propiedad';
  }
  if (pathname.startsWith('/contacto')) {
    return 'Hola, me gustaría hablar con vosotros';
  }
  return 'Hola, me gustaría información sobre vuestros servicios inmobiliarios en Valencia';
}

const WhatsAppFloat = () => {
  const { pathname } = useLocation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // En mobile aparece inmediatamente; en desktop tras 3 segundos.
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (isMobile) {
      setVisible(true);
      return;
    }
    const timer = window.setTimeout(() => setVisible(true), 3000);
    return () => window.clearTimeout(timer);
  }, []);

  const href = `https://wa.me/${PHONE}?text=${encodeURIComponent(messageForPath(pathname))}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => sendMetaLead({ content_name: 'contacto_whatsapp' })}
      aria-label="Contactar por WhatsApp"
      className={`fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
      style={{ backgroundColor: BRAND }}
    >
      <svg
        viewBox="0 0 24 24"
        className="w-7 h-7"
        fill="#ffffff"
        aria-hidden="true"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.359.101 11.943c0 2.096.547 4.142 1.588 5.945L0 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.582 0 11.941-5.359 11.944-11.943A11.864 11.864 0 0020.52 3.449" />
      </svg>
    </a>
  );
};

export default WhatsAppFloat;
