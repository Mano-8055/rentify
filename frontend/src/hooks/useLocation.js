/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useRef } from "react";

export default function useLocation() {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const mountedRef = useRef(false);

  const fetchLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (mountedRef.current) {
          setLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
          setLoading(false);
        }
      },
      (err) => {
        if (mountedRef.current) {
          setError(err.message);
          setLoading(false);
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  useEffect(() => {
    mountedRef.current = true;
    fetchLocation();
    return () => { mountedRef.current = false; };
  }, []);

  return { location, error, loading, refetch: fetchLocation };
}