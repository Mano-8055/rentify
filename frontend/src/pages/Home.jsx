import { Link } from "react-router-dom";
import { useContext, useEffect, useRef, useState, memo } from "react";
import { AuthContext } from "../context/AuthContext";

/* ── Static data (defined outside component to avoid re-creation) ── */
const FEATURES = [
  { icon: "📍", title: "10km Radius Search",    desc: "Find items within 10km of your exact location using geolocation." },
  { icon: "🛡️", title: "Trust Score System",    desc: "Every user has a trust score updated after each rental interaction." },
  { icon: "⏰", title: "Hourly & Daily Plans",  desc: "Flexible pricing — pay by the hour or by the day, your choice." },
  { icon: "🔒", title: "Verified Users",         desc: "Government ID verification creates a safer rental community." },
  { icon: "📦", title: "List Anything",          desc: "Tools, cameras, bikes, furniture — list any idle item and earn." },
  { icon: "🔄", title: "Full Rental Lifecycle",  desc: "Request → Accept → Return → Complete. Track every step." },
];

const STATS = [
  { target: 10, suffix: "K+", label: "Active Users" },
  { target: 50, suffix: "K+", label: "Items Listed" },
  { target: 98, suffix: "%",  label: "Trust Rate" },
];

const CATEGORIES = [
  { name: "Electronics", icon: "💻" },
  { name: "Vehicles",    icon: "🚗" },
  { name: "Tools",       icon: "🔧" },
  { name: "Sports",      icon: "⚽" },
  { name: "Furniture",   icon: "🛋️" },
  { name: "Books",       icon: "📚" },
];

const HOW_IT_WORKS = [
  { step: "01", icon: "👤", title: "Create Account",  desc: "Sign up and optionally verify with a government ID for higher trust." },
  { step: "02", icon: "🔍", title: "Find or List",    desc: "Browse items near you or list your own idle items with hourly/daily pricing." },
  { step: "03", icon: "🤝", title: "Rent & Earn",     desc: "Complete the rental, update your trust score, and build a reputation." },
];

const TRUST_TIERS = [
  { label: "90–100", title: "Excellent", icon: "🏆", color: "text-yellow-400", bg: "bg-yellow-500/8 border-yellow-500/20" },
  { label: "70–89",  title: "Good",      icon: "✅", color: "text-green-400",  bg: "bg-green-500/8  border-green-500/20" },
  { label: "50–69",  title: "Fair",      icon: "⚠️", color: "text-yellow-500", bg: "bg-yellow-500/8 border-yellow-500/20" },
  { label: "0–49",   title: "Risky",     icon: "🚨", color: "text-red-400",    bg: "bg-red-500/8    border-red-500/20" },
];

