import { useState, useEffect, useCallback } from 'react';
import { supabase, supabaseConfigured } from '../lib/supabase';
import { Bairro } from '../types';

export function useAdminBairros() {
  const [bairros, setBairros] = useState<Bairro[]>([]);
  const [loading, setLoading] = useState(supabaseConfigured);

  const fetchBairros = useCallback(async () => {
    if (!supabaseConfigured) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('bairros')
      .select('*')
      .order('sort_order');

    if (error) {
      console.error('Error fetching admin bairros:', error);
      setBairros([]);
    } else {
      setBairros((data as Bairro[]) || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchBairros();
  }, [fetchBairros]);

  const toggleActive = async (id: number, active: boolean) => {
    // Optimistic update
    setBairros(prev =>
      prev.map(b => (b.id === id ? { ...b, active } : b))
    );

    const { error } = await supabase
      .from('bairros')
      .update({ active })
      .eq('id', id);

    if (error) {
      console.error('Error toggling bairro active:', error);
      // Revert on error
      setBairros(prev =>
        prev.map(b => (b.id === id ? { ...b, active: !active } : b))
      );
    }
  };

  const updateBairro = async (id: number, updates: Partial<Bairro>) => {
    // Optimistic update
    setBairros(prev =>
      prev.map(b => (b.id === id ? { ...b, ...updates } : b))
    );

    const { error } = await supabase
      .from('bairros')
      .update(updates)
      .eq('id', id);

    if (error) {
      console.error('Error updating bairro:', error);
      // Revert by refetching
      await fetchBairros();
    }
  };

  const createBairro = async (bairro: Omit<Bairro, 'id'>) => {
    const tempId = Date.now();
    const newBairro: Bairro = {
      ...bairro,
      id: tempId,
    };

    // Optimistic update
    setBairros(prev => [...prev, newBairro]);

    const { error } = await supabase
      .from('bairros')
      .insert(bairro);

    if (error) {
      console.error('Error creating bairro:', error);
      // Revert by removing the optimistic entry
      setBairros(prev => prev.filter(b => b.id !== tempId));
    } else {
      // Refetch to get the real ID from the database
      await fetchBairros();
    }
  };

  return { bairros, loading, updateBairro, createBairro, toggleActive };
}
