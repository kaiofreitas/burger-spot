import React, { useState, useRef, useEffect, useCallback } from 'react';
import { CardLayout, StoreSettings } from '../../types';
import { Check, Trash2 } from 'lucide-react';

interface AdminSettingsTabProps {
  settings: StoreSettings;
  onChangeLayout: (layout: CardLayout) => void;
  onUpdateSettings: (updates: Partial<StoreSettings>) => void;
  onUploadLogo: (file: File) => void;
  onRemoveLogo: () => void;
}

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 2 * 1024 * 1024; // 2MB
const DEBOUNCE_MS = 600;

const layoutOptions: { key: CardLayout; label: string; description: string }[] = [
  { key: 'photo', label: 'Foto Grande', description: 'Foto no topo, conteudo abaixo' },
  { key: 'compact', label: 'Compacto', description: 'Apenas texto, sem foto' },
  { key: 'horizontal', label: 'Horizontal', description: 'Foto a esquerda, conteudo a direita' },
];

const MiniPhoto: React.FC = () => (
  <div className="flex flex-col gap-1.5 w-full">
    <div className="w-full aspect-[4/3] rounded bg-[#333] " />
    <div className="h-2 w-3/4 rounded bg-[#444]" />
    <div className="h-1.5 w-1/2 rounded bg-[#333]" />
    <div className="h-3 w-full rounded bg-[#F97316]/40 mt-1" />
  </div>
);

const MiniCompact: React.FC = () => (
  <div className="flex flex-col gap-1.5 w-full">
    <div className="flex justify-between">
      <div className="h-2 w-1/2 rounded bg-[#444]" />
      <div className="h-2 w-1/4 rounded bg-[#F97316]/40" />
    </div>
    <div className="h-1.5 w-3/4 rounded bg-[#333]" />
    <div className="flex justify-between mt-1">
      <div className="flex gap-1">
        <div className="h-2 w-6 rounded-full bg-[#333]" />
        <div className="h-2 w-6 rounded-full bg-[#333]" />
      </div>
      <div className="h-3 w-8 rounded bg-[#F97316]/40" />
    </div>
  </div>
);

const MiniHorizontal: React.FC = () => (
  <div className="flex gap-2 w-full">
    <div className="w-10 h-10 rounded bg-[#333] shrink-0" />
    <div className="flex flex-col gap-1 flex-1">
      <div className="h-2 w-3/4 rounded bg-[#444]" />
      <div className="h-1.5 w-1/2 rounded bg-[#333]" />
      <div className="h-3 w-8 rounded bg-[#F97316]/40 mt-0.5 ml-auto" />
    </div>
  </div>
);

const miniPreviews: Record<CardLayout, React.FC> = {
  photo: MiniPhoto,
  compact: MiniCompact,
  horizontal: MiniHorizontal,
};

