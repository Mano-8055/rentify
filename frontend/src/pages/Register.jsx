import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { registerUser } from "../services/authService";
import Loader from "../components/Loader";

export default function Register() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.email || !form.password) {
      setError("All fields are required");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords do not match");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      const data = await registerUser({
        name: form.name,
        email: form.email,
        password: form.password,
      });
      login(data);
      navigate("/nearby");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] grid-bg flex items-center justify-center px-4 pt-16">
      <div className="w-full max-w-md">
        <div className="glass rounded-3xl p-8">
          <div className="text-center mb-8">
            <Link to="/" className="text-2xl font-black gradient-text">
              Rentify
            </Link>
            <h1 className="text-2xl font-bold text-white mt-4">Create account</h1>
            <p className="text-slate-500 text-sm mt-1">
              Join thousands renting and earning locally
            </p>
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-xs text-slate-400 font-medium mb-1.5 block">
                Full Name
              </label>
              <input
                name="name"
                type="text"
                placeholder="John Doe"
                value={form.name}
                onChange={handleChange}
                className="input-dark"
                required
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 font-medium mb-1.5 block">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                className="input-dark"
                required
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 font-medium mb-1.5 block">
                Password
              </label>
              <input
                name="password"
                type="password"
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={handleChange}
                className="input-dark"
                required
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 font-medium mb-1.5 block">
                Confirm Password
              </label>
              <input
                name="confirm"
                type="password"
                placeholder="Re-enter password"
                value={form.confirm}
                onChange={handleChange}
                className="input-dark"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary py-3.5 rounded-xl text-sm mt-2 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? <Loader size="sm" /> : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-green-400 hover:text-green-300 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
