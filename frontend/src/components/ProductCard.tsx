import React from 'react';
import { memo } from "react";
import { Link } from "react-router-dom";
import { BACKEND_URL } from "../services/api";

const CATEGORY_STYLES = {
  Electronics: "bg-blue-500/15 border-blue-500/30 text-blue-400",
  Vehicles: "bg-orange-500/15 border-orange-500/30 text-orange-400",
  Tools: "bg-amber-500/15 border-amber-500/30 text-amber-400",
  Sports: "bg-emerald-500/15 border-emerald-500/30 text-emerald-400",
  Furniture: "bg-purple-500/15 border-purple-500/30 text-purple-400",
  Books: "bg-pink-500/15 border-pink-500/30 text-pink-400",
  Clothing: "bg-rose-500/15 border-rose-500/30 text-rose-400",
  Other: "bg-green-500/15 border-green-500/30 text-green-400",
};

const CONDITION_STYLES = {
  "Like New": "bg-green-500/15 border-green-500/30 text-green-400",
  "Good": "bg-blue-500/15 border-blue-500/30 text-blue-400",
  "Fair": "bg-amber-500/15 border-amber-500/30 text-amber-400",
  "Worn": "bg-orange-500/15 border-orange-500/30 text-orange-400",
};

const trustInfo = (pts) => {
  if (pts >= 90) return { label: "Excellent", color: "text-amber-400", icon: "🏆", bg: "bg-amber-500" };
  if (pts >= 70) return { label: "Good", color: "text-green-400", icon: "✅", bg: "bg-green-500" };
  if (pts >= 50) return { label: "Fair", color: "text-amber-500", icon: "⚠️", bg: "bg-amber-500" };
  if (pts >= 30) return { label: "Poor", color: "text-orange-400", icon: "🔸", bg: "bg-orange-500" };
  return { label: "Risky", color: "text-red-400", icon: "🚨", bg: "bg-red-500" };
};

const placeholder = (name) =>
  `https://via.placeholder.com/400x250/1a1a1a/22c55e?text=${encodeURIComponent(name)}`;

const ProductCard = memo(function ProductCard({ product }) {
  const pts = product.owner?.likelihoodPoints ?? 100;
  const trust = trustInfo(pts);
  const catStyle = CATEGORY_STYLES[product.category] || CATEGORY_STYLES.Other;
  const conditionStyle = CONDITION_STYLES[product.condition] || CONDITION_STYLES.Good;
  const imgSrc = product.images?.[0] ? `${BACKEND_URL}${product.images[0]}` : placeholder(product.name);
  const isAvailable = product.availability !== false;

  return (
    <Link
      to={`/products/${product._id}`}
      className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background-primary rounded-2xl"
      aria-label={`View ${product.name} - ${product.category} - ₹${product.priceDay}/day`}
    >
      <article className="card-interactive group h-full flex flex-col">
        {/* ── Image Section ── */}
        <div className="relative aspect-video overflow-hidden bg-surface-800 shrink-0">
          <img
            src={imgSrc}
            alt=""
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
            onError={(e) => { e.target.src = placeholder(product.name); }}
          />
          {/* Gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" aria-hidden="true" />

          {/* Category badge */}
          <span className={`absolute top-3 left-3 badge ${catStyle} backdrop-blur-sm`}>
            {product.category || "Other"}
          </span>

          {/* Condition badge */}
          {product.condition && (
            <span className={`absolute top-3 right-3 badge ${conditionStyle} backdrop-blur-sm`}>
              {product.condition}
            </span>
          )}

          {/* Distance badge */}
          {product.distance !== undefined && (
            <span className="absolute bottom-3 left-3 badge bg-black/60 border-white/10 text-text-secondary backdrop-blur-sm flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {product.distance < 1 ? `${Math.round(product.distance * 1000)}m` : `${product.distance}km`}
            </span>
          )}

          {/* Availability overlay */}
          {!isAvailable && (
            <div className="absolute inset-0 bg-black/75 flex items-center justify-center backdrop-blur-sm">
              <span className="badge bg-red-500/20 border-red-500/30 text-red-400 text-sm px-4 py-2">
                Currently Unavailable
              </span>
            </div>
          )}

          {/* Favorite button */}
          <button
            className="absolute bottom-3 right-3 p-2 rounded-full bg-black/50 backdrop-blur-sm text-text-secondary hover:text-red-400 hover:bg-black/70 transition-colors"
            aria-label="Add to favorites"
            onClick={(e) => e.preventDefault()}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>

        {/* ── Content Section ── */}
        <div className="p-4 flex flex-col flex-1 min-h-0">
          {/* Title & Description */}
          <div className="mb-3 min-h-[56px]">
            <h3 className="font-semibold text-text-primary text-sm line-clamp-1 mb-1 group-hover:text-green-400 transition-colors duration-200">
              {product.name}
            </h3>
            {product.description && (
              <p className="text-caption text-text-tertiary line-clamp-2 leading-relaxed">
                {product.description}
              </p>
            )}
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="glass rounded-xl py-2.5 text-center hover:bg-green-500/5 hover:border-green-500/15 border border-border-subtle transition-colors">
              <div className="text-green-400 font-bold text-sm">₹{product.priceHour}</div>
              <div className="text-micro text-text-tertiary mt-0.5 uppercase tracking-wider">/ hour</div>
            </div>
            <div className="glass rounded-xl py-2.5 text-center hover:bg-green-500/5 hover:border-green-500/15 border border-border-subtle transition-colors">
              <div className="text-green-400 font-bold text-sm">₹{product.priceDay}</div>
              <div className="text-micro text-text-tertiary mt-0.5 uppercase tracking-wider">/ day</div>
            </div>
          </div>

          {/* Owner + Trust */}
          <div className="mt-auto flex items-center justify-between pt-3 border-t border-border-subtle">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-full bg-green-500/15 border border-green-500/25 flex items-center text-xs text-green-400 font-bold shrink-0">
                {product.owner?.name?.charAt(0).toUpperCase() || "?"}
              </div>
              <div className="min-w-0">
                <span className="text-sm text-text-secondary truncate block max-w-[80px]">
                  {product.owner?.name?.split(" ")[0] || "Unknown"}
                </span>
                <div className="flex items-center gap-1 text-micro text-text-tertiary">
                  {product.owner?.isVerified && (
                    <span className="text-blue-400 flex items-center" title="Verified user">
                      <svg className="w-3 h-3 mr-0.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2 .9 2 2v1h3.5c.9 0 1.65.58 1.9 1.39.26.82.26 1.79 0 2.6L14 19.05l4.9 1.35c.26.07.52.07.78 0l1.47-1.47c.26-.26.26-.68 0-.94L17.9 15.39z" />
                      </svg>
                    </span>
                  )}
                  <span className="text-text-tertiary">•</span>
                  <span className={`${trust.color} font-medium`}>{pts}</span>
                </div>
              </div>
            </div>

            {/* Trust score indicator */}
            <div className="flex items-center gap-1.5 shrink-0">
              <div className="w-16 h-1.5 rounded-full bg-white/5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${trust.bg}`}
                  style={{ width: `${pts}%` }}
                />
              </div>
              <span className={`text-micro font-medium ${trust.color}`}>
                {trust.icon}
              </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
});

ProductCard.displayName = "ProductCard";

export default ProductCard;