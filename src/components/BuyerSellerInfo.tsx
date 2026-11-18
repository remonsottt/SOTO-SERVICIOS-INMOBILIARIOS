const BuyerSellerInfo = () => {
  return (
    <section className="py-24 md:py-28 section-paper">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-2xl mb-16 md:mb-20 scroll-reveal">
          <h2 className="text-display-sm text-forest-900 mb-4">
            Información para compradores y vendedores
          </h2>
          <p className="text-lg text-mist-600 font-sans font-light leading-relaxed">
            Todo lo que necesitas saber sobre el proceso de compra o venta de tu vivienda
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 md:gap-16 lg:gap-24">
          <div className="scroll-reveal">
            <h3 className="font-serif text-2xl md:text-3xl font-semibold text-forest-800 mb-3">
              Si vas a comprar una vivienda
            </h3>
            <p className="text-mist-600 font-sans mb-10 leading-relaxed">
              Conoce los gastos y documentos necesarios para realizar tu compra con total seguridad.
            </p>

            <div className="mb-10">
              <h4 className="font-sans text-xs font-semibold tracking-[0.14em] uppercase text-forest-500 mb-5">
                Gastos habituales del comprador
              </h4>
              <ul className="space-y-3.5 border-t border-forest-100 pt-5">
                {[
                  'ITP o IVA/AJD según el caso',
                  'Notaría',
                  'Registro',
                  'Gestoría (si se contrata)',
                  'Tasación y gastos de hipoteca (si hay financiación)',
                ].map((item) => (
                  <li key={item} className="flex gap-3 text-mist-700 font-sans text-[0.95rem] leading-relaxed">
                    <span className="mt-2 h-px w-4 flex-shrink-0 bg-forest-400" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-sans text-xs font-semibold tracking-[0.14em] uppercase text-forest-500 mb-5">
                Documentación necesaria para comprar
              </h4>
              <ul className="space-y-3.5 border-t border-forest-100 pt-5">
                {[
                  'DNI/NIE en vigor',
                  'Datos bancarios para pagos',
                  'Si hay financiación: documentación económica que solicite el banco',
                ].map((item) => (
                  <li key={item} className="flex gap-3 text-mist-700 font-sans text-[0.95rem] leading-relaxed">
                    <span className="mt-2 h-px w-4 flex-shrink-0 bg-forest-400" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="scroll-reveal stagger-2 md:border-l md:border-forest-100 md:pl-16 lg:pl-24">
            <h3 className="font-serif text-2xl md:text-3xl font-semibold text-forest-800 mb-3">
              Si vas a vender una vivienda
            </h3>
            <p className="text-mist-600 font-sans mb-10 leading-relaxed">
              Infórmate sobre los costes y requisitos documentales para vender tu propiedad.
            </p>

            <div className="mb-10">
              <h4 className="font-sans text-xs font-semibold tracking-[0.14em] uppercase text-forest-500 mb-5">
                Gastos habituales del vendedor
              </h4>
              <ul className="space-y-3.5 border-t border-forest-100 pt-5">
                {[
                  'Plusvalía municipal (IIVTNU), si procede',
                  'Certificado de eficiencia energética',
                  'Cancelación registral de hipoteca (si procede)',
                  'IRPF por ganancia patrimonial (si procede)',
                ].map((item) => (
                  <li key={item} className="flex gap-3 text-mist-700 font-sans text-[0.95rem] leading-relaxed">
                    <span className="mt-2 h-px w-4 flex-shrink-0 bg-forest-400" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-sans text-xs font-semibold tracking-[0.14em] uppercase text-forest-500 mb-5">
                Documentación necesaria para vender
              </h4>
              <ul className="space-y-3.5 border-t border-forest-100 pt-5">
                {[
                  'Escritura / título de propiedad',
                  'Nota simple (si se solicita)',
                  'Certificado eficiencia energética',
                  'Último recibo IBI',
                  'Certificado comunidad sobre deudas (si procede)',
                ].map((item) => (
                  <li key={item} className="flex gap-3 text-mist-700 font-sans text-[0.95rem] leading-relaxed">
                    <span className="mt-2 h-px w-4 flex-shrink-0 bg-forest-400" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <p className="mt-14 max-w-3xl text-sm text-mist-600 font-sans leading-relaxed scroll-reveal">
          <span className="font-medium text-forest-800">Nota:</span> esta información es orientativa
          y puede variar según la operación. Recomendamos confirmar con notaría y/o asesoría fiscal.
        </p>
      </div>
    </section>
  );
};

export default BuyerSellerInfo;
