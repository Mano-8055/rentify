export interface User {
  _id: string;
  name: string;
  email: string;
  profileImage?: string;
  location?: GeoPoint;
  likelihoodPoints: number;
  isVerified: boolean;
  governmentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GeoPoint {
  type: 'Point';
  coordinates: [number, number];
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  category: ProductCategory;
  images: string[];
  priceHour: number;
  priceDay: number;
  availability: boolean;
  owner: User;
  condition?: ProductCondition;
  distance?: number;
  location: GeoPoint;
  createdAt: string;
  updatedAt: string;
}

export type ProductCondition = 'Like New' | 'Good' | 'Fair' | 'Worn';

export type ProductCategory =
  | 'electronics'
  | 'tools'
  | 'vehicles'
  | 'party'
  | 'outdoor'
  | 'sports'
  | 'cameras'
  | 'audio'
  | 'furniture'
  | 'books'
  | 'clothing'
  | 'other';

export interface Rental {
  _id: string;
  renter: User | string;
  owner: User | string;
  product: Product | string;
  startDate: string;
  endDate: string;
  rentalType: 'hour' | 'day';
  totalAmount: number;
  status: RentalStatus;
  createdAt: string;
  updatedAt: string;
}

export type RentalStatus =
  | 'pending'
  | 'accepted'
  | 'active'
  | 'returned'
  | 'completed'
  | 'rejected'
  | 'cancelled';

export interface Review {
  _id: string;
  rental: string;
  reviewer: User | string;
  reviewee: User | string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
}

export interface CreateProductData {
  name: string;
  description: string;
  category: ProductCategory;
  priceHour: number;
  priceDay: number;
  availability: boolean;
  location: GeoPoint;
}

export interface UpdateProductData extends Partial<CreateProductData> {
  imagesToDelete?: string[];
}

export interface CreateRentalData {
  product: string;
  startDate: string;
  endDate: string;
  rentalType: 'hour' | 'day';
}

export interface UpdateRentalData {
  status?: RentalStatus;
}