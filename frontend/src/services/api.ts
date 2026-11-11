import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import type { ApiResponse, PaginatedResponse, User, Product, Rental, Review, CreateProductData, CreateRentalData, UpdateProductData, LoginCredentials, RegisterData } from '../types';

const API: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
});

API.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (res: AxiosResponse) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';

/* Typed API helpers */
export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    API.get<ApiResponse<T>>(url, config).then((r) => r.data),

  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    API.post<ApiResponse<T>>(url, data, config).then((r) => r.data),

  put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    API.put<ApiResponse<T>>(url, data, config).then((r) => r.data),

  patch: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    API.patch<ApiResponse<T>>(url, data, config).then((r) => r.data),

  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    API.delete<ApiResponse<T>>(url, config).then((r) => r.data),
};

/* Auth */
export const authApi = {
  login: (credentials: LoginCredentials) =>
    api.post<{ user: User; token: string }>('/auth/login', credentials),

  register: (data: RegisterData) =>
    api.post<{ user: User; token: string }>('/auth/register', data),

  me: () => api.get<User>('/auth/me'),

  updateProfile: (data: Partial<User>) =>
    api.put<User>('/auth/profile', data),

  uploadId: (formData: FormData) =>
    api.post<{ user: User }>('/auth/upload-id', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

/* Products */
export const productApi = {
  getAll: (params?: Record<string, unknown>) =>
    api.get<PaginatedResponse<Product>>('/products', { params }),

  getNearby: (params: { lng: number; lat: number; radius?: number; category?: string }) =>
    api.get<PaginatedResponse<Product>>('/products/nearby', { params }),

  getMine: () => api.get<Product[]>('/products/mine'),

  getById: (id: string) => api.get<Product>(`/products/${id}`),

  create: (data: CreateProductData) =>
    api.post<Product>('/products', data),

  update: (id: string, data: UpdateProductData) =>
    api.put<Product>(`/products/${id}`, data),

  delete: (id: string) => api.delete<void>(`/products/${id}`),

  uploadImages: (id: string, formData: FormData) =>
    api.post<{ images: string[] }>(`/products/${id}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  deleteImage: (id: string, imageUrl: string) =>
    api.delete<void>(`/products/${id}/images`, { data: { imageUrl } }),
};

/* Rentals */
export const rentalApi = {
  getMyRentals: (params?: { status?: string }) =>
    api.get<PaginatedResponse<Rental>>('/rentals/mine', { params }),

  getAsOwner: (params?: { status?: string }) =>
    api.get<PaginatedResponse<Rental>>('/rentals/owner', { params }),

  getById: (id: string) => api.get<Rental>(`/rentals/${id}`),

  create: (data: CreateRentalData) =>
    api.post<Rental>('/rentals', data),

  updateStatus: (id: string, status: Rental['status']) =>
    api.patch<Rental>(`/rentals/${id}/status`, { status }),

  cancel: (id: string) => api.post<void>(`/rentals/${id}/cancel`),
};

/* Reviews */
export const reviewApi = {
  create: (rentalId: string, data: { rating: number; comment?: string }) =>
    api.post<Review>(`/reviews/${rentalId}`, data),
};

export default API;