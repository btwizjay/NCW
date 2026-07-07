import Image from 'next/image';
import Link from 'next/link';
import { business } from '@/content/business';
import { cn } from '@/lib/cn';

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label={`${business.name} home`}
      className={cn(
        'group inline-flex items-center transition-opacity duration-500 ease-soft hover:opacity-90',
        className,
      )}
    >
      <Image
        src="/images/logo.png"
        alt={business.name}
        width={120}
        height={40}
        priority
        className="h-6 w-auto sm:h-7"
      />
    </Link>
  );
}
