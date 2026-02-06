import { useState, useEffect, useCallback } from 'react';
import { supabase, supabaseConfigured } from '../lib/supabase';
import { Product } from '../types';

export function useAdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(supabaseConfigured);

  const fetchProducts = useCallback(async () => {
    if (!supabaseConfigured) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('category')
      .order('sort_order');

    if (error) {
      console.error('Error fetching admin products:', error);
      setProducts([]);
    } else {
      setProducts((data as Product[]) || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const toggleAvailability = async (id: string, available: boolean) => {
    // Optimistic update
    setProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, available } : p))
    );

    const { error } = await supabase
      .from('products')
      .update({ available })
      .eq('id', id);

    if (error) {
      console.error('Error toggling availability:', error);
      // Revert on error
      setProducts(prev =>
        prev.map(p => (p.id === id ? { ...p, available: !available } : p))
      );
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    // Optimistic update
    setProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, ...updates } : p))
    );

    const { error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id);

    if (error) {
      console.error('Error updating product:', error);
      // Revert by refetching
      await fetchProducts();
    }
  };

  const createProduct = async (product: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...product,
      id: crypto.randomUUID(),
    };

    // Optimistic update
    setProducts(prev => [...prev, newProduct]);

    const { error } = await supabase
      .from('products')
      .insert(newProduct);

    if (error) {
      console.error('Error creating product:', error);
      // Revert by removing the optimistic entry
      setProducts(prev => prev.filter(p => p.id !== newProduct.id));
    }
  };

  return { products, loading, toggleAvailability, updateProduct, createProduct, refetch: fetchProducts };
}
