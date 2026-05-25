import { useEffect, useState, useContext, memo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById } from "../services/productService";
import { createRental } from "../services/rentalService";
import { AuthContext } from "../context/AuthContext";
import { BACKEND_URL } from "../services/api";
import Loader from "../components/Loader";

const trustInfo = (pts) => {
  if (pts >= 90) return { label: "Excellent", color: "text-yellow-400", icon: "🏆", bg: "bg-yellow-500/8  border-yellow-500/20" };
  if (pts >= 70) return { label: "Good",      color: "text-green-400",  icon: "✅", bg: "bg-green-500/8   border-green-500/20" };
  if (pts >= 50) return { label: "Fair",      color: "text-yellow-500", icon: "⚠️", bg: "bg-yellow-500/8  border-yellow-500/20" };
  if (pts >= 30) return { label: "Poor",      color: "text-orange-400", icon: "🔸", bg: "bg-orange-500/8  border-orange-500/20" };
  return           { label: "Risky",     color: "text-red-400",    icon: "🚨", bg: "bg-red-500/8     border-red-500/20" };
};

/* Memoised owner card */
const OwnerCard = memo(function OwnerCard({ owner, trust }) {
  return (
    <div className={`flex items-center gap-3 p-4 rounded-xl border ${trust.bg}`}>
      <div className="w-11 h-11 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center text-green-400 font-bold text-sm shrink-0">
        {owner?.name?.charAt(0).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-sm font-semibold text-white">{owner?.name}</span>
          {owner?.isVerified && (
            <span className="text-xs text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded-full border border-blue-500/20">
              ✓ Verified
            </span>
          )}
        </div>
        <div className={`text-xs flex items-center gap-1 mt-0.5 ${trust.color}`}>
          <span>{trust.icon}</span>
          <span>Trust: {owner?.likelihoodPoints}/100 — {trust.label}</span>
        </div>
      </div>
    </div>
  );
});

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [product, setProduct]     = useState(null);
  const [loading, setLoading]     = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [rentalType, setRentalType] = useState("day");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate]     = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess]     = useState("");
  const [error, setError]         = useState("");

  useEffect(() => {
    getProductById(id)
      .then(setProduct)
      .catch(() => navigate("/"))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const calcTotal = () => {
    if (!startDate || !endDate || !product) return 0;
    const ms = new Date(endDate) - new Date(startDate);
    if (ms <= 0) return 0;
    return rentalType === "hour"
      ? Math.ceil(ms / 3600000) * product.priceHour
      : Math.ceil(ms / 86400000) * product.priceDay;
  };

  const handleRent = async (e) => {
    e.preventDefault();
    if (!user) { navigate("/login"); return; }
    setError(""); setSuccess("");
    if (!startDate || !endDate) { setError("Select both start and end dates"); return; }
    if (new Date(endDate) <= new Date(startDate)) { setError("End must be after start"); return; }
    setSubmitting(true);
    try {
      await createRental({ productId: id, startDate, endDate, rentalType });
      setSuccess("Rental request sent! Waiting for owner approval.");
      setStartDate(""); setEndDate("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send rental request");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center pt-16">
        <Loader size="lg" text="Loading product…" />
      </div>
    );
  }

  if (!product) return null;

  const trust   = trustInfo(product.owner?.likelihoodPoints || 100);
  const isOwner = user?._id === product.owner?._id;
  const total   = calcTotal();

  const images = product.images?.length > 0
    ? product.images.map((img) => `${BACKEND_URL}${img}`)
    : [`https://via.placeholder.com/800x500/111827/22c55e?text=${encodeURIComponent(product.name)}`];

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-20 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* ── Images ── */}
          <div>
            <div className="glass rounded-2xl overflow-hidden mb-3" style={{ aspectRatio: "16/9" }}>
              <img
                src={images[activeImg]}
                alt={product.name}
                className="w-full h-full object-cover transition-opacity duration-300"
                onError={(e) => { e.target.src = `https://via.placeholder.com/800x500/111827/22c55e?text=${encodeURIComponent(product.name)}`; }}
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 flex-wrap">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                      activeImg === i ? "border-green-500 shadow-green-sm" : "border-white/10 hover:border-white/20"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Details ── */}
          <div className="flex flex-col gap-5">
            <div>
              <span className="text-xs text-green-400 font-medium bg-green-500/10 px-2.5 py-1 rounded-full border border-green-500/20">
                {product.category}
              </span>
              <h1 className="text-2xl md:text-3xl font-bold text-white mt-3 leading-tight">
                {product.name}
              </h1>
              {product.description && (
                <p className="text-slate-400 text-sm mt-2 leading-relaxed">{product.description}</p>
              )}
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-2 gap-3">
              <div className="glass rounded-xl p-4 text-center hover:border-green-500/20 transition-colors">
                <div className="text-xs text-slate-500 mb-1 uppercase tracking-wide">Per Hour</div>
                <div className="text-2xl font-bold text-green-400">₹{product.priceHour}</div>
              </div>
              <div className="glass rounded-xl p-4 text-center hover:border-green-500/20 transition-colors">
                <div className="text-xs text-slate-500 mb-1 uppercase tracking-wide">Per Day</div>
                <div className="text-2xl font-bold text-green-400">₹{product.priceDay}</div>
              </div>
            </div>

            {/* Owner */}
            <OwnerCard owner={product.owner} trust={trust} />

            {/* Not available */}
            {!product.availability && (
              <div className="p-3 rounded-xl bg-red-500/8 border border-red-500/20 text-red-400 text-sm text-center">
                This item is currently rented out
              </div>
            )}

            {/* Rental form */}
            {product.availability && !isOwner && (
              <form onSubmit={handleRent} className="glass-elevated rounded-2xl p-5 flex flex-col gap-4">
                <h3 className="text-sm font-semibold text-white">Request Rental</h3>

                {success && (
                  <div className="px-3 py-2.5 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-xs flex items-center gap-2">
                    <span>✅</span> {success}
                  </div>
                )}
                {error && (
                  <div className="px-3 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                    <span>⚠️</span> {error}
                  </div>
                )}

                {/* Type toggle */}
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { type: "hour", label: "⏰ Hourly" },
                    { type: "day",  label: "📅 Daily" },
                  ].map(({ type, label }) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setRentalType(type)}
                      className={`py-2.5 rounded-xl text-sm font-medium transition-all ${
                        rentalType === type ? "btn-primary" : "glass hover:border-green-500/20 text-slate-400"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-500 block mb-1">Start</label>
                    <input
                      type="datetime-local"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      min={new Date().toISOString().slice(0, 16)}
                      className="input-dark text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 block mb-1">End</label>
                    <input
                      type="datetime-local"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      min={startDate || new Date().toISOString().slice(0, 16)}
                      className="input-dark text-xs"
                    />
                  </div>
                </div>

                {/* Total */}
                {total > 0 && (
                  <div className="flex justify-between items-center px-3 py-2.5 rounded-xl glass-green">
                    <span className="text-xs text-slate-400">Estimated Total</span>
                    <span className="text-green-400 font-bold text-sm">₹{total}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary py-3.5 rounded-xl text-sm font-bold disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {submitting ? <><Loader size="sm" /> Sending…</> : "Send Rental Request"}
                </button>

                {!user && (
                  <p className="text-center text-xs text-slate-500">
                    Please{" "}
                    <span
                      onClick={() => navigate("/login")}
                      className="text-green-400 cursor-pointer hover:underline"
                    >
                      sign in
                    </span>{" "}
                    to rent
                  </p>
                )}
              </form>
            )}

            {isOwner && (
              <div className="p-4 rounded-xl glass-green text-center text-sm text-green-400 font-medium">
                ✓ This is your listing
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
