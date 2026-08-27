import React from 'react';

export function VaultLogo({ className = 'brand-logo-icon', style }) {
  return (
    <svg className={className} style={style} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="8" fill="#0f172a"/>
      <path d="M8 10L16 6L24 10V16C24 20.418 20.418 24.418 16 26C11.582 24.418 8 20.418 8 16V10Z" fill="#10b981" fillOpacity="0.15" stroke="#10b981" strokeWidth="1.5"/>
      <path d="M13 16L15.5 18.5L19 14" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
