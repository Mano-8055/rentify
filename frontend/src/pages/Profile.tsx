import React from 'react';
import { useContext, useState, useEffect, memo } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import API, { BACKEND_URL } from "../services/api";
import { getMyProducts } from "../services/productService";
import { getMyRentals } from "../services/rentalService";
import Loader from "../components/Loader";
import { ProfileSkeleton } from "../components/Skeleton";
import { Input } from "../components/Input";

const trustInfo = (pts) => {
  if (pts >= 90) return { label: "Excellent", color: "text-amber-400", bg: "from-amber-500/20 to-amber-500/5", icon: "🏆" };
  if (pts >= 70) return { label: "Good", color: "text-green-400", bg: "from-green-500/20 to-green-500/5", icon: "✅" };
  if (pts >= 50) return { label: "Fair", color: "text-amber-500", bg: "from-amber-500/20 to-amber-500/5", icon: "⚠️" };
  if (pts >= 30) return { label: "Poor", color: "text-orange-400", bg: "from-orange-500/20 to-orange-500/5", icon: "🔸" };
  return { label: "Risky", color: "text-red-400", bg: "from-red-500/20 to-red-500/5", icon: "🚨" };
};

const TRUST_GUIDE = [
  { range: "90–100", label: "Excellent", icon: "🏆", color: "text-amber-400", min: 90 },
  { range: "70–89", label: "Good", icon: "✅", color: "text-green-400", min: 70 },
  { range: "50–69", label: "Fair", icon: "⚠️", color: "text-amber-500", min: 50 },
  { range: "30–49", label: "Poor", icon: "🔸", color: "text-orange-400", min: 30 },
  { range: "0–29", label: "Risky", icon: "🚨", color: "text-red-400", min: 0 },
];

