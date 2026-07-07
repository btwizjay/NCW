import { Container } from '@/components/ui/Container';
import { cn } from '@/lib/cn';

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
};

export function PageHeader({ eyebrow, title, description, className }: Props) {
  return (
    <section
      className={cn(
        'bg-surface pt-32 pb-16 sm:pt-40 sm:pb-20',
        className,
      )}
    >
      <Container size="wide">
        {eyebrow && (
          <p className="mb-5 text-xs font-medium uppercase tracking-[0.18em] text-accent">
            {eyebrow}
          </p>
        )}
        <h1 className="text-balance text-[22px] tracking-tightest sm:text-[28px] md:text-[34px] lg:text-[42px] leading-[1.15]">
          {title}
        </h1>
        {description && (
          <p className="mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-ink-muted">
            {description}
          </p>
        )}
      </Container>
    </section>
  );
}
