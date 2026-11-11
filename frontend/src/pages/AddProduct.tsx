import React from 'react';
import { useState, useContext, useEffect, useRef, memo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { addProduct } from "../services/productService";
import useLocation from "../hooks/useLocation";
import Loader from "../components/Loader";
import { AuthContext } from "../context/AuthContext";
import { Input, FileUpload, Select } from "../components/Input";

const CATEGORIES = ["Electronics", "Vehicles", "Tools", "Sports", "Furniture", "Clothing", "Books", "Other"];
const CONDITIONS = ["Like New", "Good", "Fair", "Worn"];

const CONDITION_INFO = {
  "Like New": { color: "text-green-400", bg: "bg-green-500/10 border-green-500/20", desc: "Pristine, no visible wear" },
  "Good": { color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20", desc: "Minor signs of use, fully functional" },
  "Fair": { color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20", desc: "Visible wear, works as expected" },
  "Worn": { color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/20", desc: "Heavy use, cosmetic issues only" },
};

const StepIndicator = memo(function StepIndicator({ currentStep }) {
  const steps = [
    { num: 1, label: "Details" },
    { num: 2, label: "Pricing" },
    { num: 3, label: "Images" },
    { num: 4, label: "Publish" },
  ];

  return (
    <div className="flex items-center justify-between mb-10" role="navigation" aria-label="Listing steps">
      {steps.map((step, i) => (
        <div key={step.num} className="flex items-center">
          <div className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold transition-all ${
            i < currentStep
              ? "bg-green-500 text-background-primary"
              : i === currentStep
              ? "bg-green-500/20 border-2 border-green-500 text-green-400"
              : "bg-white/5 border border-border-default text-text-tertiary"
          }`}>
            {i < currentStep ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
            ) : step.num}
          </div>
          <span className={`ml-2 text-caption font-medium ${i <= currentStep ? "text-text-primary" : "text-text-tertiary"} hidden sm:block`}>
            {step.label}
          </span>
          {i < steps.length - 1 && (
            <div className={`hidden sm:block w-16 h-0.5 mx-2 rounded transition-all ${i < currentStep ? "bg-green-500" : "bg-border-default"}`} />
          )}
        </div>
      ))}
    </div>
  );
});

StepIndicator.displayName = "StepIndicator";

const ImagePreviewGrid = memo(function ImagePreviewGrid({ previews, onRemove, uploading }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {previews.map((preview, index) => (
        <div key={index} className="relative group aspect-square rounded-xl overflow-hidden bg-surface-800">
          <img
            src={preview}
            alt={`Upload preview ${index + 1}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              onClick={() => onRemove(index)}
              disabled={uploading}
              className="w-8 h-8 rounded-full bg-red-500/90 text-white flex items-center justify-center hover:bg-red-500 transition-colors disabled:opacity-50"
              aria-label={`Remove image ${index + 1}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-black/50 text-white text-xs font-bold flex items-center justify-center">
            {index + 1}
          </div>
          {index === 0 && (
            <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-green-500/90 text-background-primary text-caption font-medium">
              Cover
            </div>
          )}
        </div>
      ))}
    </div>
  );
});

ImagePreviewGrid.displayName = "ImagePreviewGrid";

const PricingHint = memo(function PricingHint({ hourly, daily }) {
  const ratio = hourly && daily ? (daily / hourly).toFixed(1) : null;
  return (
    <div className="card p-4 border-green-500/20 bg-green-500/5">
      <div className="flex items-center gap-2 text-sm text-green-400 mb-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <span className="font-semibold">Pricing Guide</span>
      </div>
      <div className="grid grid-cols-2 gap-3 text-caption">
        <div>
          <span className="text-text-tertiary block">Hourly Rate</span>
          <span className="text-text-primary font-medium">₹{hourly || "—"}</span>
        </div>
        <div>
          <span className="text-text-tertiary block">Daily Rate</span>
          <span className="text-text-primary font-medium">₹{daily || "—"}</span>
        </div>
        {ratio && (
          <div className="col-span-2 pt-2 border-t border-border-subtle">
            <span className="text-text-tertiary block">Daily ≈ {ratio}x Hourly</span>
            <span className={`text-text-secondary font-medium ${ratio >= 6 && ratio <= 8 ? "text-green-400" : "text-amber-400"}`}>
              {ratio >= 6 && ratio <= 8 ? "✓ Good range (6-8x)" : "Consider 6-8x hourly for daily"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
});

PricingHint.displayName = "PricingHint";

const ConditionSelector = memo(function ConditionSelector({ selected, onChange }) {
  return (
    <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Condition">
      {Object.entries(CONDITION_INFO).map(([key, info]) => (
        <button
          key={key}
          type="button"
          onClick={() => onChange(key)}
          className={`p-4 rounded-xl text-center transition-all border-2 relative ${
            selected === key
              ? `border-green-500 bg-green-500/10 shadow-[0_0_0_1px_rgba(34,197,94,0.2)]`
              : "border-border-default hover:border-green-500/30"
          }`}
          aria-pressed={selected === key}
        >
          <div className="text-lg font-bold ${info.color}">{key}</div>
          <div className="text-caption text-text-tertiary mt-1">{info.desc}</div>
          {selected === key && (
            <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
            </div>
          )}
        </button>
      ))}
    </div>
  );
});

ConditionSelector.displayName = "ConditionSelector";

export default function AddProduct() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { location } = useLocation();

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "Other",
    condition: "Good",
    priceHour: "",
    priceDay: "",
  });
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImages = (e) => {
    const files = Array.from(e.target.files).slice(0, 5 - previews.length);
    if (files.length === 0) return;
    setImageUploading(true);
    const newPreviews = files.map((f) => URL.createObjectURL(f));
    setImages((prev) => [...prev, ...files]);
    setPreviews((prev) => [...prev, ...newPreviews]);
    setImageUploading(false);
  };

  const removeImage = (index) => {
    URL.revokeObjectURL(previews[index]);
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  const validateStep = () => {
    if (step === 1) {
      if (!form.name.trim()) return "Please enter a product name";
      if (!form.description.trim()) return "Please add a description";
      return null;
    }
    if (step === 2) {
      if (!form.priceHour || Number(form.priceHour) < 1) return "Hourly price must be at least ₹1";
      if (!form.priceDay || Number(form.priceDay) < 1) return "Daily price must be at least ₹1";
      return null;
    }
    if (step === 3) {
      if (previews.length === 0) return "Please add at least one image";
      return null;
    }
    return null;
  };

  const nextStep = () => {
    const err = validateStep();
    if (err) { setError(err); return; }
    setError("");
    setStep((s) => Math.min(s + 1, 4));
  };

  const prevStep = () => {
    setError("");
    setStep((s) => Math.max(s - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    const lat = location?.lat || user?.location?.lat;
    const lng = location?.lng || user?.location?.lng;

    if (!lat || !lng) {
      setError("Location is required. Please enable location access.");
      setStep(4);
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
      setSuccess(true);
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  const hourly = form.priceHour ? Number(form.priceHour) : null;
  const daily = form.priceDay ? Number(form.priceDay) : null;

  return (
    <div className="min-h-screen bg-background-primary pt-20 pb-16 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-text-tertiary hover:text-text-secondary transition-colors text-sm mb-6">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Back to Dashboard
          </Link>
          <h1 className="heading-xl font-extrabold text-text-primary mb-2">
            List a <span className="text-gradient-brand">Product</span>
          </h1>
          <p className="body-sm text-text-secondary">Share your idle items and start earning</p>
        </div>

        {/* Step Indicator */}
        <StepIndicator currentStep={step} />

        {/* Error/Success */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start gap-3 animate-slide-down" role="alert">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0-1.732-3.85-1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm flex items-center gap-3 animate-slide-down" role="status">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            <span>Listing published! Redirecting to dashboard…</span>
          </div>
        )}

        {/* Form Steps */}
        <form onSubmit={handleSubmit} className="card-padded animate-fade-in">
          {/* Step 1: Details */}
          {step === 1 && (
            <div className="flex flex-col gap-5">
              <div className="text-center mb-4">
                <div className="w-12 h-12 rounded-2xl bg-green-500/15 border border-green-500/25 flex items-center justify-center text-2xl mx-auto mb-3">📦</div>
                <h2 className="heading-md font-semibold text-text-primary">Basic Details</h2>
                <p className="text-caption text-text-tertiary mt-1">Tell renters what you're offering</p>
              </div>

              <Input
                name="name"
                label="Product Name"
                placeholder="e.g. Sony Camera, Mountain Bike, Power Drill"
                value={form.name}
                onChange={handleChange}
                required
                hint="A clear, descriptive title helps renters find your item"
              />

              <div className="form-group">
                <label htmlFor="description" className="label">Description</label>
                <textarea
                  name="description"
                  id="description"
                  placeholder="Describe your item — brand, model, age, features, what's included, any wear…"
                  value={form.description}
                  onChange={handleChange}
                  rows={5}
                  className="input resize-none"
                  required
                />
                <p className="form-hint">Include details like brand, model, age, accessories, and any wear. More details = more trust.</p>
              </div>

              <div className="form-group">
                <label className="label">Category</label>
                <Select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  options={CATEGORIES.map((c) => ({ value: c, label: c }))}
                  required
                  className="w-full"
                />
              </div>

              <div className="form-group">
                <label className="label">Condition</label>
                <ConditionSelector selected={form.condition} onChange={(c) => setForm({ ...form, condition: c })} />
              </div>

              <div className="flex justify-end pt-2">
                <button type="button" onClick={nextStep} className="btn-primary flex items-center gap-2">
                  Next: Pricing
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Pricing */}
          {step === 2 && (
            <div className="flex flex-col gap-5">
              <div className="text-center mb-4">
                <div className="w-12 h-12 rounded-2xl bg-green-500/15 border border-green-500/25 flex items-center justify-center text-2xl mx-auto mb-3">💰</div>
                <h2 className="heading-md font-semibold text-text-primary">Set Your Price</h2>
                <p className="text-caption text-text-tertiary mt-1">Competitive pricing gets more bookings</p>
              </div>

              <PricingHint hourly={hourly} daily={daily} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  name="priceHour"
                  type="number"
                  label="Price per Hour (₹)"
                  placeholder="e.g. 50"
                  value={form.priceHour}
                  onChange={handleChange}
                  required
                  min="1"
                  step="1"
                  hint="Minimum ₹1/hour — best for short-term rentals"
                />
                <Input
                  name="priceDay"
                  type="number"
                  label="Price per Day (₹)"
                  placeholder="e.g. 300"
                  value={form.priceDay}
                  onChange={handleChange}
                  required
                  min="1"
                  step="1"
                  hint="Usually 6-8x hourly rate — best for 24hr+ rentals"
                />
              </div>

              <div className="flex justify-between pt-2">
                <button type="button" onClick={prevStep} className="btn-secondary">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                  Back
                </button>
                <button type="button" onClick={nextStep} className="btn-primary flex items-center gap-2">
                  Next: Images
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Images */}
          {step === 3 && (
            <div className="flex flex-col gap-5">
              <div className="text-center mb-4">
                <div className="w-12 h-12 rounded-2xl bg-green-500/15 border border-green-500/25 flex items-center justify-center text-2xl mx-auto mb-3">📸</div>
                <h2 className="heading-md font-semibold text-text-primary">Add Photos</h2>
                <p className="text-caption text-text-tertiary mt-1">Great photos = faster rentals (max 5)</p>
              </div>

              <div className="relative">
                <FileUpload
                  label=""
                  hint=""
                  accept="image/*"
                  multiple
                  maxFiles={5}
                  onChange={handleImages}
                  disabled={imageUploading}
                  children={
                    <label className={`w-full aspect-square rounded-2xl border-2 border-dashed border-border-default flex flex-col items-center justify-center cursor-pointer transition-all ${
                      previews.length === 0 ? "hover:border-green-500/50 hover:bg-green-500/5" : "bg-surface-800"
                    }`}>
                      {previews.length === 0 ? (
                        <>
                          <svg className="w-12 h-12 text-text-tertiary group-hover:text-green-400 transition-colors mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                          <span className="body text-text-tertiary group-hover:text-text-secondary transition-colors">Click to upload images (max 5)</span>
                          <p className="text-caption text-text-tertiary mt-1">First image becomes the cover</p>
                        </>
                      ) : (
                        <ImagePreviewGrid previews={previews} onRemove={removeImage} uploading={imageUploading} />
                      )}
                      <input type="file" ref={fileInputRef} accept="image/*" multiple className="hidden" onChange={handleImages} disabled={imageUploading} />
                    </label>
                  }
                />
                {previews.length > 0 && previews.length < 5 && (
                  <button
                    type="button"
                    onClick={triggerFileInput}
                    disabled={imageUploading}
                    className="absolute bottom-4 right-4 btn-primary shadow-lg"
                    aria-label="Add more images"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  </button>
                )}
              </div>

              {previews.length > 0 && (
                <div className="text-center text-caption text-text-tertiary">
                  {previews.length}/5 images · Drag to reorder coming soon
                </div>
              )}

              <div className="flex justify-between pt-2">
                <button type="button" onClick={prevStep} className="btn-secondary">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                  Back
                </button>
                <button type="button" onClick={nextStep} className="btn-primary flex items-center gap-2">
                  Next: Publish
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Publish */}
          {step === 4 && (
            <div className="flex flex-col gap-5">
              <div className="text-center mb-4">
                <div className="w-12 h-12 rounded-2xl bg-green-500/15 border border-green-500/25 flex items-center justify-center text-2xl mx-auto mb-3">🚀</div>
                <h2 className="heading-md font-semibold text-text-primary">Review & Publish</h2>
                <p className="text-caption text-text-tertiary mt-1">Everything looks good? List it!</p>
              </div>

              {/* Summary card */}
              <div className="card border-green-500/20 bg-green-500/5 p-5">
                <h3 className="heading-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Listing Summary
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-text-tertiary">Name</span><span className="font-medium text-text-primary">{form.name || "—"}</span></div>
                  <div className="flex justify-between"><span className="text-text-tertiary">Category</span><span className="font-medium text-text-primary">{form.category}</span></div>
                  <div className="flex justify-between"><span className="text-text-tertiary">Condition</span><span className="font-medium ${CONDITION_INFO[form.condition]?.color}">{form.condition}</span></div>
                  <div className="flex justify-between"><span className="text-text-tertiary">Hourly</span><span className="font-bold text-green-400">₹{form.priceHour || "—"}</span></div>
                  <div className="flex justify-between"><span className="text-text-tertiary">Daily</span><span className="font-bold text-green-400">₹{form.priceDay || "—"}</span></div>
                  <div className="flex justify-between"><span className="text-text-tertiary">Images</span><span className="font-medium text-text-primary">{previews.length} uploaded</span></div>
                </div>
              </div>

              {/* Location Status */}
              <div className="card flex items-center gap-3 transition-colors ${location ? "bg-green-500/5 border-green-500/15" : user?.location?.lat ? "bg-amber-500/5 border-amber-500/15" : "bg-white/3 border-border-subtle"}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg">
                  {location ? (
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  ) : user?.location?.lat ? (
                    <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  ) : (
                    <Loader size="sm" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="body-sm font-medium text-text-primary">
                    {location ? "Location detected" : user?.location?.lat ? "Using saved location" : "Waiting for location…"}
                  </p>
                  <p className="text-caption text-text-tertiary mt-0.5 truncate">
                    {location ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : user?.location?.lat ? `${user.location.lat.toFixed(4)}, ${user.location.lng.toFixed(4)}` : "Please enable location access in your browser"}
                  </p>
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <button type="button" onClick={prevStep} className="btn-secondary">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading || success}
                  className="btn-primary-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader size="sm" />
                      Publishing…
                    </>
                  ) : success ? (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      Published!
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                      Publish Listing
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}