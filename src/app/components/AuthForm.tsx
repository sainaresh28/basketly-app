'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AppIcon from '@/components/ui/AppIcon';
import { useAuth } from '@/lib/auth-context';

type Mode = 'login' | 'register';
type Status = 'idle' | 'loading' | 'error' | 'success';

export default function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const { login, register, user } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const isLogin = mode === 'login';

  const destinationAfterAuth = () => {
    if (typeof window === 'undefined') return '/account';
    const redirect = new URLSearchParams(window.location.search).get('redirect');
    if (redirect && redirect.startsWith('/')) return redirect;
    return user?.role === 'admin' ? '/admin' : '/account';
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const valid = email.includes('@') && password.length >= 6 && (isLogin || name.trim().length >= 2);
    if (!valid) {
      setErrorMessage(
        isLogin
          ? 'Enter a valid email and a password of at least 6 characters.'
          : 'Enter your name, a valid email and a password of at least 6 characters.'
      );
      setStatus('error');
      return;
    }
    setStatus('loading');
    const result = isLogin ? await login(email, password) : await register(name, email, password);
    if (result.ok) {
      setStatus('success');
    } else {
      setErrorMessage(result.message);
      setStatus('error');
    }
  };

  // Once the session state has updated, move on automatically — no need to
  // make the person click through a second screen after they've just signed in.
  React.useEffect(() => {
    if (status !== 'success') return;
    const timer = setTimeout(() => router.push(destinationAfterAuth()), 700);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, user]);

  return (
    <section className="pt-24 lg:pt-28 pb-14 px-4 sm:px-6 lg:px-10">
      <div className="max-w-[1200px] mx-auto rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-2 min-h-[600px] border border-border">
        {/* Brand panel */}
        <div className="hidden md:flex flex-col justify-end bg-primary p-10 lg:p-12">
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-white/80">
            Basketly / Members Club
          </span>
          <p className="font-display font-black uppercase text-white text-display-xl leading-[0.85] mt-auto">
            The good<br />stuff is<br /><span className="text-foreground">closer.</span>
          </p>
          <p className="mt-6 max-w-sm text-sm text-white/85 leading-6">
            Keep your basket close. Save pieces, track orders and get first look at the next edit.
          </p>
        </div>

        {/* Form panel */}
        <div className="flex items-center bg-card p-6 sm:p-10 lg:p-14">
          <div className="w-full max-w-md mx-auto">
            <span className="section-label mb-3">{isLogin ? 'Welcome Back' : 'Come On In'}</span>
            <h1 className="font-display font-black uppercase text-display-md text-foreground leading-[0.9]">
              {isLogin ? 'Good to see you.' : 'Make an account.'}
            </h1>

            {status === 'success' ? (
              <div className="mt-8 rounded-2xl border border-border bg-secondary/25 p-6">
                <AppIcon name="CheckCircleIcon" variant="solid" size={26} className="text-primary" />
                <h2 className="mt-4 text-lg font-bold text-foreground">You&apos;re in.</h2>
                <p className="mt-1.5 text-sm text-muted-foreground">Your Basketly account is ready for the good stuff.</p>
                <button
                  onClick={() => router.push(destinationAfterAuth())}
                  className="mt-5 text-sm font-bold text-foreground border-b-2 border-foreground pb-1 hover:text-primary hover:border-primary transition-colors">
                  {user?.role === 'admin' ? 'Go to admin dashboard →' : 'Go to account →'}
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="mt-8 space-y-5">
                {!isLogin && (
                  <label className="block text-sm font-semibold text-foreground">
                    Your Name
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-2 w-full border-b border-border bg-transparent px-1 py-3 text-sm outline-none focus:border-primary transition-colors"
                    />
                  </label>
                )}
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
                <label className="block text-sm font-semibold text-foreground">
                  <span className="flex items-center justify-between gap-2">
                    Password
                    {isLogin && (
                      <Link
                        href="/forgot-password"
                        tabIndex={-1}
                        className="text-xs font-semibold text-muted-foreground hover:text-primary underline underline-offset-2"
                      >
                        Forgot password?
                      </Link>
                    )}
                  </span>
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

                {status === 'error' && (
                  <p role="alert" className="rounded-xl bg-primary/10 px-3.5 py-2.5 text-sm font-semibold text-primary">
                    {errorMessage || 'Check your details and try again.'}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="btn-dark w-full justify-center py-3.5 text-xs disabled:opacity-50">
                  {status === 'loading' ? 'One moment…' : isLogin ? 'Sign In' : 'Create Account'}
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>

                <p className="text-sm text-muted-foreground">
                  {isLogin ? (
                    <>New here? <Link href="/register" className="font-bold text-foreground underline hover:text-primary">Create an account</Link></>
                  ) : (
                    <>Already a member? <Link href="/login" className="font-bold text-foreground underline hover:text-primary">Sign in</Link></>
                  )}
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
