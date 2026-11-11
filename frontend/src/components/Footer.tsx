import React from 'react';
import { memo } from "react";
import { Link } from "react-router-dom";

const PLATFORM_LINKS = [
  { to: "/nearby", label: "Browse Items" },
  { to: "/add-product", label: "List an Item" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/rent-history", label: "Rent History" },
];

const ACCOUNT_LINKS = [
  { to: "/register", label: "Sign Up" },
  { to: "/login", label: "Sign In" },
  { to: "/profile", label: "Profile" },
];

const LEGAL_LINKS = [
  { to: "/privacy", label: "Privacy Policy" },
  { to: "/terms", label: "Terms of Service" },
  { to: "/safety", label: "Trust & Safety" },
];

const SOCIALS = [
  { name: "Twitter", href: "https://twitter.com", icon: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
    </svg>
  )},
  { name: "Instagram", href: "https://instagram.com", icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" strokeWidth="2" />
      <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" strokeWidth="2" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth="2" />
    </svg>
  )},
  { name: "GitHub", href: "https://github.com", icon: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  )},
];

const FooterLink = memo(function FooterLink({ to, label }) {
  return (
    <li>
      <Link
        to={to}
        className="text-sm text-text-secondary hover:text-green-400 transition-colors duration-200"
      >
        {label}
      </Link>
    </li>
  );
});

FooterLink.displayName = "FooterLink";

const Footer = memo(function Footer() {
  return (
    <footer className="border-t border-border-subtle bg-background-primary relative overflow-hidden" role="contentinfo">
      {/* Subtle top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-px bg-gradient-to-r from-transparent via-green-500/20 to-transparent" aria-hidden="true" />

      <div className="container py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-flex items-center gap-2 text-xl font-extrabold text-gradient-brand tracking-tight mb-4" aria-label="Rentify Home">
              <span className="w-8 h-8 rounded-xl bg-gradient-brand flex items-center justify-center text-white font-black text-sm">
                R
              </span>
              Rentify
            </Link>
            <p className="text-text-secondary text-sm leading-relaxed max-w-xs mb-6">
              Peer-to-peer rental platform connecting neighbors within 10km. Rent anything, earn from idle items, build community trust.
            </p>
            <div className="flex gap-3">
              {SOCIALS.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-white/5 border border-border-subtle flex items-center justify-center text-text-secondary hover:text-green-400 hover:border-green-500/30 hover:bg-green-500/5 transition-all duration-200"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Platform */}
          <div>
            <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-widest mb-4">Platform</h3>
            <nav aria-label="Platform links">
              <ul className="flex flex-col gap-3">
                {PLATFORM_LINKS.map((link) => (
                  <FooterLink key={link.to} {...link} />
                ))}
              </ul>
            </nav>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-widest mb-4">Account</h3>
            <nav aria-label="Account links">
              <ul className="flex flex-col gap-3">
                {ACCOUNT_LINKS.map((link) => (
                  <FooterLink key={link.to} {...link} />
                ))}
              </ul>
            </nav>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-widest mb-4">Legal</h3>
            <nav aria-label="Legal links">
              <ul className="flex flex-col gap-3">
                {LEGAL_LINKS.map((link) => (
                  <FooterLink key={link.to} {...link} />
                ))}
              </ul>
            </nav>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="divider mb-8" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-tertiary">
            &copy; {new Date().getFullYear()} Rentify. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {LEGAL_LINKS.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="text-xs text-text-tertiary hover:text-text-secondary transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
});

export default Footer;