import React from 'react';
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Loader from "./Loader";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen bg-background-primary flex items-center justify-center" role="status" aria-label="Authenticating">
        <Loader size="lg" text="Authenticating…" />
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
}