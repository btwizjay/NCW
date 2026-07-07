import { cn } from '@/lib/cn';
import { Container } from './Container';

type Props = {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  tone?: 'surface' | 'alt' | 'tint' | 'ink' | 'transparent';
  id?: string;
  size?: 'default' | 'narrow' | 'wide';
  spacing?: 'default' | 'tight' | 'loose';
};

export function Section({
  children,
  className,
  containerClassName,
  tone = 'surface',
  id,
  size = 'default',
  spacing = 'default',
}: Props) {
  const toneClass = {
    surface: 'bg-surface',
    alt: 'bg-surface-alt',
    tint: 'bg-surface-tint',
    ink: 'bg-ink text-white',
    transparent: '',
  }[tone];

  const padding = {
    tight: 'py-16 sm:py-20',
    default: 'py-24 sm:py-32',
    loose: 'py-32 sm:py-40',
  }[spacing];

  return (
    <section id={id} className={cn(toneClass, padding, className)}>
      <Container size={size} className={containerClassName}>
        {children}
      </Container>
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = 'left',
  titleClassName,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  titleClassName?: string;
}) {
  return (
    <div className={cn('max-w-3xl', align === 'center' && 'mx-auto text-center')}>
      {eyebrow && (
        <p className="mb-4 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          {eyebrow}
        </p>
      )}
      <h2 className={cn('text-balance text-[20px] tracking-tighter sm:text-[24px] md:text-[30px] leading-[1.15]', titleClassName)}>
        {title}
      </h2>
      {description && (
        <p className="mt-5 text-pretty text-lg leading-relaxed text-ink-muted">
          {description}
        </p>
      )}
    </div>
  );
}
