import React from 'react';
import { useState, useContext, memo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { registerUser } from "../services/authService";
import Loader from "../components/Loader";
import { Input } from "../components/Input";

const BRAND_FEATURES = [
  { icon: "📦", title: "List Anything", desc: "Tools, cameras, bikes — earn from idle items" },
  { icon: "🔍", title: "Browse Nearby", desc: "Rent items within 10km of your location" },
  { icon: "🤝", title: "Trusted Community", desc: "Trust scores & ID verification for safety" },
];

/* Static brand panel — memoised */
const BrandPanel = memo(function BrandPanel() {
  return (
    <div className="hidden lg:flex lg:w-5/12 flex-col justify-between p-10 lg:p-16 border-r border-border-subtle relative overflow-hidden bg-gradient-to-br from-surface-900 to-background-primary">
      <div className="absolute top-0 right-0 w-80 h-80 bg-green-500/5 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-0 left-0 w-52 h-52 bg-green-500/3 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

      <Link to="/" className="inline-flex items-center gap-2 text-xl font-extrabold text-gradient-brand tracking-tight relative z-10 mb-10" aria-label="Rentify Home">
        <span className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center text-white font-black text-lg">
          R
        </span>
        Rentify
      </Link>

      <div className="relative z-10">
        <h2 className="heading-xl font-extrabold text-text-primary mb-3 leading-tight">
          Join thousands<br />already renting
        </h2>
        <p className="body text-text-secondary mb-10 leading-relaxed max-w-xs">
          Create your free account and start renting or listing items in your neighborhood today.
        </p>
        <div className="flex flex-col gap-6">
          {BRAND_FEATURES.map((f) => (
            <div key={f.title} className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-lg shrink-0">
                {f.icon}
              </div>
              <div>
                <div className="text-text-primary text-sm font-semibold">{f.title}</div>
                <div className="text-caption text-text-tertiary mt-0.5">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 flex items-center gap-3 p-4 rounded-2xl bg-green-500/5 border border-green-500/15 relative z-10">
        <div className="w-10 h-10 rounded-xl bg-green-500/15 flex items-center justify-center text-xl shrink-0">🏆</div>
        <div>
          <div className="text-text-primary text-sm font-semibold">Start with 100 trust points</div>
          <div className="text-caption text-text-tertiary mt-0.5">Build your reputation with every rental</div>
        </div>
      </div>

      <p className="text-micro text-text-tertiary relative z-10">&copy; {new Date().getFullYear()} Rentify. All rights reserved.</p>
    </div>
  );
});

BrandPanel.displayName = "BrandPanel";

export default function Register() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.email || !form.password) {
      setError("Please fill in everything — we need your name, email, and a password.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords don't match");
      return;
    }
    if (form.password.length < 6) {
      setError("Password needs at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      const data = await registerUser({ name: form.name, email: form.email, password: form.password });
      login(data);
      navigate("/nearby");
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't create your account. Try again?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-primary flex">
      <BrandPanel />

      {/* Form Panel */}
      <div className="flex-1 bg-grid flex items-center justify-center px-4 py-12 pt-20 lg:pt-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 text-xl font-extrabold text-gradient-brand tracking-tight" aria-label="Rentify Home">
              <span className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center text-white font-black text-lg">
                R
              </span>
              Rentify
            </Link>
          </div>

          <div className="card-padded">
            <div className="mb-8">
              <h1 className="heading-lg font-extrabold text-text-primary">Create account</h1>
              <p className="body-sm text-text-secondary mt-1">Join thousands renting and earning locally</p>
            </div>

            {error && (
              <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2 animate-slide-down" role="alert">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {error}
              </div>
            )

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input
                name="name"
                type="text"
                label="Full Name"
                placeholder="John Doe"
                value={form.name}
                onChange={handleChange}
                required
                autoComplete="name"
              />

              <Input
                name="email"
                type="email"
                label="Email Address"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="email"
              />

              <div className="form-group">
                <label htmlFor="password" className="label">Password</label>
                <div className="relative">
                  <input
                    name="password"
                    id="password"
                    type={showPass ? "text" : "password"}
                    placeholder="Min. 6 characters"
                    value={form.password}
                    onChange={handleChange}
                    className="input pr-12"
                    autoComplete="new-password"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary transition-colors text-sm"
                    tabIndex={-1}
                    aria-label={showPass ? "Hide password" : "Show password"}
                  >
                    {showPass ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <Input
                name="confirm"
                type="password"
                label="Confirm Password"
                placeholder="Re-enter password"
                value={form.confirm}
                onChange={handleChange}
                required
                autoComplete="new-password"
              />

              <button
                type="submit"
                disabled={loading}
                className="btn-primary-lg mt-2 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader size="sm" />
                    Creating account…
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            <p className="text-center body-sm text-text-secondary mt-6">
              Already have an account?{" "}
              <Link to="/login" className="text-green-400 hover:text-green-300 font-medium transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}