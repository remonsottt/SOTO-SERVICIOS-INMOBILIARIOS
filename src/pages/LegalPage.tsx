import { SEO } from '../components/SEO';

const LegalPage = () => {
  return (
    <>
      <SEO
        title="Aviso Legal | Soto Servicios Inmobiliarios"
        description="Aviso legal de Soto Servicios Inmobiliarios"
        type="website"
        noIndex={true}
      />
      <div className="min-h-screen bg-white pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Aviso Legal</h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6"><strong>Última actualización:</strong> Diciembre 2024</p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Datos identificativos</h2>
            <p className="text-gray-700 mb-4">
              En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y Comercio Electrónico, se facilitan los siguientes datos identificativos:
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Titular:</strong> Soto Servicios Inmobiliarios<br />
              <strong>Dirección:</strong> Avinguda de Burjassot, 46009 València, Valencia, España<br />
              <strong>Teléfono:</strong> +34 961 07 99 63 / +34 691 82 20 53<br />
              <strong>Email:</strong> estudiomarxalenes@gmail.com
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Objeto</h2>
            <p className="text-gray-700 mb-4">
              El presente aviso legal regula el uso y utilización del sitio web sotoserviciosinmobiliarios.com,
              del que es titular Soto Servicios Inmobiliarios.
            </p>
            <p className="text-gray-700 mb-4">
              La navegación por el sitio web atribuye la condición de usuario del mismo e implica la aceptación plena
              y sin reservas de todas y cada una de las disposiciones incluidas en este Aviso Legal.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Uso del sitio web</h2>
            <p className="text-gray-700 mb-4">
              El usuario se compromete a hacer un uso adecuado de los contenidos y servicios que se ofrecen
              a través del sitio web y a no emplearlos para:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>Incurrir en actividades ilícitas, ilegales o contrarias a la buena fe y al orden público</li>
              <li>Difundir contenidos o propaganda de carácter racista, xenófobo, pornográfico-ilegal, de apología del terrorismo o atentatorio contra los derechos humanos</li>
              <li>Provocar daños en los sistemas físicos y lógicos del sitio web, de sus proveedores o de terceras personas</li>
              <li>Introducir o difundir en la red virus informáticos o cualesquiera otros sistemas físicos o lógicos que sean susceptibles de provocar daños</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Propiedad intelectual e industrial</h2>
            <p className="text-gray-700 mb-4">
              Todos los contenidos del sitio web, salvo que se indique lo contrario, son titularidad exclusiva de Soto Servicios Inmobiliarios
              y, en consecuencia, son obras protegidas como propiedad intelectual por el ordenamiento jurídico español.
            </p>
            <p className="text-gray-700 mb-4">
              Queda prohibida la reproducción, distribución, comunicación pública, transformación o cualquier otra actividad que se pueda
              realizar con los contenidos del sitio web sin autorización previa y por escrito.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Exclusión de garantías y responsabilidad</h2>
            <p className="text-gray-700 mb-4">
              Soto Servicios Inmobiliarios no se hace responsable, en ningún caso, de los daños y perjuicios de cualquier naturaleza que pudieran ocasionar:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>Los errores u omisiones en los contenidos</li>
              <li>La falta de disponibilidad del sitio web o la transmisión de virus o programas maliciosos</li>
              <li>La ausencia de veracidad, exactitud, exhaustividad y actualidad de los contenidos</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Modificaciones</h2>
            <p className="text-gray-700 mb-4">
              Soto Servicios Inmobiliarios se reserva el derecho de efectuar sin previo aviso las modificaciones que considere
              oportunas en su sitio web, pudiendo cambiar, suprimir o añadir tanto los contenidos y servicios que se presten a través
              del mismo como la forma en la que éstos aparezcan presentados o localizados.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. Enlaces</h2>
            <p className="text-gray-700 mb-4">
              En el caso de que en el sitio web se incluyeran enlaces o hipervínculos hacia otros sitios de Internet,
              Soto Servicios Inmobiliarios no ejercerá ningún tipo de control sobre dichos sitios y contenidos.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">8. Ley aplicable y jurisdicción</h2>
            <p className="text-gray-700 mb-4">
              Las presentes condiciones se regirán por la legislación española. Para cualquier litigio que pudiera derivarse
              del acceso o uso del sitio web, las partes se someterán a los Juzgados y Tribunales de Valencia capital.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">9. Contacto</h2>
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

export default LegalPage;
