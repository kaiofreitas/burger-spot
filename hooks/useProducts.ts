import { useState, useEffect, useCallback } from 'react';
import { supabase, supabaseConfigured } from '../lib/supabase';
import { Product } from '../types';

const FALLBACK_BURGERS: Product[] = [
  { id: 'b1', name: 'Clássica Americana', description: 'Pão brioche, carne 180g, queijo cheddar, alface, tomate e nosso molho especial.', price: 189, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80', tags: ['clássica', 'tradicional'], category: 'burger', available: true, sort_order: 0 },
  { id: 'b2', name: 'Bacon Supreme', description: 'Carne suculenta, bacon crocante, cheddar fundido, cebola caramelizada e maionese de bacon.', price: 219, image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=600&q=80', tags: ['bacon', 'premium'], category: 'burger', available: true, sort_order: 1 },
  { id: 'b3', name: 'Duplo Cheese', description: 'Duas carnes, dois queijos cheddar, picles e ketchup artesanal.', price: 229, image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=600&q=80', tags: ['duplo', 'queijo'], category: 'burger', available: true, sort_order: 2 },
  { id: 'b4', name: 'Picante Mexicana', description: 'Carne temperada com cominho, jalapeño, guacamole, queijo pepper jack e tortilla chips.', price: 209, image: 'https://images.unsplash.com/photo-1605789538467-f715d58e03f3?w=600&q=80', tags: ['picante', 'mexicana'], category: 'burger', available: true, sort_order: 3 },
  { id: 'b5', name: 'BBQ Ranch', description: 'Molho BBQ defumado, onion rings, ranch caseiro e bacon.', price: 219, image: 'https://images.unsplash.com/photo-1513185158878-8d8c2a2a3da3?w=600&q=80', tags: ['BBQ', 'defumado'], category: 'burger', available: true, sort_order: 4 },
  { id: 'b6', name: 'Veggie Delight', description: 'Hambúrguer de grão-de-bico, abacate, rúcula, tomate seco e maionese de ervas.', price: 179, image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=600&q=80', tags: ['veggie', 'vegetariano'], category: 'burger', available: true, sort_order: 5 },
];

const FALLBACK_DRINKS: Product[] = [
  { id: 'd1', name: 'Coca-Cola', description: 'Lata 350ml gelada, o clássico de sempre.', price: 8.9, image: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=600&q=80', tags: ['refrigerante', 'clássico'], category: 'drink', available: true, sort_order: 0 },
  { id: 'd2', name: 'Guarana Antarctica', description: 'Lata 350ml, sabor brasileiro inconfundivel.', price: 7.9, image: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=600&q=80', tags: ['refrigerante', 'nacional'], category: 'drink', available: true, sort_order: 1 },
  { id: 'd3', name: 'Suco de Laranja', description: 'Natural, feito na hora com laranjas frescas. 400ml.', price: 12.9, image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=600&q=80', tags: ['suco', 'natural'], category: 'drink', available: true, sort_order: 2 },
  { id: 'd4', name: 'Cerveja Artesanal', description: 'IPA local, 473ml. Amargor equilibrado com notas citricas.', price: 18.9, image: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=600&q=80', tags: ['cerveja', 'artesanal'], category: 'drink', available: true, sort_order: 3 },
  { id: 'd5', name: 'Agua Mineral', description: 'Garrafa 500ml, com ou sem gas.', price: 5.9, image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=600&q=80', tags: ['agua', 'natural'], category: 'drink', available: true, sort_order: 4 },
  { id: 'd6', name: 'Milkshake', description: 'Cremoso milkshake de baunilha com chantilly. 500ml.', price: 19.9, image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&q=80', tags: ['milkshake', 'sobremesa'], category: 'drink', available: true, sort_order: 5 },
];

const FALLBACK_PRODUCTS = [...FALLBACK_BURGERS, ...FALLBACK_DRINKS];

export function useProducts() {
  const [allProducts, setAllProducts] = useState<Product[]>(
    supabaseConfigured ? [] : FALLBACK_PRODUCTS
  );
  const [loading, setLoading] = useState(supabaseConfigured);

  const fetchProducts = useCallback(async () => {
    if (!supabaseConfigured) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('available', true)
      .order('sort_order');

    if (error) {
      console.error('Error fetching products:', error);
      setAllProducts(FALLBACK_PRODUCTS);
    } else {
      setAllProducts((data as Product[]) || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!supabaseConfigured) return;

    fetchProducts();

    const channel = supabase
      .channel('products-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
        fetchProducts();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchProducts]);

  const burgers = allProducts.filter(p => p.category === 'burger');
  const drinks = allProducts.filter(p => p.category === 'drink');

  return { burgers, drinks, allProducts, loading };
}
