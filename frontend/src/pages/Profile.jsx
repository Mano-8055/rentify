import { useContext, useState, useEffect, memo } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import API, { BACKEND_URL } from "../services/api";
import { getMyProducts } from "../services/productService";
import { getMyRentals } from "../services/rentalService";
import Loader from "../components/Loader";

const trustInfo = (pts) => {
  if (pts >= 90) return { label: "Excellent", color: "text-yellow-400", bg: "from-yellow-500/20 to-yellow-500/5", icon: "🏆" };
  if (pts >= 70) return { label: "Good",      color: "text-green-400",  bg: "from-green-500/20  to-green-500/5",  icon: "✅" };
  if (pts >= 50) return { label: "Fair",      color: "text-yellow-500", bg: "from-yellow-500/20 to-yellow-500/5", icon: "⚠️" };
  if (pts >= 30) return { label: "Poor",      color: "text-orange-400", bg: "from-orange-500/20 to-orange-500/5", icon: "🔸" };
  return           { label: "Risky",     color: "text-red-400",    bg: "from-red-500/20    to-red-500/5",    icon: "🚨" };
};

const TRUST_GUIDE = [
  { range: "90–100", label: "Excellent", icon: "🏆", color: "text-yellow-400", min: 90 },
  { range: "70–89",  label: "Good",      icon: "✅", color: "text-green-400",  min: 70 },
  { range: "50–69",  label: "Fair",      icon: "⚠️", color: "text-yellow-500", min: 50 },
  { range: "30–49",  label: "Poor",      icon: "🔸", color: "text-orange-400", min: 30 },
  { range: "0–29",   label: "Risky",     icon: "🚨", color: "text-red-400",    min: 0  },
];

/* Memoised trust guide — static content */
const TrustGuide = memo(function TrustGuide({ pct }) {
  return (
    <div className="glass rounded-2xl p-4">
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
        Trust Score Guide
      </h3>
      {TRUST_GUIDE.map((t) => (
        <div
          key={t.range}
          className={`flex items-center justify-between py-1.5 transition-opacity ${pct >= t.min ? "opacity-100" : "opacity-35"}`}
        >
          <div className={`flex items-center gap-1.5 text-xs ${t.color}`}>
            <span>{t.icon}</span>
            <span>{t.label}</span>
          </div>
          <span className="text-xs text-slate-600">{t.range} pts</span>
        </div>
      ))}
    </div>
  );
});

