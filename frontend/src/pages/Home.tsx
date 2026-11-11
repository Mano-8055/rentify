import React from 'react';
import { useContext, useEffect, useRef, useState, memo } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import useLocation from "../hooks/useLocation";
import Loader from "../components/Loader";
import { ProductCardSkeleton } from "../components/Skeleton";
import { ProductCardSkeleton } from "../components/Skeleton";

/* ── Static data ── */
const FEATURES = [
  { icon: "📍", title: "10km Radius Search", desc: "Find items within 10km of your exact location using geolocation." },
  { icon: "🛡️", title: "Trust Score System", desc: "Every user has a trust score updated after each rental interaction." },
  { icon: "⏰", title: "Hourly & Daily Plans", desc: "Pay by the hour or day — whatever works for you." },
  { icon: "🔒", title: "Verified Users", desc: "Government ID verification creates a safer rental community." },
  { icon: "📦", title: "List Anything", desc: "Tools, cameras, bikes, furniture — list any idle item and earn." },
  { icon: "🔄", title: "Full Rental Lifecycle", desc: "Request → Accept → Return → Complete. Track every step." },
];

const STATS = [
  { target: 10, suffix: "K+", label: "Active Users" },
  { target: 50, suffix: "K+", label: "Items Listed" },
  { target: 98, suffix: "%", label: "Trust Rate" },
];

const CATEGORIES = [
  { name: "Electronics", icon: "💻", href: "/nearby?category=Electronics" },
  { name: "Vehicles", icon: "🚗", href: "/nearby?category=Vehicles" },
  { name: "Tools", icon: "🔧", href: "/nearby?category=Tools" },
  { name: "Sports", icon: "⚽", href: "/nearby?category=Sports" },
  { name: "Furniture", icon: "🛋️", href: "/nearby?category=Furniture" },
  { name: "Books", icon: "📚", href: "/nearby?category=Books" },
];

const HOW_IT_WORKS = [
  { step: "01", icon: "👤", title: "Create Account", desc: "Sign up and optionally verify with a government ID for higher trust." },
  { step: "02", icon: "🔍", title: "Find or List", desc: "Browse items near you or list your own idle items with hourly/daily pricing." },
  { step: "03", icon: "🤝", title: "Rent & Earn", desc: "Complete the rental, update your trust score, and build a reputation." },
];

const TRUST_TIERS = [
  { label: "90–100", title: "Excellent", icon: "🏆", color: "text-amber-400", bg: "bg-amber-500/8 border-amber-500/20" },
  { label: "70–89", title: "Good", icon: "✅", color: "text-green-400", bg: "bg-green-500/8 border-green-500/20" },
  { label: "50–69", title: "Fair", icon: "⚠️", color: "text-amber-500", bg: "bg-amber-500/8 border-amber-500/20" },
  { label: "0–49", title: "Risky", icon: "🚨", color: "text-red-400", bg: "bg-red-500/8 border-red-500/20" },
];