const TrustGuide = memo(function TrustGuide({ pct }) {
  return (
    <div className="card-padded">
      <h3 className="text-caption font-semibold text-text-tertiary uppercase tracking-widest mb-3">
        Trust Score Guide
      </h3>
      {TRUST_GUIDE.map((t) => (
        <div
          key={t.range}
          className={`flex items-center justify-between py-1.5 transition-opacity ${pct >= t.min ? "opacity-100" : "opacity-35"}`}
        >
          <div className={`flex items-center gap-1.5 text-caption ${t.color}`}>
            <span>{t.icon}</span>
            <span>{t.label}</span>
          </div>
          <span className="text-caption text-text-tertiary">{t.range} pts</span>
        </div>
      </div>
    </div>
  );
});

TrustGuide.displayName = "TrustGuide";

const StatCard = memo(function StatCard({ label, value, icon, color }) {
  return (
    <div className="card-padded text-center hover:border-green-500/20 transition-colors">
      <div className="text-xl mb-1">{icon}</div>
      <div className={`font-bold text-text-primary text-sm ${color}`}>{value}</div>
      <div className="text-caption text-text-tertiary mt-0.5">{label}</div>
    </div>
  );
});

StatCard.displayName = "StatCard";

const ProductLink = memo(function ProductLink({ product }) {
  return (
    <Link
      to={`/products/${product._id}`}
      className="card-interactive group p-4 flex flex-col"
    >
      <div className="h-28 rounded-xl overflow-hidden mb-3 bg-surface-800">
        <img
          src={product.images?.[0] ? `${BACKEND_URL}${product.images[0]}` : `https://via.placeholder.com/300x200/1a1a1a/22c55e?text=${encodeURIComponent(product.name)}`}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
          onError={(e) => { e.target.src = `https://via.placeholder.com/300x200/1a1a1a/22c55e?text=${encodeURIComponent(product.name)}`; }}
        />
      </div>
      <div className="font-medium text-text-primary text-sm truncate group-hover:text-green-400 transition-colors">
        {product.name}
      </div>
      <div className="flex items-center justify-between mt-1">
        <span className="text-caption text-green-400 font-medium">₹{product.priceDay}/day</span>
        <span className="text-caption px-2 py-0.5 rounded-full border ${product.availability ? "badge-success" : "badge-error"}">
          {product.availability ? "Available" : "Rented"}
        </span>
      </div>
    </Link>
  );
});

ProductLink.displayName = "ProductLink";

const RentalHistoryItem = memo(function RentalHistoryItem({ rental }) {
  const statusClasses = {
    pending: "badge-warning",
    accepted: "badge-success",
    active: "bg-blue-500/15 border-blue-500/30 text-blue-400 badge",
    returned: "bg-blue-500/15 border-blue-500/30 text-blue-400 badge",
    rejected: "badge-error",
    completed: "bg-purple-500/15 border-purple-500/30 text-purple-400 badge",
    cancelled: "badge-secondary",
  };

  return (
    <Link
      to={`/products/${rental.product?._id}`}
      className="card-interactive p-4 flex items-center gap-3"
    >
      <div className="w-12 h-12 rounded-lg bg-surface-800 overflow-hidden shrink-0">
        <img
          src={rental.product?.images?.[0] ? `${BACKEND_URL}${rental.product.images[0]}` : `https://via.placeholder.com/80/1a1a1a/22c55e?text=Item`}
          alt={rental.product?.name}
          loading="lazy"
          className="w-full h-full object-cover"
          onError={(e) => { e.target.src = `https://via.placeholder.com/80/1a1a1a/22c55e?text=Item`; }}
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-text-primary truncate">{rental.product?.name}</div>
        <div className="text-caption text-text-tertiary">
          {new Date(rental.createdAt).toLocaleDateString()} · ₹{rental.totalAmount.toLocaleString()}
        </div>
      </div>
      <span className={`text-caption px-2 py-0.5 rounded-full border font-medium badge ${statusClasses[rental.status] || "badge-secondary"} shrink-0`}>
        {rental.status.charAt(0).toUpperCase() + rental.status.slice(1)}
      </span>
    </Link>
  );
});

RentalHistoryItem.displayName = "RentalHistoryItem";

/* Avatar upload component */
const AvatarUpload = memo(function AvatarUpload({ user, onUpload, uploading, BACKEND_URL }) {
  return (
    <label className="relative cursor-pointer group w-24 h-24">
      <div className="w-full h-full rounded-full bg-green-500/15 border-2 border-green-500/25 overflow-hidden flex items-center justify-center transition-all group-hover:border-green-500/50">
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
        <span className="text-white text-caption font-medium">
          {uploading ? "…" : "Edit"}
        </span>
      </div>
      <input type="file" accept="image/*" className="hidden" onChange={onUpload} disabled={uploading} />
    </label>
  );
});

AvatarUpload.displayName = "AvatarUpload";

/* Verification Card */
const VerificationCard = memo(function VerificationCard({ user, onUpload, uploading }) {
  if (user.isVerified) {
    return (
      <div className="w-full py-2 rounded-xl text-caption text-center text-blue-400 bg-blue-500/10 border border-blue-500/20 flex items-center justify-center gap-1">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2 .9 2 2v1h3.5c.9 0 1.65.58 1.9 1.39.26.82.26 1.79 0 2.6L14 19.05l4.9 1.35c.26.07.52.07.78 0l1.47-1.47c-.26-.26-.26-.68 0-.94L17.9 15.39z" /></svg>
        Government ID Verified
      </div>
    </label>
  );
});

VerificationCard.displayName = "VerificationCard";

/* Name edit component */
const NameEditor = memo(function NameEditor({ user, editName, setEditName, nameInput, setNameInput, saving, saveName }) {
  if (editName) {
    return (
      <div className="flex gap-2 w-full">
        <input
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          className="input flex-1"
          autoFocus
          placeholder="Your name"
          onKeyDown={(e) => e.key === "Enter" && saveName()}
        />
        <button
          onClick={saveName}
          disabled={saving || !nameInput.trim()}
          className="btn-primary px-4 py-2 text-sm disabled:opacity-50"
        >
          {saving ? "…" : "Save"}
        </button>
        <button
          onClick={() => setEditName(false)}
          className="btn-secondary px-4 py-2 text-sm"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="flex items-center gap-1 justify-center">
        <h2 className="heading-md font-extrabold text-text-primary">{user.name}</h2>
        {user.isVerified && (
          <span className="badge bg-blue-500/15 border-blue-500/30 text-blue-400 flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2 .9 2 2v1h3.5c.9 0 1.65.58 1.9 1.39.26.82.26 1.79 0 2.6L14 19.05l4.9 1.35c.26.07.52.07.78 0l1.47-1.47c-.26-.26-.26-.68 0-.94L17.9 15.39z" /></svg>
            Verified
          </span>
        )}
      </div>
      <div className="text-center">
        <div className="flex items-center gap-1 justify-center">
          <h2 className="heading-md font-extrabold text-text-primary">{user.name}</h2>
          {user.isVerified && (
            <span className="badge bg-blue-500/15 border-blue-500/30 text-blue-400 flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2 .9 2 2v1h3.5c.9 0 1.65.58 1.9 1.39.26.82.26 1.79 0 2.6L14 19.05l4.9 1.35c.26.07.52.07.78 0l1.47-1.47c-.26-.26-.26-.68 0-.94L17.9 15.39z" /></svg>
            Verified
          </span>
        )}
      </div>
      <div className="text-center">
        <div className="flex items-center gap-1 justify-center">
          <h2 className="heading-md font-extrabold text-text-primary">{user.name}</h2>
          {user.isVerified && (
            <span className="badge bg-blue-500/15 border-blue-500/30 text-blue-400 flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2 .9 2 2v1h3.5c.9 0 1.65.58 1.9 1.39.26.82.26 1.79 0 2.6L14 19.05l4.9 1.35c.26.07.52.07.78 0l1.47-1.47c-.26-.26-.26-.68 0-.94L17.9 15.39z" /></svg>
            Verified
          </span>
        )}
      </div>
      <div className="text-center">
        <div className="flex items-center gap-1 justify-center">
          <h2 className="heading-md font-extrabold text-text-primary">{user.name}</h2>
          {user.isVerified && (
            <span className="badge bg-blue-500/15 border-blue-500/30 text-blue-400 flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2 .9 2 2v1h3.5c.9 0 1.65.58 1.9 1.39.26.82.26 1.79 0 2.6L14 19.05l4.9 1.35c.26.07.52.07.78 0l1.47-1.47c-.26-.26-.26-.68 0-.94L17.9 15.39z" /></svg>
            Verified
          </span>
        )}
      </div>
      <div className="text-center">
        <div className="flex items-center gap-1 justify-center">
          <h2 className="heading-md font-extrabold text-text-primary">{user.name}</h2>
          {user.isVerified && (
            <span className="badge bg-blue-500/15 border-blue-500/30 text-blue-400 flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2 .9 2 2v1h3.5c.9 0 1.65.58 1.9 1.39.26.82.26 1.79 0 2.6L14 19.05l4.9 1.35c.26.07.52.07.78 0l1.47-1.47c-.26-.26-.26-.68 0-.94L17.9 15.39z" /></svg>
            Verified
          </span>
          )}
        </div>
        <div className="text-center">
          <div className="flex items-center gap-1 justify-center">
            <h2 className="heading-md font-extrabold text-text-primary">{user.name}</h2>
            {user.isVerified && (
              <span className="badge bg-blue-500/15 border-blue-500/30 text-blue-400 flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2 .9 2 2v1h3.5c.9 0 1.65.58 1.9 1.39.26.82.26 1.79 0 2.6L14 19.05l4.9 1.35c.26.07.52.07.78 0l1.47-1.47c-.26-.26-.26-.68 0-.94L17.9 15.39z" /></svg>
                Verified
              </span>
            )}
          )}
        </div>
        <div className="text-center">
          <div className="flex items-center gap-1 justify-center">
            <h2 className="heading-md font-extrabold text-text-primary">{user.name}</h2>
            {user.isVerified && (
              <span className="badge bg-blue-500/15 border-blue-500/30 text-blue-400 flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2 .9 2 2v1h3.5c.9 0 1.65.58 1.9 1.39.26.82.26 1.79 0 2.6L14 19.05l4.9 1.35c.26.07.52.07.78 0l1.47-1.47c-.26-.26-.26-.68 0-.94L17.9 15.39z" /></svg>
                Verified
              </span>
            )}
          )}
        </div>
        <div className="text-center">
          <div className="flex items-center gap-1 justify-center">
            <h2 className="heading-md font-extrabold text-text-primary">{user.name}</h2>
            {user.isVerified && (
              <span className="badge bg-blue-500/15 border-blue-500/30 text-blue-400 flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2 .9 2 2v1h3.5c.9 0 1.65.58 1.9 1.39.26.82.26 1.79 0 2.6L14 19.05l4.9 1.35c.26.07.52.07.78 0l1.47-1.47c-.26-.26-.26-.68 0-.94L17.9 15.39z" /></svg>
                Verified
              </span>
            )}
          )}
        </div>
        <div className="text-center">
          <div className="flex items-center gap-1 justify-center">
            <h2 className="heading-md font-extrabold text-text-primary">{user.name}</h2>
            {user.isVerified && (
              <span className="badge bg-blue-500/15 border-blue-500/30 text-blue-400 flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2 .9 2 2v1h3.5c.9 0 1.65.58 1.9 1.39.26.82.26 1.79 0 2.6L14 19.05l4.9 1.35c.26.07.52.07.78 0l1.47-1.47c-.26-.26-.26-.68 0-.94L17.9 15.39z" /></svg>
                Verified
              </span>
            )}
          )}
        </div>
      </div>
    </div>
  );
}