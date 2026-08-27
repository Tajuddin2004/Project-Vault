import React from 'react';
import { Logo } from '../Logo';

export function PublicFooter({ onNavigate }) {
  return (
    <footer className="public-beige-footer">
      <div className="shell public-footer-inner">
        <div className="public-footer-left">
          <Logo href="/" onNavigate={onNavigate} />
          <span className="public-footer-copy">
            © 2026 Project Vault. All rights reserved.
          </span>
        </div>

        <div className="public-footer-links">
          <a
            href="/#how-it-works"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/#how-it-works');
            }}
          >
            How It Works
          </a>
          <a
            href="/#showcase"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/#showcase');
            }}
          >
            Explore Showcase
          </a>
          <a
            href="/#verification"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/#verification');
            }}
          >
            Verification Audit
          </a>
        </div>
      </div>
    </footer>
  );
}
