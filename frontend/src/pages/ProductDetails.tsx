import React from 'react';
import { useEffect, useState, useContext, memo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getProductById } from "../services/productService";
import { createRental } from "../services/rentalService";
import { AuthContext } from "../context/AuthContext";
import { BACKEND_URL } from "../services/api";
import Loader from "../components/Loader";
import { ProductDetailsSkeleton } from "../components/Skeleton";
import Modal from "../components/Modal";
import { Input, Select } from "../components/Input";

const trustInfo = (pts) => {
  if (pts >= 90) return { label: "Excellent", color: "text-amber-400", icon: "🏆", bg: "bg-amber-500/8 border-amber-500/20" };
  if (pts >= 70) return { label: "Good", color: "text-green-400", icon: "✅", bg: "bg-green-500/8 border-green-500/20" };
  if (pts >= 50) return { label: "Fair", color: "text-amber-500", icon: "⚠️", bg: "bg-amber-500/8 border-amber-500/20" };
  if (pts >= 30) return { label: "Poor", color: "text-orange-400", icon: "🔸", bg: "bg-orange-500/8 border-orange-500/20" };
  return { label: "Risky", color: "text-red-400", icon: "🚨", bg: "bg-red-500/8 border-red-500/20" };
};

const CONDITION_STYLES = {
  "Like New": "bg-green-500/15 border-green-500/30 text-green-400",
  "Good": "bg-blue-500/15 border-blue-500/30 text-blue-400",
  "Fair": "bg-amber-500/15 border-amber-500/30 text-amber-400",
  "Worn": "bg-orange-500/15 border-orange-500/30 text-orange-400",
};

