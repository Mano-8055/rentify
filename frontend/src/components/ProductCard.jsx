import { Link } from "react-router-dom";
import { BACKEND_URL } from "../services/api";

const trustInfo = (pts) => {
  if (pts >= 90) return { label: "Excellent", color: "text-yellow-400", icon: "🏆" };
  if (pts >= 70) return { label: "Good", color: "text-green-400", icon: "✅" };
  if (pts >= 50) return { label: "Fair", color: "text-yellow-500", icon: "⚠️" };
  if (pts >= 30) return { label: "Poor", color: "text-orange-400", icon: "🔸" };
  return { label: "Risky", color: "text-red-400", icon: "🚨" };
};

export default function ProductCard({ product }) {
  const trust = trustInfo(product.owner?.likelihoodPoints || 100);

  const imgSrc =
    product.images?.[0]
      ? `${BACKEND_URL}${product.images[0]}`
      : `https://via.placeholder.com/400x250/111827/22c55e?text=${encodeURIComponent(product.name)}`;

  return (
    <Link to={`/products/${product._id}`} className="block group">
      <div className="glass card-hover rounded-2xl overflow-hidden cursor-pointer">
        {/* Image */}
        <div className="relative h-44 overflow-hidden bg-white/3">
          <img
            src={imgSrc}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.src = `https://via.placeholder.com/400x250/111827/22c55e?text=${encodeURIComponent(product.name)}`;
            }}
          />
          {/* Category badge */}
          <span className="absolute top-3 left-3 text-xs px-2 py-1 rounded-full bg-black/60 backdrop-blur-sm text-green-400 border border-green-500/20">
            {product.category || "Other"}
          </span>
          {/* Availability */}
          {!product.availability && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-white font-bold text-sm bg-red-500/80 px-3 py-1 rounded-full">
                Not Available
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-white text-sm truncate mb-1 group-hover:text-green-400 transition-colors">
            {product.name}
          </h3>
          {product.description && (
            <p className="text-xs text-slate-500 line-clamp-1 mb-3">
              {product.description}
            </p>
          )}

          {/* Pricing */}
          <div className="flex gap-3 mb-3">
            <div className="flex-1 glass rounded-lg p-2 text-center">
              <div className="text-xs text-slate-500">Per Hour</div>
              <div className="text-green-400 font-bold text-sm">
                ₹{product.priceHour}
              </div>
            </div>
            <div className="flex-1 glass rounded-lg p-2 text-center">
              <div className="text-xs text-slate-500">Per Day</div>
              <div className="text-green-400 font-bold text-sm">
                ₹{product.priceDay}
              </div>
            </div>
          </div>

          {/* Owner + Distance */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center text-xs text-green-400 font-bold">
                {product.owner?.name?.charAt(0).toUpperCase() || "?"}
              </div>
              <span className="text-xs text-slate-400 truncate max-w-[80px]">
                {product.owner?.name?.split(" ")[0] || "Unknown"}
              </span>
              {product.owner?.isVerified && (
                <span title="Verified" className="text-blue-400 text-xs">✓</span>
              )}
            </div>

            <div className={`flex items-center gap-1 text-xs ${trust.color}`}>
              <span>{trust.icon}</span>
              <span>{product.owner?.likelihoodPoints || 100}</span>
            </div>
          </div>

          {product.distance !== undefined && (
            <div className="mt-2 text-xs text-slate-600 flex items-center gap-1">
              <span>📍</span>
              <span>{product.distance}km away</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
