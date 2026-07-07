import { business } from '@/content/business';

// Compose a branded WhatsApp greeting with a source tag so the recipient knows
// the message came from the website. Pass the intent body only; the helper
// prefixes "Hi {business.name}, " and appends a source line.
export const waMessage = (intent?: string, source = 'website') => {
  const head = intent ? `Hi ${business.name}, ${intent}` : `Hi ${business.name}`;
  return `${head}\n\n— sent via ${source}`;
};

export const waLink = (message?: string) => {
  const base = `https://wa.me/${business.whatsapp.e164}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
};

export const telLink = `tel:${business.phone.e164}`;
