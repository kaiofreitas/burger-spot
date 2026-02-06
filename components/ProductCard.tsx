import React from 'react';
import { Product } from '../types';
import { Plus, Minus } from 'lucide-react';

interface ProductCardProps {
  item: Product;
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
}


export const ProductCard: React.FC<ProductCardProps> = ({ item, quantity, onAdd, onRemove }) => {
  return (
    <div className="bg-[#242424] p-3 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.3)] transition-all duration-500 ease-out border border-[#2E2E2E]">
      {/* Image with Frame Effect */}
      <div className="relative aspect-square rounded-[2rem] overflow-hidden bg-[#1A1A1A] mb-4">
        <img
          src={item.image}
          alt={item.name}
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
            className="w-full py-4 rounded-2xl bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-sm uppercase tracking-widest transition-all active:scale-95 group flex items-center justify-center gap-2"
          >
            <span>Pedir Agora</span>
            <Plus size={16} className="group-hover:rotate-90 transition-transform" />
          </button>
        ) : (
          <div className="flex items-center justify-between bg-[#F97316] rounded-2xl p-2 pl-6">
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
