'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Logo } from './Logo';
import { navItems } from './nav-items';
import { Button } from '@/components/ui/Button';
import { MenuIcon, CloseIcon, PhoneIcon } from '@/components/ui/Icons';
import { telLink } from '@/lib/whatsapp';
import { getLenis } from '@/lib/lenis';
import { cn } from '@/lib/cn';

const SCROLL_THRESHOLD = 50;

const transition = {
  duration: 0.5,
  ease: [0.22, 1, 0.36, 1] as const,
};

export function Header() {
  const pathname = usePathname();
  // Pages that open with a full-bleed dark image hero (home + every PageHero
  // page, including the booking flow) want the nav to sit on top in white until
  // the user scrolls. Only the Sanity studio keeps a light background at the top.
  const onDarkHero = !pathname.startsWith('/studio');
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const hero = onDarkHero && !scrolled;

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    // Pause Lenis while the mobile drawer is open so the page behind it can't
    // scroll; resume on close. (No-op when Lenis is disabled / reduced-motion.)
    if (open) getLenis()?.stop();
    else getLenis()?.start();
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY >= SCROLL_THRESHOLD);
    handler();
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <motion.header
      className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center"
      animate={{
        paddingLeft: scrolled ? 16 : 0,
        paddingRight: scrolled ? 16 : 0,
      }}
      transition={transition}
      initial={false}
    >
      <motion.nav
        className="pointer-events-auto relative flex w-full items-center justify-between rounded-full"
        animate={{
          maxWidth: scrolled ? 900 : 1320,
          marginTop: scrolled ? 16 : 0,
          paddingTop: scrolled ? 14 : 28,
          paddingBottom: scrolled ? 14 : 28,
          paddingLeft: scrolled ? 24 : 40,
          paddingRight: scrolled ? 12 : 40,
        }}
        transition={transition}
        initial={false}
      >
        {/* Glass backdrop — blur is always applied; only opacity animates */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'rgba(255,255,255,0.45)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            border: '1px solid rgba(255,255,255,0.3)',
            boxShadow:
              '0 10px 40px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.35)',
          }}
          animate={{ opacity: scrolled ? 1 : 0 }}
          transition={transition}
          initial={false}
        />

        <Logo className="relative z-10" />

        <nav
          className={cn(
            'z-10 hidden items-center md:flex',
            scrolled
              ? 'absolute left-1/2 -translate-x-1/2 -ml-8 gap-1'
              : 'relative gap-1',
          )}
        >
          {navItems.map((item) => {
            const active =
              item.href === '/'
                ? pathname === '/'
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{ fontFamily: 'var(--font-pirulen), sans-serif' }}
                className={cn(
                  'rounded-full px-3 py-1.5 text-[9.5px] font-medium uppercase tracking-wide transition-colors duration-500 ease-soft',
                  active
                    ? hero
                      ? 'bg-white/15 text-white'
                      : 'bg-white/40 text-ink'
                    : hero
                      ? 'text-white/75 hover:text-white'
                      : 'text-ink-muted hover:text-ink',
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="relative z-10 flex items-center gap-2">
          <Button
            href="/book"
            variant="primary"
            size="sm"
            className="hidden bg-accent-dark hover:bg-[#0A1652] md:inline-flex"
          >
            Book Appointment
          </Button>

          <button
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className={cn(
              'inline-flex h-10 w-10 items-center justify-center rounded-full ring-1 transition-[color,box-shadow] duration-500 ease-soft md:hidden',
              hero ? 'text-white ring-white/30' : 'text-ink ring-hairline',
            )}
          >
            {open ? (
              <CloseIcon className="h-5 w-5" />
            ) : (
              <MenuIcon className="h-5 w-5" />
            )}
          </button>
        </div>
      </motion.nav>

      {/* Mobile drawer */}
      <div
        className={cn(
          'fixed inset-x-0 bottom-0 top-24 z-40 origin-top transform bg-surface transition-all duration-300 ease-soft md:hidden',
          open
            ? 'pointer-events-auto translate-y-0 opacity-100'
            : 'pointer-events-none -translate-y-2 opacity-0',
        )}
      >
        <div className="flex h-full flex-col">
          <nav className="flex flex-col gap-1 px-6 pt-6">
            {navItems.map((item) => {
              const active =
                item.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{ fontFamily: 'var(--font-pirulen), sans-serif' }}
                  className={cn(
                    'flex items-center justify-between rounded-2xl px-5 py-4 text-sm font-medium uppercase tracking-wide transition-colors',
                    active
                      ? 'bg-surface-alt text-ink'
                      : 'text-ink-muted hover:text-ink',
                  )}
                >
                  {item.label}
                  <span className="text-ink-subtle">→</span>
                </Link>
              );
            })}
          </nav>
          <div className="mt-auto flex flex-col gap-3 px-6 py-6">
            <Button
              href={telLink}
              variant="secondary"
              size="lg"
              iconLeft={<PhoneIcon className="h-4 w-4" />}
            >
              Call us
            </Button>
            <Button href="/book" variant="primary" size="lg">
              Book Appointment
            </Button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
