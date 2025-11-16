import axios from 'axios';
import type { Product, Category, Cart, Order, AuthTokens, LoginCredentials, RegisterData, User } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Добавляем токен ко всем запросам
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: (credentials: LoginCredentials) =>
    api.post<AuthTokens>('/users/login/', credentials),

  register: (data: RegisterData) =>
    api.post('/users/register/', data),

  getProfile: () =>
    api.get<User>('/users/profile/'),

  updateProfile: (data: Partial<User>) =>
    api.patch<User>('/users/profile/', data),
};

// Products API
export const productsAPI = {
  getAll: (params?: any) =>
    api.get<{ results: Product[]; count: number }>('/products/', { params }),

  getBySlug: (slug: string) =>
    api.get<Product>(`/products/${slug}/`),

  getFeatured: () =>
    api.get<Product[]>('/products/featured/'),

  getNew: () =>
    api.get<Product[]>('/products/new/'),
};

// Categories API
export const categoriesAPI = {
  getAll: () =>
    api.get<Category[]>('/products/categories/'),
};

// Cart API
export const cartAPI = {
  get: () =>
    api.get<Cart>('/cart/'),

  addItem: (product_id: number, quantity: number = 1) =>
    api.post('/cart/add_item/', { product_id, quantity }),

  updateItem: (item_id: number, quantity: number) =>
    api.patch('/cart/update_item/', { item_id, quantity }),

  removeItem: (item_id: number) =>
    api.delete('/cart/remove_item/', { data: { item_id } }),

  clear: () =>
    api.delete('/cart/clear/'),
};

// Orders API
export const ordersAPI = {
  getAll: () =>
    api.get<Order[]>('/orders/'),

  getById: (id: number) =>
    api.get<Order>(`/orders/${id}/`),

  create: (data: any) =>
    api.post<Order>('/orders/', data),

  cancel: (id: number) =>
    api.post(`/orders/${id}/cancel/`),

  updateStatus: (id: number, status: string) =>
    api.patch(`/orders/${id}/update_status/`, { status }),
};

export default api;
