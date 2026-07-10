import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import localFont from 'next/font/local';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppFab } from '@/components/WhatsAppFab';
import { ScrollRestore } from '@/components/ScrollRestore';
import { SmoothScroll } from '@/components/SmoothScroll';
import { PageTransition } from '@/components/PageTransition';
import { baseMetadata } from '@/lib/seo';
import { business } from '@/content/business';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

const pirulen = localFont({
  src: '../public/fonts/pirulen-rg.otf',
  variable: '--font-pirulen',
  display: 'swap',
});


export const metadata: Metadata = baseMetadata;

export const viewport: Viewport = {
  themeColor: '#FFFFFF',
  width: 'device-width',
  initialScale: 1,
};

const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AutoBodyShop',
  '@id': `${business.siteUrl}/#business`,
  name: business.name,
  description: business.description,
  url: business.siteUrl,
  image: `${business.siteUrl}/images/og-default.jpg`,
  logo: `${business.siteUrl}/images/logo.png`,
  telephone: business.phone.e164,
  email: business.email,
  priceRange: '$$',
  currenciesAccepted: 'LKR',
  paymentAccepted: 'Cash, Bank Transfer',
  areaServed: {
    '@type': 'Country',
    name: 'Sri Lanka',
  },
  address: {
    '@type': 'PostalAddress',
    streetAddress: `${business.address.line1}, ${business.address.line2}`,
    addressLocality: business.address.city,
    addressRegion: business.address.district,
    postalCode: business.address.postal,
    addressCountry: 'LK',
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '08:30',
      closes: '18:00',
    },
  ],
  sameAs: [business.social.facebook, business.social.instagram, business.social.tiktok],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${pirulen.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-white"
        >
          Skip to content
        </a>
        <Header />
        <main id="main">
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer />
        <WhatsAppFab />
        <SmoothScroll />
        <ScrollRestore />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </body>
    </html>
  );
}
