import { useState, useEffect, useCallback } from 'react';
import { supabase, supabaseConfigured } from '../lib/supabase';
import { StoreSettings, CardLayout } from '../types';

const DEFAULT_SETTINGS: StoreSettings = {
  cardLayout: 'photo',
  displayName: 'Brandao Burguer',
  featuredTitle: 'Lanche de verdade,',
  secondTitle: 'do jeito que tem que ser.',
  logoUrl: null,
};

/** Maps camelCase StoreSettings keys to snake_case DB columns */
const camelToSnake: Record<string, string> = {
  cardLayout: 'card_layout',
  displayName: 'display_name',
  featuredTitle: 'featured_title',
  secondTitle: 'second_title',
  logoUrl: 'logo_url',
};

export function useAdminStoreSettings() {
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
        cardLayout: (data?.card_layout as CardLayout) || DEFAULT_SETTINGS.cardLayout,
        displayName: data?.display_name || DEFAULT_SETTINGS.displayName,
        featuredTitle: data?.featured_title || DEFAULT_SETTINGS.featuredTitle,
        secondTitle: data?.second_title || DEFAULT_SETTINGS.secondTitle,
        logoUrl: data?.logo_url ?? null,
      });
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  /** Generic update — accepts any partial StoreSettings, maps to snake_case, optimistic */
  const updateSettings = useCallback(async (updates: Partial<StoreSettings>) => {
    const previous = { ...settings };

    // Optimistic update
    setSettings(prev => ({ ...prev, ...updates }));

    // Map camelCase keys to snake_case for DB
    const dbUpdates: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(updates)) {
      const col = camelToSnake[key];
      if (col) dbUpdates[col] = value;
    }

    const { error } = await supabase
      .from('store_settings')
      .update(dbUpdates)
      .eq('id', 1);

    if (error) {
      console.error('Error updating store settings:', error);
      setSettings(previous);
    }
  }, [settings]);

  /** Legacy helper — keeps existing call sites working */
  const updateCardLayout = useCallback(async (layout: CardLayout) => {
    await updateSettings({ cardLayout: layout });
  }, [updateSettings]);

  /** Upload logo to product-images bucket, then update logo_url */
  const uploadLogo = useCallback(async (file: File) => {
    const ext = file.name.split('.').pop() || 'jpg';
    const fileName = `logo-${crypto.randomUUID()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(fileName, file, { contentType: file.type });

    if (uploadError) {
      console.error('Error uploading logo:', uploadError);
      return;
    }

    const { data: urlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName);

    await updateSettings({ logoUrl: urlData.publicUrl });
  }, [updateSettings]);

  /** Remove logo — set logo_url to null */
  const removeLogo = useCallback(async () => {
    await updateSettings({ logoUrl: null });
  }, [updateSettings]);

  return {
    settings,
    loading,
    cardLayout: settings.cardLayout,
    updateSettings,
    updateCardLayout,
    uploadLogo,
    removeLogo,
  };
}
