import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { getOwnerRequests, acceptRental, rejectRental, completeRental, getMyRentals, markReturned } from "../services/rentalService";
import { getMyProducts, deleteProduct } from "../services/productService";
import { AuthContext } from "../context/AuthContext";
import { BACKEND_URL } from "../services/api";
import Loader from "../components/Loader";

const StatusBadge = ({ status }) => (
  <span className={`text-xs px-2 py-0.5 rounded-full border font-medium status-${status}`}>
    {status.charAt(0).toUpperCase() + status.slice(1)}
  </span>
);

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [myRentals, setMyRentals] = useState([]);
  const [myProducts, setMyProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [req, rents, prods] = await Promise.all([
        getOwnerRequests(),
        getMyRentals(),
        getMyProducts(),
      ]);
      setRequests(req);
      setMyRentals(rents);
      setMyProducts(prods);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const handle = async (fn, id) => {
    setActionLoading(id);
    try { await fn(id); await fetchAll(); } catch {}
    setActionLoading("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try { await deleteProduct(id); setMyProducts((p) => p.filter((x) => x._id !== id)); } catch {}
  };

  const pendingRequests = requests.filter((r) => r.status === "pending");
  const activeRentals = myRentals.filter((r) => ["accepted", "active"].includes(r.status));

  const stats = [
    { label: "My Listings", value: myProducts.length, icon: "📦" },
    { label: "Pending Requests", value: pendingRequests.length, icon: "⏳" },
    { label: "Active Rentals", value: activeRentals.length, icon: "🔄" },
    { label: "Trust Score", value: `${user?.likelihoodPoints}/100`, icon: "🛡️" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center pt-16">
        <Loader size="lg" text="Loading dashboard…" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-20 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">
              Welcome, <span className="gradient-text">{user?.name?.split(" ")[0]}</span>
            </h1>
            <p className="text-slate-500 text-sm">Manage your listings and rental requests</p>
          </div>
          <Link to="/add-product" className="btn-primary px-5 py-2.5 rounded-xl text-sm">
            + List Item
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {stats.map((s) => (
            <div key={s.label} className="glass rounded-2xl p-5">
              <div className="text-2xl mb-2">{s.icon}</div>
              <div className="text-2xl font-bold text-white">{s.value}</div>
              <div className="text-xs text-slate-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Incoming Requests (as owner) */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span>⏳</span> Incoming Requests
            {pendingRequests.length > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/20">
                {pendingRequests.length} pending
              </span>
            )}
          </h2>

          {pendingRequests.length === 0 ? (
            <div className="glass rounded-2xl p-6 text-center text-slate-600 text-sm">
              No pending requests
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {pendingRequests.map((r) => (
                <div key={r._id} className="glass rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-white text-sm">{r.product?.name}</span>
                      <StatusBadge status={r.status} />
                    </div>
                    <div className="text-xs text-slate-500">
                      Renter: <span className="text-slate-300">{r.renter?.name}</span>
                      {" · "}Trust:{" "}
                      <span className="text-green-400">{r.renter?.likelihoodPoints}/100</span>
                      {r.renter?.isVerified && <span className="text-blue-400 ml-1">✓</span>}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {new Date(r.startDate).toLocaleDateString()} →{" "}
                      {new Date(r.endDate).toLocaleDateString()} ·{" "}
                      <span className="text-green-400 font-medium">₹{r.totalAmount}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => handle(acceptRental, r._id)}
                      disabled={actionLoading === r._id}
                      className="px-4 py-2 rounded-lg bg-green-500/20 text-green-400 border border-green-500/20 hover:bg-green-500/30 text-xs font-medium transition-all disabled:opacity-50"
                    >
                      {actionLoading === r._id ? <Loader size="sm" /> : "Accept"}
                    </button>
                    <button
                      onClick={() => handle(rejectRental, r._id)}
                      disabled={actionLoading === r._id}
                      className="px-4 py-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 text-xs font-medium transition-all disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* All owner requests (non-pending) */}
        {requests.filter((r) => r.status !== "pending").length > 0 && (
          <section className="mb-10">
            <h2 className="text-lg font-semibold text-white mb-4">📋 All Requests on My Items</h2>
            <div className="flex flex-col gap-3">
              {requests
                .filter((r) => r.status !== "pending")
                .map((r) => (
                  <div key={r._id} className="glass rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-white text-sm">{r.product?.name}</span>
                        <StatusBadge status={r.status} />
                      </div>
                      <div className="text-xs text-slate-500">
                        Renter: <span className="text-slate-300">{r.renter?.name}</span>
                        {" · "}
                        <span className="text-green-400">₹{r.totalAmount}</span>
                      </div>
                    </div>
                    {r.status === "returned" && (
                      <div className="flex gap-2 shrink-0">
                        {["onTime", "late", "damage"].map((type) => (
                          <button
                            key={type}
                            onClick={() => {
                              setActionLoading(r._id + type);
                              completeRental(r._id, type).then(fetchAll).catch(() => {}).finally(() => setActionLoading(""));
                            }}
                            disabled={actionLoading.startsWith(r._id)}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all disabled:opacity-50 glass hover:border-green-500/20 text-slate-300"
                          >
                            {type === "onTime" ? "✅ On-time" : type === "late" ? "⏰ Late" : "💥 Damage"}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </section>
        )}

        {/* My Active Rentals (as renter) */}
        {activeRentals.length > 0 && (
          <section className="mb-10">
            <h2 className="text-lg font-semibold text-white mb-4">🔄 My Active Rentals</h2>
            <div className="flex flex-col gap-3">
              {activeRentals.map((r) => (
                <div key={r._id} className="glass rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Link to={`/products/${r.product?._id}`} className="font-medium text-white text-sm hover:text-green-400 transition-colors">
                        {r.product?.name}
                      </Link>
                      <StatusBadge status={r.status} />
                    </div>
                    <div className="text-xs text-slate-500">
                      Owner: <span className="text-slate-300">{r.owner?.name}</span>
                      {" · "}
                      <span className="text-green-400">₹{r.totalAmount}</span>
                    </div>
                  </div>
                  {r.status === "accepted" && (
                    <button
                      onClick={() => {
                        setActionLoading(r._id);
                        markReturned(r._id).then(fetchAll).catch(() => {}).finally(() => setActionLoading(""));
                      }}
                      disabled={actionLoading === r._id}
                      className="px-4 py-2 rounded-lg text-xs font-medium btn-primary shrink-0 disabled:opacity-50"
                    >
                      {actionLoading === r._id ? <Loader size="sm" /> : "Mark Returned"}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* My Products */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-4">📦 My Listings</h2>
          {myProducts.length === 0 ? (
            <div className="glass rounded-2xl p-8 text-center">
              <div className="text-4xl mb-3">📭</div>
              <p className="text-slate-500 text-sm mb-4">No products listed yet</p>
              <Link to="/add-product" className="btn-primary px-6 py-2.5 rounded-xl text-sm inline-block">
                List Your First Item
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {myProducts.map((p) => (
                <div key={p._id} className="glass rounded-2xl p-4">
                  <div className="h-32 rounded-xl overflow-hidden mb-3 bg-white/3">
                    <img
                      src={p.images?.[0] ? `${BACKEND_URL}${p.images[0]}` : `https://via.placeholder.com/300x200/111827/22c55e?text=${encodeURIComponent(p.name)}`}
                      alt={p.name}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = `https://via.placeholder.com/300x200/111827/22c55e?text=${encodeURIComponent(p.name)}`; }}
                    />
                  </div>
                  <h3 className="font-semibold text-white text-sm mb-1 truncate">{p.name}</h3>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-green-400">₹{p.priceDay}/day</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${p.availability ? "status-accepted" : "status-rejected"}`}>
                      {p.availability ? "Available" : "Rented"}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDelete(p._id)}
                    className="w-full text-xs py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all"
                  >
                    Delete Listing
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
