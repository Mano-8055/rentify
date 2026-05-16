import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#0a0a0a] mt-16">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <Link to="/" className="text-2xl font-black gradient-text">
              Rentify
            </Link>
            <p className="text-slate-500 text-sm mt-3 max-w-xs leading-relaxed">
              Peer-to-peer rental platform connecting people within 10km. Rent
              anything, earn from idle items.
            </p>
            <div className="flex gap-3 mt-4">
              {["Twitter", "Instagram", "GitHub"].map((s) => (
                <span
                  key={s}
                  className="text-xs text-slate-600 hover:text-green-400 cursor-pointer transition-colors"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Platform
            </p>
            <div className="flex flex-col gap-2">
              {[
                { to: "/nearby", label: "Browse Items" },
                { to: "/add-product", label: "List an Item" },
                { to: "/dashboard", label: "Dashboard" },
                { to: "/rent-history", label: "Rent History" },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-sm text-slate-500 hover:text-green-400 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Account
            </p>
            <div className="flex flex-col gap-2">
              {[
                { to: "/register", label: "Sign Up" },
                { to: "/login", label: "Sign In" },
                { to: "/profile", label: "Profile" },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-sm text-slate-500 hover:text-green-400 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-xs text-slate-600">
            © 2025 Rentify. All rights reserved.
          </p>
          <p className="text-xs text-slate-600">
            Built with React · Node.js · MongoDB
          </p>
        </div>
      </div>
    </footer>
  );
}
