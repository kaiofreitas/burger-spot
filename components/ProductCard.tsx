import React, { useState, useEffect, useRef } from 'react';
import { Product, CardLayout } from '../types';
import { Plus, Minus } from 'lucide-react';

interface ProductCardProps {
  item: Product;
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
  layout?: CardLayout;
}


export const ProductCard: React.FC<ProductCardProps> = ({ item, quantity, onAdd, onRemove, layout = 'photo' }) => {
  const [justAdded, setJustAdded] = useState(false);
  const prevQuantity = useRef(quantity);

  useEffect(() => {
    if (quantity > prevQuantity.current) {
      setJustAdded(true);
      const timer = setTimeout(() => setJustAdded(false), 600);
      return () => clearTimeout(timer);
    }
    prevQuantity.current = quantity;
  }, [quantity]);

  // Fallback: if layout needs an image but product has none → compact
  const needsImage = layout === 'photo' || layout === 'horizontal';
  const effectiveLayout = (needsImage && !item.image ? 'compact' : layout) as CardLayout;

  // Compact text-only card
  if (effectiveLayout === 'compact') {
    return (
      <div className="bg-[#242424] px-5 py-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.3)] transition-all duration-500 ease-out border border-[#2E2E2E] flex flex-col gap-3">
        {/* Top row: name + price */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base font-semibold text-[#F5F5F5] leading-tight" style={{ fontFamily: 'Inter, sans-serif' }}>{item.name}</h3>
          <span className="text-base font-semibold text-[#F97316] shrink-0" style={{ fontFamily: 'Inter, sans-serif' }}>
            R${item.price.toFixed(2)}
          </span>
        </div>

        {item.description && (
          <p className="text-[#A3A3A3] text-sm leading-relaxed">
            {item.description}
          </p>
        )}

        {/* Bottom row: tags + action */}
        <div className="flex items-center justify-between gap-3">
          {item.tags.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {item.tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center text-[9px] font-semibold uppercase tracking-wide px-2 py-1 rounded-full leading-none border border-[#333] text-[#A3A3A3]"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : <div />}

          {quantity === 0 ? (
            <button
              onClick={onAdd}
              className="px-4 py-2 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-xs uppercase tracking-widest transition-all duration-200 active:scale-95 group flex items-center gap-1.5 shrink-0"
            >
              <span>Pedir</span>
              <Plus size={14} className="group-hover:rotate-90 transition-transform" />
            </button>
          ) : (
            <div
              className="flex items-center gap-1.5 bg-[#F97316] rounded-xl p-1.5 pl-3 transition-transform duration-200 shrink-0"
              style={justAdded ? { transform: 'scale(1.05)', transition: 'transform 150ms ease-out' } : { transform: 'scale(1)', transition: 'transform 150ms ease-out' }}
            >
              <span className="font-bold text-white text-xs uppercase tracking-wider">
                {quantity}
              </span>
              <button
                onClick={onRemove}
                className="w-8 h-8 flex items-center justify-center bg-white/15 hover:bg-white/25 rounded-lg text-white transition-colors active:scale-90"
              >
                <Minus size={14} />
              </button>
              <button
                onClick={onAdd}
                className="w-8 h-8 flex items-center justify-center bg-white text-[#F97316] rounded-lg shadow-sm active:scale-90 transition-transform hover:bg-[#F5F5F5]"
              >
                <Plus size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Horizontal card: photo left, content right
  if (effectiveLayout === 'horizontal') {
    return (
      <div className="bg-[#242424] p-3 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.3)] transition-all duration-500 ease-out border border-[#2E2E2E] flex gap-3">
        {/* Image */}
        <div className="w-28 h-28 rounded-xl overflow-hidden bg-[#1A1A1A] shrink-0">
          <img
            src={item.image}
            alt={item.name}
            width={224}
            height={224}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
          {/* Top: name + price */}
          <div>
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm font-semibold text-[#F5F5F5] leading-tight" style={{ fontFamily: 'Inter, sans-serif' }}>{item.name}</h3>
              <span className="text-sm font-semibold text-[#F97316] shrink-0" style={{ fontFamily: 'Inter, sans-serif' }}>
                R${item.price.toFixed(2)}
              </span>
            </div>
            {item.description && (
              <p className="text-[#A3A3A3] text-xs leading-relaxed mt-1 line-clamp-2">
                {item.description}
              </p>
            )}
          </div>

          {/* Bottom: tags + action */}
          <div className="flex items-center justify-between gap-2 mt-2">
            {item.tags.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {item.tags.slice(0, 2).map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center text-[8px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded-full leading-none border border-[#333] text-[#A3A3A3]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : <div />}

            {quantity === 0 ? (
              <button
                onClick={onAdd}
                className="px-3 py-1.5 rounded-lg bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-[10px] uppercase tracking-widest transition-all duration-200 active:scale-95 group flex items-center gap-1 shrink-0"
              >
                <span>Pedir</span>
                <Plus size={12} className="group-hover:rotate-90 transition-transform" />
              </button>
            ) : (
              <div
                className="flex items-center gap-1 bg-[#F97316] rounded-lg p-1 pl-2.5 transition-transform duration-200 shrink-0"
                style={justAdded ? { transform: 'scale(1.05)', transition: 'transform 150ms ease-out' } : { transform: 'scale(1)', transition: 'transform 150ms ease-out' }}
              >
                <span className="font-bold text-white text-[10px] uppercase tracking-wider">
                  {quantity}
                </span>
                <button
                  onClick={onRemove}
                  className="w-6 h-6 flex items-center justify-center bg-white/15 hover:bg-white/25 rounded text-white transition-colors active:scale-90"
                >
                  <Minus size={12} />
                </button>
                <button
                  onClick={onAdd}
                  className="w-6 h-6 flex items-center justify-center bg-white text-[#F97316] rounded shadow-sm active:scale-90 transition-transform hover:bg-[#F5F5F5]"
                >
                  <Plus size={12} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Standard photo card (default)
  return (
    <div className="bg-[#242424] p-3 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.3)] transition-all duration-500 ease-out border border-[#2E2E2E]">
      {/* Image with Frame Effect */}
      <div className="relative aspect-square rounded-[2rem] overflow-hidden bg-[#1A1A1A] mb-4">
        <img
          src={item.image}
          alt={item.name}
          width={512}
          height={512}
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          loading="lazy"
        />
        {/* Floating Price Tag */}
        <div className="absolute top-4 right-4 bg-[#1A1A1A]/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-[#333333]">
          <span className="text-lg font-semibold text-[#F97316]" style={{ fontFamily: 'Inter, sans-serif' }}>R${item.price.toFixed(2)}</span>
        </div>
      </div>

      <div className="px-3 pb-3">
        <h3 className="text-2xl font-semibold text-[#F5F5F5] leading-none mb-3 mt-8" style={{ fontFamily: 'Inter, sans-serif' }}>{item.name}</h3>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {item.tags.map(tag => (
              <span
                key={tag}
                className="inline-flex items-center text-[10px] font-semibold uppercase tracking-wide px-2.5 py-1.5 rounded-full leading-none border border-[#333] text-[#A3A3A3]"
              >
                {tag}
              </span>
          ))}
        </div>

        <p className="text-[#A3A3A3] text-sm leading-relaxed mb-6 line-clamp-2">
          {item.description}
        </p>

        {/* Action Button */}
        {quantity === 0 ? (
          <button
            onClick={onAdd}
            className="w-full py-4 rounded-2xl bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-sm uppercase tracking-widest transition-all duration-200 active:scale-95 group flex items-center justify-center gap-2"
          >
            <span>Pedir Agora</span>
            <Plus size={16} className="group-hover:rotate-90 transition-transform" />
          </button>
        ) : (
          <div
            className="flex items-center justify-between bg-[#F97316] rounded-2xl p-2 pl-6 transition-transform duration-200"
            style={justAdded ? { transform: 'scale(1.05)', transition: 'transform 150ms ease-out' } : { transform: 'scale(1)', transition: 'transform 150ms ease-out' }}
          >
            <span className="font-bold text-white text-sm uppercase tracking-wider">
              {quantity} no pedido
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={onRemove}
                className="w-10 h-10 flex items-center justify-center bg-white/15 hover:bg-white/25 rounded-xl text-white transition-colors active:scale-90"
              >
                <Minus size={16} />
              </button>
              <button
                onClick={onAdd}
                className="w-10 h-10 flex items-center justify-center bg-white text-[#F97316] rounded-xl shadow-sm active:scale-90 transition-transform hover:bg-[#F5F5F5]"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
