import { Burger } from './types';
import { ShoppingCart, MapPin, Clock } from 'lucide-react';

export const BURGERS: Burger[] = [
  {
    id: 'b1',
    name: 'Clássica Americana',
    description: 'Pão brioche, carne 180g, queijo cheddar, alface, tomate e nosso molho especial.',
    price: 189,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80',
    tags: ['clássica', 'tradicional']
  },
  {
    id: 'b2',
    name: 'Bacon Supreme',
    description: 'Carne suculenta, bacon crocante, cheddar fundido, cebola caramelizada e maionese de bacon.',
    price: 219,
    image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=600&q=80',
    tags: ['bacon', 'premium']
  },
  {
    id: 'b3',
    name: 'Duplo Cheese',
    description: 'Duas carnes, dois queijos cheddar, picles e ketchup artesanal.',
    price: 229,
    image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=600&q=80',
    tags: ['duplo', 'queijo']
  },
  {
    id: 'b4',
    name: 'Picante Mexicana',
    description: 'Carne temperada com cominho, jalapeño, guacamole, queijo pepper jack e tortilla chips.',
    price: 209,
    image: 'https://images.unsplash.com/photo-1605789538467-f715d58e03f3?w=600&q=80',
    tags: ['picante', 'mexicana']
  },
  {
    id: 'b5',
    name: 'BBQ Ranch',
    description: 'Molho BBQ defumado, onion rings, ranch caseiro e bacon.',
    price: 219,
    image: 'https://images.unsplash.com/photo-1513185158878-8d8c2a2a3da3?w=600&q=80',
    tags: ['BBQ', 'defumado']
  },
  {
    id: 'b6',
    name: 'Veggie Delight',
    description: 'Hambúrguer de grão-de-bico, abacate, rúcula, tomate seco e maionese de ervas.',
    price: 179,
    image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=600&q=80',
    tags: ['veggie', 'vegetariano']
  }
];

export const WHATSAPP_NUMBER = "529999999999"; // ALTERAR
export const RESTAURANT_NAME = "BRANDÃO BURGUER";
export const TAGLINE = "Sucos. Gostos. Momentos.";
