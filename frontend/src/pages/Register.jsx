import { useState, useContext, memo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { registerUser } from "../services/authService";
import Loader from "../components/Loader";

const BRAND_FEATURES = [
  { icon: "📦", title: "List Anything",       desc: "Tools, cameras, bikes — earn from idle items" },
  { icon: "🔍", title: "Browse Nearby",       desc: "Rent items within 10km of your location" },
  { icon: "🤝", title: "Trusted Community",   desc: "Trust scores & ID verification for safety" },
];

/* Static brand panel — memoised */
const BrandPanel = memo(function BrandPanel() {
  return (
    <div className="hidden lg:flex lg:w-5/12 flex-col justify-between p-12 border-r border-white/5 relative overflow-hidden bg-gradient-to-br from-[#0c160e] to-[#0a0a0a]">
      <div className="absolute top-0 right-0 w-80 h-80 bg-green-500/6 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-52 h-52 bg-green-500/4 rounded-full blur-3xl pointer-events-none" />

      <Link to="/" className="text-2xl font-black gradient-text relative z-10">Rentify</Link>

      <div className="relative z-10">
        <h2 className="text-3xl font-bold text-white mb-3 leading-tight">
          Join thousands<br />already renting
        </h2>
        <p className="text-slate-500 text-sm mb-10 leading-relaxed max-w-xs">
          Create your free account and start renting or listing items in your neighborhood today.
        </p>
        <div className="flex flex-col gap-6">
          {BRAND_FEATURES.map((f) => (
            <div key={f.title} className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-lg shrink-0">
                {f.icon}
              </div>
              <div>
                <div className="text-white text-sm font-semibold">{f.title}</div>
                <div className="text-slate-600 text-xs mt-0.5">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex items-center gap-3 p-4 rounded-2xl bg-green-500/5 border border-green-500/15">
          <div className="text-2xl">🏆</div>
          <div>
            <div className="text-white text-sm font-semibold">Start with 100 trust points</div>
            <div className="text-slate-600 text-xs mt-0.5">Build your reputation with every rental</div>
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-700 relative z-10">© {new Date().getFullYear()} Rentify. All rights reserved.</p>
    </div>
  );
});

export default function Register() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm]       = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.email || !form.password) {
      setError("All fields are required");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords do not match");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      const data = await registerUser({ name: form.name, email: form.email, password: form.password });
      login(data);
      navigate("/nearby");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      <BrandPanel />

      {/* Form Panel */}
      <div className="flex-1 grid-bg flex items-center justify-center px-4 py-12 pt-20 lg:pt-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="text-2xl font-black gradient-text">Rentify</Link>
          </div>

          <div className="glass-elevated rounded-3xl p-8">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-white">Create account</h1>
              <p className="text-slate-500 text-sm mt-1">Join thousands renting and earning locally</p>
            </div>

            {error && (
              <div className="mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
                <span>⚠️</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-xs text-slate-400 font-medium mb-1.5 block">Full Name</label>
                <input
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={handleChange}
                  className="input-dark"
                  autoComplete="name"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 font-medium mb-1.5 block">Email Address</label>
                <input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  className="input-dark"
                  autoComplete="email"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 font-medium mb-1.5 block">Password</label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPass ? "text" : "password"}
                    placeholder="Min. 6 characters"
                    value={form.password}
                    onChange={handleChange}
                    className="input-dark pr-10"
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors text-sm select-none"
                    tabIndex={-1}
                    aria-label={showPass ? "Hide password" : "Show password"}
                  >
                    {showPass ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 font-medium mb-1.5 block">Confirm Password</label>
                <input
                  name="confirm"
                  type="password"
                  placeholder="Re-enter password"
                  value={form.confirm}
                  onChange={handleChange}
                  className="input-dark"
                  autoComplete="new-password"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary py-3.5 rounded-xl text-sm mt-2 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? <><Loader size="sm" /> Creating account…</> : "Create Account"}
              </button>
            </form>

            <p className="text-center text-sm text-slate-500 mt-6">
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
