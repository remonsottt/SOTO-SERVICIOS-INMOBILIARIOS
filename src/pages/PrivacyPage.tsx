import { SEO } from '../components/SEO';

const PrivacyPage = () => {
  return (
    <>
      <SEO
        title="Política de Privacidad | Soto Servicios Inmobiliarios"
        description="Política de privacidad y protección de datos de Soto Servicios Inmobiliarios. Información sobre el tratamiento de datos personales conforme al RGPD."
        type="website"
        noIndex={true}
      />
      <div className="min-h-screen bg-white pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Política de Privacidad</h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Última actualización:</strong> Diciembre 2024
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Responsable del tratamiento</h2>
            <p className="text-gray-700 mb-4">
              <strong>Identidad:</strong> Soto Servicios Inmobiliarios<br />
              <strong>Dirección:</strong> Avinguda de Burjassot, 46009 València, Valencia, España<br />
              <strong>Teléfono:</strong> +34 961 07 99 63 / +34 691 82 20 53<br />
              <strong>Email:</strong> estudiomarxalenes@gmail.com
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Finalidad del tratamiento</h2>
            <p className="text-gray-700 mb-4">
              En Soto Servicios Inmobiliarios tratamos la información que nos facilitas con las siguientes finalidades:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>Gestionar las consultas realizadas a través de formularios de contacto</li>
              <li>Proporcionar valoraciones inmobiliarias solicitadas</li>
              <li>Enviar información sobre nuestros servicios inmobiliarios</li>
              <li>Cumplir con las obligaciones legales aplicables</li>
              <li>Mejorar la experiencia de navegación en nuestra web</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Base legal</h2>
            <p className="text-gray-700 mb-4">
              El tratamiento de tus datos se basa en:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li><strong>Consentimiento:</strong> Al aceptar la política de privacidad en nuestros formularios</li>
              <li><strong>Interés legítimo:</strong> Para la mejora de nuestros servicios</li>
              <li><strong>Cumplimiento legal:</strong> Para cumplir con las obligaciones normativas</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Destinatarios</h2>
            <p className="text-gray-700 mb-4">
              Tus datos no serán cedidos a terceros, salvo obligación legal o con tu consentimiento expreso.
              Utilizamos proveedores de servicios que pueden actuar como encargados del tratamiento:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>Servicios de hosting y almacenamiento en la nube</li>
              <li>Herramientas de gestión inmobiliaria</li>
              <li>Servicios de análisis web</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Conservación de datos</h2>
            <p className="text-gray-700 mb-4">
              Conservamos tus datos personales durante el tiempo necesario para cumplir con la finalidad
              para la que fueron recogidos y para determinar las posibles responsabilidades que se pudieran
              derivar de dicha finalidad y del tratamiento de los datos. Los plazos de conservación varían según:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li><strong>Consultas generales:</strong> Hasta que retires tu consentimiento o 2 años desde el último contacto</li>
              <li><strong>Valoraciones:</strong> Durante 5 años por requerimientos legales</li>
              <li><strong>Datos de navegación:</strong> Según lo establecido en la política de cookies</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Tus derechos</h2>
            <p className="text-gray-700 mb-4">
              Conforme al RGPD, puedes ejercer los siguientes derechos:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li><strong>Acceso:</strong> Conocer qué datos personales tenemos sobre ti</li>
              <li><strong>Rectificación:</strong> Corregir datos inexactos o incompletos</li>
              <li><strong>Supresión:</strong> Solicitar la eliminación de tus datos</li>
              <li><strong>Oposición:</strong> Oponerte al tratamiento de tus datos</li>
              <li><strong>Limitación:</strong> Solicitar la limitación del tratamiento</li>
              <li><strong>Portabilidad:</strong> Recibir tus datos en formato estructurado</li>
            </ul>
            <p className="text-gray-700 mb-4">
              Para ejercer estos derechos, contacta con nosotros en: estudiomarxalenes@gmail.com
            </p>
            <p className="text-gray-700 mb-4">
              También tienes derecho a presentar una reclamación ante la Agencia Española de Protección
              de Datos (www.aepd.es) si consideras que el tratamiento no se ajusta a la normativa vigente.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. Medidas de seguridad</h2>
            <p className="text-gray-700 mb-4">
              Hemos adoptado medidas técnicas y organizativas apropiadas para proteger tus datos personales
              contra el acceso no autorizado, la alteración, divulgación o destrucción de tu información.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">8. Menores de edad</h2>
            <p className="text-gray-700 mb-4">
              Nuestros servicios están dirigidos a mayores de 18 años. No recopilamos intencionadamente
              información de menores de edad sin el consentimiento de sus padres o tutores.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">9. Modificaciones</h2>
            <p className="text-gray-700 mb-4">
              Nos reservamos el derecho de modificar esta política de privacidad para adaptarla a novedades
              legislativas o jurisprudenciales. Te recomendamos revisar esta página periódicamente.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">10. Contacto</h2>
            <p className="text-gray-700 mb-4">
              Para cualquier duda sobre esta política de privacidad o sobre el tratamiento de tus datos personales,
              puedes contactar con nosotros:
            </p>
            <p className="text-gray-700">
              <strong>Email:</strong> estudiomarxalenes@gmail.com<br />
              <strong>Teléfono:</strong> +34 961 07 99 63 / +34 691 82 20 53<br />
              <strong>Dirección:</strong> Avinguda de Burjassot, 46009 València, Valencia, España
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPage;
