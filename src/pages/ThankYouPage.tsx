import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Home, Mail, Phone } from 'lucide-react';
import { SEO } from '../components/SEO';

const ThankYouPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <SEO
        title="Gracias por tu contacto - Inmobiliaria Soto"
        description="Hemos recibido tu mensaje. Nos pondremos en contacto contigo lo antes posible."
      />

      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              ¡Mensaje Recibido!
            </h1>

            <p className="text-lg text-gray-600 mb-8">
              Gracias por ponerte en contacto con nosotros. Hemos recibido tu solicitud y nuestro equipo la revisará en breve.
            </p>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
              <p className="text-green-800 font-medium mb-2">
                ¿Qué sigue?
              </p>
              <p className="text-green-700 text-sm">
                Uno de nuestros asesores inmobiliarios se pondrá en contacto contigo dentro de las próximas 24-48 horas para atender tu consulta personalizada.
              </p>
            </div>

            <div className="space-y-4 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Mientras tanto...
              </h2>

              <div className="grid md:grid-cols-2 gap-4 text-left">
                <div className="bg-gray-50 rounded-lg p-4">
                  <Phone className="w-6 h-6 text-green-600 mb-2" />
                  <h3 className="font-semibold text-gray-900 mb-1">¿Urgente?</h3>
                  <p className="text-sm text-gray-600">Llámanos directamente al</p>
                  <a href="tel:+34961079963" className="text-green-600 font-medium hover:text-green-700">
                    961 079 963
                  </a>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <Mail className="w-6 h-6 text-green-600 mb-2" />
                  <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                  <p className="text-sm text-gray-600">Escríbenos a</p>
                  <a href="mailto:estudiomarxalenes@gmail.com" className="text-green-600 font-medium hover:text-green-700 break-all">
                    estudiomarxalenes@gmail.com
                  </a>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/')}
                className="inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                <Home className="w-5 h-5 mr-2" />
                Volver al inicio
              </button>

              <button
                onClick={() => navigate('/propiedades')}
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-green-600 border-2 border-green-600 rounded-lg hover:bg-green-50 transition-colors font-medium"
              >
                Ver propiedades
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default ThankYouPage;
