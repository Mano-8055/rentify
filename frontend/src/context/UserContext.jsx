import { createContext, useState, useCallback, useContext } from "react";
import API from "../services/api";
import { AuthContext } from "./AuthContext";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [myProducts, setMyProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const fetchMyProducts = useCallback(async () => {
    if (!user) return;
    setLoadingProducts(true);
    try {
      const res = await API.get("/products/mine");
      setMyProducts(res.data);
    } catch {
      setMyProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ myProducts, fetchMyProducts, loadingProducts }}>
      {children}
    </UserContext.Provider>
  );
};
