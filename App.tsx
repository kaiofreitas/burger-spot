import React, { useState, useMemo, useEffect } from 'react';
import { BURGERS, RESTAURANT_NAME, TAGLINE } from './constants';
import { CartItem } from './types';
import { ProductCard } from './components/ProductCard';
import { CartModal } from './components/CartModal';

const warmColors = [
  '#FFF8F0', // Cream
  '#FFEBD6', // Light peach
  '#FFDAB3', // Peach
  '#FFF0E6', // Light warm orange
  '#FFE4D6', // Warm beige
  '#FFF8F0', // Loop back
];

const App: React.FC = () => {
  const [cart, setCart] = useState<Record<string, number>>({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [bgColor, setBgColor] = useState(warmColors[0]);

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCart(prev => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: next };
    });
  };

  const cartItems: CartItem[] = useMemo(() => {
    return Object.entries(cart)
      .map(([id, quantity]) => {
        const burger = BURGERS.find(b => b.id === id);
        if (!burger) return null;
        return { ...burger, quantity };
      })
      .filter((item): item is CartItem => item !== null);
  }, [cart]);

  const totalItems = (Object.values(cart) as number[]).reduce((a, b) => a + b, 0);
  const totalPrice = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercentage = scrollPosition / windowHeight;

      const colorIndex = Math.min(
        Math.floor(scrollPercentage * warmColors.length),
        warmColors.length - 1
      );

      setBgColor(warmColors[colorIndex]);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className="min-h-screen pb-40 max-w-md mx-auto text-[#1C1917] transition-colors duration-1000 ease-out relative overflow-hidden"
      style={{ backgroundColor: bgColor }}
    >
      <div className="relative" style={{ zIndex: 1 }}>
      
      {/* Header */}
      <header className="px-6 pt-16 pb-12">
        <div className="flex items-start justify-between mb-10">
          <h1 className="text-6xl leading-[0.85] tracking-tight font-bold text-[#DC2626]">
            {RESTAURANT_NAME.split(' ')[0]}<br/>{RESTAURANT_NAME.split(' ')[1]}
          </h1>
          <div className="bg-[#FEF3C7] px-3 py-1.5 rounded-full mt-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#1C1917]">Desde 2025</span>
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-xl text-[#1C1917] font-medium tracking-tight">{TAGLINE}</p>
          <p className="text-xl text-[#1C1917] font-medium tracking-tight">Brasileiros de alma.</p>
          <p className="text-xl text-[#1C1917]/60 font-normal tracking-tight">Sabor de verdade.</p>
        </div>
      </header>

      {/* Product List */}
      <main className="px-4 flex flex-col gap-6">
        {BURGERS.map(burger => (
          <ProductCard 
            key={burger.id}
            item={burger}
            quantity={cart[burger.id] || 0}
            onAdd={() => handleUpdateQuantity(burger.id, 1)}
            onRemove={() => handleUpdateQuantity(burger.id, -1)}
          />
        ))}
      </main>

      {/* About Section */}
      <section className="px-6 py-16 max-w-lg mx-auto">
        <h3 className="text-2xl font-semibold text-[#1C1917] mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
          Nossa História
        </h3>

        <div className="flex flex-col gap-6">
          {/* Photo */}
          <div className="w-full aspect-[4/3] rounded-2xl bg-[#F5F5F4] overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&q=80"
              alt="Restaurant"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Text */}
          <div>
            <p className="text-[#1C1917] text-base leading-relaxed mb-4">
              Tudo começou com uma pergunta simples: "Por que não existe um burger que lembre o sabor de verdade?" 
              Depois de anos aperfeiçoando receitas na cozinha de casa, nascemos com uma missão: 
              trazer de volta o sabor autêntico das hamburguerias tradicionais.
            </p>
            <p className="text-[#1C1917] text-base leading-relaxed mb-4">
              Cada burger é preparado na grelha, com ingredientes selecionados e muito cuidado. 
              Porque acreditamos que uma boa refeição transforma o dia.
            </p>
            <p className="text-[#78716C] text-sm">
              — A Equipe {RESTAURANT_NAME}
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <div className="text-center py-16 opacity-40">
        <p className="serif italic">{RESTAURANT_NAME} • Sabor & Amor</p>
      </div>

      {/* Floating Cart Pill */}
      {totalItems > 0 && (
        <div className="fixed bottom-8 left-6 right-6 z-40 max-w-md mx-auto">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-[#DC2626] text-[#FFFBEB] h-16 rounded-[2rem] shadow-2xl shadow-[#DC2626]/20 flex items-center justify-between px-2 pr-8 transition-transform active:scale-95 hover:scale-[1.02]"
          >
            <div className="flex items-center gap-4">
              <div className="bg-[#FEF3C7] text-[#1C1917] h-12 px-6 rounded-[1.5rem] flex items-center justify-center font-bold text-lg">
                {totalItems}
              </div>
              <span className="text-sm font-bold uppercase tracking-widest">Ver Pedido</span>
            </div>
            <span className="text-2xl font-bold" style={{ fontFamily: 'Inter, sans-serif' }}>R${totalPrice.toFixed(2)}</span>
          </button>
        </div>
      )}

      </div>

      {/* Modals */}
      {isCartOpen && (
        <CartModal
          items={cartItems}
          total={totalPrice}
          onClose={() => setIsCartOpen(false)}
          onUpdateQuantity={handleUpdateQuantity}
        />
      )}
    </div>
  );
};

export default App;
