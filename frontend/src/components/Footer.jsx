import { memo } from "react";
import { Link } from "react-router-dom";

const PLATFORM_LINKS = [
  { to: "/nearby",       label: "Browse Items" },
  { to: "/add-product",  label: "List an Item" },
  { to: "/dashboard",    label: "Dashboard" },
  { to: "/rent-history", label: "Rent History" },
];

const ACCOUNT_LINKS = [
  { to: "/register", label: "Sign Up" },
  { to: "/login",    label: "Sign In" },
  { to: "/profile",  label: "Profile" },
];

const SOCIALS = ["Twitter", "Instagram", "GitHub"];

const Footer = memo(function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#0a0a0a] mt-16 relative overflow-hidden">
      {/* Subtle top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-px bg-gradient-to-r from-transparent via-green-500/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="inline-block text-2xl font-black gradient-text mb-3">
              Rentify
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
              Peer-to-peer rental platform connecting people within 10km.
              Rent anything, earn from idle items, build community trust.
            </p>
            <div className="flex gap-4 mt-5">
              {SOCIALS.map((s) => (
                <span
                  key={s}
                  className="text-xs text-slate-600 hover:text-green-400 cursor-pointer transition-colors duration-200 font-medium"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Platform */}
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
              Platform
            </p>
            <div className="flex flex-col gap-2.5">
              {PLATFORM_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-sm text-slate-500 hover:text-green-400 transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Account */}
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
              Account
            </p>
            <div className="flex flex-col gap-2.5">
              {ACCOUNT_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-sm text-slate-500 hover:text-green-400 transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="section-divider mb-6" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-700">
            © {new Date().getFullYear()} Rentify. All rights reserved.
          </p>
          <div className="flex gap-4">
            {["Privacy Policy", "Terms of Service"].map((item) => (
              <span
                key={item}
                className="text-xs text-slate-700 hover:text-slate-500 cursor-pointer transition-colors"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
});

export default Footer;
