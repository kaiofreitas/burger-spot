import { useState, useEffect, useCallback } from 'react';
import { supabase, supabaseConfigured } from '../lib/supabase';
import { StoreSettings } from '../types';

const DEFAULT_SETTINGS: StoreSettings = {
  cardLayout: 'photo',
  displayName: 'Brandao Burguer',
  featuredTitle: 'Lanche de verdade,',
  secondTitle: 'do jeito que tem que ser.',
  logoUrl: null,
};

export function useStoreSettings() {
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(supabaseConfigured);

  const fetchSettings = useCallback(async () => {
    if (!supabaseConfigured) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('store_settings')
      .select('card_layout, display_name, featured_title, second_title, logo_url')
      .eq('id', 1)
      .single();

    if (error) {
      console.error('Error fetching store settings:', error);
      setSettings(DEFAULT_SETTINGS);
    } else {
      setSettings({
        cardLayout: (data?.card_layout as StoreSettings['cardLayout']) || DEFAULT_SETTINGS.cardLayout,
        displayName: data?.display_name || DEFAULT_SETTINGS.displayName,
        featuredTitle: data?.featured_title || DEFAULT_SETTINGS.featuredTitle,
        secondTitle: data?.second_title || DEFAULT_SETTINGS.secondTitle,
        logoUrl: data?.logo_url ?? null,
      });
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!supabaseConfigured) return;

    fetchSettings();

    const channel = supabase
      .channel('store-settings-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'store_settings' }, () => {
        fetchSettings();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchSettings]);

  return { settings, loading, cardLayout: settings.cardLayout };
}