/** Auto-resizing textarea */
function AutoResizeTextarea({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  const adjust = () => {
    if (ref.current) {
      ref.current.style.height = '0';
      ref.current.style.height = ref.current.scrollHeight + 'px';
    }
  };

  useEffect(adjust, [value]);

  return (
    <textarea
      ref={ref}
      value={value}
      onFocus={adjust}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={1}
      className="w-full px-3 py-2.5 rounded-lg text-sm outline-none resize-none overflow-hidden bg-zinc-800 border border-[#333333] text-[#F5F5F5] min-h-[40px]"
    />
  );
}

export const AdminSettingsTab: React.FC<AdminSettingsTabProps> = ({
  settings,
  onChangeLayout,
  onUpdateSettings,
  onUploadLogo,
  onRemoveLogo,
}) => {
  const [displayName, setDisplayName] = useState(settings.displayName);
  const [featuredTitle, setFeaturedTitle] = useState(settings.featuredTitle);
  const [secondTitle, setSecondTitle] = useState(settings.secondTitle);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const debounceRefs = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  // Sync local state when settings prop changes (e.g. after fetch)
  useEffect(() => { setDisplayName(settings.displayName); }, [settings.displayName]);
  useEffect(() => { setFeaturedTitle(settings.featuredTitle); }, [settings.featuredTitle]);
  useEffect(() => { setSecondTitle(settings.secondTitle); }, [settings.secondTitle]);

  // Cleanup debounce timers on unmount
  useEffect(() => {
    return () => {
      Object.values(debounceRefs.current).forEach(clearTimeout);
    };
  }, []);

  const debouncedUpdate = useCallback((key: keyof StoreSettings, value: string) => {
    if (debounceRefs.current[key]) clearTimeout(debounceRefs.current[key]);
    debounceRefs.current[key] = setTimeout(() => {
      onUpdateSettings({ [key]: value });
    }, DEBOUNCE_MS);
  }, [onUpdateSettings]);

  const handleDisplayNameChange = (val: string) => {
    if (val.length > 24) return;
    setDisplayName(val);
    debouncedUpdate('displayName', val);
  };

  const handleFeaturedTitleChange = (val: string) => {
    setFeaturedTitle(val);
    debouncedUpdate('featuredTitle', val);
  };

  const handleSecondTitleChange = (val: string) => {
    setSecondTitle(val);
    debouncedUpdate('secondTitle', val);
  };

  const handleBlur = (key: keyof StoreSettings, value: string) => {
    if (debounceRefs.current[key]) clearTimeout(debounceRefs.current[key]);
    onUpdateSettings({ [key]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setUploadError('Formato invalido. Use JPEG, PNG ou WebP.');
      return;
    }
    if (file.size > MAX_SIZE) {
      setUploadError('Imagem muito grande. Maximo 2MB.');
      return;
    }

    onUploadLogo(file);
    // Reset file input so same file can be re-selected
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const logoSrc = settings.logoUrl || '/logo.png';

  const labelStyle: React.CSSProperties = { color: '#A3A3A3' };

  return (
    <div className="px-6 pt-6">
      {/* ── Header Editor ── */}
      <h2 className="text-lg font-bold mb-1" style={{ color: '#F5F5F5', fontFamily: 'Inter, sans-serif' }}>
        Cabecalho da Loja
      </h2>
      <p className="text-sm mb-6" style={{ color: '#A3A3A3' }}>
        Personalize o nome, logo e textos do cabecalho.
      </p>

      {/* Logo */}
      <div className="mb-5">
        <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={labelStyle}>
          Logo
        </label>
        <div className="flex items-center gap-4">
          <img
            src={logoSrc}
            alt="Logo"
            className="h-16 w-16 rounded-full object-cover border-2 border-[#F97316]/30"
          />
          <div className="flex gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-opacity hover:opacity-80"
              style={{
                backgroundColor: '#2A2A2A',
                color: '#F5F5F5',
                border: '1px solid #333333',
              }}
            >
              Alterar
            </button>
            {settings.logoUrl && (
              <button
                type="button"
                onClick={onRemoveLogo}
                className="p-2 rounded-lg transition-opacity hover:opacity-80"
                style={{
                  backgroundColor: 'transparent',
                  color: '#EF4444',
                  border: '1px solid #EF4444',
                }}
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        </div>
        {uploadError && (
          <span className="text-xs mt-1 block" style={{ color: '#EF4444' }}>
            {uploadError}
          </span>
        )}
      </div>

      {/* Display Name */}
      <div className="mb-5">
        <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={labelStyle}>
          Nome de Exibicao
        </label>
        <div className="relative">
          <input
            type="text"
            value={displayName}
            onChange={e => handleDisplayNameChange(e.target.value)}
            onBlur={() => handleBlur('displayName', displayName)}
            maxLength={24}
            className="w-full px-3 py-2.5 rounded-lg text-sm outline-none bg-zinc-800 border border-[#333333] text-[#F5F5F5]"
            placeholder="Nome da loja"
          />
          <span
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs"
            style={{ color: displayName.length >= 24 ? '#EF4444' : '#666666' }}
          >
            {displayName.length}/24
          </span>
        </div>
      </div>

      {/* Featured Title */}
      <div className="mb-5">
        <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={labelStyle}>
          Titulo Principal
        </label>
        <AutoResizeTextarea
          value={featuredTitle}
          onChange={handleFeaturedTitleChange}
          placeholder="Ex: Lanche de verdade,"
        />
      </div>

      {/* Second Title */}
      <div className="mb-6">
        <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={labelStyle}>
          Subtitulo
        </label>
        <AutoResizeTextarea
          value={secondTitle}
          onChange={handleSecondTitleChange}
          placeholder="Ex: do jeito que tem que ser."
        />
      </div>

      {/* ── Divider ── */}
      <div className="border-t border-[#2E2E2E] mb-6" />

      {/* ── Card Layout Picker ── */}
      <h2 className="text-lg font-bold mb-1" style={{ color: '#F5F5F5', fontFamily: 'Inter, sans-serif' }}>
        Layout do Cardapio
      </h2>
      <p className="text-sm mb-6" style={{ color: '#A3A3A3' }}>
        Escolha como os produtos aparecem para os clientes.
      </p>

      <div className="flex flex-col gap-3">
        {layoutOptions.map(option => {
          const isSelected = settings.cardLayout === option.key;
          const Preview = miniPreviews[option.key];
          return (
            <button
              key={option.key}
              onClick={() => onChangeLayout(option.key)}
              className="flex items-center gap-4 p-4 rounded-xl text-left transition-all"
              style={{
                backgroundColor: '#242424',
                border: isSelected ? '2px solid #F97316' : '2px solid #2E2E2E',
              }}
            >
              {/* Mini preview */}
              <div className="w-20 shrink-0">
                <Preview />
              </div>

              {/* Label + description */}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold" style={{ color: '#F5F5F5' }}>
                  {option.label}
                </div>
                <div className="text-xs mt-0.5" style={{ color: '#A3A3A3' }}>
                  {option.description}
                </div>
              </div>

              {/* Checkmark */}
              {isSelected && (
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: '#F97316' }}
                >
                  <Check size={14} color="#FFFFFF" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
