import React from 'react';
import { useEffect, useState, useContext, useMemo, memo } from "react";
import { getNearbyProducts } from "../services/productService";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";
import { ProductCardSkeleton } from "../components/Skeleton";
import useLocation from "../hooks/useLocation";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { Select, Input } from "../components/Input";

const CATEGORIES = ["All", "Electronics", "Vehicles", "Tools", "Sports", "Furniture", "Clothing", "Books", "Other"];
const RADIUS_OPTIONS = [2, 5, 10, 25, 50];
const SORT_OPTIONS = [
  { value: "distance", label: "Distance: Nearest First" },
  { value: "priceHourAsc", label: "Price: Low to High (Hourly)" },
  { value: "priceHourDesc", label: "Price: High to Low (Hourly)" },
  { value: "priceDayAsc", label: "Price: Low to High (Daily)" },
  { value: "priceDayDesc", label: "Price: High to Low (Daily)" },
  { value: "newest", label: "Newest First" },
  { value: "trust", label: "Highest Trust Score" },
];

/* Memoised empty state */
const EmptyState = memo(function EmptyState({ location, category, radius }) {
  return (
    <div className="card-padded text-center py-16">
      <div className="w-20 h-20 rounded-3xl rounded-3xl glass flex items-center justify-center text-4xl mx-auto mb-5">
        📭
      </div>
      <h3 className="heading-md text-text-primary mb-2">No items found</h3>
      <p className="body-sm text-text-secondary max-w-xs mx-auto">
        {location
          ? `No ${category !== "All" ? category.toLowerCase() + " " : ""}items within ${radius}km. Try expanding the radius or changing the category.`
          : "Enable location access or try a wider radius."}
      </p>
    </div>
  );
});

EmptyState.displayName = "EmptyState";

/* Memoised error state */
const ErrorState = memo(function ErrorState({ message, onRetry }) {
  return (
    <div className="card-padded text-center py-16">
      <div className="w-20 h-20 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-4xl mx-auto mb-5">
        ⚠️
      </div>
      <h3 className="heading-md text-text-primary mb-2">Something went wrong</h3>
      <p className="body-sm text-text-secondary max-w-xs mx-auto mb-5">{message}</p>
      <button onClick={onRetry} className="btn-primary-sm">
        Try Again
      </button>
    </div>
  );
});

ErrorState.displayName = "ErrorState";

/* Filter chips component */
const CategoryFilter = memo(function CategoryFilter({ categories, active, onChange }) {
  return (
    <div className="flex gap-2 flex-wrap" role="group" aria-label="Categories">
      {categories.map((c) => (
        <button
          key={c}
          onClick={() => onChange(c)}
          className={`px-3 py-1.5 rounded-full border transition-all duration-200 text-sm font-medium ${
            active === c
              ? "bg-green-500 border-green-500 text-background-primary shadow-[0_4px_20px_rgba(34,197,94,0.25)]"
              : "border-border-default text-text-secondary hover:border-green-500/30 hover:text-green-400"
          }`}
        >
          {c}
        </button>
      ))}
    </div>
  );
});

CategoryFilter.displayName = "CategoryFilter";

