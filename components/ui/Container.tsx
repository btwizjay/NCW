import { cn } from '@/lib/cn';

type Props = {
  children: React.ReactNode;
  className?: string;
  size?: 'default' | 'narrow' | 'wide';
};

// Sitewide layout widths.
//   narrow — readable prose / forms (~768px)
//   default — standard sections (1280px)
//   wide — full-width sections, grids, hero, header, footer (1320px)
// Horizontal padding: 24px mobile, 32px small, 40px desktop.
export function Container({ children, className, size = 'default' }: Props) {
  const max = {
    narrow: 'max-w-3xl',
    default: 'max-w-7xl',
    wide: 'max-w-[1320px]',
  }[size];

  return (
    <div className={cn('mx-auto w-full px-6 sm:px-8 lg:px-10', max, className)}>
      {children}
    </div>
  );
}
