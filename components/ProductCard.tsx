import React from 'react';
import { Burger } from '../types';
import { Plus, Minus } from 'lucide-react';

interface ProductCardProps {
  item: Burger;
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
}

// Warm burger colors
const tagColors = [
  '#FEF3C7',  // Warm yellow
  '#FEE2E2',  // Light red
  '#DCFCE7',  // Light green
  '#E0E7FF',  // Light indigo
  '#FCE7F3',  // Light pink
  '#FFEDD5',  // Light orange
];

const getTagColor = (tag: string) => {
  const hash = tag.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return tagColors[hash % tagColors.length];
};

export const ProductCard: React.FC<ProductCardProps> = ({ item, quantity, onAdd, onRemove }) => {
  return (
    <div className="bg-white p-3 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.06)] transition-all duration-500 ease-out">
      {/* Image with Frame Effect */}
      <div className="relative aspect-square rounded-[2rem] overflow-hidden bg-[#F5F5F4] mb-4">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          loading="lazy"
        />
        {/* Floating Price Tag */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
          <span className="text-lg font-semibold text-[#DC2626]" style={{ fontFamily: 'Inter, sans-serif' }}>R${item.price.toFixed(2)}</span>
        </div>
      </div>

      <div className="px-3 pb-3">
        <h3 className="text-2xl font-semibold text-[#1C1917] leading-none mb-3 mt-8" style={{ fontFamily: 'Inter, sans-serif' }}>{item.name}</h3>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {item.tags.map(tag => {
            const bgColor = getTagColor(tag);
            return (
              <span
                key={tag}
                className="inline-flex items-center text-[10px] font-semibold uppercase tracking-wide px-2.5 py-1.5 rounded-full text-[#1C1917] leading-none"
                style={{ backgroundColor: bgColor }}
              >
                {tag}
              </span>
            );
          })}
        </div>

        <p className="text-[#78716C] text-sm leading-relaxed mb-6 line-clamp-2">
          {item.description}
        </p>

        {/* Action Button */}
        {quantity === 0 ? (
          <button
            onClick={onAdd}
            className="w-full py-4 rounded-2xl bg-[#DC2626] hover:bg-[#B91C1C] text-white font-bold text-sm uppercase tracking-widest transition-all active:scale-95 group flex items-center justify-center gap-2"
          >
            <span>Pedir Agora</span>
            <Plus size={16} className="group-hover:rotate-90 transition-transform" />
          </button>
        ) : (
          <div className="flex items-center justify-between bg-[#1C1917] rounded-2xl p-2 pl-6">
            <span className="font-bold text-[#FDFBF7] text-sm uppercase tracking-wider">
              {quantity} no pedido
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={onRemove}
                className="w-10 h-10 flex items-center justify-center bg-[#FDFBF7]/10 hover:bg-[#FDFBF7]/20 rounded-xl text-[#FDFBF7] transition-colors active:scale-90"
              >
                <Minus size={16} />
              </button>
              <button
                onClick={onAdd}
                className="w-10 h-10 flex items-center justify-center bg-[#FDFBF7] text-[#1C1917] rounded-xl shadow-sm active:scale-90 transition-transform hover:bg-white"
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