/* ── CountUp ── */
function CountUp({ target, suffix = "", duration = 1800 }) {
  const [count, setCount] = useState(0);
  const ref     = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = performance.now();
          const tick = (now) => {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased    = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

/* ── Feature card (memoised — pure, only depends on static props) ── */
const FeatureCard = memo(function FeatureCard({ icon, title, desc, delay }) {
  return (
    <div
      className="glass rounded-2xl p-6 cursor-default hover:border-green-500/20 hover:bg-green-500/3 transition-all duration-300 group"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="w-12 h-12 rounded-2xl bg-green-500/8 border border-green-500/15 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-base font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
    </div>
  );
});

/* ── Category pill (memoised) ── */
const CategoryPill = memo(function CategoryPill({ name, icon }) {
  return (
    <Link
      to="/nearby"
      className="glass rounded-2xl p-4 flex flex-col items-center gap-2 hover:border-green-500/30 hover:bg-green-500/5 transition-all duration-200 group"
    >
      <span className="text-2xl group-hover:scale-110 transition-transform duration-200">{icon}</span>
      <span className="text-xs text-slate-400 group-hover:text-green-400 transition-colors duration-200">{name}</span>
    </Link>
  );
});

/* ── Main page ── */
export default function Home() {
  const { user } = useContext(AuthContext);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] overflow-x-hidden">

      {/* ══ Hero ══ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden grid-bg pt-16">
        {/* Ambient orbs */}
        <div
          className="absolute top-1/4 left-1/2 w-[800px] h-[800px] bg-green-500/4 rounded-full blur-3xl pointer-events-none"
          style={{ transform: `translate(-50%, ${scrollY * 0.18}px)` }}
        />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-500/3 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-0 w-64 h-64 bg-emerald-500/3 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-green-500/20 bg-green-500/5 text-green-400 text-xs font-medium mb-8 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse-green" />
            Peer-to-peer rental platform
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse-green delay-300" />
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black mb-6 leading-[1.05] tracking-tight text-balance">
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
            <Link to="/nearby" className="btn-primary px-8 py-4 rounded-xl text-base font-bold">
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
          <div className="flex justify-center gap-10 sm:gap-16">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl sm:text-4xl font-black gradient-text">
                  <CountUp target={s.target} suffix={s.suffix} />
                </div>
                <div className="text-xs text-slate-600 mt-1 uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-slate-600 text-xs animate-bounce-soft">
          <span className="tracking-widest uppercase text-[10px]">scroll</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* ══ Categories ══ */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-xl font-semibold text-slate-300 mb-1">Browse by Category</h2>
            <p className="text-sm text-slate-600">Find exactly what you need</p>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {CATEGORIES.map((c) => (
              <CategoryPill key={c.name} name={c.name} icon={c.icon} />
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider max-w-4xl mx-auto" />

      {/* ══ Features ══ */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold text-green-400 uppercase tracking-widest mb-3 block">Why Rentify</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Built for <span className="gradient-text">Trust</span>
            </h2>
            <p className="text-slate-500 max-w-lg mx-auto">
              Everything you need for a safe, seamless rental experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <FeatureCard key={f.title} {...f} delay={i * 0.07} />
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider max-w-4xl mx-auto" />

      {/* ══ How it works ══ */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold text-green-400 uppercase tracking-widest mb-3 block">Simple Process</span>
            <h2 className="text-4xl font-bold text-white">
              How It <span className="gradient-text">Works</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-7 left-[calc(33%+1.5rem)] right-[calc(33%+1.5rem)] h-px bg-gradient-to-r from-green-500/20 via-green-500/40 to-green-500/20" />

            {HOW_IT_WORKS.map((item) => (
              <div key={item.step} className="text-center group">
                <div className="w-14 h-14 rounded-2xl glass-green flex items-center justify-center text-2xl mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-green-sm">
                  {item.icon}
                </div>
                <div className="text-4xl font-black gradient-text mb-2">{item.step}</div>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider max-w-4xl mx-auto" />

      {/* ══ Trust Section ══ */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="glass-green rounded-3xl p-10 text-center relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute inset-0 bg-radial-green opacity-40 pointer-events-none" />

            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-green-500/15 border border-green-500/25 flex items-center justify-center text-3xl mx-auto mb-5">
                🛡️
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">
                Our Trust Score System
              </h2>
              <p className="text-slate-400 mb-8 leading-relaxed max-w-lg mx-auto">
                Every user starts with 100 points. Points increase for on-time returns
                and decrease for late returns or damage. High-trust users get more rental approvals.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {TRUST_TIERS.map((t) => (
                  <div key={t.label} className={`glass rounded-xl p-4 border ${t.bg}`}>
                    <div className="text-2xl mb-2">{t.icon}</div>
                    <div className={`font-bold text-sm ${t.color}`}>{t.title}</div>
                    <div className="text-xs text-slate-600 mt-0.5">{t.label} pts</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ CTA ══ */}
      {!user && (
        <section className="py-20 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="glass-elevated rounded-3xl p-12 relative overflow-hidden">
              <div className="absolute inset-0 bg-radial-green opacity-30 pointer-events-none" />
              <div className="relative z-10">
                <h2 className="text-4xl font-bold text-white mb-4">
                  Ready to Start?
                </h2>
                <p className="text-slate-400 mb-8 leading-relaxed">
                  Join thousands of users already saving and earning on Rentify.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/register" className="btn-primary px-10 py-4 rounded-xl text-base font-bold">
                    Create Free Account
                  </Link>
                  <Link to="/login" className="btn-ghost px-10 py-4 rounded-xl text-base">
                    Sign In
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
