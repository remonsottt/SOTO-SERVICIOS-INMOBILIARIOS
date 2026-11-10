import { Home, FileText } from 'lucide-react';

const BuyerSellerInfo = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#223e28] mb-4">
            Información para compradores y vendedores
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Todo lo que necesitas saber sobre el proceso de compra o venta de tu vivienda
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-[#223e28] rounded-lg flex items-center justify-center">
                <Home className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#223e28]">
                Si vas a comprar una vivienda
              </h3>
            </div>
            <p className="text-gray-600 mb-8">
              Conoce los gastos y documentos necesarios para realizar tu compra con total seguridad.
            </p>

            <div className="mb-8">
              <h4 className="text-lg font-semibold text-[#223e28] mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-[#998675] rounded-full"></span>
                Gastos habituales del comprador
              </h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-gray-700">
                  <span className="text-[#998675] font-bold mt-1">•</span>
                  <span>ITP o IVA/AJD según el caso</span>
                </li>
                <li className="flex items-start gap-3 text-gray-700">
                  <span className="text-[#998675] font-bold mt-1">•</span>
                  <span>Notaría</span>
                </li>
                <li className="flex items-start gap-3 text-gray-700">
                  <span className="text-[#998675] font-bold mt-1">•</span>
                  <span>Registro</span>
                </li>
                <li className="flex items-start gap-3 text-gray-700">
                  <span className="text-[#998675] font-bold mt-1">•</span>
                  <span>Gestoría (si se contrata)</span>
                </li>
                <li className="flex items-start gap-3 text-gray-700">
                  <span className="text-[#998675] font-bold mt-1">•</span>
                  <span>Tasación y gastos de hipoteca (si hay financiación)</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-[#223e28] mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#998675]" />
                Documentación necesaria para comprar
              </h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-gray-700">
                  <span className="text-[#998675] font-bold mt-1">•</span>
                  <span>DNI/NIE en vigor</span>
                </li>
                <li className="flex items-start gap-3 text-gray-700">
                  <span className="text-[#998675] font-bold mt-1">•</span>
                  <span>Datos bancarios para pagos</span>
                </li>
                <li className="flex items-start gap-3 text-gray-700">
                  <span className="text-[#998675] font-bold mt-1">•</span>
                  <span>Si hay financiación: documentación económica que solicite el banco</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-[#998675] rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#223e28]">
                Si vas a vender una vivienda
              </h3>
            </div>
            <p className="text-gray-600 mb-8">
              Infórmate sobre los costes y requisitos documentales para vender tu propiedad.
            </p>

            <div className="mb-8">
              <h4 className="text-lg font-semibold text-[#223e28] mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-[#998675] rounded-full"></span>
                Gastos habituales del vendedor
              </h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-gray-700">
                  <span className="text-[#998675] font-bold mt-1">•</span>
                  <span>Plusvalía municipal (IIVTNU), si procede</span>
                </li>
                <li className="flex items-start gap-3 text-gray-700">
                  <span className="text-[#998675] font-bold mt-1">•</span>
                  <span>Certificado de eficiencia energética</span>
                </li>
                <li className="flex items-start gap-3 text-gray-700">
                  <span className="text-[#998675] font-bold mt-1">•</span>
                  <span>Cancelación registral de hipoteca (si procede)</span>
                </li>
                <li className="flex items-start gap-3 text-gray-700">
                  <span className="text-[#998675] font-bold mt-1">•</span>
                  <span>IRPF por ganancia patrimonial (si procede)</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-[#223e28] mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#998675]" />
                Documentación necesaria para vender
              </h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-gray-700">
                  <span className="text-[#998675] font-bold mt-1">•</span>
                  <span>Escritura / título de propiedad</span>
                </li>
                <li className="flex items-start gap-3 text-gray-700">
                  <span className="text-[#998675] font-bold mt-1">•</span>
                  <span>Nota simple (si se solicita)</span>
                </li>
                <li className="flex items-start gap-3 text-gray-700">
                  <span className="text-[#998675] font-bold mt-1">•</span>
                  <span>Certificado eficiencia energética</span>
                </li>
                <li className="flex items-start gap-3 text-gray-700">
                  <span className="text-[#998675] font-bold mt-1">•</span>
                  <span>Último recibo IBI</span>
                </li>
                <li className="flex items-start gap-3 text-gray-700">
                  <span className="text-[#998675] font-bold mt-1">•</span>
                  <span>Certificado comunidad sobre deudas (si procede)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 max-w-5xl mx-auto">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <p className="text-sm text-gray-700 leading-relaxed">
              <span className="font-semibold text-gray-900">Nota:</span> esta información es orientativa y puede variar según la operación. Recomendamos confirmar con notaría y/o asesoría fiscal.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BuyerSellerInfo;