const OwnerCard = memo(function OwnerCard({ owner, trust }) {
  return (
    <div className={`card-padded flex items-center gap-4 border ${trust.bg}`}>
      <div className="w-12 h-12 rounded-full bg-green-500/15 border border-green-500/25 flex items-center justify-center text-green-400 font-bold text-sm shrink-0">
        {owner?.name?.charAt(0).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="font-semibold text-text-primary text-sm">{owner?.name}</span>
          {owner?.isVerified && (
            <span className="badge bg-blue-500/15 border-blue-500/30 text-blue-400">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2 .9 2 2v1h3.5c.9 0 1.65.58 1.9 1.39.26.82.26 1.79 0 2.6L14 19.05l4.9 1.35c.26.07.52.07.78 0l1.47-1.47c.26-.26.26-.68 0-.94L17.9 15.39z" />
              </svg>
              Verified
            </span>
          )}
        </div>
        <div className="text-caption flex items-center gap-1 ${trust.color}">
          <span>{trust.icon}</span>
          <span>{trust.label} Trust Score: {owner?.likelihoodPoints}/100 — {trust.label}</span>
        </div>
      </div>
    </div>
  );
});

OwnerCard.displayName = "OwnerCard";

const Thumbnail = memo(function Thumbnail({ src, alt, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
        active ? "border-green-500 shadow-[0_0_0_1px_rgba(34,197,94,0.4),_0_0_12px_rgba(34,197,94,0.2)]" : "border-border-default hover:border-green-500/30"
      }`}
      aria-label={`View ${alt}`}
      aria-current={active ? "true" : "false"}
    >
      <img src={src} alt="" className="w-full h-full object-cover" />
    </button>
  );
});

Thumbnail.displayName = "Thumbnail";

const PricingCard = memo(function PricingCard({ label, price, period, isActive, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`p-4 rounded-xl text-center transition-all ${
        isActive
          ? "btn-primary"
          : "card hover:border-green-500/20 text-text-secondary"
      }`}
    >
      <div className="font-medium text-sm">{label}</div>
      <div className="text-micro text-text-tertiary mt-0.5">{period}</div>
      <div className="heading-md font-extrabold text-green-400 mt-1">₹{price}</div>
    </button>
  );
});

PricingCard.displayName = "PricingCard";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [rentalType, setRentalType] = useState("day");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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
    setError("");
    setSuccess("");
    if (!startDate || !endDate) { setError("Please select start and end dates"); return; }
    if (new Date(endDate) <= new Date(startDate)) { setError("End date must be after start date"); return; }
    setSubmitting(true);
    try {
      await createRental({ productId: id, startDate, endDate, rentalType });
      setShowSuccessModal(true);
      setStartDate("");
      setEndDate("");
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't send request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background-primary flex items-center justify-center pt-16">
        <ProductDetailsSkeleton />
      </div>
    );
  }

  if (!product) return null;

  const trust = trustInfo(product.owner?.likelihoodPoints || 100);
  const isOwner = user?._id === product.owner?._id;
  const total = calcTotal();
  const conditionStyle = CONDITION_STYLES[product.condition] || CONDITION_STYLES.Good;

  const images = product.images?.length > 0
    ? product.images.map((img) => `${BACKEND_URL}${img}`)
    : [`https://via.placeholder.com/800x500/1a1a1a/22c55e?text=${encodeURIComponent(product.name)}`];

  const today = new Date().toISOString().slice(0, 16);

  return (
    <div className="min-h-screen bg-background-primary pt-20 pb-16 px-4">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* ── Images ── */}
          <div>
            <div className="card aspect-video overflow-hidden mb-3">
              <img
                src={images[activeImg]}
                alt={product.name}
                className="w-full h-full object-cover transition-opacity duration-300"
                onError={(e) => {
                  e.target.src = `https://via.placeholder.com/800x500/1a1a1a/22c55e?text=${encodeURIComponent(product.name)}`;
                }}
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide" role="group" aria-label="Product images">
                {images.map((img, i) => (
                  <Thumbnail
                    key={i}
                    src={img}
                    alt={`${product.name} - Image ${i + 1}`}
                    active={activeImg === i}
                    onClick={() => setActiveImg(i)}
                  />
                ))}
              </div>
            </div>

            {/* ── Details ── */}
            <div className="flex flex-col gap-5">
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-3">
                  <span className="badge badge-primary">{product.category}</span>
                  {product.condition && (
                    <span className={`badge ${conditionStyle}`}>{product.condition}</span>
                  )}
                  {product.distance !== undefined && (
                    <span className="badge bg-black/30 border-white/10 text-text-secondary flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {product.distance < 1 ? `${Math.round(product.distance * 1000)}m` : `${product.distance}km away`}
                    </span>
                  </span>
                </div>

                <h1 className="heading-lg font-extrabold text-text-primary leading-tight">
                  {product.name}
                </h1>
                {product.description && (
                  <p className="body text-text-secondary mt-2 leading-relaxed">{product.description}</p>
                )}
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-2 gap-3">
                <PricingCard
                  label="Per Hour"
                  price={product.priceHour}
                  period="Best for short-term"
                  isActive={rentalType === "hour"}
                  onClick={() => setRentalType("hour")}
                />
                <PricingCard
                  label="Per Day"
                  price={product.priceDay}
                  period="Best for 24hrs+"
                  isActive={rentalType === "day"}
                  onClick={() => setRentalType("day")}
                />
              </div>

              {/* Owner */}
              <OwnerCard owner={product.owner} trust={trust} />

              {/* Not available */}
              {!product.availability && (
                <div className="card-padded bg-red-500/5 border-red-500/20 text-red-400 text-center text-sm">
                  <svg className="w-5 h-5 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  This item is currently rented out
                </div>
              )}

              {/* Rental form */}
              {product.availability && !isOwner && (
                <form onSubmit={handleRent} className="card-padded flex flex-col gap-4">
                  <h3 className="heading-sm font-semibold text-text-primary">Request Rental</h3>

                  {success && (
                    <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm flex items-center gap-2">
                      <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {success}
                    </div>
                  )}

                  {error && (
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
                      <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      {error}
                    </div>
                  )}

                  {/* Type toggle */}
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { type: "hour", label: "⏰ Hourly", desc: "Best for short-term" },
                      { type: "day", label: "📅 Daily", desc: "Best for 24hrs+" },
                    ].map(({ type, label, desc }) => (
                      <PricingCard
                        key={type}
                        label={label}
                        price={type === "hour" ? product.priceHour : product.priceDay}
                        period={desc}
                        isActive={rentalType === type}
                        onClick={() => setRentalType(type)}
                      />
                    ))}
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="label">Start Date & Time</label>
                      <input
                        type="datetime-local"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        min={today}
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="label">End Date & Time</label>
                      <input
                        type="datetime-local"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        min={startDate || today}
                        className="input"
                      />
                    </div>
                  </div>

                  {/* Total */}
                  {total > 0 && (
                    <div className="p-3 rounded-xl bg-green-500/5 border border-green-500/15 flex justify-between items-center">
                      <span className="text-sm text-text-secondary">Estimated Total</span>
                      <span className="heading-md font-extrabold text-green-400">₹{total.toLocaleString()}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <Loader size="sm" />
                        Sending…
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Send Rental Request
                      </>
                    )}
                  </button>
                </form>
              )}

              {!user && (
                <p className="text-center text-caption text-text-tertiary">
                  <span
                    onClick={() => navigate("/login")}
                    className="text-green-400 cursor-pointer hover:underline font-medium"
                  >
                    Sign in
                  </span>{" "}
                  to rent this item
                </p>
              )}

              {isOwner && (
                <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/20 text-center text-sm text-green-400 font-medium">
                  <svg className="w-5 h-5 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  This is your listing
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Success Modal */}
        <Modal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          title="Request Sent!"
          size="sm"
        >
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-green-500/15 border border-green-500/25 flex items-center justify-center text-3xl mx-auto mb-4">
              ✓
            </div>
            <p className="body text-text-secondary mb-6">
              Your rental request has been sent to the owner. You'll be notified once they respond.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowSuccessModal(false)} className="btn-secondary flex-1">
                Continue Browsing
              </button>
              <Link to="/dashboard" className="btn-primary flex-1" onClick={() => setShowSuccessModal(false)}>
                View Dashboard
              </Link>
            </div>
        </Modal>
      </div>
    </div>
  );
}