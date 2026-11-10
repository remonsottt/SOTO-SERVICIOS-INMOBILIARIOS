import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Loader2,
  Check,
  ChevronDown,
  ChevronUp,
  MapPin,
  Phone,
  TrendingUp,
  BarChart3,
  Target,
  ClipboardList,
  Search,
  PhoneCall,
} from 'lucide-react';
import { SEO } from '../components/SEO';
import { sendMetaLead } from '../lib/metaCapi';
import { valuationService } from '../services/valuationService';
import { antispamService } from '../lib/antispamService';
import { analytics } from '../lib/analytics';

const ZONES = [
  'Campanar',
  'Marxalenes',
  'La Saïdia',
  'Benimaclet',
  'Extramurs',
  'Otra zona de Valencia',
];

const SELLER_STAGES = [
  'Solo quiero saber cuánto vale.',
  'Estoy pensando si vender o esperar.',
  'Estoy comparando opciones.',
  'Quiero vender pronto.',
];

const PUBLISHED_OPTIONS = [
  '',
  'No, todavía no.',
  'Sí, en Idealista o Fotocasa.',
  'Sí, con otra agencia.',
  'No lo sé o lo gestiona otra persona.',
];

const OBJECTIONS = [
  {
    q: 'Solo quiero saber cuánto vale.',
    a: 'Perfecto. No tienes que decidir hoy si vendes. Primero revisamos tu caso y te damos una orientación.',
  },
  {
    q: 'No quiero comprometerme con una agencia.',
    a: 'La primera orientación no implica exclusiva, publicación ni compromiso de venta.',
  },
  {
    q: 'Podría publicarlo yo en Idealista.',
    a: 'Por supuesto. Te ayudamos a revisar precio y demanda antes de que salgas al mercado.',
  },
];

const inputClass =
  'w-full bg-white border border-sand-200 text-forest-900 placeholder-forest-900/35 rounded-xl px-4 py-3.5 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-forest-700/30 focus:border-forest-700 transition-colors duration-200';

