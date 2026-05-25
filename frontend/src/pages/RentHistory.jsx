import { useEffect, useState, memo } from "react";
import { Link } from "react-router-dom";
import { getMyRentals, getOwnerRequests, markReturned } from "../services/rentalService";
import { BACKEND_URL } from "../services/api";
import Loader from "../components/Loader";

/* Memoised status badge */
const StatusBadge = memo(function StatusBadge({ status }) {
  return (
    <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium status-${status} shrink-0`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
});

const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

/* Memoised empty state */
const EmptyState = memo(function EmptyState({ tab }) {
  return (
    <div className="glass rounded-3xl p-12 text-center">
      <div className="w-20 h-20 rounded-3xl glass flex items-center justify-center text-4xl mx-auto mb-5">
        📋
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">No rentals yet</h3>
      <p className="text-slate-500 text-sm mb-6">
        {tab === "renter"
          ? "You haven't rented any items yet."
          : "Nobody has rented your items yet."}
      </p>
      {tab === "renter" && (
        <Link to="/nearby" className="btn-primary px-6 py-2.5 rounded-xl text-sm inline-block">
          Browse Nearby Items
        </Link>
      )}
    </div>
  );
});

export default function RentHistory() {
  const [tab, setTab]                   = useState("renter");
  const [rentals, setRentals]           = useState([]);
  const [ownerRentals, setOwnerRentals] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [actionLoading, setActionLoading] = useState("");

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [my, owner] = await Promise.all([getMyRentals(), getOwnerRequests()]);
      setRentals(my);
      setOwnerRentals(owner);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const handleReturn = async (id) => {
    setActionLoading(id);
    try { await markReturned(id); await fetchAll(); } catch {}
    setActionLoading("");
  };

  const list = tab === "renter" ? rentals : ownerRentals;

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-20 pb-16 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Rental <span className="gradient-text">History</span>
          </h1>
          <p className="text-slate-500 text-sm">Track all your rental transactions</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { key: "renter", label: "Items I Rented",    count: rentals.length },
            { key: "owner",  label: "My Items Rented",   count: ownerRentals.length },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                tab === t.key
                  ? "btn-primary"
                  : "glass text-slate-400 hover:border-green-500/20 hover:text-green-400"
              }`}
            >
              {t.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${tab === t.key ? "bg-black/30" : "bg-white/10"}`}>
                {t.count}
              </span>
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader size="lg" text="Loading history…" />
          </div>
        ) : list.length === 0 ? (
          <EmptyState tab={tab} />
        ) : (
          <div className="flex flex-col gap-4">
            {list.map((r) => {
              const product = r.product;
              const imgSrc  = product?.images?.[0]
                ? `${BACKEND_URL}${product.images[0]}`
                : `https://via.placeholder.com/100x100/111827/22c55e?text=${encodeURIComponent(product?.name || "Item")}`;

              return (
                <div key={r._id} className="glass rounded-2xl p-5 flex flex-col sm:flex-row gap-4 hover:border-white/10 transition-colors">
                  {/* Product Image */}
                  <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-white/3">
                    <img
                      src={imgSrc}
                      alt={product?.name}
                      loading="lazy"
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = `https://via.placeholder.com/100x100/111827/22c55e?text=Item`; }}
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2 flex-wrap">
                      <div>
                        <Link
                          to={`/products/${product?._id}`}
                          className="font-semibold text-white hover:text-green-400 transition-colors"
                        >
                          {product?.name}
                        </Link>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {tab === "renter" ? (
                            <>Owner: <span className="text-slate-300">{r.owner?.name}</span></>
                          ) : (
                            <>
                              Renter: <span className="text-slate-300">{r.renter?.name}</span>
                              {" · "}Trust: <span className="text-green-400">{r.renter?.likelihoodPoints}/100</span>
                            </>
                          )}
                        </div>
                      </div>
                      <StatusBadge status={r.status} />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      <div>
                        <span className="text-slate-600 block">Type</span>
                        <div className="text-slate-300 capitalize">{r.rentalType}</div>
                      </div>
                      <div>
                        <span className="text-slate-600 block">Start</span>
                        <div className="text-slate-300">{formatDate(r.startDate)}</div>
                      </div>
                      <div>
                        <span className="text-slate-600 block">End</span>
                        <div className="text-slate-300">{formatDate(r.endDate)}</div>
                      </div>
                      <div>
                        <span className="text-slate-600 block">Amount</span>
                        <div className="text-green-400 font-bold">₹{r.totalAmount}</div>
                      </div>
                    </div>

                    {tab === "renter" && r.status === "accepted" && (
                      <button
                        onClick={() => handleReturn(r._id)}
                        disabled={actionLoading === r._id}
                        className="mt-3 px-4 py-2 rounded-lg text-xs font-medium btn-primary disabled:opacity-50 flex items-center gap-2"
                      >
                        {actionLoading === r._id ? <Loader size="sm" /> : "✅ Mark as Returned"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
