import { cn } from '@/lib/cn';

type BaseProps = {
  label: string;
  name: string;
  required?: boolean;
  error?: string;
  hint?: string;
};

const inputClasses =
  'w-full rounded-2xl border border-hairline bg-surface px-4 py-3 text-[15px] text-ink placeholder:text-ink-subtle outline-none transition-colors focus:border-accent/50 focus:ring-2 focus:ring-accent/15';

export function Field({
  label,
  name,
  required,
  error,
  hint,
  ...rest
}: BaseProps & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-2 block text-[13px] font-medium text-ink">
        {label} {required && <span className="text-accent">*</span>}
      </span>
      <input
        name={name}
        required={required}
        className={cn(inputClasses, error && 'border-accent focus:border-accent focus:ring-accent/20')}
        {...rest}
      />
      {hint && <span className="mt-1.5 block text-[12px] text-ink-subtle">{hint}</span>}
      {error && <span className="mt-1.5 block text-[12px] text-accent">{error}</span>}
    </label>
  );
}

export function TextAreaField({
  label,
  name,
  required,
  error,
  hint,
  ...rest
}: BaseProps & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className="block">
      <span className="mb-2 block text-[13px] font-medium text-ink">
        {label} {required && <span className="text-accent">*</span>}
      </span>
      <textarea
        name={name}
        required={required}
        rows={4}
        className={cn(inputClasses, 'resize-y', error && 'border-accent')}
        {...rest}
      />
      {hint && <span className="mt-1.5 block text-[12px] text-ink-subtle">{hint}</span>}
      {error && <span className="mt-1.5 block text-[12px] text-accent">{error}</span>}
    </label>
  );
}

export function SelectField({
  label,
  name,
  required,
  error,
  hint,
  children,
  ...rest
}: BaseProps & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <label className="block">
      <span className="mb-2 block text-[13px] font-medium text-ink">
        {label} {required && <span className="text-accent">*</span>}
      </span>
      <select
        name={name}
        required={required}
        className={cn(inputClasses, 'appearance-none pr-10 bg-[length:1rem_1rem] bg-no-repeat')}
        style={{
          backgroundImage:
            'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%235A5A5F\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'><polyline points=\'6 9 12 15 18 9\'/></svg>")',
          backgroundPosition: 'right 1rem center',
        }}
        {...rest}
      >
        {children}
      </select>
      {hint && <span className="mt-1.5 block text-[12px] text-ink-subtle">{hint}</span>}
      {error && <span className="mt-1.5 block text-[12px] text-accent">{error}</span>}
    </label>
  );
}
