export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  tags: string[];
}

/** @deprecated Use Product instead */
export type Burger = Product;

export interface CartItem extends Product {
  quantity: number;
}

export interface Bairro {
  name: string;
  fee: number;
}

export type PaymentMethod = 'pix' | 'cartao' | 'dinheiro';

export interface UserDetails {
  name: string;
  address: string;
  bairro: string;
  notes: string;
  payment: PaymentMethod | '';
}
