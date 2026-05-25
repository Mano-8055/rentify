import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext, useState, useCallback } from "react";
import { AuthContext } from "../context/AuthContext";
import { BACKEND_URL } from "../services/api";

const NAV_LINKS_PUBLIC = [
  { to: "/",       label: "Home" },
  { to: "/nearby", label: "Nearby" },
];

const NAV_LINKS_AUTH = [
  { to: "/dashboard",    label: "Dashboard" },
  { to: "/add-product",  label: "List Item" },
  { to: "/rent-history", label: "History" },
];

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = useCallback(() => {
    logout();
    navigate("/login");
    setMenuOpen(false);
  }, [logout, navigate]);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const isActive = (path) => location.pathname === path;

  const NavLink = ({ to, children }) => (
    <div className="relative flex flex-col items-center">
      <Link
        to={to}
        className={`text-sm font-medium transition-colors duration-200 hover:text-green-400 ${
          isActive(to) ? "text-green-400" : "text-slate-400"
        }`}
      >
        {children}
      </Link>
      {isActive(to) && (
        <span className="absolute -bottom-[14px] w-1 h-1 rounded-full bg-green-400 shadow-[0_0_6px_rgba(34,197,94,0.8)]" />
      )}
    </div>
  );

  const allLinks = [
    ...NAV_LINKS_PUBLIC,
    ...(user ? NAV_LINKS_AUTH : []),
    ...(user ? [{ to: "/profile", label: "Profile" }] : []),
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0a0a0a]/85 backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">

        {/* Logo */}
        <Link to="/" className="text-xl font-black gradient-text tracking-tight select-none">
          Rentify
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-7">
          {NAV_LINKS_PUBLIC.map((l) => (
            <NavLink key={l.to} to={l.to}>{l.label}</NavLink>
          ))}
          {user && NAV_LINKS_AUTH.map((l) => (
            <NavLink key={l.to} to={l.to}>{l.label}</NavLink>
          ))}
        </div>

        {/* Desktop Auth */}
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
                <div className="w-8 h-8 rounded-full bg-green-500/20 border border-green-500/30 overflow-hidden flex items-center justify-center transition-all group-hover:border-green-500/60 group-hover:shadow-[0_0_12px_rgba(34,197,94,0.3)]">
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
                className="text-xs px-4 py-2 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 hover:border-red-500/35 transition-all"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-all"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <div className="w-5 flex flex-col gap-[5px]">
            <span className={`block h-0.5 bg-current rounded-full transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
            <span className={`block h-0.5 bg-current rounded-full transition-all duration-300 ${menuOpen ? "opacity-0 scale-x-0" : ""}`} />
            <span className={`block h-0.5 bg-current rounded-full transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden glass-elevated border-t border-white/5 px-4 py-5 flex flex-col gap-1 animate-slide-down">
          {allLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={closeMenu}
              className={`py-2.5 px-3 rounded-xl text-sm font-medium transition-all ${
                isActive(link.to)
                  ? "text-green-400 bg-green-500/8"
                  : "text-slate-300 hover:text-green-400 hover:bg-white/4"
              }`}
            >
              {link.label}
            </Link>
          ))}

          <div className="section-divider my-2" />

          {!user ? (
            <div className="flex gap-3 pt-1">
              <Link
                to="/login"
                onClick={closeMenu}
                className="flex-1 text-center py-2.5 text-slate-300 hover:text-white transition-colors text-sm font-medium rounded-xl hover:bg-white/4"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={closeMenu}
                className="flex-1 text-center py-2.5 btn-primary rounded-xl text-sm"
              >
                Get Started
              </Link>
            </div>
          ) : (
            <button
              onClick={handleLogout}
              className="text-sm text-red-400 hover:text-red-300 py-2.5 px-3 rounded-xl hover:bg-red-500/8 transition-all text-left"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