export default function Profile() {
  const { user, updateUser } = useContext(AuthContext);
  const [products, setProducts]   = useState([]);
  const [rentals, setRentals]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [editName, setEditName]   = useState(false);
  const [nameInput, setNameInput] = useState(user?.name || "");
  const [saving, setSaving]       = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    Promise.all([getMyProducts(), getMyRentals()])
      .then(([p, r]) => { setProducts(p); setRentals(r); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const saveName = async () => {
    if (!nameInput.trim()) return;
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", nameInput);
      const res = await API.put("/users/profile", formData);
      updateUser(res.data);
      setEditName(false);
    } catch {}
    setSaving(false);
  };

  const handleProfileImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("profileImage", file);
    setUploading(true);
    try {
      const res = await API.put("/users/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      updateUser(res.data);
    } catch {}
    setUploading(false);
  };

  const handleGovtId = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("governmentId", file);
    setUploading(true);
    try {
      const res = await API.post("/users/govt-id", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      updateUser(res.data);
    } catch {}
    setUploading(false);
  };

  if (!user || loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center pt-16">
        <Loader size="lg" />
      </div>
    );
  }

  const trust            = trustInfo(user.likelihoodPoints);
  const pct              = user.likelihoodPoints;
  const completedRentals = rentals.filter((r) => r.status === "completed").length;
  const totalSpent       = rentals.filter((r) => r.status === "completed").reduce((s, r) => s + r.totalAmount, 0);

  const circumference = 2 * Math.PI * 30;
  const dashOffset    = circumference - (pct / 100) * circumference;

  const STATS = [
    { label: "Listings",    value: products.length,    icon: "📦" },
    { label: "Completed",   value: completedRentals,   icon: "✅" },
    { label: "Total Spent", value: `₹${totalSpent}`,   icon: "💰" },
    { label: "Trust Score", value: `${pct}%`,           icon: "🛡️" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-20 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">
          My <span className="gradient-text">Profile</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Left Column ── */}
          <div className="flex flex-col gap-5">

            {/* Profile Card */}
            <div className="glass-elevated rounded-3xl p-6 flex flex-col items-center gap-4">
              {/* Avatar */}
              <label className="relative cursor-pointer group">
                <div className="w-24 h-24 rounded-full bg-green-500/20 border-2 border-green-500/30 overflow-hidden flex items-center justify-center transition-all group-hover:border-green-500/60">
                  {user.profileImage ? (
                    <img
                      src={`${BACKEND_URL}${user.profileImage}`}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl font-black text-green-400">
                      {user.name?.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="absolute inset-0 rounded-full bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-xs font-medium">
                    {uploading ? "…" : "Edit"}
                  </span>
                </div>
                <input type="file" accept="image/*" className="hidden" onChange={handleProfileImage} />
              </label>

              {/* Name */}
              {editName ? (
                <div className="flex gap-2 w-full">
                  <input
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="input-dark text-sm flex-1"
                    autoFocus
                  />
                  <button
                    onClick={saveName}
                    disabled={saving}
                    className="btn-primary px-3 py-1.5 rounded-lg text-xs"
                  >
                    {saving ? "…" : "Save"}
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <div className="flex items-center gap-1 justify-center">
                    <h2 className="text-xl font-bold text-white">{user.name}</h2>
                    {user.isVerified && (
                      <span className="text-blue-400 text-sm" title="Verified">✓</span>
                    )}
                  </div>
                  <p className="text-slate-500 text-xs mt-0.5">{user.email}</p>
                  <button
                    onClick={() => setEditName(true)}
                    className="text-xs text-green-400 hover:text-green-300 mt-1.5 transition-colors"
                  >
                    Edit name
                  </button>
                </div>
              )}

              {/* Trust Ring */}
              <div className="flex flex-col items-center gap-1">
                <div className="relative">
                  <svg width="80" height="80" className="-rotate-90">
                    <circle cx="40" cy="40" r="30" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                    <circle
                      cx="40" cy="40" r="30" fill="none"
                      stroke="#22c55e" strokeWidth="6"
                      strokeDasharray={circumference}
                      strokeDashoffset={dashOffset}
                      strokeLinecap="round"
                      style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className={`text-xl font-black ${trust.color}`}>{pct}</div>
                    <div className="text-[10px] text-slate-600">/ 100</div>
                  </div>
                </div>
                <div className={`flex items-center gap-1 text-sm font-semibold ${trust.color}`}>
                  <span>{trust.icon}</span>
                  <span>{trust.label}</span>
                </div>
              </div>

              {/* Verification */}
              {!user.isVerified ? (
                <label className="w-full cursor-pointer">
                  <div className="w-full py-2.5 rounded-xl text-xs font-medium text-center border border-dashed border-blue-500/30 text-blue-400 hover:bg-blue-500/5 transition-all">
                    📎 Upload Government ID
                    <div className="text-slate-600 text-xs mt-0.5">to get verified</div>
                  </div>
                  <input type="file" accept="image/*,.pdf" className="hidden" onChange={handleGovtId} />
                </label>
              ) : (
                <div className="w-full py-2 rounded-xl text-xs text-center text-blue-400 bg-blue-500/10 border border-blue-500/20">
                  ✓ Government ID Verified
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              {STATS.map((s) => (
                <div key={s.label} className="glass rounded-2xl p-4 text-center hover:border-white/10 transition-colors">
                  <div className="text-xl mb-1">{s.icon}</div>
                  <div className="font-bold text-white text-sm">{s.value}</div>
                  <div className="text-xs text-slate-600 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>

            <TrustGuide pct={pct} />
          </div>

          {/* ── Right Column ── */}
          <div className="lg:col-span-2 flex flex-col gap-6">

            {/* My Products */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">📦 My Listings</h2>
                <Link to="/add-product" className="btn-primary px-4 py-2 rounded-xl text-xs">
                  + New
                </Link>
              </div>

              {products.length === 0 ? (
                <div className="glass rounded-2xl p-8 text-center">
                  <p className="text-slate-500 text-sm">No listings yet</p>
                  <Link to="/add-product" className="text-green-400 text-xs hover:underline mt-1 inline-block">
                    List your first item →
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {products.slice(0, 4).map((p) => (
                    <Link
                      key={p._id}
                      to={`/products/${p._id}`}
                      className="glass rounded-2xl p-4 hover:border-green-500/20 transition-all group"
                    >
                      <div className="h-28 rounded-xl overflow-hidden mb-3 bg-white/3">
                        <img
                          src={p.images?.[0] ? `${BACKEND_URL}${p.images[0]}` : `https://via.placeholder.com/300x200/111827/22c55e?text=${encodeURIComponent(p.name)}`}
                          alt={p.name}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => { e.target.src = `https://via.placeholder.com/300x200/111827/22c55e?text=${encodeURIComponent(p.name)}`; }}
                        />
                      </div>
                      <div className="font-medium text-sm text-white truncate group-hover:text-green-400 transition-colors">
                        {p.name}
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-green-400 font-medium">₹{p.priceDay}/day</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${p.availability ? "status-accepted" : "status-rejected"}`}>
                          {p.availability ? "Available" : "Rented"}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Rentals */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">🔄 Recent Rentals</h2>
                <Link to="/rent-history" className="text-xs text-green-400 hover:text-green-300 transition-colors">
                  View all →
                </Link>
              </div>

              {rentals.length === 0 ? (
                <div className="glass rounded-2xl p-8 text-center">
                  <p className="text-slate-500 text-sm">No rental history</p>
                  <Link to="/nearby" className="text-green-400 text-xs hover:underline mt-1 inline-block">
                    Browse nearby items →
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {rentals.slice(0, 5).map((r) => (
                    <div key={r._id} className="glass rounded-xl p-4 flex items-center gap-3 hover:border-white/10 transition-colors">
                      <div className="w-10 h-10 rounded-lg bg-white/3 overflow-hidden shrink-0">
                        <img
                          src={r.product?.images?.[0] ? `${BACKEND_URL}${r.product.images[0]}` : `https://via.placeholder.com/80/111827/22c55e?text=${encodeURIComponent(r.product?.name || "Item")}`}
                          alt={r.product?.name}
                          loading="lazy"
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.src = `https://via.placeholder.com/80/111827/22c55e?text=Item`; }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-white truncate">{r.product?.name}</div>
                        <div className="text-xs text-slate-500">
                          {new Date(r.createdAt).toLocaleDateString()} · ₹{r.totalAmount}
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-medium status-${r.status} shrink-0`}>
                        {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
