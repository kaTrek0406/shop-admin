// Типы для всего приложения

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  role: 'customer' | 'admin';
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  is_active: boolean;
  products_count?: number;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  category: number | Category;
  category_name?: string;
  material: string;
  material_display: string;
  gemstone: string;
  gemstone_display: string;
  price: string;
  weight?: string;
  size?: string;
  stock: number;
  in_stock: boolean;
  is_active: boolean;
  is_featured: boolean;
  is_new: boolean;
  main_image?: string;
  images?: ProductImage[];
  views_count?: number;
}

export interface ProductImage {
  id: number;
  image: string;
  alt_text: string;
  is_main: boolean;
  order: number;
}

export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
  total_price: string;
}

export interface Cart {
  id: number;
  items: CartItem[];
  total_price: string;
  total_items: number;
}

export interface OrderItem {
  id: number;
  product: number;
  product_name: string;
  product_price: string;
  quantity: number;
  total_price: string;
}

export interface Order {
  id: number;
  order_number: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postal_code: string;
  total_price: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  status_display: string;
  payment_method: 'cash' | 'card' | 'online';
  payment_method_display: string;
  is_paid: boolean;
  notes?: string;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  password_confirm: string;
  first_name: string;
  last_name: string;
  phone?: string;
}
