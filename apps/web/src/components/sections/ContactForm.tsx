'use client';

import { useId, useRef, useState } from 'react';
import { Button } from '@/components/ui/primitives';
import { submitContact } from '@/lib/api';
import { cn } from '@/lib/utils';

type Status = 'idle' | 'sending' | 'sent' | 'error';

const FIELDS = [
  { name: 'name', label: 'Name', type: 'text', autoComplete: 'name', required: true },
  { name: 'email', label: 'Email', type: 'email', autoComplete: 'email', required: true },
  { name: 'subject', label: 'Subject', type: 'text', autoComplete: 'off', required: true },
] as const;

/**
 * The contact form, rebuilt rather than restyled.
 *
 * The previous version had five `<label>` elements with no `htmlFor` and five
 * inputs with no `id` — nothing was programmatically labelled — plus
 * `focus:outline-none` with a replacement ring that compiled to no CSS, an
 * error paragraph with no live region, and a success state that unmounted the
 * form and dropped focus to `<body>` unannounced.
 */
export default function ContactForm() {
  const formId = useId();
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    setStatus('sending');
    setError(null);

    try {
      await submitContact({
        name: String(data.get('name') ?? ''),
        email: String(data.get('email') ?? ''),
        subject: String(data.get('subject') ?? ''),
        message: String(data.get('message') ?? ''),
      });
      setStatus('sent');
      form.reset();
      // Move focus to the confirmation so keyboard and screen-reader users
      // land on the outcome instead of at the top of the document.
      requestAnimationFrame(() => statusRef.current?.focus());
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  }

  const inputClass =
    'w-full rounded-md border border-rule bg-canvas px-3 py-2.5 text-sm text-ink ' +
    'placeholder:text-ink-faint transition-colors hover:border-rule-strong ' +
    'focus:border-verdigris';

  return (
    <form onSubmit={onSubmit} noValidate={false} className="space-y-4">
      <div
        ref={statusRef}
        tabIndex={-1}
        role="status"
        aria-live="polite"
        className={cn(
          'rounded-md border px-4 py-3 text-sm outline-none',
          status === 'sent'
            ? 'border-positive/40 bg-positive/10 text-ink'
            : status === 'error'
              ? 'border-critical/40 bg-critical/10 text-ink'
              : 'sr-only',
        )}
      >
        {status === 'sent' &&
          'Message sent. I read everything that comes in and usually reply within a day or two.'}
        {status === 'error' && error}
        {status === 'sending' && 'Sending your message…'}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {FIELDS.map((field) => (
          <div
            key={field.name}
            className={field.name === 'subject' ? 'sm:col-span-2' : undefined}
          >
            <label
              htmlFor={`${formId}-${field.name}`}
              className="meta mb-1.5 block uppercase tracking-[0.14em]"
            >
              {field.label}
              {field.required && (
                <span className="text-copper" aria-hidden="true">
                  {' '}
                  *
                </span>
              )}
            </label>
            <input
              id={`${formId}-${field.name}`}
              name={field.name}
              type={field.type}
              autoComplete={field.autoComplete}
              required={field.required}
              className={inputClass}
            />
          </div>
        ))}
      </div>

      <div>
        <label
          htmlFor={`${formId}-message`}
          className="meta mb-1.5 block uppercase tracking-[0.14em]"
        >
          Message
          <span className="text-copper" aria-hidden="true">
            {' '}
            *
          </span>
        </label>
        <textarea
          id={`${formId}-message`}
          name="message"
          rows={5}
          required
          className={cn(inputClass, 'resize-y')}
        />
      </div>

      <div className="flex items-center gap-3">
        <Button
          type="submit"
          tone="primary"
          disabled={status === 'sending'}
          aria-busy={status === 'sending'}
        >
          {status === 'sending' ? 'Sending…' : 'Send message'}
        </Button>
        <p className="meta">Required fields are marked *</p>
      </div>
    </form>
  );
}
