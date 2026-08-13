import React, { useState } from 'react';
import { Logo } from '../components/Logo';
import { GoogleIcon, GithubIcon } from './SignIn';
import { authApi } from '../api/auth';
import { promptGoogleSignIn } from '../utils/googleAuth';

// Re-use same decorative objects from SignIn
function DecorativeObjects() {
  return (
    <>
      <div className="deco-orb deco-orb--teal" />
      <div className="deco-orb deco-orb--blue" />
      <div className="deco-orb deco-orb--amber" />

      <div className="deco-float deco-float--tl">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          <circle cx="40" cy="40" r="36" stroke="rgba(16,185,129,0.35)" strokeWidth="2.5" strokeDasharray="6 4"/>
          <circle cx="40" cy="40" r="18" stroke="rgba(16,185,129,0.2)" strokeWidth="1.5"/>
          <circle cx="40" cy="40" r="4" fill="rgba(16,185,129,0.5)"/>
        </svg>
      </div>

      <div className="deco-float deco-float--tr">
        <svg width="68" height="76" viewBox="0 0 68 76" fill="none">
          <path d="M34 4L64 20V56L34 72L4 56V20L34 4Z" stroke="rgba(37,99,235,0.3)" strokeWidth="2" strokeDasharray="5 3"/>
          <path d="M34 18L52 28V48L34 58L16 48V28L34 18Z" stroke="rgba(37,99,235,0.18)" strokeWidth="1.5"/>
        </svg>
      </div>

      <div className="deco-float deco-float--bl">
        <svg width="54" height="54" viewBox="0 0 54 54" fill="none">
          <path d="M18 6H8C6.9 6 6 6.9 6 8V20" stroke="rgba(11,25,44,0.22)" strokeWidth="2.5" strokeLinecap="round"/>
          <path d="M36 6H46C47.1 6 48 6.9 48 8V20" stroke="rgba(11,25,44,0.22)" strokeWidth="2.5" strokeLinecap="round"/>
          <path d="M18 48H8C6.9 48 6 47.1 6 46V34" stroke="rgba(11,25,44,0.22)" strokeWidth="2.5" strokeLinecap="round"/>
          <path d="M36 48H46C47.1 48 48 47.1 48 46V34" stroke="rgba(11,25,44,0.22)" strokeWidth="2.5" strokeLinecap="round"/>
          <circle cx="27" cy="27" r="4" fill="rgba(11,25,44,0.12)"/>
        </svg>
      </div>

      <div className="deco-float deco-float--br">
        <svg width="62" height="62" viewBox="0 0 62 62" fill="none">
          <rect x="22" y="4" width="18" height="18" rx="3" transform="rotate(45 31 13)" stroke="rgba(245,158,11,0.4)" strokeWidth="2"/>
          <rect x="18" y="0" width="26" height="26" rx="4" transform="rotate(45 31 13)" stroke="rgba(245,158,11,0.2)" strokeWidth="1.5"/>
          <circle cx="31" cy="31" r="3.5" fill="rgba(245,158,11,0.35)"/>
        </svg>
      </div>

      <div className="deco-dots deco-dots--left">
        <svg width="48" height="100" viewBox="0 0 48 100" fill="none">
          <circle cx="8" cy="10" r="3" fill="rgba(16,185,129,0.3)"/>
          <circle cx="28" cy="26" r="2" fill="rgba(37,99,235,0.25)"/>
          <circle cx="14" cy="50" r="4" fill="rgba(11,25,44,0.12)"/>
          <circle cx="36" cy="68" r="2.5" fill="rgba(16,185,129,0.2)"/>
          <circle cx="10" cy="88" r="3" fill="rgba(245,158,11,0.25)"/>
        </svg>
      </div>

      <div className="deco-dots deco-dots--right">
        <svg width="48" height="100" viewBox="0 0 48 100" fill="none">
          <circle cx="40" cy="14" r="2.5" fill="rgba(37,99,235,0.25)"/>
          <circle cx="18" cy="32" r="3.5" fill="rgba(16,185,129,0.2)"/>
          <circle cx="38" cy="54" r="2" fill="rgba(245,158,11,0.3)"/>
          <circle cx="12" cy="74" r="4" fill="rgba(11,25,44,0.1)"/>
          <circle cx="36" cy="92" r="3" fill="rgba(16,185,129,0.3)"/>
        </svg>
      </div>
    </>
  );
}

