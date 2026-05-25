import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { addProduct } from "../services/productService";
import useLocation from "../hooks/useLocation";
import Loader from "../components/Loader";
import { AuthContext } from "../context/AuthContext";

const CATEGORIES = ["Electronics", "Vehicles", "Tools", "Sports", "Furniture", "Clothing", "Books", "Other"];

export default function AddProduct() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { location } = useLocation();

  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "Other",
    priceHour: "",
    priceDay: "",
  });
  const [images, setImages]     = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImages = (e) => {
    const files = Array.from(e.target.files).slice(0, 5);
    setImages(files);
    setPreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.priceHour || !form.priceDay) {
      setError("Name and both prices are required");
      return;
    }

    const lat = location?.lat || user?.location?.lat;
    const lng = location?.lng || user?.location?.lng;

    if (!lat || !lng) {
      setError("Location is required. Please enable location access.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      formData.append("lat", lat);
      formData.append("lng", lng);
      images.forEach((img) => formData.append("images", img));
      await addProduct(formData);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-20 pb-16 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            List a <span className="gradient-text">Product</span>
          </h1>
          <p className="text-slate-500 text-sm">Share your idle items and start earning</p>
        </div>

        <div className="glass-elevated rounded-3xl p-8">
          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Name */}
            <div>
              <label className="text-xs text-slate-400 font-medium mb-1.5 block">
                Product Name <span className="text-red-400">*</span>
              </label>
              <input
                name="name"
                placeholder="e.g. Sony Camera, Mountain Bike"
                value={form.name}
                onChange={handleChange}
                className="input-dark"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-xs text-slate-400 font-medium mb-1.5 block">Description</label>
              <textarea
                name="description"
                placeholder="Describe your item — condition, features, what's included…"
                value={form.description}
                onChange={handleChange}
                rows={3}
                className="input-dark resize-none"
              />
            </div>

            {/* Category */}
            <div>
              <label className="text-xs text-slate-400 font-medium mb-1.5 block">Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="input-dark"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} className="bg-[#111]">{c}</option>
                ))}
              </select>
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 font-medium mb-1.5 block">
                  Price per Hour (₹) <span className="text-red-400">*</span>
                </label>
                <input
                  name="priceHour"
                  type="number"
                  min="1"
                  step="1"
                  placeholder="e.g. 50"
                  value={form.priceHour}
                  onChange={handleChange}
                  className="input-dark"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 font-medium mb-1.5 block">
                  Price per Day (₹) <span className="text-red-400">*</span>
                </label>
                <input
                  name="priceDay"
                  type="number"
                  min="1"
                  step="1"
                  placeholder="e.g. 300"
                  value={form.priceDay}
                  onChange={handleChange}
                  className="input-dark"
                  required
                />
              </div>
            </div>

            {/* Images */}
            <div>
              <label className="text-xs text-slate-400 font-medium mb-1.5 block">
                Product Images <span className="text-slate-600">(up to 5)</span>
              </label>
              <label className="flex flex-col items-center justify-center h-28 rounded-xl border-2 border-dashed border-white/10 hover:border-green-500/30 cursor-pointer transition-all hover:bg-green-500/3 group">
                <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">📸</span>
                <span className="text-xs text-slate-500 group-hover:text-slate-400 transition-colors">
                  Click to upload images
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImages}
                  className="hidden"
                />
              </label>
              {previews.length > 0 && (
                <div className="flex gap-2 mt-3 flex-wrap">
                  {previews.map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt={`Preview ${i + 1}`}
                      className="w-16 h-16 rounded-lg object-cover border border-white/10"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Location Status */}
            <div className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs transition-colors ${
              location ? "bg-green-500/5 border-green-500/15 text-green-400" : "bg-white/3 border-white/5 text-slate-500"
            }`}>
              <span>{location ? "📍" : "⏳"}</span>
              <span>
                {location
                  ? `Location detected: ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`
                  : user?.location?.lat
                  ? "Using saved location"
                  : "Waiting for location…"}
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary py-4 rounded-xl text-sm font-bold mt-2 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <><Loader size="sm" /> Publishing…</>
              ) : (
                "📦 Publish Listing"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
