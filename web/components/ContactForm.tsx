'use client';

import { startTransition, useActionState, useState, type FormEvent } from 'react';
import { submitContact, type ContactState } from '@/app/actions/contact';
import { buttonClasses } from '@/components/ui/button';
import type { Dictionary } from '@/content/dictionaries';
import { MESSAGE_MAX, readFields, validate, type ContactFields, type FieldErrors } from '@/lib/contact-schema';
import type { Locale } from '@/lib/i18n';
import { cn } from '@/lib/utils';

type Props = {
  locale: Locale;
  labels: Dictionary['form'];
  matters: { value: string; label: string }[];
};

const fieldOrder: (keyof ContactFields)[] = ['fullName', 'email', 'phone', 'matter', 'message', 'consent'];

const inputClass =
  'flex h-10 w-full rounded-md border border-border bg-white px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-1 aria-[invalid=true]:border-red-600';

export default function ContactForm({ locale, labels, matters }: Props) {
  const [state, formAction, pending] = useActionState<ContactState, FormData>(submitContact.bind(null, locale), {});
  const [clientErrors, setClientErrors] = useState<FieldErrors | null>(null);
  const errors: FieldErrors = clientErrors ?? state.errors ?? {};
  const hasErrors = Object.keys(errors).length > 0;

  function message(field: keyof ContactFields) {
    const code = errors[field];
    return code ? labels.errors[code].replace('{max}', String(MESSAGE_MAX)) : undefined;
  }

  // Validate in the browser first; submitting manually (instead of letting React
  // handle the action) also prevents the form from being cleared on a server error.
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const found = validate(readFields(formData));
    if (Object.keys(found).length > 0) {
      setClientErrors(found);
      const first = fieldOrder.find((f) => found[f]);
      if (first) (form.elements.namedItem(first) as HTMLElement | null)?.focus();
      return;
    }
    setClientErrors(null);
    startTransition(() => formAction(formData));
  }

  function fieldProps(field: keyof ContactFields, hintId?: string) {
    const err = errors[field];
    const describedBy = [hintId, err ? `${field}-error` : undefined].filter(Boolean).join(' ') || undefined;
    return { id: field, name: field, 'aria-invalid': err ? true : undefined, 'aria-describedby': describedBy };
  }

  function renderError(field: keyof ContactFields) {
    const text = message(field);
    return text ? (
      <p id={`${field}-error`} className="mt-1.5 text-sm text-red-700">
        {text}
      </p>
    ) : null;
  }

  const label = 'mb-1.5 block text-sm font-medium text-brand-900';
  const required = (
    <span aria-hidden="true" className="text-red-700">
      {' '}*
    </span>
  );

  return (
    <form action={formAction} onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="rounded-md border border-brand-200 bg-brand-50 p-4 text-sm text-brand-900">
        <p className="font-semibold">{labels.disclaimerTitle}</p>
        {labels.disclaimer.map((p) => (
          <p key={p} className="mt-2">
            {p}
          </p>
        ))}
      </div>

      <p className="text-sm text-muted-foreground">{labels.requiredNote}</p>

      <div role="alert" aria-live="assertive">
        {(hasErrors || state.serverError) && (
          <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {state.serverError && !hasErrors ? labels.errors.server : labels.errorSummary}
          </p>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="fullName" className={label}>
            {labels.fullName}
            {required}
          </label>
          <input {...fieldProps('fullName')} type="text" autoComplete="name" required maxLength={120} className={inputClass} />
          {renderError('fullName')}
        </div>

        <div>
          <label htmlFor="email" className={label}>
            {labels.email}
            {required}
          </label>
          <input {...fieldProps('email')} type="email" autoComplete="email" required maxLength={200} className={inputClass} />
          {renderError('email')}
        </div>

        <div>
          <label htmlFor="phone" className={label}>
            {labels.phone} <span className="font-normal text-muted-foreground">({labels.phoneHint})</span>
          </label>
          <input {...fieldProps('phone')} type="tel" autoComplete="tel" maxLength={30} className={inputClass} />
          {renderError('phone')}
        </div>

        <div>
          <label htmlFor="preferredLanguage" className={label}>
            {labels.preferredLanguage}
          </label>
          <select id="preferredLanguage" name="preferredLanguage" defaultValue={locale} className={inputClass}>
            <option value="en">{labels.languages.en}</option>
            <option value="es">{labels.languages.es}</option>
          </select>
        </div>

        <div>
          <label htmlFor="matter" className={label}>
            {labels.matter}
            {required}
          </label>
          <select {...fieldProps('matter')} required defaultValue="" className={inputClass}>
            <option value="" disabled>
              {labels.matterPlaceholder}
            </option>
            {matters.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
          {renderError('matter')}
        </div>

        <fieldset className="sm:col-span-2">
          <legend className={label}>{labels.contactMethod}</legend>
          <div className="flex gap-6">
            {(['email', 'phone'] as const).map((m) => (
              <label key={m} className="flex items-center gap-2 text-sm text-brand-900">
                <input type="radio" name="contactMethod" value={m} defaultChecked={m === 'email'} className="h-4 w-4 accent-brand-700" />
                {labels.contactMethods[m]}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="sm:col-span-2">
          <label htmlFor="message" className={label}>
            {labels.message}
          </label>
          <textarea
            {...fieldProps('message', 'message-hint')}
            rows={5}
            maxLength={MESSAGE_MAX}
            className={cn(inputClass, 'h-auto min-h-[120px]')}
          />
          <p id="message-hint" className="mt-1.5 text-sm text-muted-foreground">
            {labels.messageHint}
          </p>
          {renderError('message')}
        </div>

        {/* Honeypot for spam bots — hidden from people and assistive technology. */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label htmlFor="company">Company</label>
          <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <div className="sm:col-span-2">
          <label className="flex items-start gap-3 text-sm text-brand-900">
            <input
              {...fieldProps('consent')}
              type="checkbox"
              value="yes"
              required
              className="mt-0.5 h-4 w-4 shrink-0 accent-brand-700"
            />
            <span>
              {labels.consent}
              {required}
            </span>
          </label>
          {renderError('consent')}
        </div>
      </div>

      <button type="submit" disabled={pending} className={buttonClasses({ size: 'lg', className: 'w-full sm:w-auto' })}>
        {pending ? labels.submitting : labels.submit}
      </button>
    </form>
  );
}
