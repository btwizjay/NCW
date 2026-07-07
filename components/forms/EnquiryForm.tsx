'use client';

import { useState } from 'react';
import { Field, TextAreaField } from './Field';
import { Button } from '@/components/ui/Button';
import { CheckIcon } from '@/components/ui/Icons';
import { business } from '@/content/business';

type Status = 'idle' | 'submitting' | 'success' | 'error';

export function EnquiryForm() {
  const [status, setStatus] = useState<Status>('idle');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');

    // Capture the form node before the await — React nulls e.currentTarget once
    // the handler returns, so reading it afterwards throws.
    const form = e.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      setStatus('success');
      form.reset();
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="flex items-start gap-4 rounded-2xl bg-accent-soft p-6 text-accent-dark">
        <CheckIcon className="mt-0.5 h-5 w-5" />
        <div>
          <p className="font-medium">Thanks! Your message has been received.</p>
          <p className="mt-1 text-sm text-ink-muted">We typically respond within a few hours during workshop hours.</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your name" name="name" placeholder="Your name" required />
        <Field label="Phone or email" name="contact" placeholder={business.phone.display} required />
      </div>
      <TextAreaField
        label="How can we help?"
        name="message"
        placeholder="Tell us about your vehicle and what you’re after."
        required
      />
      <Button type="submit" variant="primary" size="md" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Sending…' : 'Send enquiry'}
      </Button>
      {status === 'error' && (
        <p className="text-[14px] text-accent">Couldn’t send. Please try WhatsApp or call us.</p>
      )}
    </form>
  );
}
