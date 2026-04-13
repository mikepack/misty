'use client';

import { useState, useEffect, ReactNode } from 'react';
import { isAuthenticated, setAuthenticated, verifyPassword } from '@/lib/auth';

export default function PasswordGate({ children }: { children: ReactNode }) {
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      setAuthed(true);
      setChecking(false);
    } else {
      setChecking(false);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const valid = await verifyPassword(password);
      if (valid) {
        setAuthenticated();
        setAuthed(true);
      } else {
        setError('Wrong password');
        setPassword('');
      }
    } catch {
      setError('Could not verify password');
    }
    setSubmitting(false);
  };

  if (checking) return null;
  if (authed) return <>{children}</>;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-bg-muted z-100">
      <form className="bg-bg-default border border-border-muted rounded-lg p-8 w-80 flex flex-col gap-4 shadow-[0_4px_16px_rgba(0,0,0,0.08)]" onSubmit={handleSubmit}>
        <h2 className="text-lg font-semibold text-fg-default text-center">Enter password</h2>
        <input
          type="password"
          className="py-2.5 px-3 border border-border-muted rounded-md text-sm outline-none text-fg-default focus:border-fg-accent focus:shadow-[0_0_0_3px_var(--bg-accent-subtle)]"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          autoFocus
          disabled={submitting}
        />
        {error && <p className="text-fg-danger text-[13px] text-center">{error}</p>}
        <button className="py-2.5 px-4 bg-bg-success-emphasis text-fg-on-emphasis border-none rounded-md text-sm font-medium cursor-pointer hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed" type="submit" disabled={submitting}>
          {submitting ? 'Checking...' : 'Enter'}
        </button>
      </form>
    </div>
  );
}