/* ── CountUp ── */
function CountUp({ target, suffix = "", duration = 1800 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = performance.now();
          const tick = (now) => {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
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

  return <span ref={ref} className="tabular-nums">{count}{suffix}</span>;
}

/* ── Feature card ── */
const FeatureCard = memo(function FeatureCard({ icon, title, desc, delay }) {
  return (
    <div
      className="card-hover group p-6 cursor-default"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="w-12 h-12 rounded-2xl bg-green-500/8 border border-green-500/15 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="heading-sm text-text-primary mb-2">{title}</h3>
      <p className="body-sm text-text-secondary leading-relaxed">{desc}</p>
    </div>
  );
);

FeatureCard.displayName = "FeatureCard";

/* ── Category card ── */
const CategoryCard = memo(function CategoryCard({ name, icon, href }) {
  return (
    <Link
      to={href}
      className="card p-4 flex flex-col items-center gap-2 group"
    >
      <span className="text-3xl group-hover:scale-110 transition-transform duration-300">{icon}</span>
      <span className="text-caption font-medium text-text-tertiary group-hover:text-green-400 transition-colors duration-200">{name}</span>
    </Link>
  );
});

CategoryCard.displayName = "CategoryCard";

/* ── Trust tier card ── */
const TrustTierCard = memo(function TrustTierCard({ label, title, icon, color, bg }) {
  return (
    <div className={`card p-4 border ${bg}`}>
      <div className="text-2xl mb-2">{icon}</div>
      <div className={`font-semibold text-sm ${color}`}>{title}</div>
      <div className="text-caption text-text-tertiary mt-0.5">{label} pts</div>
    </div>
  );
});

TrustTierCard.displayName = "TrustTierCard";

/* ── Hero search bar ── */
const HeroSearch = memo(function HeroSearch({ location, onSearch }) {
  const [query, setQuery] = useState("");
  const [showLocation, setShowLocation] = useState(true);

  return (
    <div className="card-padded bg-background-tertiary/50 border border-border-default max-w-3xl mx-auto">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none" aria-hidden="true">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="What are you looking for?"
            className="input pl-12 py-4 text-lg"
            aria-label="Search items"
            onKeyDown={(e) => e.key === "Enter" && query.trim() && onSearch(query)}
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary transition-colors text-sm"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 sm:flex-1">
          <button
            type="button"
            onClick={() => setShowLocation(!showLocation)}
            className="btn-secondary px-4 py-3.5 flex items-center gap-2 whitespace-nowrap"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="hidden sm:inline">{location ? `${location.lat.toFixed(3)}, ${location.lng.toFixed(3)}` : "Detect location"}</span>
            <span className="sm:hidden" aria-hidden="true">{location ? "📍" : "📍"}</span>
          </button>
          <button
            onClick={() => query.trim() && onSearch(query)}
            className="btn-primary-lg flex-1 py-3.5"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span>Search</span>
          </button>
        </div>
      </div>
    </div>
  );
});

HeroSearch.displayName = "HeroSearch";

/* ── Section header ── */
const SectionHeader = memo(function SectionHeader({ label, title, subtitle, action }) {
  return (
    <div className="text-center mb-12">
      {label && (
        <span className="text-caption font-semibold text-green-400 uppercase tracking-widest mb-3 block">
          {label}
        </span>
      )}
      <h2 className="heading-xl font-extrabold text-text-primary mb-4">
        {typeof title === "string" ? title : title}
      </h2>
      {subtitle && (
        <p className="body text-text-secondary max-w-lg mx-auto">{subtitle}</p>
      )}
      {action && (
        <div className="mt-6">{action}</div>
      )}
    </div>
  );
});

SectionHeader.displayName = "SectionHeader";

export default function Home() {
  const { user } = useContext(AuthContext);
  const { location } = useLocation();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSearch = (query) => {
    // Navigate to nearby with search query
    window.location.href = `/nearby?search=${encodeURIComponent(query)}`;
  };

  return (
    <div className="min-h-screen bg-background-primary overflow-x-hidden">
      {/* ══ Hero ══ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-grid pt-16">
        {/* Ambient orbs */}
        <div
          className="absolute top-1/4 left-1/2 w-[800px] h-[800px] bg-green-500/4 rounded-full blur-3xl pointer-events-none"
          style={{ transform: `translate(-50%, ${scrollY * 0.18}px)` }}
          aria-hidden="true"
        />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-500/3 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
        <div className="absolute top-1/3 left-0 w-64 h-64 bg-emerald-500/3 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-green-500/20 bg-green-500/5 text-green-400 text-caption font-medium mb-8 backdrop-blur-sm animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse-subtle" aria-hidden="true" />
            Peer-to-peer rental platform
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse-subtle delay-300" aria-hidden="true" />
          </div>

          <h1 className="text-display-xl font-extrabold mb-6 leading-[1.05] tracking-tight text-balance animate-slide-up">
            <span className="text-text-primary">Access more. </span>
            <span className="text-gradient-brand">Own less.</span>
          </h1>

          <p className="body-lg text-text-secondary mb-10 max-w-2xl mx-auto leading-relaxed animate-slide-up delay-100">
            Rent the things you need from people around you. Discover useful products, save money, and make better use of what your community already owns.
          </p>

          {/* Hero Search */}
          <HeroSearch location={location} onSearch={handleSearch} className="animate-slide-up delay-200" />

          {/* Stats */}
          <div className="flex justify-center gap-10 sm:gap-16 mt-20 animate-fade-in delay-300">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-display-sm font-extrabold text-gradient-brand">
                  <CountUp target={s.target} suffix={s.suffix} />
                </div>
                <div className="text-micro text-text-tertiary mt-1 uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ Categories ══ */}
      <section className="section">
        <div className="container">
          <SectionHeader
            label="Browse"
            title="Shop by Category"
            subtitle="Find exactly what you need from our curated categories"
          />
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {CATEGORIES.map((c) => (
              <CategoryCard key={c.name} {...c} />
            ))}
          </div>
        </div>
      </section>

      <div className="divider container" />

      {/* ══ Features ══ */}
      <section className="section">
        <div className="container">
          <SectionHeader
            label="Why Rentify"
            title={<>Built for <span className="text-gradient-brand">Trust</span></>}
            subtitle="Everything you need for a safe, seamless rental experience"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <FeatureCard key={f.title} {...f} delay={i * 0.07} />
            ))}
          </div>
        </div>
      </section>

      <div className="divider container" />

      {/* ══ How it works ══ */}
      <section className="section">
        <div className="container">
          <SectionHeader
            label="Simple Process"
            title={<>How It <span className="text-gradient-brand">Works</span></>}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-7 left-[calc(33%+2rem)] right-[calc(33%+2rem)] h-px bg-gradient-to-r from-green-500/20 via-green-500/40 to-green-500/20" aria-hidden="true" />
            {HOW_IT_WORKS.map((item) => (
              <div key={item.step} className="text-center group">
                <div className="w-14 h-14 rounded-2xl glass-brand flex items-center justify-center text-2xl mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-[0_4px_20px_rgba(34,197,94,0.15)]">
                  {item.icon}
                </div>
                <div className="text-display-sm font-extrabold text-gradient-brand mb-2">{item.step}</div>
                <h3 className="heading-sm text-text-primary mb-2">{item.title}</h3>
                <p className="body-sm text-text-secondary leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider container" />

      {/* ══ Trust Section ══ */}
      <section className="section">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <div className="card-padded bg-gradient-to-br from-green-500/3 via-green-500/1 to-transparent border border-green-500/15 relative overflow-hidden">
              {/* Background glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-500/10 to-transparent opacity-40 pointer-events-none" aria-hidden="true" />
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-green-500/15 border border-green-500/25 flex items-center justify-center text-3xl mx-auto mb-5">
                  🛡️
                </div>
                <h2 className="heading-lg font-extrabold text-text-primary mb-4 text-center">
                  Our Trust Score System
                </h2>
                <p className="body text-text-secondary mb-8 leading-relaxed max-w-lg mx-auto text-center">
                  Everyone starts at 100. Return on time and your score goes up. Late returns or damage bring it down. High-trust users get more rental approvals.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {TRUST_TIERS.map((t) => (
                    <TrustTierCard key={t.label} {...t} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ CTA for logged out users ══ */}
      {!user && (
        <section className="section">
          <div className="container">
            <div className="max-w-2xl mx-auto text-center">
              <div className="card-padded bg-gradient-to-br from-surface-800 via-surface-900 to-surface-800 border border-border-default relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-500/10 to-transparent opacity-30 pointer-events-none" aria-hidden="true" />
                <div className="relative z-10">
                  <h2 className="heading-lg font-extrabold text-text-primary mb-4">
                    Ready to Start?
                  </h2>
                  <p className="body text-text-secondary mb-8 leading-relaxed">
                    Join thousands already saving and earning on Rentify.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/register" className="btn-primary-lg">
                      Start for free
                    </Link>
                    <Link to="/login" className="btn-secondary-lg">
                      Sign In
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ══ CTA for logged in users ══ */}
      {user && (
        <section className="section">
          <div className="container">
            <div className="max-w-2xl mx-auto text-center">
              <div className="card-padded bg-gradient-to-br from-surface-800 via-surface-900 to-surface-800 border border-border-default">
                <h2 className="heading-lg font-extrabold text-text-primary mb-2">
                  List your first item
                </h2>
                <p className="body text-text-secondary mb-6 leading-relaxed">
                  Turn your idle items into income. Set your own prices and availability.
                </p>
                <Link to="/add-product" className="btn-primary-lg">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  List an Item
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}