import { SEO } from '../components/SEO';

const CookiesPage = () => {
  return (
    <>
      <SEO
        title="Política de Cookies | Soto Servicios Inmobiliarios"
        description="Información sobre el uso de cookies en sotoserviciosinmobiliarios.com"
        type="website"
        noIndex={true}
      />
      <div className="min-h-screen bg-white pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Política de Cookies</h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6"><strong>Última actualización:</strong> Diciembre 2024</p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">¿Qué son las cookies?</h2>
            <p className="text-gray-700 mb-4">
              Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas una página web.
              Se utilizan ampliamente para hacer que los sitios web funcionen de manera más eficiente y proporcionen información a los propietarios del sitio.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">¿Qué cookies utilizamos?</h2>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Cookies necesarias</h3>
            <p className="text-gray-700 mb-4">
              Estas cookies son esenciales para que el sitio web funcione correctamente. No se pueden desactivar en nuestros sistemas.
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>Preferencias de cookies</li>
              <li>Sesión de usuario</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Cookies analíticas</h3>
            <p className="text-gray-700 mb-4">
              Estas cookies nos permiten contar las visitas y fuentes de tráfico para poder medir y mejorar el rendimiento de nuestro sitio.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Cookies de marketing</h3>
            <p className="text-gray-700 mb-4">
              Estas cookies pueden establecerse a través de nuestro sitio por nuestros socios publicitarios para crear un perfil de tus intereses.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">¿Cómo gestionar las cookies?</h2>
            <p className="text-gray-700 mb-4">
              Puedes controlar y/o eliminar las cookies según desees. Puedes eliminar todas las cookies que ya están en tu dispositivo
              y puedes configurar la mayoría de los navegadores para evitar que se coloquen. Sin embargo, si haces esto, es posible que
              tengas que ajustar manualmente algunas preferencias cada vez que visites el sitio.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Más información</h2>
            <p className="text-gray-700 mb-4">
              Para cualquier duda sobre nuestra política de cookies, puedes contactar con nosotros:
            </p>
            <p className="text-gray-700">
              <strong>Email:</strong> estudiomarxalenes@gmail.com<br />
              <strong>Teléfono:</strong> +34 961 07 99 63 / +34 691 82 20 53
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default CookiesPage;
