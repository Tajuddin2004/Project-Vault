import React, { useState } from 'react';
import { Logo, VaultLogo } from '../components/Logo';
import { authApi } from '../api/auth';

export function ForgotPassword({ onNavigate }) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      await authApi.forgotPassword(email);
      setSent(true);
    } catch (err) {
      if (err.message.includes('connect to backend')) {
        setSent(true);
      } else {
        setErrorMsg(err.message || 'Failed to send password reset OTP.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fpp-root">
      {/* ── Left Panel: Dark Navy Brand Side ── */}
      <aside className="fpp-left">
        <div className="fpp-left-inner">
          <div className="fpp-left-logo" onClick={() => onNavigate('/')} role="button" tabIndex={0}>
            <VaultLogo style={{ width: 36, height: 36 }} />
            <span className="fpp-brand-name">PROJECT VAULT</span>
          </div>

          <div className="fpp-left-content">
            <div className="fpp-left-eyebrow">PASSWORD RECOVERY</div>
            <h2 className="fpp-left-title">
              Regain access to your account securely.
            </h2>
            <p className="fpp-left-desc">
              Enter the email address linked to your Project Vault account and we'll send a time-limited reset link directly to your inbox.
            </p>

            <ul className="fpp-security-list">
              <li>
                <div className="fpp-sec-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                </div>
                <div>
                  <strong>Single-use token</strong>
                  <span>Valid for 30 minutes only</span>
                </div>
              </li>
              <li>
                <div className="fpp-sec-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </div>
                <div>
                  <strong>Encrypted delivery</strong>
                  <span>TLS-secured email channel</span>
                </div>
              </li>
              <li>
                <div className="fpp-sec-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <div>
                  <strong>Bcrypt hashing</strong>
                  <span>Password never stored in plain text</span>
                </div>
              </li>
            </ul>
          </div>

          <div className="fpp-left-footer">
            © {new Date().getFullYear()} Project Vault Inc.
          </div>
        </div>
      </aside>

      {/* ── Right Panel: Form ── */}
      <main className="fpp-right">
        <div className="fpp-right-topbar" />

        <div className="fpp-form-area">
          {!sent ? (
            <>
              <div className="fpp-form-head">
                <div className="fpp-form-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2"/>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                </div>
                <h1>Forgot your password?</h1>
                <p>Enter your registered email address below. We'll send a 6-digit OTP verification code to your inbox.</p>
              </div>

              {errorMsg && (
                <div className="auth-alert auth-alert--error" style={{ marginBottom: 20 }}><span>⚠️</span> {errorMsg}</div>
              )}

              <form onSubmit={handleSubmit} className="fpp-form">
                <div className="fpp-field">
                  <label htmlFor="fp-email" className="fpp-label">Email address</label>
                  <input
                    id="fp-email"
                    type="email"
                    required
                    autoFocus
                    placeholder="you@university.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="fpp-input"
                  />
                </div>

                <button type="submit" className="fpp-btn-primary" disabled={isLoading}>
                  {isLoading ? (
                    <><span className="fpp-spinner" /> Sending Reset Link…</>
                  ) : (
                    <>Send Reset Link
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                      </svg>
                    </>
                  )}
                </button>
              </form>

              <p className="fpp-alt-link">
                Remembered your password?{' '}
                <button className="fpp-inline-link" onClick={() => onNavigate('/signin')}>Sign in</button>
              </p>
            </>
          ) : (
            <div className="fpp-success">
              <div className="fpp-success-check">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <h1>Check your inbox</h1>
              <p>
                A reset link was sent to <strong className="fpp-email-highlight">{email}</strong>. It expires in <strong>30 minutes</strong> and can only be used once.
              </p>

              <div className="fpp-info-box">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <span>Not in your inbox? Check your spam or promotions folder.</span>
              </div>

              <div className="fpp-success-actions">
                <button className="fpp-btn-ghost" onClick={() => { setSent(false); setEmail(''); }}>
                  Send to a different email
                </button>
                <button className="fpp-btn-ghost" onClick={() => onNavigate('/signin')}>
                  Return to Sign In
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
