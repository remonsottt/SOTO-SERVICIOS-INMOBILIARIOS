import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: '¿Cuándo es el mejor momento para vender una propiedad?',
    answer: 'Para conocer el mejor momento para vender una propiedad, es importante tener en cuenta factores como la inflación, los tipos de interés y el comportamiento de los compradores.\n\nNo obstante, independientemente del contexto económico, una correcta estrategia de precio y comercialización permite obtener el mejor resultado posible.\n\nEl sector inmobiliario sigue siendo una inversión estable y segura, especialmente en zonas consolidadas. En determinados segmentos del mercado, la vivienda se considera un activo de protección patrimonial a largo plazo.',
  },
  {
    question: '¿Cómo puedo determinar el valor de mi propiedad?',
    answer: 'Existen dos formas de valorar una propiedad: una valoración orientativa online y una valoración presencial.\n\nLa valoración online permite obtener una primera estimación teniendo en cuenta factores como el tipo de inmueble, la superficie, la ubicación, el estado y el año de construcción.\nSin embargo, esta valoración no sustituye a una valoración presencial.\n\nPara conocer el valor real de mercado de una vivienda, especialmente si se está valorando vender, es recomendable realizar una valoración presencial, donde se analizan en detalle todas las características del inmueble y su entorno.',
  },
  {
    question: '¿Cuánto tiempo se tarda en vender mi propiedad?',
    answer: 'El tiempo medio de venta de una vivienda suele situarse entre uno y seis meses, dependiendo principalmente del precio de salida y de la demanda en la zona.\n\nCuanto más ajustado esté el precio al valor real de mercado desde el inicio, más ágil será el proceso de venta.\nFijar un precio excesivamente alto suele provocar que la vivienda permanezca más tiempo en el mercado y termine ajustándose posteriormente.',
  },
  {
    question: '¿Debo vender mi inmueble a través de un consultor inmobiliario?',
    answer: 'Vender una vivienda con un consultor inmobiliario reduce de forma considerable el esfuerzo y el tiempo que debe dedicar el propietario al proceso de venta.\n\nUn consultor inmobiliario:\n– Conoce el mercado local y el valor real de los inmuebles\n– Analiza todo el potencial de la propiedad\n– Prepara una estrategia de venta profesional\n– Gestiona visitas, compradores y negociaciones\n– Acompaña durante todo el proceso hasta la firma en notaría\n\nEl objetivo es obtener el mejor precio posible minimizando riesgos y preocupaciones para el propietario.',
  },
  {
    question: '¿Cuáles son los documentos más importantes que necesito para vender mi propiedad?',
    answer: 'Para vender una vivienda normalmente se necesita:\n– Nota simple o extracto del Registro de la Propiedad\n– Certificado de eficiencia energética (CEE)\n– Certificado de estar al corriente de pagos con la comunidad\n– Último recibo del IBI\n– Documento de identidad del propietario\n\nDependiendo del inmueble, pueden ser necesarios otros documentos adicionales.',
  },
  {
    question: '¿Tengo que pagar impuestos por los ingresos de la venta?',
    answer: 'Sí. Si vende su vivienda por un precio superior al de compra, deberá tributar en el IRPF por la ganancia patrimonial.\n\nLos tipos aplicables actualmente son:\n– 19% hasta 6.000 €\n– 21% entre 6.000 € y 50.000 €\n– 23% entre 50.000 € y 200.000 €\n– 26% para importes superiores a 200.000 €\n\nAdemás, deberá liquidar la plusvalía municipal en el ayuntamiento correspondiente.\n\nEn el caso de vendedores no residentes, el comprador retendrá el 3% del precio de venta como pago a cuenta del impuesto correspondiente.',
  },
  {
    question: '¿Puedo vender mi vivienda con un inquilino?',
    answer: 'Sí, es posible vender una vivienda con un contrato de alquiler vigente.\n\nDebe tenerse en cuenta que la venta no extingue el contrato de arrendamiento.\nPara compradores que buscan vivienda habitual, esto puede suponer una desventaja y afectar al precio.\nAdemás, es importante revisar si el inquilino dispone de derecho de tanteo.',
  },
  {
    question: '¿Cómo vendo una propiedad heredada?',
    answer: 'Para vender una vivienda heredada es necesario:\n– Aceptar y adjudicar la herencia\n– Inscribir la vivienda en el Registro de la Propiedad\n– Contar con el acuerdo de todos los herederos, si los hubiera\n\nUna vez realizados estos trámites, la vivienda puede venderse con normalidad.',
  },
  {
    question: '¿Puedo vender mi propiedad si no está totalmente pagada?',
    answer: 'Sí, es posible vender una vivienda con hipoteca pendiente.\n\nEn la mayoría de los casos, la hipoteca se cancela el mismo día de la firma de la compraventa utilizando parte del precio de venta.',
  },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqData.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: { '@type': 'Answer', text: faq.answer },
  })),
};

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-24" style={{ background: '#faf8f5' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14 scroll-reveal">
          <p className="font-sans font-semibold text-xs tracking-widest uppercase mb-4" style={{ color: '#998675' }}>
            FAQ
          </p>
          <h2 className="text-display-sm mb-4" style={{ color: '#0f1f12' }}>
            Preguntas frecuentes
          </h2>
          <p className="font-sans text-lg" style={{ color: '#5e5049' }}>
            Resolvemos tus dudas sobre la compra y venta de viviendas
          </p>
        </div>

        {/* Items */}
        <div className="space-y-3">
          {faqData.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl overflow-hidden scroll-reveal"
                style={{
                  border: isOpen ? '1.5px solid #bfa588' : '1px solid rgba(153,134,117,0.15)',
                  transition: 'border-color 250ms ease',
                }}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-forest-700"
                  style={{ background: 'transparent' }}
                >
                  <span className="font-serif font-semibold text-base pr-4" style={{ color: '#0f1f12' }}>
                    {faq.question}
                  </span>
                  <ChevronDown
                    className="w-5 h-5 flex-shrink-0"
                    style={{
                      color: '#998675',
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 250ms ease',
                    }}
                  />
                </button>

                <div
                  style={{
                    maxHeight: isOpen ? '800px' : '0',
                    opacity: isOpen ? 1 : 0,
                    overflow: 'hidden',
                    transition: 'max-height 350ms ease, opacity 250ms ease',
                  }}
                >
                  <div
                    className="px-6 pb-6 font-sans text-sm leading-relaxed whitespace-pre-line"
                    style={{ color: '#5e5049', borderTop: '1px solid rgba(153,134,117,0.12)', paddingTop: '1.25rem' }}
                  >
                    {faq.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-14 text-center scroll-reveal">
          <p className="font-sans text-base mb-5" style={{ color: '#5e5049' }}>
            ¿Tienes más preguntas? Estamos aquí para ayudarte
          </p>
          <a href="/contacto" className="btn-primary">
            Contacta con nosotros
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
