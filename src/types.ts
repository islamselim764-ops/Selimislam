export type AuthMode = 'signin' | 'signup' | 'forgot';
export type AppViewMode = 'store' | 'dashboard' | 'auth';

export interface UserSession {
  username: string;
  name?: string;
  email?: string;
  loggedInAt: string;
  avatarUrl?: string;
}

export interface FormNotification {
  type: 'success' | 'error' | 'info';
  message: string;
}

export interface ProductReview {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ProductItem {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  rating: number;
  reviews?: ProductReview[];
  gradientTheme: string;
  iconType: 'chip' | 'shield' | 'hard-drive' | 'eye' | 'cpu' | 'zap' | 'box';
  description: string;
  createdAt: string;
}

export interface CartItem {
  product: ProductItem;
  quantity: number;
}

export interface CustomerOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  address: string;
  items: { productName: string; price: number; quantity: number }[];
  totalAmount: number;
  status: 'Confirmed' | 'Processing' | 'Shipped';
  paymentMethod: string;
  createdAt: string;
}