export default function NearbyProducts() {
  const { updateUser } = useContext(AuthContext);
  const { location, error: locError, loading: locLoading, refetch } = useLocation();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [category, setCategory] = useState("All");
  const [radius, setRadius] = useState(10);
  const [sortBy, setSortBy] = useState("distance");
  const [locationSaved, setLocationSaved] = useState(false);
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  /* Save location once */
  useEffect(() => {
    if (location && !locationSaved) {
      API.put("/users/location", location)
        .then((res) => {
          updateUser(res.data);
          setLocationSaved(true);
        })
        .catch(() => {});
  }, [location, locationSaved, updateUser]);

  /* Fetch products */
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

  /* Filter & Sort - derived state via useMemo */
  const filtered = useMemo(() => {
    let result = [...products];

    if (category !== "All") {
      result = result.filter((p) => p.category === category);
    }
    if (search.trim()) {
      result = result.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
    }

    // Sort
    switch (sortBy) {
      case "distance":
        result.sort((a, b) => (a.distance || 0) - (b.distance || 0));
        break;
      case "priceHourAsc":
        result.sort((a, b) => a.priceHour - b.priceHour);
        break;
      case "priceHourDesc":
        result.sort((a, b) => b.priceHour - a.priceHour);
        break;
      case "priceDayAsc":
        result.sort((a, b) => a.priceDay - b.priceDay);
        break;
      case "priceDayDesc":
        result.sort((a, b) => b.priceDay - a.priceDay);
        break;
      case "newest":
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "trust":
        result.sort((a, b) => (b.owner?.likelihoodPoints || 0) - (a.owner?.likelihoodPoints || 0));
        break;
    }

    return result;
  }, [products, category, search, sortBy]);

  return (
    <div className="min-h-screen bg-background-primary pt-20 pb-16 px-4">
      <div className="container">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="heading-xl font-extrabold text-text-primary mb-2">
                Nearby <span className="text-gradient-brand">Rentals</span>
              </h1>
              <p className="body-sm text-text-secondary">
                {location
                  ? `Showing items within ${radius}km of your location`
                  : "Detecting your location…"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="btn-secondary-sm hidden sm:flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filters
              </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="btn-secondary-sm sm:hidden w-full"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filters
              </button>
            </div>
          </div>

          {/* Location alerts */}
          {locError && (
            <div className="mb-6 p-4 rounded-xl bg-warning-bg border border-warning-border text-warning-light text-sm flex items-center justify-between animate-slide-down" role="alert">
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {locError} — showing all products
              </span>
              <button onClick={refetch} className="text-sm underline hover:text-warning transition-colors flex-shrink-0">
                Retry
              </button>
            </div>
          )}

          {locLoading && (
            <div className="mb-6 p-4 rounded-xl glass flex items-center gap-3 text-text-secondary text-sm animate-slide-down">
              <Loader size="sm" />
              <span>Getting your location…</span>
            </div>
          )}

          {/* Search & Filters */}
          <div className="card-padded animate-slide-down">
            {/* Search */}
            <div className="relative mb-5">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary text-sm pointer-events-none" aria-hidden="true">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search items by name…"
                className="input pl-12"
                aria-label="Search items"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary transition-colors text-sm"
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Filters row */}
            <div className={`flex flex-col sm:flex-row gap-4 ${showFilters ? "opacity-100 max-h-96" : "opacity-0 max-h-0 overflow-hidden pointer-events-none sm:opacity-100 sm:max-h-none sm:pointer-events-auto"} transition-all duration-300`}>
              <div className="flex-1 min-w-0">
                <CategoryFilter
                  categories={CATEGORIES}
                  active={category}
                  onChange={setCategory}
                />
              </div>

              <div className="flex items-center gap-2 flex-wrap shrink-0">
                <span className="text-caption text-text-tertiary hidden sm:inline">Radius:</span>
                <Select
                  value={radius}
                  onChange={(e) => setRadius(Number(e.target.value))}
                  options={RADIUS_OPTIONS.map((r) => ({ value: r, label: `${r}km` }))}
                  className="w-28 sm:w-32"
                />
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  options={SORT_OPTIONS}
                  className="w-48 sm:w-56"
                />
              </div>
            </div>

            {/* Active filters indicator */}
            {(category !== "All" || search) && (
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border-subtle animate-slide-down">
                <span className="text-caption text-text-tertiary">Active filters:</span>
                {category !== "All" && (
                  <span className="badge badge-primary flex items-center gap-1">
                    {category}
                    <button onClick={() => setCategory("All")} className="ml-1 hover:text-text-primary" aria-label="Remove category filter">✕</button>
                  </span>
                )}
                {search && (
                  <span className="badge badge-primary flex items-center gap-1">
                    "{search}"
                    <button onClick={() => setSearch("")} className="ml-1 hover:text-text-primary" aria-label="Remove search filter">✕</button>
                  </span>
                )}
                <button onClick={() => { setCategory("All"); setSearch(""); }} className="text-caption text-green-400 hover:text-green-300 font-medium">Clear all</button>
              </div>
            )}

            {/* Content */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : error ? (
              <ErrorState message={error} onRetry={() => window.location.reload()} />
            ) : filtered.length === 0 ? (
              <EmptyState location={location} category={category} radius={radius} />
            ) : (
              <>
                <p className="text-caption text-text-tertiary mb-5">
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
      </div>
    </div>
  );
}