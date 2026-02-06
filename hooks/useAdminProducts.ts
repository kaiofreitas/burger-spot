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

  const reorderProducts = async (orderedIds: string[]) => {
    // Optimistic update: assign sequential sort_order values
    setProducts(prev => {
      const idToOrder = new Map(orderedIds.map((id, i) => [id, i]));
      return prev
        .map(p => idToOrder.has(p.id) ? { ...p, sort_order: idToOrder.get(p.id)! } : p)
        .sort((a, b) => a.category.localeCompare(b.category) || a.sort_order - b.sort_order);
    });

    // Batch update to Supabase
    const updates = orderedIds.map((id, index) =>
      supabase.from('products').update({ sort_order: index }).eq('id', id)
    );
    const results = await Promise.all(updates);
    const hasError = results.some(r => r.error);
    if (hasError) {
      console.error('Error reordering products');
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

  return { products, loading, toggleAvailability, updateProduct, createProduct, reorderProducts, refetch: fetchProducts };
}
