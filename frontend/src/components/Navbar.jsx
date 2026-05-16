import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { BACKEND_URL } from "../services/api";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const navLink =
    "text-sm font-medium transition-all duration-200 hover:text-green-400";
  const activeLink = "text-green-400";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="text-xl font-black gradient-text tracking-tight"
        >
          Rentify
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className={`${navLink} ${isActive("/") ? activeLink : "text-slate-400"}`}
          >
            Home
          </Link>
          <Link
            to="/nearby"
            className={`${navLink} ${isActive("/nearby") ? activeLink : "text-slate-400"}`}
          >
            Nearby
          </Link>
          {user && (
            <>
              <Link
                to="/dashboard"
                className={`${navLink} ${isActive("/dashboard") ? activeLink : "text-slate-400"}`}
              >
                Dashboard
              </Link>
              <Link
                to="/add-product"
                className={`${navLink} ${isActive("/add-product") ? activeLink : "text-slate-400"}`}
              >
                List Item
              </Link>
              <Link
                to="/rent-history"
                className={`${navLink} ${isActive("/rent-history") ? activeLink : "text-slate-400"}`}
              >
                History
              </Link>
            </>
          )}
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {!user ? (
            <>
              <Link
                to="/login"
                className="text-sm text-slate-400 hover:text-white transition-colors font-medium"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="btn-primary px-5 py-2 rounded-xl text-sm"
              >
                Get Started
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/profile" className="flex items-center gap-2 group">
                <div className="w-8 h-8 rounded-full bg-green-500/20 border border-green-500/30 overflow-hidden flex items-center justify-center">
                  {user.profileImage ? (
                    <img
                      src={`${BACKEND_URL}${user.profileImage}`}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-green-400 text-xs font-bold">
                      {user.name?.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
                  {user.name?.split(" ")[0]}
                </span>
              </Link>
              <button
                onClick={handleLogout}
                className="text-xs px-4 py-2 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-all"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-slate-400 hover:text-white p-1"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <div className="w-6 flex flex-col gap-1.5">
            <span
              className={`block h-0.5 bg-current transition-all ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
            />
            <span
              className={`block h-0.5 bg-current transition-all ${menuOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`block h-0.5 bg-current transition-all ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
            />
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden glass border-t border-white/5 px-4 py-4 flex flex-col gap-3">
          {[
            { to: "/", label: "Home" },
            { to: "/nearby", label: "Nearby" },
            ...(user
              ? [
                  { to: "/dashboard", label: "Dashboard" },
                  { to: "/add-product", label: "List Item" },
                  { to: "/rent-history", label: "History" },
                  { to: "/profile", label: "Profile" },
                ]
              : []),
          ].map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className="text-slate-300 hover:text-green-400 transition-colors py-1"
            >
              {link.label}
            </Link>
          ))}
          {!user ? (
            <div className="flex gap-3 pt-2 border-t border-white/5">
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="flex-1 text-center py-2 text-slate-300 hover:text-white transition-colors text-sm"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="flex-1 text-center py-2 btn-primary rounded-lg text-sm"
              >
                Get Started
              </Link>
            </div>
          ) : (
            <button
              onClick={handleLogout}
              className="text-sm text-red-400 hover:text-red-300 pt-2 border-t border-white/5 text-left"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
