import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense, type ComponentType } from 'react';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Loader from './components/Loader';
import ProtectedRoute from './components/ProtectedRoute';

/* ── Lazy-loaded pages (code splitting) ── */
const Home = lazy(() => import('./pages/Home').then((m) => ({ default: m.default as ComponentType })));
const Login = lazy(() => import('./pages/Login').then((m) => ({ default: m.default as ComponentType })));
const Register = lazy(() => import('./pages/Register').then((m) => ({ default: m.default as ComponentType })));
const NearbyProducts = lazy(() => import('./pages/NearbyProducts').then((m) => ({ default: m.default as ComponentType })));
const AddProduct = lazy(() => import('./pages/AddProduct').then((m) => ({ default: m.default as ComponentType })));
const Profile = lazy(() => import('./pages/Profile').then((m) => ({ default: m.default as ComponentType })));
const Dashboard = lazy(() => import('./pages/Dashboard').then((m) => ({ default: m.default as ComponentType })));
const RentHistory = lazy(() => import('./pages/RentHistory').then((m) => ({ default: m.default as ComponentType })));
const ProductDetails = lazy(() => import('./pages/ProductDetails').then((m) => ({ default: m.default as ComponentType })));

/* Fallback shown while a lazy page chunk loads */
function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Loader size="lg" />
    </div>
  );
}

export default function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background-primary flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/products/:id" element={<ProductDetails />} />

            <Route path="/nearby" element={
              <ProtectedRoute><NearbyProducts /></ProtectedRoute>
            } />
            <Route path="/add-product" element={
              <ProtectedRoute><AddProduct /></ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute><Profile /></ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute><Dashboard /></ProtectedRoute>
            } />
            <Route path="/rent-history" element={
              <ProtectedRoute><RentHistory /></ProtectedRoute>
            } />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}