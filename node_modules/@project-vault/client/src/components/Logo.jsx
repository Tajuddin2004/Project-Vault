import React from 'react';

export function VaultLogo({ className = "brand-logo-icon", style }) {
  return (
    <svg className={className} style={style} viewBox="0 0 100 84" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <mask id="vault-keyhole-cutout-comp">
        <rect x="0" y="0" width="100" height="84" fill="white" />
        <circle cx="50" cy="56" r="4.5" fill="black" />
        <polygon points="47.5,57 46,71 54,71 52.5,57" fill="black" />
      </mask>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6 8 H24 L50 56 L76 8 H94 L58 76 H42 L6 8 Z"
        fill="currentColor"
        mask="url(#vault-keyhole-cutout-comp)"
      />
    </svg>
  );
}

export function Logo({ href = "/", onNavigate }) {
  const handleClick = (e) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(href);
    }
  };

  return (
    <a className="brand-logo" href={href} onClick={handleClick} aria-label="Project Vault Home">
      <VaultLogo />
      <span className="brand-logo-text">PROJECT VAULT</span>
    </a>
  );
}
