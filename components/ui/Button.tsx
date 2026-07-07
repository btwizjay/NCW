import Link from 'next/link';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'whatsapp';
type Size = 'sm' | 'md' | 'lg';

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
};

type AsButton = CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type AsLink = CommonProps & { href: string; external?: boolean };

const baseClasses =
  'inline-flex items-center justify-center gap-2 font-pirulen font-medium uppercase tracking-wide rounded-full transition-all ease-soft duration-200 hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ink/20 focus-visible:ring-offset-surface disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0';

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-ink text-white hover:bg-ink/90 active:scale-[0.98] shadow-soft',
  secondary:
    'bg-white text-ink border border-hairline hover:border-ink/40 hover:bg-surface-alt active:scale-[0.98]',
  ghost:
    'text-ink hover:bg-surface-alt',
  whatsapp:
    'bg-whatsapp text-white hover:bg-whatsapp-dark active:scale-[0.98] shadow-soft',
};

const sizeClasses: Record<Size, string> = {
  sm: 'h-9 px-4 text-[9.5px]',
  md: 'h-11 px-5 text-[9.5px]',
  lg: 'h-12 px-7 text-[9.5px]',
};

const renderInner = (
  iconLeft: React.ReactNode | undefined,
  children: React.ReactNode,
  iconRight: React.ReactNode | undefined,
) => (
  <>
    {iconLeft && <span className="inline-flex shrink-0 items-center justify-center">{iconLeft}</span>}
    <span>{children}</span>
    {iconRight && <span className="inline-flex shrink-0 items-center justify-center">{iconRight}</span>}
  </>
);

export function Button(props: AsButton | AsLink) {
  const {
    variant = 'primary',
    size = 'md',
    className,
    children,
    iconLeft,
    iconRight,
  } = props;

  const classes = cn(baseClasses, variantClasses[variant], sizeClasses[size], className);

  if ('href' in props && props.href) {
    const { href, external } = props;
    if (external || href.startsWith('http') || href.startsWith('tel:') || href.startsWith('mailto:')) {
      return (
        <a
          href={href}
          target={external ? '_blank' : undefined}
          rel={external ? 'noopener noreferrer' : undefined}
          className={classes}
        >
          {renderInner(iconLeft, children, iconRight)}
        </a>
      );
    }
    return (
      <Link href={href} className={classes}>
        {renderInner(iconLeft, children, iconRight)}
      </Link>
    );
  }

  const { variant: _v, size: _s, className: _c, iconLeft: _il, iconRight: _ir, ...rest } =
    props as AsButton;
  return (
    <button className={classes} {...rest}>
      {renderInner(iconLeft, children, iconRight)}
    </button>
  );
}
