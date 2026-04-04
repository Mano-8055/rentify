import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-gray-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-green-400">
          Rentify
        </Link>

        {/* Links */}
        <div className="flex items-center gap-6">
          
          <Link to="/" className="hover:text-green-400 transition">
            Home
          </Link>

          <Link to="/nearby" className="hover:text-green-400 transition">
            Nearby
          </Link>

          {user && (
            <>
              <Link to="/add-product" className="hover:text-green-400 transition">
                Add Product
              </Link>

              <Link to="/profile" className="hover:text-green-400 transition">
                Profile
              </Link>
            </>
          )}

          {!user ? (
            <>
              <Link to="/login" className="hover:text-green-400 transition">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-green-500 px-4 py-1 rounded hover:bg-green-600"
              >
                Register
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-1 rounded hover:bg-red-600"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}