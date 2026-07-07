'use client';

import { waLink, waMessage } from '@/lib/whatsapp';
import { WhatsAppIcon } from '@/components/ui/Icons';

export function WhatsAppFab() {
  return (
    <a
      href={waLink(waMessage('I would like to enquire about your services.', 'floating button'))}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-12 right-5 z-40 inline-flex items-center gap-2.5 rounded-full bg-whatsapp/10 px-5 py-3.5 text-whatsapp shadow-lift ring-1 ring-whatsapp/20 transition-all duration-200 ease-soft hover:-translate-y-0.5 hover:bg-whatsapp/15 hover:shadow-soft active:scale-[0.98] sm:bottom-14 sm:right-6"
    >
      <WhatsAppIcon className="h-6 w-6" />
      <span className="hidden text-[14.5px] font-medium tracking-tight sm:inline">
        WhatsApp
      </span>
    </a>
  );
}
