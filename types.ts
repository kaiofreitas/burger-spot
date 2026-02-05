export interface Cookie {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  tags: string[];
}

export interface CartItem extends Cookie {
  quantity: number;
}

export interface UserDetails {
  name: string;
  address: string;
  notes: string;
}

export interface GeminiRecommendationRequest {
  userQuery: string;
  availableCookies: Cookie[];
}
