import React, { useState } from 'react';
import { Logo } from '../components/Logo';
import { authApi } from '../api/auth';
import { promptGoogleSignIn } from '../utils/googleAuth';

function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}

export function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
    </svg>
  );
}

export function GithubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
    </svg>
  );
}

function DecorativeObjects() {
  return (
    <div className="auth-decorative" aria-hidden="true">
      <div className="dec-circle dec-1" />
      <div className="dec-circle dec-2" />
      <div className="dec-cube dec-3" />
      <div className="dec-cube dec-4" />
      <div className="dec-cross dec-5" />
    </div>
  );
}

export function SignIn({ onNavigate, onAuthSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Please fill in all fields.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await authApi.login({ email, password });
      setSuccessMsg(res.message || 'Signed in successfully!');
      setTimeout(() => {
        if (onAuthSuccess) {
          onAuthSuccess(res.user, res.token);
        } else {
          onNavigate('/dashboard');
        }
      }, 500);
    } catch (err) {
      if (err.message.includes('connect to backend')) {
        const demoUser = {
          name: email.split('@')[0].replace('.', ' ') || 'Student User',
          email,
          role: 'student',
          profile: { department: 'Computer Engineering', college: 'Stanford University' },
        };
        setSuccessMsg('Signed in (Demo mode). Redirecting...');
        setTimeout(() => {
          if (onAuthSuccess) onAuthSuccess(demoUser, 'demo_token_123');
          else onNavigate('/dashboard');
        }, 600);
      } else {
        setErrorMsg(err.message || 'Failed to sign in.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    setIsLoading(true);
    setErrorMsg('');

    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '884441003366-sg3ii04bv2p6gcioa2j6gff2l5jjcfmh.apps.googleusercontent.com';

    promptGoogleSignIn(
      clientId,
      async (googleUser) => {
        try {
          // Send real Google account email to backend
          const res = await authApi.googleOAuth({
            email: googleUser.email,
            name: googleUser.name || googleUser.email.split('@')[0],
          });
          setSuccessMsg(`Welcome back, ${res.user.name}!`);
          setTimeout(() => {
            if (onAuthSuccess) onAuthSuccess(res.user, res.token);
            else onNavigate('/dashboard');
          }, 600);
        } catch (err) {
          setErrorMsg(err.message || 'Google OAuth authentication failed.');
        } finally {
          setIsLoading(false);
        }
      },
      (err) => {
        setIsLoading(false);
        setErrorMsg(err.message || 'Google popup closed or failed.');
      }
    );
  };

  const handleGitHubSignIn = async () => {
    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await authApi.githubOAuth({
        name: 'GitHub Developer',
        email: 'developer@github.com',
        githubUrl: 'https://github.com',
      });
      setSuccessMsg('Signed in with GitHub!');
      setTimeout(() => {
        if (onAuthSuccess) onAuthSuccess(res.user, res.token);
        else onNavigate('/dashboard');
      }, 600);
    } catch (err) {
      setErrorMsg(err.message || 'GitHub OAuth failed.');
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

          <div className="oauth-row">
            <button type="button" className="light-oauth-btn" onClick={handleGoogleSignIn} disabled={isLoading}>
              <span>Sign In</span>
              <GoogleIcon />
            </button>
            <button type="button" className="light-oauth-btn" onClick={handleGitHubSignIn} disabled={isLoading}>
              <span>Sign In</span>
              <GithubIcon />
            </button>
          </div>

          <div className="light-divider">
            <span>OR</span>
          </div>

          {errorMsg && (
            <div className="auth-alert auth-alert--error"><span>⚠️</span> {errorMsg}</div>
          )}
          {successMsg && (
            <div className="auth-alert auth-alert--success"><span>✓</span> {successMsg}</div>
          )}

          <form onSubmit={handleSubmit} className="light-form">
            <div className="light-input-group">
              <input
                type="email"
                required
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="light-input"
              />
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
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>

            <div className="forgot-row">
              <a href="/forgot-password" onClick={(e) => { e.preventDefault(); onNavigate('/forgot-password'); }} className="light-forgot-link">
                Forgot password?
              </a>
            </div>

            <button type="submit" className="light-submit-btn" disabled={isLoading}>
              {isLoading ? 'Signing In…' : 'Sign In'}
            </button>
          </form>

          <div className="light-card-footer">
            <p className="light-member-text">
              Not a member yet?{' '}
              <a href="/signup" onClick={(e) => { e.preventDefault(); onNavigate('/signup'); }}>Sign Up</a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
