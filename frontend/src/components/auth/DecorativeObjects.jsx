import React from 'react';

/** Shared decorative background objects used on auth pages (SignIn / SignUp). */
export function DecorativeObjects() {
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
