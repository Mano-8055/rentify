import { useEffect, useState, useContext } from "react";
import { getNearbyProducts, getAllProducts } from "../services/productService";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";
import useLocation from "../hooks/useLocation";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";

const CATEGORIES = ["All", "Electronics", "Vehicles", "Tools", "Sports", "Furniture", "Clothing", "Books", "Other"];

export default function NearbyProducts() {
  const { user, updateUser } = useContext(AuthContext);
  const { location, error: locError, loading: locLoading, refetch } = useLocation();
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [category, setCategory] = useState("All");
  const [radius, setRadius] = useState(10);
  const [locationSaved, setLocationSaved] = useState(false);

  useEffect(() => {
    if (location && !locationSaved) {
      API.put("/users/location", location)
        .then((res) => {
          updateUser(res.data);
          setLocationSaved(true);
        })
        .catch(() => {});
    }
  }, [location, locationSaved, updateUser]);

  useEffect(() => {
    if (!location) return;
    const fetchProducts = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getNearbyProducts(location.lat, location.lng, radius);
        setProducts(data);
      } catch {
        setError("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [location, radius]);

  useEffect(() => {
    if (category === "All") {
      setFiltered(products);
    } else {
      setFiltered(products.filter((p) => p.category === category));
    }
  }, [products, category]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-20 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Nearby <span className="gradient-text">Rentals</span>
          </h1>
          <p className="text-slate-500 text-sm">
            {location
              ? `Showing items within ${radius}km of your location`
              : "Detecting your location…"}
          </p>
        </div>

        {/* Location Status */}
        {locError && (
          <div className="mb-6 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-sm flex items-center justify-between">
            <span>📍 {locError} — showing all products</span>
            <button onClick={refetch} className="text-xs underline hover:text-yellow-300">
              Retry
            </button>
          </div>
        )}

        {locLoading && (
          <div className="mb-6 p-4 rounded-xl glass flex items-center gap-3 text-slate-400 text-sm">
            <Loader size="sm" />
            <span>Getting your location…</span>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                  category === c
                    ? "bg-green-500 border-green-500 text-black font-bold"
                    : "border-white/10 text-slate-400 hover:border-green-500/30 hover:text-green-400"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs text-slate-500">Radius:</span>
            <select
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="input-dark text-xs py-1.5 px-3 w-24 rounded-lg"
            >
              {[2, 5, 10, 25, 50].map((r) => (
                <option key={r} value={r} className="bg-[#111]">
                  {r}km
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader size="lg" text="Finding items near you…" />
          </div>
        ) : error ? (
          <div className="text-center py-16 text-red-400">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">📭</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No items found
            </h3>
            <p className="text-slate-500 text-sm">
              {location
                ? `No ${category !== "All" ? category.toLowerCase() + " " : ""}items within ${radius}km. Try expanding the radius.`
                : "Enable location or try a wider radius."}
            </p>
          </div>
        ) : (
          <>
            <p className="text-xs text-slate-600 mb-4">
              {filtered.length} item{filtered.length !== 1 ? "s" : ""} found
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {filtered.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
