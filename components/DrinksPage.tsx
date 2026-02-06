import React from 'react';
import { DRINKS } from '../constants';
import { X, ArrowRight, Plus, Minus } from 'lucide-react';

interface DrinksPageProps {
  cart: Record<string, number>;
  totalItems: number;
  onUpdateQuantity: (id: string, delta: number) => void;
  onContinueToCart: () => void;
  onClose: () => void;
}

export const DrinksPage: React.FC<DrinksPageProps> = ({
  cart,
  totalItems,
  onUpdateQuantity,
  onContinueToCart,
  onClose,
}) => {
  // Check if any drinks are in the cart
  const hasDrinksInCart = DRINKS.some(d => (cart[d.id] || 0) > 0);

  // Prevent body scroll when page is open
  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-[#1A1A1A] w-full h-full flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-[#2E2E2E] bg-[#1A1A1A] flex justify-between items-center flex-shrink-0">
          <h2 className="text-2xl font-semibold text-[#F5F5F5]">Bebidas</h2>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#2A2A2A] transition-colors text-[#A3A3A3]"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable drink list */}
        <div className="flex-1 overflow-y-auto p-4 pb-32">
          <div className="flex flex-col gap-3">
            {DRINKS.map(drink => {
              const qty = cart[drink.id] || 0;
              return (
                <div key={drink.id} className="flex items-center gap-3 bg-[#242424] p-3 rounded-2xl shadow-[0_2px_12px_rgb(0,0,0,0.2)] border border-[#2E2E2E]">
                  <img
                    src={drink.image}
                    alt={drink.name}
                    className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                    loading="lazy"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[#F5F5F5] text-sm leading-tight">{drink.name}</h3>
                    <p className="text-[#F97316] font-semibold text-sm mt-0.5">R${drink.price.toFixed(2)}</p>
                  </div>
                  {qty === 0 ? (
                    <button
                      onClick={() => onUpdateQuantity(drink.id, 1)}
                      className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#F97316] text-white flex-shrink-0 active:scale-90 transition-transform"
                    >
                      <Plus size={18} />
                    </button>
                  ) : (
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => onUpdateQuantity(drink.id, -1)}
                        className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#333333] text-[#F5F5F5] active:scale-90 transition-transform"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-6 text-center font-bold text-sm text-[#F5F5F5]">{qty}</span>
                      <button
                        onClick={() => onUpdateQuantity(drink.id, 1)}
                        className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#F97316] text-white active:scale-90 transition-transform"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="fixed bottom-8 left-0 right-0 z-50 px-6">
          <div className="max-w-md mx-auto">
            <button
              onClick={onContinueToCart}
              className="w-full bg-[#F97316] text-white h-16 rounded-[2rem] shadow-2xl shadow-[#F97316]/30 flex items-center justify-between px-2 pr-8 transition-transform active:scale-95 hover:scale-[1.02]"
            >
              <div className="flex items-center gap-4">
                {totalItems > 0 && (
                  <div className="bg-white/20 text-white h-12 px-6 rounded-[1.5rem] flex items-center justify-center font-bold text-lg">
                    {totalItems}
                  </div>
                )}
                <span className="text-sm font-bold uppercase tracking-widest">
                  {hasDrinksInCart ? 'Ver Pedido' : 'Pular Bebidas'}
                </span>
              </div>
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
