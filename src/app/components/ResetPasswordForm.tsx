'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import AppIcon from '@/components/ui/AppIcon';

type Status = 'idle' | 'loading' | 'error' | 'success';

async function parseJson(res: Response) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const uid = searchParams.get('uid') || '';
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const linkIsMissingParams = !uid || !token;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      setStatus('error');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      setStatus('error');
      return;
    }
    setStatus('loading');
    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uid, token, password }),
    });
    const json = await parseJson(res);
    if (!res.ok || !json?.success) {
      setErrorMessage(json?.error?.message || 'This reset link is invalid or has expired.');
      setStatus('error');
      return;
    }
    setStatus('success');
  };

  return (
    <section className="pt-24 lg:pt-28 pb-14 px-4 sm:px-6 lg:px-10">
      <div className="max-w-[520px] mx-auto rounded-3xl border border-border bg-card p-8 sm:p-10">
        <span className="section-label mb-3">Reset Access</span>
        <h1 className="font-display font-black uppercase text-display-md text-foreground leading-[0.9]">
          Set a new password.
        </h1>

        {linkIsMissingParams ? (
          <div className="mt-8 rounded-2xl border border-border bg-primary/10 p-6">
            <h2 className="text-lg font-bold text-foreground">This link looks incomplete.</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Open the reset link from your email again, or request a new one.
            </p>
            <Link
              href="/forgot-password"
              className="mt-5 inline-block text-sm font-bold text-foreground border-b-2 border-foreground pb-1 hover:text-primary hover:border-primary transition-colors"
            >
              Request a new link →
            </Link>
          </div>
        ) : status === 'success' ? (
          <div className="mt-8 rounded-2xl border border-border bg-secondary/25 p-6">
            <AppIcon name="CheckCircleIcon" variant="solid" size={26} className="text-primary" />
            <h2 className="mt-4 text-lg font-bold text-foreground">Password updated.</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">You can sign in with your new password now.</p>
            <button
              onClick={() => router.push('/login')}
              className="mt-5 text-sm font-bold text-foreground border-b-2 border-foreground pb-1 hover:text-primary hover:border-primary transition-colors"
            >
              Go to sign in →
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-8 space-y-5">
            <label className="block text-sm font-semibold text-foreground">
              New Password
              <span className="mt-2 flex items-center border-b border-border focus-within:border-primary transition-colors">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent px-1 py-3 text-sm outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                  className="px-1 py-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <AppIcon name={showPassword ? 'EyeSlashIcon' : 'EyeIcon'} size={18} />
                </button>
              </span>
              <span className="mt-2 block text-xs text-muted-foreground">At least 6 characters</span>
            </label>

            <label className="block text-sm font-semibold text-foreground">
              Confirm New Password
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              {status === 'loading' ? 'Updating…' : 'Reset password'}
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
