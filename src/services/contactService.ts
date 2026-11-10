import { edgeFetch } from '../lib/edgeClient';

export interface ContactFormData {
  name: string;
  lastName?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message: string;
  origin?: string;
  property_reference?: string;
  page_url?: string;
  utm?: {
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
  };
}

const isDev = import.meta.env.DEV;

export const contactService = {
  submitContactForm: async (data: ContactFormData): Promise<{ success: boolean; error?: string }> => {
    try {
      const utmString = data.utm
        ? [
            data.utm.utm_source && `source=${data.utm.utm_source}`,
            data.utm.utm_medium && `medium=${data.utm.utm_medium}`,
            data.utm.utm_campaign && `campaign=${data.utm.utm_campaign}`,
          ]
            .filter(Boolean)
            .join(', ')
        : undefined;

      const payload = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: data.message,
        origin: data.origin || 'General',
        property_reference: data.property_reference,
        page_url: data.page_url,
        utm: utmString,
      };

      if (isDev) {
        console.log('[ContactService] Submitting to Notion:', payload);
      }

      const response = await edgeFetch('notion-contacts', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        if (isDev) {
          console.error('[ContactService] Error response:', result);
        }
        return {
          success: false,
          error: result.error || 'Error al enviar el formulario',
        };
      }

      if (isDev) {
        console.log('[ContactService] Success:', result);
      }

      return { success: result.success };
    } catch (error) {
      if (isDev) {
        console.error('[ContactService] Exception:', error);
      }
      return {
        success: false,
        error: 'Error de conexión. Por favor, intenta de nuevo.',
      };
    }
  },

  isConfigured: (): boolean => {
    return true;
  },
};
