export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  tags: string[];
  category: 'burger' | 'drink';
  available: boolean;
  sort_order: number;
  menu_category_id?: string | null;
}

export interface MenuCategory {
  id: string;
  name: string;
  sort_order: number;
}

/** @deprecated Use Product instead */
export type Burger = Product;

export interface CartEntry {
  quantity: number;
  notes: string;
}

export interface CartItem extends Product {
  quantity: number;
  notes: string;
}

export interface Bairro {
  id: number;
  name: string;
  fee: number;
  active: boolean;
  sort_order: number;
}

export type CardLayout = 'photo' | 'compact' | 'horizontal';

export interface StoreSettings {
  cardLayout: CardLayout;
  displayName: string;
  featuredTitle: string;
  secondTitle: string;
  logoUrl: string | null;
}

export type PaymentMethod = 'pix' | 'cartao' | 'dinheiro';

export interface UserDetails {
  name: string;
  address: string;
  bairro: string;
  notes: string;
  payment: PaymentMethod | '';
}
