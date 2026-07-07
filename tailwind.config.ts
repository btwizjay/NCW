import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './content/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#1A1A1A',
          muted: '#5A5A5F',
          subtle: '#86868B',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          alt: '#F7F7F8',
          tint: '#FAFAFA',
        },
        hairline: '#E5E5E7',
        accent: {
          DEFAULT: '#24388b',
          dark: '#0F1F6E',
          soft: '#E8EBF7',
        },
        whatsapp: {
          DEFAULT: '#25D366',
          dark: '#1FB855',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        pirulen: ['var(--font-pirulen)', 'sans-serif'],
        'tharu-mahee': ['THARU DIGITAL MAHEE', 'sans-serif'],
        'tharu-nikini': ['THARU DIGITAL NIKINI', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.04em',
        tighter: '-0.025em',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06)',
        lift: '0 4px 12px rgba(0,0,0,0.06), 0 24px 48px rgba(0,0,0,0.10)',
        ring: '0 0 0 1px rgba(0,0,0,0.06)',
      },
      maxWidth: {
        prose: '68ch',
      },
      transitionTimingFunction: {
        soft: 'cubic-bezier(0.22, 0.61, 0.36, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
