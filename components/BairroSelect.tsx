import React, { useState, useRef, useEffect } from 'react';
import { Bairro } from '../types';
import { X, MapPin, ChevronDown } from 'lucide-react';

interface BairroSelectProps {
  bairros: Bairro[];
  value: string;
  onChange: (bairroName: string) => void;
}

export const BairroSelect: React.FC<BairroSelectProps> = ({ bairros, value, onChange }) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedBairro = bairros.find(b => b.name === value);

  const filtered = query.trim()
    ? bairros.filter(b => b.name.toLowerCase().includes(query.toLowerCase()))
    : bairros;

  // Close dropdown on click/touch outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const handleSelect = (bairro: Bairro) => {
    onChange(bairro.name);
    setIsOpen(false);
    setQuery('');
  };

  const handleClear = () => {
    onChange('');
    setQuery('');
    setIsOpen(false);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    if (!isOpen) setIsOpen(true);
  };

  // Selected state: show bairro + fee with clear button
  if (selectedBairro && !isOpen) {
    return (
      <div ref={containerRef}>
        <label className="block text-base font-semibold text-[#F5F5F5] mb-3">Bairro</label>
        <div className="flex items-center gap-3 w-full px-5 py-4 bg-[#F97316]/10 border-2 border-[#F97316] rounded-2xl">
          <MapPin size={18} className="text-[#F97316] flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <span className="text-base text-[#F5F5F5] font-medium">{selectedBairro.name}</span>
            <span className="text-sm text-[#A3A3A3] ml-2">
              — R${selectedBairro.fee.toFixed(2).replace('.', ',')}
            </span>
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F97316]/20 transition-colors flex-shrink-0"
          >
            <X size={16} className="text-[#A3A3A3]" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <label className="block text-base font-semibold text-[#F5F5F5] mb-3">Bairro</label>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          className="w-full px-5 py-4 pl-12 pr-12 bg-[#2A2A2A] border border-[#333333] rounded-2xl text-base text-[#F5F5F5] focus:outline-none focus:ring-2 focus:ring-[#F97316] placeholder:text-[#666666]"
          placeholder="Buscar bairro..."
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
        />
        <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#666666]" />
        <ChevronDown
          size={18}
          className={`absolute right-4 top-1/2 -translate-y-1/2 text-[#666666] transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </div>

      {isOpen && (
        <div className="absolute z-10 left-0 right-0 mt-2 bg-[#242424] rounded-2xl shadow-lg border border-[#333333] max-h-60 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="px-5 py-4 text-sm text-[#666666]">Nenhum bairro encontrado</div>
          ) : (
            filtered.map(bairro => (
              <button
                key={bairro.name}
                type="button"
                onClick={() => handleSelect(bairro)}
                className="w-full text-left px-5 py-3 hover:bg-[#F97316]/10 transition-colors first:rounded-t-2xl last:rounded-b-2xl"
              >
                <span className="text-sm font-medium text-[#F5F5F5]">{bairro.name}</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};
