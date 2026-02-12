import { useState, useEffect, useCallback } from 'react';
import { supabase, supabaseConfigured } from '../lib/supabase';
import { MenuCategory } from '../types';

export function useAdminCategories() {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(supabaseConfigured);

  const fetchCategories = useCallback(async () => {
    if (!supabaseConfigured) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('menu_categories')
      .select('*')
      .order('sort_order');

    if (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    } else {
      setCategories((data as MenuCategory[]) || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const createCategory = async (category: Omit<MenuCategory, 'id'>) => {
    const tempId = crypto.randomUUID();
    const newCategory: MenuCategory = { ...category, id: tempId };

    setCategories(prev => [...prev, newCategory]);

    const { error } = await supabase
      .from('menu_categories')
      .insert(category);

    if (error) {
      console.error('Error creating category:', error);
      setCategories(prev => prev.filter(c => c.id !== tempId));
    } else {
      await fetchCategories();
    }
  };

  const updateCategory = async (id: string, updates: Partial<MenuCategory>) => {
    setCategories(prev =>
      prev.map(c => (c.id === id ? { ...c, ...updates } : c))
    );

    const { error } = await supabase
      .from('menu_categories')
      .update(updates)
      .eq('id', id);

    if (error) {
      console.error('Error updating category:', error);
      await fetchCategories();
    }
  };

  const deleteCategory = async (id: string) => {
    const prev = categories;
    setCategories(prev => prev.filter(c => c.id !== id));

    const { error } = await supabase
      .from('menu_categories')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting category:', error);
      setCategories(prev);
    }
  };

  return { categories, loading, createCategory, updateCategory, deleteCategory };
}