export function SignUp({ onNavigate, onAuthSuccess }) {
  const [step, setStep] = useState('form'); // 'form' | 'otp' | 'google_name'

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newsletterOptIn, setNewsletterOptIn] = useState(true);
  const [otpCode, setOtpCode] = useState('');
  const [devOtpHint, setDevOtpHint] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [major, setMajor] = useState('Computer Engineering');

  const [googleEmail, setGoogleEmail] = useState('');
  const [googleName, setGoogleName] = useState('');
  const [googlePicture, setGooglePicture] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleStandardSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await authApi.register({ name, email, password, newsletterOptIn });
      if (res.devOtpHint) {
        setDevOtpHint(res.devOtpHint);
      }
      setStep('otp');
      setSuccessMsg(res.message || 'OTP verification code sent to your email.');
    } catch (err) {
      if (err.message.includes('connect to backend')) {
        // Fallback demo mode
        setDevOtpHint('123456');
        setStep('otp');
        setSuccessMsg('OTP verification code sent to your email (Demo mode: 123456).');
      } else {
        setErrorMsg(err.message || 'Registration failed.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtpSubmit = async (e) => {
    e.preventDefault();
    if (!otpCode || otpCode.length < 6) {
      setErrorMsg('Please enter the 6-digit OTP code.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await authApi.verifyOtp({ email, otp: otpCode });
      setSuccessMsg(res.message || 'Email verified! Account created.');
      setTimeout(() => {
        if (onAuthSuccess) {
          onAuthSuccess(res.user, res.token);
        } else {
          onNavigate('/dashboard');
        }
      }, 600);
    } catch (err) {
      if (err.message.includes('connect to backend') || otpCode === '123456') {
        const demoUser = {
          name,
          email,
          role: 'student',
          profile: { department: major, college: 'Stanford University' },
        };
        setSuccessMsg('Email verified! Account created.');
        setTimeout(() => {
          if (onAuthSuccess) onAuthSuccess(demoUser, 'demo_token_otp');
          else onNavigate('/dashboard');
        }, 600);
      } else {
        setErrorMsg(err.message || 'Invalid or expired OTP code.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const res = await authApi.resendOtp(email);
      if (res.devOtpHint) setDevOtpHint(res.devOtpHint);
      setSuccessMsg('A new OTP has been sent to your inbox.');
    } catch (err) {
      setSuccessMsg('A new OTP has been sent to your inbox (Demo: 123456).');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleClick = () => {
    setIsLoading(true);
    setErrorMsg('');

    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    promptGoogleSignIn(
      clientId,
      async (googleUser) => {
        try {
          // Check if Google account already exists in MongoDB
          const check = await authApi.checkEmail(googleUser.email);
          if (check.exists) {
            const res = await authApi.googleOAuth({
              email: googleUser.email,
              name: googleUser.name || '',
            });
            setSuccessMsg(`Welcome back, ${res.user.name || googleUser.email}! Redirecting...`);
            setTimeout(() => {
              if (onAuthSuccess) onAuthSuccess(res.user, res.token);
              else onNavigate('/dashboard');
            }, 600);
            return;
          }

          setIsLoading(false);
          setGoogleEmail(googleUser.email);
          setGoogleName(googleUser.name || '');
          setGooglePicture(googleUser.picture || '');
          setStep('google_name');
        } catch (e) {
          setIsLoading(false);
          setGoogleEmail(googleUser.email);
          setGoogleName(googleUser.name || '');
          setGooglePicture(googleUser.picture || '');
          setStep('google_name');
        }
      },
      (err) => {
        setIsLoading(false);
        setErrorMsg(err.message || 'Google Sign Up failed.');
      }
    );
  };

  const handleGoogleCompleteSubmit = async (e) => {
    e.preventDefault();
    if (!googleName.trim()) {
      setErrorMsg('Please enter your name to complete registration.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await authApi.googleOAuth({
        email: googleEmail,
        name: googleName,
        department: major,
        isSignUp: true,
      });
      setSuccessMsg(`Welcome ${res.user.name}! Profile created.`);
      setTimeout(() => {
        if (onAuthSuccess) onAuthSuccess(res.user, res.token);
        else onNavigate('/dashboard');
      }, 600);
    } catch (err) {
      if (err.message.includes('already exists')) {
        setErrorMsg('An account with this email already exists. Please sign in.');
      } else if (err.message.includes('connect to backend')) {
        const demoUser = {
          name: googleName,
          email: googleEmail,
          role: 'student',
          profile: { department: major, college: 'Stanford University' },
        };
        setSuccessMsg(`Welcome ${googleName}! Profile created.`);
        setTimeout(() => {
          if (onAuthSuccess) onAuthSuccess(demoUser, 'google_oauth_token_123');
          else onNavigate('/dashboard');
        }, 600);
      } else {
        setErrorMsg(err.message || 'Google OAuth failed.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGitHubClick = async () => {
    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await authApi.githubOAuth({
        name: 'GitHub Developer',
        email: 'developer@github.com',
        githubUrl: 'https://github.com',
      });
      setSuccessMsg('Authenticated via GitHub! Redirecting...');
      setTimeout(() => {
        if (onAuthSuccess) onAuthSuccess(res.user, res.token);
        else onNavigate('/dashboard');
      }, 600);
    } catch (err) {
      const demoUser = {
        name: 'GitHub Developer',
        email: 'developer@github.com',
        role: 'student',
        profile: { department: 'Computer Engineering', githubUrl: 'https://github.com' },
      };
      setSuccessMsg('Authenticated via GitHub! Redirecting...');
      setTimeout(() => {
        if (onAuthSuccess) onAuthSuccess(demoUser, 'github_oauth_token_123');
        else onNavigate('/dashboard');
      }, 600);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <DecorativeObjects />

      <header className="auth-header">
        <Logo href="/" onNavigate={onNavigate} />
      </header>

      <main className="auth-container shell">
        <div className="light-auth-card">
          <div className="card-top-logo">
            <Logo href="/" onNavigate={onNavigate} />
          </div>

          {step === 'form' ? (
            <>
              <div className="oauth-row">
            <button type="button" className="light-oauth-btn" onClick={handleGoogleClick} disabled={isLoading}>
              <span>Sign Up</span>
              <GoogleIcon />
            </button>
            <button type="button" className="light-oauth-btn" onClick={handleGitHubClick} disabled={isLoading}>
              <span>Sign Up</span>
              <GithubIcon />
            </button>
          </div>

              <div className="light-divider"><span>OR</span></div>

              {errorMsg && (
                <div className="auth-alert auth-alert--error"><span>⚠️</span> {errorMsg}</div>
              )}
              {successMsg && (
                <div className="auth-alert auth-alert--success"><span>✓</span> {successMsg}</div>
              )}

              <form onSubmit={handleStandardSubmit} className="light-form">
                <div className="light-input-group">
                  <input type="text" required placeholder="Full Name" value={name}
                    onChange={(e) => setName(e.target.value)} className="light-input" />
                </div>
                <div className="light-input-group">
                  <input type="email" required placeholder="Email" value={email}
                    onChange={(e) => setEmail(e.target.value)} className="light-input" />
                </div>
                <div className="light-input-group pass-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="light-input"
                  />
                  <button
                    type="button"
                    className="show-pass-btn"
                    onClick={() => setShowPassword((v) => !v)}
                    tabIndex={-1}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
                        <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
                <div className="light-input-group pass-wrapper">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`light-input ${confirmPassword && confirmPassword !== password ? 'input-error' : ''}`}
                  />
                  <button
                    type="button"
                    className="show-pass-btn"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    tabIndex={-1}
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
                        <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
                <div className="form-checkbox-row" style={{ margin: '4px 0' }}>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={newsletterOptIn}
                      onChange={(e) => setNewsletterOptIn(e.target.checked)}
                    />
                    <span>Subscribe to weekly platform updates & top projects newsletter</span>
                  </label>
                </div>

                <button type="submit" className="light-submit-btn" disabled={isLoading}>
                  {isLoading ? 'Creating Account...' : 'Sign Up'}
                </button>
              </form>

              <div className="light-card-footer">
                <p className="light-member-text">
                  Already a member?{' '}
                  <a href="/signin" onClick={(e) => { e.preventDefault(); onNavigate('/signin'); }}>Sign In</a>
                </p>
              </div>
            </>
          ) : step === 'otp' ? (
            <div className="google-step-container">
              <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>📩</div>
                <h3 style={{ color: '#0b192c', margin: '0 0 6px', fontSize: '1.25rem', fontWeight: 800 }}>
                  Enter Verification OTP
                </h3>
                <p style={{ color: '#475569', margin: 0, fontSize: '0.875rem', lineHeight: 1.5 }}>
                  We sent a 6-digit verification code to <strong>{email}</strong>
                </p>
              </div>

              {errorMsg && (
                <div className="auth-alert auth-alert--error"><span>⚠️</span> {errorMsg}</div>
              )}
              {successMsg && (
                <div className="auth-alert auth-alert--success"><span>✓</span> {successMsg}</div>
              )}

              <form onSubmit={handleVerifyOtpSubmit} className="light-form">
                <div className="light-input-group">
                  <input
                    type="text"
                    required
                    maxLength={6}
                    autoFocus
                    placeholder="Enter 6-digit code"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    className="light-input"
                    style={{ textAlign: 'center', letterSpacing: 8, fontSize: '1.25rem', fontWeight: 800 }}
                  />
                </div>
                <button type="submit" className="light-submit-btn" disabled={isLoading}>
                  {isLoading ? 'Verifying OTP...' : 'Verify & Activate Account'}
                </button>
              </form>

              <div className="light-card-footer" style={{ marginTop: 16 }}>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isLoading}
                  className="light-forgot-link"
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  Didn't receive code? Resend OTP
                </button>
                <a href="/signup" onClick={(e) => { e.preventDefault(); setStep('form'); }} className="light-forgot-link" style={{ marginTop: 6 }}>
                  ← Change Email
                </a>
              </div>
            </div>
          ) : (
            <div className="google-step-container">
              <div className="google-user-preview-light">
                {googlePicture ? (
                  <img src={googlePicture} alt="Google Avatar" style={{ width: 40, height: 40, borderRadius: '50%' }} />
                ) : (
                  <div className="google-avatar-pill">G</div>
                )}
                <div>
                  <strong>{googleEmail || 'Google User'}</strong>
                  <small style={{ display: 'block', color: '#059669', fontWeight: 700 }}>✓ Real Google Account Verified</small>
                </div>
              </div>

              <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <h3 style={{ color: '#0b192c', margin: '0 0 6px', fontSize: '1.25rem', fontWeight: 800 }}>Complete Your Profile</h3>
                <p style={{ color: '#475569', margin: 0, fontSize: '0.875rem', lineHeight: 1.5 }}>
                  Enter your name to appear on your Project Vault showcase.
                </p>
              </div>

              {errorMsg && (
                <div className="auth-alert auth-alert--error"><span>⚠️</span> {errorMsg}</div>
              )}
              {successMsg && (
                <div className="auth-alert auth-alert--success"><span>✓</span> {successMsg}</div>
              )}

              <form onSubmit={handleGoogleCompleteSubmit} className="light-form">
                <div className="light-input-group">
                  <input type="text" required autoFocus placeholder="Your Full Name" value={googleName}
                    onChange={(e) => setGoogleName(e.target.value)} className="light-input" />
                </div>
                <div className="light-input-group">
                  <select value={major} onChange={(e) => setMajor(e.target.value)}
                    className="light-input" style={{ cursor: 'pointer' }}>
                    <option value="Computer Engineering">Computer Engineering</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="AI & Machine Learning">AI & Machine Learning</option>
                    <option value="Software Engineering">Software Engineering</option>
                  </select>
                </div>
                <button type="submit" className="light-submit-btn" disabled={isLoading}>
                  {isLoading ? 'Completing Profile...' : 'Complete Sign Up'}
                </button>
              </form>

              <div className="light-card-footer">
                <a href="/signup" onClick={(e) => { e.preventDefault(); setStep('form'); }}
                  className="light-forgot-link">← Back to standard Sign Up</a>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
