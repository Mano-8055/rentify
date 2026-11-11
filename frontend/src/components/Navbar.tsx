import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useRef, useEffect, useCallback, memo, type ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';
import { BACKEND_URL } from '../services/api';

const NAV_LINKS_PUBLIC = [
  { to: '/', label: 'Home' },
  { to: '/nearby', label: 'Browse' },
];

const NAV_LINKS_AUTH = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/add-product', label: 'List Item' },
  { to: '/rent-history', label: 'History' },
];

interface NavLinkProps {
  to: string;
  children: ReactNode;
  isActive: boolean;
}

const NavLink = memo(function NavLink({ to, children, isActive }: NavLinkProps) {
  return (
    <div className="relative flex flex-col items-center">
      <Link
        to={to}
        className={`text-sm font-medium transition-colors duration-200 ${
          isActive ? 'text-green-400' : 'text-text-secondary hover:text-text-primary'
        }`}
      >
        {children}
      </Link>
      {isActive && (
        <span className="absolute -bottom-[14px] left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_6px_rgba(34,197,94,0.8)]" aria-hidden="true" />
      )}
    </div>
  );
});

NavLink.displayName = 'NavLink';

interface UserAvatarProps {
  src?: string;
  name?: string;
  verified?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const UserAvatar = memo(function UserAvatar({ src, name, verified, size = 'md' }: UserAvatarProps) {
  const sizes = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-8 h-8 text-xs',
    lg: 'w-10 h-10 text-sm',
    xl: 'w-12 h-12 text-base',
  };

  return (
    <div className="relative">
      <div className={`${sizes[size]} rounded-full bg-green-500/15 border border-green-500/25 overflow-hidden flex items-center justify-center transition-all group-hover:border-green-500/50`}>
        {src ? (
          <img src={`${BACKEND_URL}${src}`} alt="" className="w-full h-full object-cover" />
        ) : (
          <span className="text-green-400 font-bold">{name?.charAt(0).toUpperCase()}</span>
        )}
      </div>
      {verified && (
        <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-[10px] text-white shadow-[0_0_0_2px_var(--color-background-primary)]">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2 .9 2 2v1h3.5c.9 0 1.65.58 1.9 1.39.26.82.26 1.79 0 2.6L14 19.05l4.9 1.35c.26.07.52.07.78 0l1.47-1.47c.26-.26.26-.68 0-.94L17.9 15.39z" />
          </svg>
        </span>
      )}
    </div>
  );
});

UserAvatar.displayName = 'UserAvatar';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);

  const handleLogout = useCallback(() => {
    logout();
    navigate('/login');
    setMenuOpen(false);
    setProfileOpen(false);
  }, [logout, navigate]);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    setProfileOpen(false);
  }, []);

  const toggleProfile = useCallback(() => {
    setProfileOpen((prev) => !prev);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on escape
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        closeMenu();
      }
    }
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [closeMenu]);

  const allLinks = [
    ...NAV_LINKS_PUBLIC,
    ...(user ? NAV_LINKS_AUTH : []),
    ...(user ? [{ to: '/profile', label: 'Profile' }] : []),
  ];

  return (
    <nav
      ref={menuRef}
      className={`fixed top-0 left-0 right-0 z-50 border-b border-border-subtle bg-background-primary/80 backdrop-blur-xl transition-all duration-300 ${
        scrolled ? 'shadow-card' : ''
      }`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container py-3.5 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-xl font-extrabold text-gradient-brand tracking-tight select-none flex items-center gap-2" aria-label="Rentify Home">
          <span className="w-8 h-8 rounded-xl bg-gradient-brand flex items-center justify-center text-white font-black text-sm">
            R
          </span>
          Rentify
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-8">
          {NAV_LINKS_PUBLIC.map((l) => (
            <NavLink key={l.to} to={l.to} isActive={isActive(l.to)}>{l.label}</NavLink>
          ))}
          {user && NAV_LINKS_AUTH.map((l) => (
            <NavLink key={l.to} to={l.to} isActive={isActive(l.to)}>{l.label}</NavLink>
          ))}
        </div>

        {/* Desktop Auth / User Menu */}
        <div className="hidden lg:flex items-center gap-3">
          {!user ? (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors px-3 py-2 rounded-lg"
              >
                Sign In
              </Link>
              <Link to="/register" className="btn-primary-sm">
                Get Started
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-2">
              {/* Profile Dropdown */}
              <div ref={profileRef} className="relative">
                <button
                  onClick={toggleProfile}
                  className="flex items-center gap-2.5 group p-1.5 rounded-xl hover:bg-white/5 transition-colors"
                  aria-expanded={profileOpen}
                  aria-haspopup="true"
                  aria-label="User menu"
                >
                  <UserAvatar
                    src={user.profileImage}
                    name={user.name}
                    verified={user.isVerified}
                    size="md"
                  />
                  <span className="text-sm font-medium text-text-primary hidden sm:block">
                    {user.name?.split(' ')[0]}
                  </span>
                  <svg className="w-4 h-4 text-text-tertiary transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {profileOpen && (
                  <div
                    className="absolute right-0 top-full mt-2 w-56 glass-elevated rounded-2xl shadow-card-elevated border border-border-default py-2 animate-slide-down z-50"
                    role="menu"
                  >
                    <Link
                      to="/profile"
                      onClick={closeMenu}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors"
                      role="menuitem"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Profile
                    </Link>
                    <Link
                      to="/dashboard"
                      onClick={closeMenu}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors"
                      role="menuitem"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                      Dashboard
                    </Link>
                    <div className="divider my-2" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-error-light hover:text-error hover:bg-red-500/10 transition-colors text-left"
                      role="menuitem"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="lg:hidden text-text-secondary hover:text-text-primary p-2 rounded-lg hover:bg-white/5 transition-colors"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          <div className="w-6 flex flex-col gap-1.5">
            <span className={`block h-0.5 rounded-full bg-current transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[5.5px]' : ''}`} aria-hidden="true" />
            <span className={`block h-0.5 rounded-full bg-current transition-all duration-300 ${menuOpen ? 'opacity-0 scale-x-0' : ''}`} aria-hidden="true" />
            <span className={`block h-0.5 rounded-full bg-current transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[5.5px]' : ''}`} aria-hidden="true" />
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          id="mobile-menu"
          className="lg:hidden glass-elevated border-t border-border-subtle px-4 py-5 flex flex-col gap-1 animate-slide-down"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile menu"
        >
          {allLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={closeMenu}
              className={`py-3 px-3 rounded-xl text-sm font-medium transition-colors ${
                isActive(link.to)
                  ? 'text-green-400 bg-green-500/8'
                  : 'text-text-secondary hover:text-text-primary hover:bg-white/4'
              }`}
            >
              {link.label}
            </Link>
          ))}

          <div className="divider my-3" />

          {!user ? (
            <div className="flex flex-col gap-2 pt-1">
              <Link
                to="/login"
                onClick={closeMenu}
                className="text-center py-3 text-text-secondary hover:text-text-primary transition-colors text-sm font-medium rounded-xl hover:bg-white/4"
              >
                Sign In
              </Link>
              <Link to="/register" onClick={closeMenu} className="text-center py-3 btn-primary-sm">
                Get Started
              </Link>
            </div>
          ) : (
            <button
              onClick={handleLogout}
              className="text-left py-3 px-3 text-sm text-error-light hover:text-error hover:bg-red-500/10 transition-colors rounded-xl"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}