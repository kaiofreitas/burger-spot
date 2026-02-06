import { Product, Bairro } from './types';

export const BURGERS: Product[] = [
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

export const DRINKS: Product[] = [
  {
    id: 'd1',
    name: 'Coca-Cola',
    description: 'Lata 350ml gelada, o clássico de sempre.',
    price: 8.9,
    image: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=600&q=80',
    tags: ['refrigerante', 'clássico']
  },
  {
    id: 'd2',
    name: 'Guarana Antarctica',
    description: 'Lata 350ml, sabor brasileiro inconfundivel.',
    price: 7.9,
    image: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=600&q=80',
    tags: ['refrigerante', 'nacional']
  },
  {
    id: 'd3',
    name: 'Suco de Laranja',
    description: 'Natural, feito na hora com laranjas frescas. 400ml.',
    price: 12.9,
    image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=600&q=80',
    tags: ['suco', 'natural']
  },
  {
    id: 'd4',
    name: 'Cerveja Artesanal',
    description: 'IPA local, 473ml. Amargor equilibrado com notas citricas.',
    price: 18.9,
    image: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=600&q=80',
    tags: ['cerveja', 'artesanal']
  },
  {
    id: 'd5',
    name: 'Agua Mineral',
    description: 'Garrafa 500ml, com ou sem gas.',
    price: 5.9,
    image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=600&q=80',
    tags: ['agua', 'natural']
  },
  {
    id: 'd6',
    name: 'Milkshake',
    description: 'Cremoso milkshake de baunilha com chantilly. 500ml.',
    price: 19.9,
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&q=80',
    tags: ['milkshake', 'sobremesa']
  }
];

export const ALL_PRODUCTS: Product[] = [...BURGERS, ...DRINKS];

export const BAIRROS: Bairro[] = [
  { name: 'Aterrado', fee: 3 },
  { name: 'Bela Vista', fee: 5 },
  { name: 'Candelária', fee: 6 },
  { name: 'Centro', fee: 3 },
  { name: 'Colina', fee: 5 },
  { name: 'Conforto', fee: 4 },
  { name: 'Eucaliptal', fee: 7 },
  { name: 'Ilha São João', fee: 6 },
  { name: 'Jardim Amália', fee: 6 },
  { name: 'Jardim Belvedere', fee: 7 },
  { name: 'Jardim Normandia', fee: 5 },
  { name: 'Laranjal', fee: 4 },
  { name: 'Niterói', fee: 5 },
  { name: 'Ponte Alta', fee: 8 },
  { name: 'Retiro', fee: 5 },
  { name: 'Roma', fee: 8 },
  { name: 'Santa Cruz', fee: 7 },
  { name: 'São Geraldo', fee: 6 },
  { name: 'São Lucas', fee: 9 },
  { name: 'Sessenta', fee: 4 },
  { name: 'Vila Rica', fee: 6 },
  { name: 'Vila Santa Cecília', fee: 3 },
  { name: 'Volta Grande', fee: 10 },
];

export const WHATSAPP_NUMBER = "529844497471";
export const PIX_KEY = "email@brandaoburguer.com"; // ALTERAR
export const RESTAURANT_NAME = "BRANDAO BURGUER";
export const TAGLINE = "Lanche de verdade,";
