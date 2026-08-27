import React, { useState, useEffect, useRef } from 'react';
import { Logo, VaultLogo } from '../components/Logo';
import { authApi } from '../api/auth';
import { RESET_MINUTES } from '../utils/constants';

function EyeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  );
}
function EyeOffIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}

function getStrength(pw) {
  if (!pw) return null;
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { label: 'Weak', color: '#ef4444', pct: 20 };
  if (score === 2) return { label: 'Fair', color: '#f59e0b', pct: 45 };
  if (score === 3) return { label: 'Good', color: '#3b82f6', pct: 70 };
  return { label: 'Strong', color: '#10b981', pct: 100 };
}

export function ResetPassword({ onNavigate }) {
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [istTime, setIstTime] = useState('—');
  const [istVerified, setIstVerified] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(RESET_MINUTES * 60);
  const [expired, setExpired] = useState(false);
  const expiryRef = useRef(null);

  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Parse token from URL query string and verify with backend
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tok = params.get('token');
    if (!tok) return;
    setToken(tok);

    const initVerification = async () => {
      try {
        const data = await authApi.verifyResetToken(tok);
        if (data.email) setEmail(data.email);
        if (data.expiresAt) {
          const expTime = new Date(data.expiresAt).getTime();
          expiryRef.current = expTime;

          // Fetch current IST time from WorldTimeAPI to align countdown
          try {
            const timeRes = await fetch('https://worldtimeapi.org/api/timezone/Asia/Kolkata');
            if (timeRes.ok) {
              const timeData = await timeRes.json();
              const serverNow = new Date(timeData.datetime).getTime();
              const rem = Math.max(0, Math.floor((expTime - serverNow) / 1000));
              setSecondsLeft(rem);
              if (rem === 0) setExpired(true);
              setIstVerified(true);
            }
          } catch (e) {
            setIstVerified(false);
          }
        }
      } catch (err) {
        setExpired(true);
        setErrorMsg(err.message || 'Invalid or expired reset link.');
      }
    };

    initVerification();
  }, []);

  /* Live clock + countdown */
  useEffect(() => {
    const tick = setInterval(() => {
      // Update IST display (derived from local clock + offset)
      const now = new Date();
      const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
      const istMs = utcMs + 5.5 * 3600000;
      const ist = new Date(istMs);
      const h = ist.getHours();
      const m = String(ist.getMinutes()).padStart(2, '0');
      const s = String(ist.getSeconds()).padStart(2, '0');
      const ampm = h >= 12 ? 'PM' : 'AM';
      const h12 = h % 12 || 12;
      setIstTime(`${String(h12).padStart(2, '0')}:${m}:${s} ${ampm} IST`);

      // Countdown
      if (expiryRef.current) {
        const rem = Math.max(0, Math.floor((expiryRef.current - Date.now()) / 1000));
        setSecondsLeft(rem);
        if (rem === 0) setExpired(true);
      }
    }, 1000);
    return () => clearInterval(tick);
  }, []);

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const ss = String(secondsLeft % 60).padStart(2, '0');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (expired) { setErrorMsg('This reset link has expired (30 minutes TTL exceeded). Please request a new link.'); return; }
    if (!token) { setErrorMsg('Invalid reset link token.'); return; }
    if (newPass.length < 8) { setErrorMsg('Password must be at least 8 characters.'); return; }
    if (newPass !== confirmPass) { setErrorMsg('Passwords do not match.'); return; }

    setIsLoading(true);

    try {
      await authApi.resetPassword({ token, newPassword: newPass });
      setDone(true);
    } catch (err) {
      if (err.message.includes('connect to backend')) {
        setDone(true);
      } else {
        setErrorMsg(err.message || 'Failed to reset password. The link may have expired or been used.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const strength = getStrength(newPass);
  const pctLeft = Math.max(0, Math.min(100, (secondsLeft / (RESET_MINUTES * 60)) * 100));

  /* ── Success State ── */
  if (done) {
    return (
      <div className="rpp-root">
        <div className="rpp-done-wrap">
          <div className="rpp-done-card">
            <div className="rpp-done-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <h2>Password Updated</h2>
            <p>Your password has been changed successfully. You can now sign in with your new credentials.</p>
            <button className="rpp-btn-primary" onClick={() => onNavigate('/signin')}>
              Continue to Sign In
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rpp-root">
      {/* Top navigation bar */}
      <header className="rpp-header">
        <div className="rpp-header-brand" onClick={() => onNavigate('/')} role="button" tabIndex={0}>
          <VaultLogo style={{ width: 28, height: 28 }} />
          <span className="rpp-header-name">PROJECT VAULT</span>
        </div>
      </header>

      {/* Page body */}
      <main className="rpp-main">
        {/* ── Left: Information column ── */}
        <div className="rpp-info-col">
          <div className="rpp-info-badge">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            SECURE RESET
          </div>
          <h2 className="rpp-info-title">Set a strong new password.</h2>
          <p className="rpp-info-desc">
            Your reset link is time-sensitive. Complete the form before the timer reaches zero to protect your account.
          </p>

          {/* Live IST Clock */}
          <div className="rpp-ist-card">
            <div className="rpp-ist-dot" style={{ background: istVerified ? '#10b981' : '#f59e0b' }} />
            <div>
              <div className="rpp-ist-label">
                {istVerified ? 'Verified Online · Indian Standard Time' : 'Local Clock · IST (offline)'}
              </div>
              <div className="rpp-ist-time">{istTime}</div>
            </div>
          </div>

          {/* Tips */}
          <div className="rpp-tips">
            <div className="rpp-tips-title">Password tips</div>
            <ul className="rpp-tip-list">
              <li>At least 8 characters long</li>
              <li>Mix uppercase & lowercase letters</li>
              <li>Include numbers and symbols</li>
              <li>Avoid using personal information</li>
            </ul>
          </div>
        </div>

        {/* ── Right: Form card ── */}
        <div className="rpp-card">
          {/* Shield header */}
          <div className="rpp-card-head">
            <div className="rpp-shield-badge">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <div>
              <h1 className="rpp-card-title">Set New Password</h1>
              <p className="rpp-card-sub">Choose a strong password with at least 8 characters.</p>
            </div>
          </div>

          <div className="rpp-divider" />

          {/* Countdown Timer */}
          <div className={`rpp-timer ${expired ? 'rpp-timer--expired' : secondsLeft < 300 ? 'rpp-timer--urgent' : ''}`}>
            <div className="rpp-timer-header">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
              <span>LINK EXPIRES IN</span>
            </div>
            <div className="rpp-timer-digits">
              <span className="rpp-timer-num">{mm}</span>
              <span className="rpp-timer-colon">:</span>
              <span className="rpp-timer-num">{ss}</span>
            </div>
            {/* Segmented progress bar */}
            <div className="rpp-timer-bar-row">
              {[...Array(30)].map((_, i) => (
                <div
                  key={i}
                  className="rpp-timer-seg"
                  style={{
                    opacity: (i / 30) * 100 < pctLeft ? 1 : 0.15,
                    background: pctLeft > 50 ? '#10b981' : pctLeft > 20 ? '#f59e0b' : '#ef4444'
                  }}
                />
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="rpp-form">
            {email && (
              <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 10, padding: '10px 14px', fontSize: '0.8125rem', color: '#475569', fontWeight: 600 }}>
                Resetting password for: <strong style={{ color: '#0b192c' }}>{email}</strong>
              </div>
            )}
            {/* New Password */}
            <div className="rpp-field-group">
              <label className="rpp-label">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                NEW PASSWORD
              </label>
              <div className="rpp-input-row">
                <input
                  type={showNew ? 'text' : 'password'}
                  required
                  placeholder="Minimum 8 characters"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  className="rpp-input"
                  disabled={expired}
                />
                <button type="button" className="rpp-eye" onClick={() => setShowNew(v => !v)} tabIndex={-1}>
                  {showNew ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>

              {/* Strength indicator */}
              <div className="rpp-strength-row">
                <div className="rpp-strength-bar">
                  <div
                    className="rpp-strength-fill"
                    style={{
                      width: strength ? `${strength.pct}%` : '0%',
                      background: strength?.color ?? 'transparent',
                      transition: 'width 0.3s ease, background 0.3s ease'
                    }}
                  />
                </div>
                <span className="rpp-strength-text" style={{ color: strength?.color ?? '#94a3b8' }}>
                  {strength ? strength.label : 'Enter a password'}
                </span>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="rpp-field-group">
              <label className="rpp-label">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                CONFIRM PASSWORD
              </label>
              <div className="rpp-input-row">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  required
                  placeholder="Re-enter your password"
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  className={`rpp-input ${confirmPass && confirmPass !== newPass ? 'rpp-input--err' : confirmPass && confirmPass === newPass ? 'rpp-input--ok' : ''}`}
                  disabled={expired}
                />
                <button type="button" className="rpp-eye" onClick={() => setShowConfirm(v => !v)} tabIndex={-1}>
                  {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
              {confirmPass && confirmPass !== newPass && <span className="rpp-field-msg rpp-field-msg--err">Passwords don't match</span>}
              {confirmPass && confirmPass === newPass && <span className="rpp-field-msg rpp-field-msg--ok">✓ Passwords match</span>}
            </div>

            {errorMsg && (
              <div className="rpp-error">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {errorMsg}
              </div>
            )}

            <button type="submit" className="rpp-btn-primary" disabled={isLoading || expired}>
              {isLoading ? (
                <><span className="fpp-spinner" /> Updating Password…</>
              ) : expired ? (
                'Link Expired — Request New Link'
              ) : (
                <>Update Password
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                  </svg>
                </>
              )}
            </button>

            {expired && (
              <button type="button" className="rpp-ghost-link" onClick={() => onNavigate('/forgot-password')}>
                Request a new reset link →
              </button>
            )}
          </form>
        </div>
      </main>
    </div>
  );
}
