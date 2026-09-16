'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import AppIcon from '@/components/ui/AppIcon';

type Status = 'idle' | 'loading' | 'error' | 'sent';

async function parseJson(res: Response) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [devResetUrl, setDevResetUrl] = useState<string | undefined>(undefined);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) {
      setErrorMessage('Enter a valid email address.');
      setStatus('error');
      return;
    }
    setStatus('loading');
    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const json = await parseJson(res);
    if (!res.ok || !json?.success) {
      setErrorMessage(json?.error?.message || 'Something went wrong. Please try again.');
      setStatus('error');
      return;
    }
    setDevResetUrl(json.data?.devResetUrl);
    setStatus('sent');
  };

  return (
    <section className="pt-24 lg:pt-28 pb-14 px-4 sm:px-6 lg:px-10">
      <div className="max-w-[520px] mx-auto rounded-3xl border border-border bg-card p-8 sm:p-10">
        <span className="section-label mb-3">Reset Access</span>
        <h1 className="font-display font-black uppercase text-display-md text-foreground leading-[0.9]">
          Forgot your password?
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Enter the email on your account and, if it matches one we have on file, we&apos;ll send you a link to set a
          new password.
        </p>

        {status === 'sent' ? (
          <div className="mt-8 rounded-2xl border border-border bg-secondary/25 p-6">
            <AppIcon name="CheckCircleIcon" variant="solid" size={26} className="text-primary" />
            <h2 className="mt-4 text-lg font-bold text-foreground">Check your inbox.</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              If an account exists for <span className="font-semibold text-foreground">{email}</span>, a reset link
              is on its way. The link expires in 30 minutes.
            </p>

            {devResetUrl && (
              <div className="mt-5 rounded-xl border border-dashed border-border bg-background p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  Dev preview — no email service is configured yet
                </p>
                <Link
                  href={devResetUrl.replace(/^https?:\/\/[^/]+/, '')}
                  className="mt-2 block break-all text-xs font-semibold text-primary underline"
                >
                  {devResetUrl}
                </Link>
              </div>
            )}

            <Link
              href="/login"
              className="mt-5 inline-block text-sm font-bold text-foreground border-b-2 border-foreground pb-1 hover:text-primary hover:border-primary transition-colors"
            >
              Back to sign in →
            </Link>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-8 space-y-5">
            <label className="block text-sm font-semibold text-foreground">
              Email Address
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full border-b border-border bg-transparent px-1 py-3 text-sm outline-none focus:border-primary transition-colors"
              />
            </label>

            {status === 'error' && (
              <p role="alert" className="rounded-xl bg-primary/10 px-3.5 py-2.5 text-sm font-semibold text-primary">
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="btn-dark w-full justify-center py-3.5 text-xs disabled:opacity-50"
            >
              {status === 'loading' ? 'Sending…' : 'Send reset link'}
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>

            <p className="text-sm text-muted-foreground">
              Remembered it?{' '}
              <Link href="/login" className="font-bold text-foreground underline hover:text-primary">
                Sign in
              </Link>
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
