import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { contactService } from '../services/contactService';
import { sendMetaLead } from '../lib/metaCapi';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    email: '',
    phone: '',
    subject: 'Consulta general',
    message: '',
    acceptPolicy: false,
    honeypot: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const getUTMParams = () => {
    const params = new URLSearchParams(window.location.search);
    return {
      utm_source: params.get('utm_source') || undefined,
      utm_medium: params.get('utm_medium') || undefined,
      utm_campaign: params.get('utm_campaign') || undefined,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name || !formData.email || !formData.message) {
      setError('Por favor, completa todos los campos requeridos');
      return;
    }

    if (!formData.acceptPolicy) {
      setError('Debes aceptar la política de privacidad');
      return;
    }

    if (formData.honeypot) {
      console.warn('Honeypot triggered');
      return;
    }

    setIsSubmitting(true);

    try {
      const utmParams = getUTMParams();

      const fullPayload = {
        ...formData,
        origin: 'Contacto web',
        page_url: window.location.href,
        property_reference: null,
        utm: utmParams,
      };

      console.log('Contact form submission:', fullPayload);

      const result = await contactService.submitContactForm({
        name: formData.name,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message,
      });

      if (result.success) {
        const utmParams = getUTMParams();
        sendMetaLead({
          content_name: 'contacto_formulario',
          email: formData.email,
          phone: formData.phone,
          utm_source: utmParams.utm_source,
          utm_campaign: utmParams.utm_campaign,
        });

        setFormSubmitted(true);
        setFormData({
          name: '',
          lastName: '',
          email: '',
          phone: '',
          subject: 'Consulta general',
          message: '',
          acceptPolicy: false,
          honeypot: ''
        });

        setTimeout(() => {
          setFormSubmitted(false);
        }, 5000);
      } else {
        setError(result.error || 'Error al enviar el mensaje');
      }
    } catch (err) {
      console.error('Contact form error:', err);
      setError('Error al enviar el mensaje. Por favor, intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contacto" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 scroll-reveal">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Contacta con Nosotros
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Escríbenos o llámanos. Te respondemos lo antes posible y con la información clara.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Information */}
          <div className="scroll-reveal-left">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">
              Información de Contacto
            </h3>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-[#223e28] rounded-full p-3">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Dirección</h4>
                  <p className="text-gray-600">
                    Avinguda de Burjassot<br />
                    46009 València, Valencia, España
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-[#223e28] rounded-full p-3">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Teléfono</h4>
                  <p className="text-gray-600">+34 961 07 99 63</p>
                  <p className="text-gray-600">+34 691 82 20 53</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-[#223e28] rounded-full p-3">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Email</h4>
                  <p className="text-gray-600">estudiomarxalenes@gmail.com</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-[#223e28] rounded-full p-3">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Horario</h4>
                  <p className="text-gray-600">
                    Lun-Jue: 9:30-14:00 / 17:00-20:00<br />
                    Viernes: 9:30-14:00 / 17:00-19:00<br />
                    Sábado: 10:00-13:00<br />
                    Domingo: Cerrado<br />
                    <span className="text-sm text-gray-500">*Horarios pueden variar en festivos</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Location Card */}
            <div className="mt-8 bg-gray-50 rounded-2xl p-6 shadow-lg border border-gray-100">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-[#223e28]" />
                Nuestra Ubicación
              </h4>
              <p className="text-gray-700 mb-4">
                Avinguda de Burjassot<br />
                46009 València, Valencia, España
              </p>
              <a
                href="https://www.google.com/maps/place/Avinguda+de+Burjassot,+46009+Val%C3%A8ncia"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-[#223e28] text-white px-6 py-3 rounded-xl hover:bg-[#28352b] transition-all duration-300 font-medium shadow-apple hover-lift"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Ver en Google Maps</span>
              </a>
              <p className="text-sm text-gray-500 mt-3">
                Abrir indicaciones y cómo llegar
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-gray-50 rounded-2xl p-8 scroll-reveal-right">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">
              Envíanos un Mensaje
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Honeypot field - hidden from users */}
              <input
                type="text"
                name="honeypot"
                value={formData.honeypot}
                onChange={handleChange}
                style={{ display: 'none' }}
                tabIndex={-1}
                autoComplete="off"
              />

              {formSubmitted && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-green-800 font-medium">¡Mensaje enviado con éxito!</p>
                    <p className="text-green-700 text-sm mt-1">Te responderemos lo antes posible.</p>
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#223e28] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Tu nombre"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Apellidos *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#223e28] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Tus apellidos"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#223e28] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="tu@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#223e28] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="+34 123 456 789"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Asunto
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#223e28] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option>Consulta general</option>
                  <option>Quiero vender mi propiedad</option>
                  <option>Busco una propiedad</option>
                  <option>Información sobre servicios</option>
                  <option>Valoración gratuita</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mensaje *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#223e28] focus:border-transparent resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Cuéntanos en qué podemos ayudarte..."
                ></textarea>
              </div>

              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  name="acceptPolicy"
                  id="privacy"
                  checked={formData.acceptPolicy}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  required
                  className="mt-1 w-4 h-4 text-[#223e28] border-gray-300 rounded focus:ring-[#223e28] disabled:cursor-not-allowed"
                />
                <label htmlFor="privacy" className="text-sm text-gray-600">
                  Acepto la{' '}
                  <a href="/es/privacidad" target="_blank" rel="noopener noreferrer" className="text-[#223e28] hover:underline font-medium">
                    política de privacidad
                  </a>
                  {' '}y el tratamiento de mis datos personales *
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#223e28] text-white px-8 py-4 rounded-lg hover:bg-[#28352b] transition-colors flex items-center justify-center space-x-2 font-semibold hover-lift disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Enviando...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Enviar Mensaje</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