const SellerPage: React.FC = () => {
  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const [form, setForm] = useState({
    name: '',
    phone: '',
    zone: ZONES[0],
    stage: SELLER_STAGES[0],
    published: '',
    acceptPolicy: false,
    website_url: '',
  });

  const update = (field: keyof typeof form, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => nameRef.current?.focus(), 600);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.website_url) return;

    if (!form.acceptPolicy) {
      setError('Debes aceptar la política de privacidad para continuar.');
      return;
    }

    if (!antispamService.checkRateLimit()) {
      setError('Has enviado varias solicitudes seguidas. Espera un momento e inténtalo de nuevo.');
      return;
    }

    setSubmitting(true);
    setError(null);

    const notes = [
      `Zona: ${form.zone}`,
      `¿En qué punto estás?: ${form.stage}`,
      form.published ? `¿Está ya publicada?: ${form.published}` : null,
      `Origen: Landing Vender`,
    ]
      .filter(Boolean)
      .join('\n');

    const utm = analytics.getUTMParams();
    const utmString = [
      utm.utm_source && `source=${utm.utm_source}`,
      utm.utm_medium && `medium=${utm.utm_medium}`,
      utm.utm_campaign && `campaign=${utm.utm_campaign}`,
    ]
      .filter(Boolean)
      .join(', ');

    try {
      const result = await valuationService.saveSellerLead({
        name: form.name,
        phone: form.phone,
        address: form.zone,
        propertyType: 'Piso',
        notes,
        utm: utmString || undefined,
      });

      if (result.success) {
        const utmParams = analytics.getUTMParams();
        sendMetaLead({
          content_name: 'contacto_formulario',
          phone: form.phone,
          utm_source: utmParams.utm_source,
          utm_campaign: utmParams.utm_campaign,
        });
        navigate('/gracias');
      } else {
        setError(result.error || 'No se pudo enviar la solicitud. Inténtalo de nuevo.');
      }
    } catch {
      setError('Error de conexión. Por favor, inténtalo de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <SEO
        title="Valoración de piso en Valencia antes de publicar | Soto"
        description="Antes de publicar tu piso, revisa cuánto podría valer y qué demanda hay en tu zona. Orientación gratuita con un agente local de Soto."
        type="website"
      />

      <main className="bg-sand-50">
        {/* ═══════ 2. HERO CON FORMULARIO ═══════ */}
        <section className="pt-32 pb-20 px-6">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Left: Copy */}
            <div className="pt-4">
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-forest-900 leading-tight mb-6">
                Conoce el precio de tu piso{' '}
                <span className="text-sand-500">antes de publicarlo</span>
              </h1>
              <p className="text-lg text-forest-900/70 font-sans leading-relaxed mb-8">
                Antes de salir en Idealista, revisa cuánto podría valer y qué estrategia tiene más sentido en tu zona.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Valoración basada en datos reales de tu zona.',
                  'Revisamos si podría encajar con compradores activos.',
                  'Sin coste, sin compromiso y sin presión.',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-forest-700 flex-shrink-0 mt-0.5" />
                    <span className="text-sm font-sans text-forest-900/75 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={scrollToForm}
                className="lg:hidden inline-flex items-center justify-center gap-2 bg-forest-700 text-white font-medium font-sans py-4 px-8 rounded-xl transition-all duration-200 hover:bg-forest-800 hover:-translate-y-px"
              >
                Quiero conocer el precio
              </button>
            </div>

            {/* Right: Form */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-sand-100">
              <h2 className="text-xl font-serif font-bold text-forest-900 mb-1">
                Pide tu orientación de precio
              </h2>
              <p className="text-sm font-sans text-forest-900/55 mb-6">
                Te llamamos en menos de 24 h con una primera orientación.
              </p>

              <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  name="website_url"
                  value={form.website_url}
                  onChange={(e) => update('website_url', e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  style={{ display: 'none' }}
                />

                <div>
                  <label htmlFor="seller-name" className="block text-xs font-medium font-sans text-forest-900/60 mb-1.5">
                    Nombre *
                  </label>
                  <input
                    ref={nameRef}
                    id="seller-name"
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => update('name', e.target.value)}
                    placeholder="Tu nombre"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="seller-phone" className="block text-xs font-medium font-sans text-forest-900/60 mb-1.5">
                    Teléfono *
                  </label>
                  <input
                    id="seller-phone"
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => update('phone', e.target.value)}
                    placeholder="600 000 000"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="seller-zone" className="block text-xs font-medium font-sans text-forest-900/60 mb-1.5">
                    Zona o barrio *
                  </label>
                  <select
                    id="seller-zone"
                    value={form.zone}
                    onChange={(e) => update('zone', e.target.value)}
                    className={inputClass}
                  >
                    {ZONES.map((z) => (
                      <option key={z}>{z}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="seller-stage" className="block text-xs font-medium font-sans text-forest-900/60 mb-1.5">
                    ¿En qué punto estás? *
                  </label>
                  <select
                    id="seller-stage"
                    value={form.stage}
                    onChange={(e) => update('stage', e.target.value)}
                    className={inputClass}
                  >
                    {SELLER_STAGES.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="seller-published" className="block text-xs font-medium font-sans text-forest-900/60 mb-1.5">
                    ¿Está ya publicada? <span className="text-forest-900/35">(opcional)</span>
                  </label>
                  <select
                    id="seller-published"
                    value={form.published}
                    onChange={(e) => update('published', e.target.value)}
                    className={inputClass}
                  >
                    <option value="">— Selecciona —</option>
                    {PUBLISHED_OPTIONS.filter(Boolean).map((p) => (
                      <option key={p}>{p}</option>
                    ))}
                  </select>
                </div>

                <label className="flex items-start gap-3 text-sm font-sans text-forest-900/70 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    required
                    checked={form.acceptPolicy}
                    onChange={(e) => update('acceptPolicy', e.target.checked)}
                    className="mt-1 w-4 h-4 accent-forest-700 flex-shrink-0"
                  />
                  <span>
                    Acepto la{' '}
                    <a href="/es/privacidad" className="text-forest-700 underline">
                      política de privacidad
                    </a>.
                  </span>
                </label>

                {error && (
                  <p className="text-sm text-red-600 font-sans" role="alert">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full inline-flex items-center justify-center gap-2 bg-forest-700 text-white font-medium font-sans py-4 px-8 rounded-xl transition-all duration-200 hover:bg-forest-800 hover:-translate-y-px disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" /> Enviando...
                    </>
                  ) : (
                    'Quiero conocer el precio'
                  )}
                </button>

                <p className="text-center text-xs font-sans text-forest-900/40">
                  Sin compromiso. Solo usamos tus datos para darte la orientación.
                </p>
              </form>
            </div>
          </div>
        </section>

        {/* ═══════ 3. BARRA DE CONFIANZA ═══════ */}
        <section className="border-y border-sand-200 py-10 px-6">
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '+10', label: 'años en el barrio' },
              { value: '+250', label: 'viviendas vendidas' },
              { value: '4,5/5', label: 'en Google (64 reseñas)' },
              { value: 'Familiar', label: 'empresa de barrio' },
            ].map(({ value, label }) => (
              <div key={label}>
                <p className="text-2xl md:text-3xl font-serif font-bold text-forest-900">{value}</p>
                <p className="text-xs font-sans text-forest-900/55 mt-1 uppercase tracking-wide">{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════ 4. POR QUÉ VALORAR PRIMERO ═══════ */}
        <section className="py-20 px-6">
          <div className="max-w-5xl mx-auto">
            <p className="text-xs font-sans font-semibold uppercase tracking-widest text-forest-700 mb-4 text-center">
              Por qué valorar primero
            </p>
            <h2 className="text-3xl font-serif font-bold text-forest-900 text-center mb-12">
              Publicar sin saber el precio te puede costar meses
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: TrendingUp,
                  title: 'El precio de salida importa',
                  text: 'Un precio mal puesto ahuyenta compradores serios y alarga la venta más de lo necesario.',
                },
                {
                  icon: BarChart3,
                  title: 'Antes de los portales',
                  text: 'Revisamos si podría encajar con compradores activos que ya están buscando en tu zona.',
                },
                {
                  icon: Target,
                  title: 'Decides con datos',
                  text: 'Te damos precio orientativo, demanda real y una estrategia antes de que decidas nada.',
                },
              ].map(({ icon: Icon, title, text }) => (
                <div key={title} className="bg-white rounded-xl p-6 border border-sand-100">
                  <div className="w-10 h-10 rounded-xl bg-forest-50 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-forest-700" />
                  </div>
                  <h3 className="text-base font-sans font-semibold text-forest-900 mb-2">{title}</h3>
                  <p className="text-sm text-forest-900/65 font-sans leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════ 5. CÓMO FUNCIONA ═══════ */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-serif font-bold text-forest-900 text-center mb-14">
              Cómo funciona
            </h2>

            <div className="space-y-10">
              {[
                {
                  num: '01',
                  icon: ClipboardList,
                  title: 'Cuéntanos tu piso',
                  text: 'Zona, tamaño y estado. Sin documentación, sin visita obligatoria.',
                },
                {
                  num: '02',
                  icon: Search,
                  title: 'Analizamos tu zona',
                  text: 'Precio de mercado, viviendas comparables y demanda real en el barrio.',
                },
                {
                  num: '03',
                  icon: PhoneCall,
                  title: 'Te llamamos con una primera orientación',
                  text: 'Revisamos contigo el caso y, si tiene sentido, agendamos una visita para valorar la vivienda con mayor precisión.',
                },
              ].map(({ num, icon: Icon, title, text }) => (
                <div key={num} className="flex items-start gap-6">
                  <span className="text-4xl font-serif font-bold text-sand-300 leading-none flex-shrink-0 w-12">
                    {num}
                  </span>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-9 h-9 rounded-lg bg-forest-700 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="text-base font-sans font-semibold text-forest-900">{title}</h3>
                    </div>
                    <p className="text-sm text-forest-900/65 font-sans leading-relaxed">{text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <button
                type="button"
                onClick={scrollToForm}
                className="inline-flex items-center justify-center gap-2 bg-forest-700 text-white font-medium font-sans py-4 px-8 rounded-xl transition-all duration-200 hover:bg-forest-800 hover:-translate-y-px"
              >
                Empezar
              </button>
            </div>
          </div>
        </section>

        {/* ═══════ 6. AUTORIDAD LOCAL ═══════ */}
        <section className="py-20 px-6">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl border border-sand-100 p-8 md:p-10 text-center">
              <span className="inline-flex items-center gap-2 text-xs font-sans font-semibold uppercase tracking-widest text-forest-700 mb-5">
                <MapPin className="w-4 h-4" /> Conocemos el barrio
              </span>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-forest-900 mb-4">
                Campanar, La Saïdia, Benimaclet y Marxalenes
              </h2>
              <p className="text-forest-900/65 font-sans leading-relaxed max-w-xl mx-auto mb-8">
                No valoramos con datos genéricos. Revisamos la zona, el estado de la vivienda
                y el tipo de comprador que puede encajar en tu barrio.
              </p>
              <button
                type="button"
                onClick={scrollToForm}
                className="inline-flex items-center justify-center gap-2 font-medium font-sans py-3.5 px-7 rounded-xl border-2 border-forest-700 text-forest-700 transition-all duration-200 hover:bg-forest-700 hover:text-white"
              >
                Valorar mi piso
              </button>
            </div>
          </div>
        </section>

        {/* ═══════ 7. PRUEBA SOCIAL HUMANA COMPACTA ═══════ */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-serif font-bold text-forest-900 mb-3">
                No hablarás con un call center
              </h2>
              <p className="text-forest-900/65 font-sans leading-relaxed max-w-xl mx-auto">
                Te atenderá una persona del equipo de Soto que conoce Valencia y revisará personalmente tu caso.
              </p>
            </div>

            {/* Team + reviews side by side */}
            <div className="grid md:grid-cols-2 gap-8 items-start">
              {/* Team photos */}
              <div className="flex items-center gap-5 justify-center md:justify-start">
                <div className="text-center">
                  <img
                    src="/foto_katia.jpeg"
                    alt="Katia — Gerente"
                    className="w-16 h-16 rounded-full object-cover object-top ring-2 ring-sand-200 mx-auto mb-2"
                    loading="lazy"
                  />
                  <p className="text-sm font-sans font-semibold text-forest-900">Katia</p>
                  <p className="text-xs font-sans text-forest-900/50">Gerente</p>
                </div>
                <div className="text-center">
                  <img
                    src="/data/foto_raul.png"
                    alt="Raúl — Agente comercial"
                    className="w-16 h-16 rounded-full object-cover object-top ring-2 ring-sand-200 mx-auto mb-2"
                    loading="lazy"
                  />
                  <p className="text-sm font-sans font-semibold text-forest-900">Raúl</p>
                  <p className="text-xs font-sans text-forest-900/50">Agente comercial</p>
                </div>
                <div className="text-center">
                  <img
                    src="/foto_carolim_.jpeg"
                    alt="Carol — Coordinadora"
                    className="w-16 h-16 rounded-full object-cover object-top ring-2 ring-sand-200 mx-auto mb-2"
                    loading="lazy"
                  />
                  <p className="text-sm font-sans font-semibold text-forest-900">Carol</p>
                  <p className="text-xs font-sans text-forest-900/50">Coordinadora</p>
                </div>
              </div>

              {/* Reviews */}
              <div className="space-y-4">
                <div className="bg-sand-50 rounded-xl p-5 border border-sand-100">
                  <div className="flex gap-0.5 mb-2">
                    {[...Array(5)].map((_, j) => (
                      <svg key={j} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    ))}
                  </div>
                  <p className="text-sm font-sans text-forest-900/75 italic leading-relaxed">
                    "Trato cercano y profesional desde el primer momento. Nos explicaron todo con claridad y nos acompañaron durante el proceso."
                  </p>
                </div>
                <div className="bg-sand-50 rounded-xl p-5 border border-sand-100">
                  <div className="flex gap-0.5 mb-2">
                    {[...Array(5)].map((_, j) => (
                      <svg key={j} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    ))}
                  </div>
                  <p className="text-sm font-sans text-forest-900/75 italic leading-relaxed">
                    "Equipo serio, claro y de confianza. Se nota que conocen la zona y que cuidan tanto al comprador como al vendedor."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════ 8. OBJECIONES ═══════ */}
        <section className="py-20 px-6">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-serif font-bold text-forest-900 text-center mb-10">
              Dudas frecuentes
            </h2>
            <div className="space-y-3">
              {OBJECTIONS.map(({ q, a }, i) => (
                <div key={q} className="bg-white rounded-xl border border-sand-100 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left"
                  >
                    <span className="text-sm font-sans font-semibold text-forest-900">"{q}"</span>
                    {openFaq === i ? (
                      <ChevronUp className="w-5 h-5 text-forest-700 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-forest-700 flex-shrink-0" />
                    )}
                  </button>
                  {openFaq === i && (
                    <div className="px-6 pb-4">
                      <p className="text-sm font-sans text-forest-900/70 leading-relaxed">{a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════ 9. CTA FINAL ═══════ */}
        <section className="py-20 px-6 bg-forest-700">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
              ¿Cuánto vale tu piso hoy?
            </h2>
            <p className="text-white/70 font-sans leading-relaxed mb-8">
              Pídenos la valoración antes de publicar. Es gratis y sin compromiso.
            </p>
            <button
              type="button"
              onClick={scrollToForm}
              className="inline-flex items-center justify-center gap-2 bg-sand-500 text-white font-medium font-sans py-4 px-8 rounded-xl transition-all duration-200 hover:bg-sand-600 hover:-translate-y-px"
            >
              Conocer el precio de mi piso
            </button>
            <p className="text-sm font-sans text-white/45 mt-5">
              +10 años en el barrio · +250 viviendas vendidas · Empresa familiar
            </p>
          </div>
        </section>

        {/* ═══════ BARRA FLOTANTE MÓVIL ═══════ */}
        <div
          className="fixed bottom-0 left-0 right-0 md:hidden z-40"
          style={{
            background: 'rgba(15,31,18,0.96)',
            backdropFilter: 'blur(12px)',
            paddingBottom: 'env(safe-area-inset-bottom, 0px)',
          }}
        >
          <div className="flex items-center px-4 py-3">
            <button
              type="button"
              onClick={scrollToForm}
              className="flex-1 inline-flex items-center justify-center gap-2 font-medium font-sans text-sm py-3 px-4 rounded-xl bg-sand-500 text-white transition-all duration-200 hover:bg-sand-600"
            >
              <Check className="w-4 h-4" />
              Conocer precio
            </button>
          </div>
        </div>
      </main>
    </>
  );
};

export default SellerPage;
