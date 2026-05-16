import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { loginUser } from "../services/authService";
import Loader from "../components/Loader";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password) {
      setError("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      const data = await loginUser(form);
      login(data);
      navigate("/nearby");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] grid-bg flex items-center justify-center px-4 pt-16">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="glass rounded-3xl p-8">
          <div className="text-center mb-8">
            <Link to="/" className="text-2xl font-black gradient-text">
              Rentify
            </Link>
            <h1 className="text-2xl font-bold text-white mt-4">Welcome back</h1>
            <p className="text-slate-500 text-sm mt-1">
              Sign in to your account to continue
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
                placeholder="••••••••"
                value={form.password}
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
              {loading ? <Loader size="sm" /> : "Sign In"}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-green-400 hover:text-green-300 font-medium">
              Create one free
            </Link>
          </p>
        </div>

        {/* Demo hint */}
        <p className="text-center text-xs text-slate-700 mt-4">
          By signing in, you agree to our Terms and Privacy Policy
        </p>
      </div>
    </div>
  );
}
