import { createContext, useState, useCallback, useContext, type ReactNode, type Context } from 'react';
import { productApi } from '../services/api.ts';
import { useAuth } from './AuthContext';
import type { Product } from '../types';

interface UserContextType {
  myProducts: Product[];
  loadingProducts: boolean;
  fetchMyProducts: () => Promise<void>;
}

const UserContext: Context<UserContextType | undefined> = createContext<UserContextType | undefined>(undefined);

export const useUserContext = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUserContext must be used within UserProvider');
  return ctx;
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [myProducts, setMyProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const fetchMyProducts = useCallback(async () => {
    if (!user) return;
    setLoadingProducts(true);
    try {
      const res = await productApi.getMine();
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

export { UserContext };