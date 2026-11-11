import React from 'react';
import { useEffect, useState, useRef, memo } from "react";
import { Link } from "react-router-dom";
import { getMyRentals, getOwnerRequests, markReturned, completeRental } from "../services/rentalService";
import { BACKEND_URL } from "../services/api";
import Loader from "../components/Loader";
import { RentHistorySkeleton } from "../components/Skeleton";

const StatusBadge = memo(function StatusBadge({ status }) {
  const statusClasses = {
    pending: "badge-warning",
    accepted: "badge-success",
    active: "bg-blue-500/15 border-blue-500/30 text-blue-400 badge",
    returned: "bg-blue-500/15 border-blue-500/30 text-blue-400 badge",
    rejected: "badge-error",
    completed: "bg-purple-500/15 border-purple-500/30 text-purple-400 badge",
    cancelled: "badge-secondary",
  };

  const icons = {
    pending: "⏳",
    accepted: "✅",
    active: "🔄",
    returned: "📦",
    rejected: "❌",
    completed: "✓",
    cancelled: "✕",
  };

  return (
    <span className={`${statusClasses[status] || "badge-secondary"} flex items-center gap-1 shrink-0`}>
      <span aria-hidden="true">{icons[status] || ""}</span>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
});

StatusBadge.displayName = "StatusBadge";

const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

/* Memoised empty state */
const EmptyState = memo(function EmptyState({ tab }) {
  return (
    <div className="card-padded text-center py-16">
      <div className="w-20 h-20 rounded-3xl rounded-3xl glass flex items-center justify-center text-4xl mx-auto mb-5">
        📋
      </div>
      <h3 className="heading-md font-semibold text-text-primary mb-2">No rentals yet</h3>
      <p className="body-sm text-text-secondary mb-6">
        {tab === "renter"
          ? "You haven't rented any items yet."
          : "Nobody has rented your items yet."}
      </p>
      {tab === "renter" && (
        <Link to="/nearby" className="btn-primary inline-flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          Browse Nearby Items
        </Link>
      )}
    </div>
  );
});

EmptyState.displayName = "EmptyState";

/* Rental row component */
const RentalRow = memo(function RentalRow({ rental, tab, onReturn, onComplete, loadingId, actionLoading, setActionLoading }) {
  const product = rental.product;
  const imgSrc = product?.images?.[0]
    ? `${BACKEND_URL}${product.images[0]}`
    : `https://via.placeholder.com/100x100/1a1a1a/22c55e?text=${encodeURIComponent(product?.name || "Item")}`;

  const isReturnable = tab === "renter" && rental.status === "accepted";
  const isCompletable = tab === "owner" && rental.status === "returned";

  return (
    <div className="card-interactive p-4 flex flex-col sm:flex-row gap-4">
      {/* Product Image */}
      <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-surface-800">
        <img
          src={imgSrc}
          alt={product?.name}
          loading="lazy"
          className="w-full h-full object-cover"
          onError={(e) => { e.target.src = `https://via.placeholder.com/100x100/1a1a1a/22c55e?text=Item`; }}
        />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-2 flex-wrap">
          <div className="flex-1 min-w-0">
            <Link
              to={`/products/${product?._id}`}
              className="font-medium text-text-primary hover:text-green-400 transition-colors truncate block"
            >
              {product?.name}
            </Link>
            <div className="text-caption text-text-tertiary mt-0.5">
              {tab === "renter" ? (
                <>
                  Owner: <span className="text-text-secondary">{rental.owner?.name}</span>
                </>
              ) : (
                <>
                  Renter: <span className="text-text-secondary">{rental.renter?.name}</span>
                  {" · "}Trust: <span className="text-green-400 font-medium">{rental.renter?.likelihoodPoints}/100</span>
                  {rental.renter?.isVerified && (
                    <span className="text-blue-400 ml-1 flex items-center gap-0.5">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2 .9 2 2v1h3.5c.9 0 1.65.58 1.9 1.39.26.82.26 1.79 0 2.6L14 19.05l4.9 1.35c.26.07.52.07.78 0l1.47-1.47c-.26-.26-.26-.68 0-.94L17.9 15.39z" /></svg>
                      Verified
                    </span>
                  )}
                </>
              </div>
            </div>
          </div>
          <div className="StatusBadge status={rental.status}" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-caption mb-3">
          <div>
            <span className="text-text-tertiary block">Type</span>
            <div className="text-text-secondary capitalize">{rental.rentalType}</div>
          </div>
          <div>
            <span className="text-text-tertiary block">Start</span>
            <div className="text-text-secondary">{formatDate(rental.startDate)}</div>
          </div>
          <div>
            <span className="text-text-tertiary block">End</span>
            <div className="text-text-secondary">{formatDate(rental.endDate)}</div>
          </div>
          <div>
            <span className="text-text-tertiary block">Amount</span>
            <div className="text-green-400 font-bold">{rental.totalAmount.toLocaleString()}</div>
          </div>
        </div>

        {isReturnable && (
          <button
            onClick={() => onReturn(rental._id)}
            disabled={loadingId === rental._id}
            className="px-4 py-2 rounded-lg text-caption font-medium btn-primary disabled:opacity-50 flex items-center gap-2 w-full sm:w-auto"
          >
            {loadingId === rental._id ? (
              <Loader size="sm" />
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                Mark as Returned
              </>
            )}
          </button>
        )}

        {isCompletable && (
          <div className="flex gap-2 flex-wrap">
            {[
              { type: "onTime", label: "✅ On-time", color: "text-green-400" },
              { type: "late", label: "⏰ Late", color: "text-amber-400" },
              { type: "damage", label: "💥 Damage", color: "text-red-400" },
            ].map(({ type, label, color }) => (
              <button
                key={type}
                onClick={() => {
                  setActionLoading(rental._id + type);
                  completeRental(rental._id, type)
                    .then(() => onComplete())
                    .catch(() => {})
                    .finally(() => setActionLoading(""));
                }}
                disabled={actionLoading.startsWith(rental._id)}
                className={`px-3 py-1.5 rounded-lg text-caption font-medium transition-all disabled:opacity-50 card hover:border-green-500/20 ${color}`}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

RentalRow.displayName = "RentalRow";

const TabButton = memo(function TabButton({ tab, activeTab, label, count, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
        activeTab === tab
          ? "btn-primary"
          : "card text-text-secondary hover:border-green-500/20 hover:text-text-primary"
      }`}
    >
      {label}
      <span className={`text-caption px-2 py-0.5 rounded-full ${activeTab === tab ? "bg-black/30" : "bg-white/10"}`}>
        {count}
      </span>
    </button>
  );
});

TabButton.displayName = "TabButton";

export default function RentHistory() {
  const [tab, setTab] = useState("renter");
  const [rentals, setRentals] = useState([]);
  const [ownerRentals, setOwnerRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");
  const mountedRef = useRef(true);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [my, owner] = await Promise.all([getMyRentals(), getOwnerRequests()]);
      if (mountedRef.current) {
        setRentals(my);
        setOwnerRentals(owner);
      }
    } catch {
      // Silently fail - UI will show empty state
    }
    if (mountedRef.current) setLoading(false);
  };

  useEffect(() => {
    fetchAll();
    return () => { mountedRef.current = false; };
  }, []);

  const handleReturn = async (id) => {
    setActionLoading(id);
    try {
      await markReturned(id);
      await fetchAll();
    } catch {
      // Silently fail - UI will show error state
    }
    setActionLoading("");
  };

  const list = tab === "renter" ? rentals : ownerRentals;

  return (
    <div className="min-h-screen bg-background-primary pt-20 pb-16 px-4">
      <div className="container">

        {/* Header */}
        <div className="mb-8">
          <h1 className="heading-xl font-extrabold text-text-primary mb-2">
            Rental <span className="text-gradient-brand">History</span>
          </h1>
          <p className="body-sm text-text-secondary">Track all your rental transactions</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { key: "renter", label: "Items I Rented", count: rentals.length },
            { key: "owner", label: "My Items Rented", count: ownerRentals.length },
          ].map((t) => (
            <TabButton
              key={t.key}
              tab={t.key}
              activeTab={tab}
              label={t.label}
              count={t.count}
              onClick={() => setTab(t.key)}
            />
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <RentHistorySkeleton />
        ) : list.length === 0 ? (
          <EmptyState tab={tab} />
        ) : (
          <div className="flex flex-col gap-4">
            {list.map((r) => (
              <RentalRow
                key={r._id}
                rental={r}
                tab={tab}
                onReturn={handleReturn}
                onComplete={fetchAll}
                loadingId={actionLoading}
                actionLoading={actionLoading}
                setActionLoading={setActionLoading}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}