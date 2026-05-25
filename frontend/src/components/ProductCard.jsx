import { memo } from "react";
import { Link } from "react-router-dom";
import { BACKEND_URL } from "../services/api";

const trustInfo = (pts) => {
  if (pts >= 90) return { label: "Excellent", color: "text-yellow-400", bar: "bg-yellow-400", icon: "🏆" };
  if (pts >= 70) return { label: "Good",      color: "text-green-400",  bar: "bg-green-400",  icon: "✅" };
  if (pts >= 50) return { label: "Fair",      color: "text-yellow-500", bar: "bg-yellow-500", icon: "⚠️" };
  if (pts >= 30) return { label: "Poor",      color: "text-orange-400", bar: "bg-orange-400", icon: "🔸" };
  return           { label: "Risky",     color: "text-red-400",    bar: "bg-red-400",    icon: "🚨" };
};

const CATEGORY_STYLES = {
  Electronics: "text-blue-400   bg-blue-500/10   border-blue-500/25",
  Vehicles:    "text-orange-400 bg-orange-500/10 border-orange-500/25",
  Tools:       "text-yellow-400 bg-yellow-500/10 border-yellow-500/25",
  Sports:      "text-emerald-400 bg-emerald-500/10 border-emerald-500/25",
  Furniture:   "text-purple-400 bg-purple-500/10 border-purple-500/25",
  Books:       "text-pink-400   bg-pink-500/10   border-pink-500/25",
  Clothing:    "text-rose-400   bg-rose-500/10   border-rose-500/25",
  Other:       "text-green-400  bg-green-500/10  border-green-500/25",
};

const ProductCard = memo(function ProductCard({ product }) {
  const pts      = product.owner?.likelihoodPoints ?? 100;
  const trust    = trustInfo(pts);
  const catStyle = CATEGORY_STYLES[product.category] || CATEGORY_STYLES.Other;

  const placeholder = `https://via.placeholder.com/400x250/111827/22c55e?text=${encodeURIComponent(product.name)}`;
  const imgSrc = product.images?.[0] ? `${BACKEND_URL}${product.images[0]}` : placeholder;

  return (
    <Link to={`/products/${product._id}`} className="block group h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500/50 rounded-2xl">
      <div className="glass card-hover rounded-2xl overflow-hidden cursor-pointer h-full flex flex-col">

        {/* ── Image ── */}
        <div className="relative h-44 overflow-hidden bg-white/3 shrink-0">
          <img
            src={imgSrc}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            onError={(e) => { e.target.src = placeholder; }}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

          {/* Category badge */}
          <span className={`absolute top-3 left-3 text-xs px-2.5 py-1 rounded-full border font-medium backdrop-blur-sm ${catStyle}`}>
            {product.category || "Other"}
          </span>

          {/* Distance badge */}
          {product.distance !== undefined && (
            <span className="absolute top-3 right-3 text-xs px-2 py-1 rounded-full bg-black/60 backdrop-blur-sm text-slate-300 flex items-center gap-1 border border-white/10">
              📍 {product.distance}km
            </span>
          )}

          {/* Not available overlay */}
          {!product.availability && (
            <div className="absolute inset-0 bg-black/72 flex items-center justify-center backdrop-blur-[2px]">
              <span className="text-white font-bold text-xs bg-red-500/90 px-4 py-1.5 rounded-full shadow-lg tracking-wide uppercase">
                Not Available
              </span>
            </div>
          )}
        </div>

        {/* ── Content ── */}
        <div className="p-4 flex flex-col flex-1">
          <h3 className="font-semibold text-white text-sm truncate mb-1 group-hover:text-green-400 transition-colors duration-200">
            {product.name}
          </h3>
          {product.description && (
            <p className="text-xs text-slate-500 line-clamp-1 mb-3 leading-relaxed">
              {product.description}
            </p>
          )}

          {/* Pricing */}
          <div className="flex gap-2 mb-4">
            <div className="flex-1 text-center py-2 rounded-xl bg-green-500/6 border border-green-500/18 hover:bg-green-500/10 transition-colors">
              <div className="text-green-400 font-bold text-sm">₹{product.priceHour}</div>
              <div className="text-[10px] text-slate-600 mt-0.5 uppercase tracking-wide">/ hr</div>
            </div>
            <div className="flex-1 text-center py-2 rounded-xl bg-green-500/6 border border-green-500/18 hover:bg-green-500/10 transition-colors">
              <div className="text-green-400 font-bold text-sm">₹{product.priceDay}</div>
              <div className="text-[10px] text-slate-600 mt-0.5 uppercase tracking-wide">/ day</div>
            </div>
          </div>

          {/* Owner + Trust */}
          <div className="mt-auto flex items-center justify-between">
            <div className="flex items-center gap-1.5 min-w-0">
              <div className="w-6 h-6 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center text-xs text-green-400 font-bold shrink-0">
                {product.owner?.name?.charAt(0).toUpperCase() || "?"}
              </div>
              <span className="text-xs text-slate-400 truncate max-w-[72px]">
                {product.owner?.name?.split(" ")[0] || "Unknown"}
              </span>
              {product.owner?.isVerified && (
                <span className="text-blue-400 text-xs shrink-0" title="Verified">✓</span>
              )}
            </div>

            {/* Trust score pill */}
            <div className={`flex items-center gap-1 text-xs font-medium ${trust.color} bg-white/4 px-2 py-0.5 rounded-full border border-white/8`}>
              <span>{trust.icon}</span>
              <span>{pts}</span>
            </div>
          </div>

          {/* Trust bar */}
          <div className="mt-3 h-0.5 rounded-full bg-white/5 overflow-hidden">
            <div
              className={`h-full rounded-full ${trust.bar} transition-all duration-700`}
              style={{ width: `${pts}%` }}
            />
          </div>
        </div>
      </div>
    </Link>
  );
});

export default ProductCard;
