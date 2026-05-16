import { Link } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const features = [
  { icon: "📍", title: "10km Radius Search", desc: "Find items within 10km of your exact location using geolocation." },
  { icon: "🛡️", title: "Trust Score System", desc: "Every user has a trust score updated after each rental interaction." },
  { icon: "⏰", title: "Hourly & Daily Plans", desc: "Flexible pricing — pay by the hour or by the day, your choice." },
  { icon: "🔒", title: "Verified Users", desc: "Government ID verification creates a safer rental community." },
  { icon: "📦", title: "List Anything", desc: "Tools, cameras, bikes, furniture — list any idle item and earn." },
  { icon: "🔄", title: "Full Rental Lifecycle", desc: "Request → Accept → Return → Complete. Track every step." },
];

const stats = [
  { number: "10K+", label: "Active Users" },
  { number: "50K+", label: "Items Listed" },
  { number: "98%", label: "Trust Rate" },
];

const categories = [
  { name: "Electronics", icon: "💻" },
  { name: "Vehicles", icon: "🚗" },
  { name: "Tools", icon: "🔧" },
  { name: "Sports", icon: "⚽" },
  { name: "Furniture", icon: "🛋️" },
  { name: "Books", icon: "📚" },
];

export default function Home() {
  const { user } = useContext(AuthContext);
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleCardTilt = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 15;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -15;
    card.style.transform = `perspective(800px) rotateX(${y}deg) rotateY(${x}deg) translateY(-6px)`;
  };

  const resetCardTilt = (e) => {
    e.currentTarget.style.transform =
      "perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0)";
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] overflow-x-hidden">
      {/* ── Hero ── */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden grid-bg pt-16"
      >
        {/* Glow orbs */}
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-green-500/5 rounded-full blur-3xl pointer-events-none"
          style={{ transform: `translate(-50%, ${scrollY * 0.2}px)` }}
        />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-green-500/3 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-green-500/20 bg-green-500/5 text-green-400 text-xs font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse-green" />
            Peer-to-peer rental platform
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black mb-6 leading-tight tracking-tight">
            <span className="text-white">Rent </span>
            <span className="gradient-text">Anything</span>
            <span className="text-white">,</span>
            <br />
            <span className="text-white">Anywhere</span>
          </h1>

          <p className="text-base md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Connect with trusted neighbors to rent items within 10km.
            Save money, earn from idle items, and build community trust.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            <Link
              to="/nearby"
              className="btn-primary px-8 py-4 rounded-xl text-base font-bold"
            >
              🔍 Browse Nearby Items
            </Link>
            <Link
              to={user ? "/add-product" : "/register"}
              className="btn-ghost px-8 py-4 rounded-xl text-base"
            >
              📦 List Your Items
            </Link>
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-12">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-black gradient-text">{s.number}</div>
                <div className="text-xs text-slate-600 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-slate-600 text-xs animate-bounce">
          <span>scroll</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-center text-xl font-semibold text-slate-400 mb-8">
            Browse by Category
          </h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {categories.map((c) => (
              <Link
                key={c.name}
                to="/nearby"
                className="glass rounded-2xl p-4 flex flex-col items-center gap-2 hover:border-green-500/30 hover:bg-green-500/5 transition-all group"
              >
                <span className="text-2xl group-hover:scale-110 transition-transform">
                  {c.icon}
                </span>
                <span className="text-xs text-slate-400 group-hover:text-green-400 transition-colors">
                  {c.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Why Choose <span className="gradient-text">Rentify</span>?
            </h2>
            <p className="text-slate-500 max-w-lg mx-auto">
              Everything you need for a safe, seamless rental experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <div
                key={f.title}
                onMouseMove={handleCardTilt}
                onMouseLeave={resetCardTilt}
                style={{ transition: "transform 0.1s ease", animationDelay: `${i * 0.08}s` }}
                className="glass rounded-2xl p-6 cursor-default"
              >
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="text-base font-bold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-center text-4xl font-bold text-white mb-14">
            How It <span className="gradient-text">Works</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-6 left-1/3 right-1/3 h-px bg-gradient-to-r from-transparent via-green-500/30 to-transparent" />
            {[
              { step: "01", icon: "👤", title: "Create Account", desc: "Sign up and optionally verify with a government ID for higher trust." },
              { step: "02", icon: "🔍", title: "Find or List", desc: "Browse items near you or list your own idle items with hourly/daily pricing." },
              { step: "03", icon: "🤝", title: "Rent & Earn", desc: "Complete the rental, update your trust score, and build a reputation." },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 rounded-2xl glass-green flex items-center justify-center text-xl mx-auto mb-4">
                  {item.icon}
                </div>
                <div className="text-4xl font-black gradient-text mb-2">
                  {item.step}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust Section ── */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto glass-green rounded-3xl p-10 text-center">
          <div className="text-5xl mb-4">🛡️</div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Our Trust Score System
          </h2>
          <p className="text-slate-400 mb-8 leading-relaxed">
            Every user starts with 100 points. Points increase for on-time returns
            and decrease for late returns or damage. High-trust users get more
            rental approvals.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "90–100", title: "Excellent", icon: "🏆", color: "text-yellow-400" },
              { label: "70–89", title: "Good", icon: "✅", color: "text-green-400" },
              { label: "50–69", title: "Fair", icon: "⚠️", color: "text-yellow-500" },
              { label: "0–49", title: "Risky", icon: "🚨", color: "text-red-400" },
            ].map((t) => (
              <div key={t.label} className="glass rounded-xl p-3">
                <div className="text-2xl mb-1">{t.icon}</div>
                <div className={`font-bold text-sm ${t.color}`}>{t.title}</div>
                <div className="text-xs text-slate-600">{t.label} pts</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      {!user && (
        <section className="py-20 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Start?
            </h2>
            <p className="text-slate-500 mb-8">
              Join thousands of users already saving and earning on Rentify.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="btn-primary px-10 py-4 rounded-xl text-base font-bold"
              >
                Create Free Account
              </Link>
              <Link to="/login" className="btn-ghost px-10 py-4 rounded-xl text-base">
                Sign In
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
