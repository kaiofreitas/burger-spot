export interface Burger {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  tags: string[];
}

export interface CartItem extends Burger {
  quantity: number;
}

export interface UserDetails {
  name: string;
  address: string;
  notes: string;
}
