import React, { useState, useMemo, useEffect } from 'react';
import { BURGERS, ALL_PRODUCTS, RESTAURANT_NAME, TAGLINE } from './constants';
import { CartEntry, CartItem } from './types';
import { ProductCard } from './components/ProductCard';
import { CartModal } from './components/CartModal';
import { DrinksPage } from './components/DrinksPage';
import { ArrowRight } from 'lucide-react';

type View = 'home' | 'drinks' | 'cart';

const warmColors = [
  '#1A1A1A', // Matte black
  '#181818', // Slightly darker
  '#1C1C1C', // Subtle variation
  '#191919', // Dark tone
  '#1B1B1B', // Near-black
  '#1A1A1A', // Loop back
];

const getQuantity = (cart: Record<string, CartEntry>, id: string): number => {
  const entry = cart[id];
  return entry ? entry.quantity : 0;
};

const App: React.FC = () => {
  const [cart, setCart] = useState<Record<string, CartEntry>>({});
  const [view, setView] = useState<View>('home');
  const [bgColor, setBgColor] = useState(warmColors[0]);

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCart(prev => {
      const entry = prev[id];
      const current = entry ? entry.quantity : 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: { quantity: next, notes: entry?.notes || '' } };
    });
  };

  const handleAddNewItem = (id: string) => {
    const entry = cart[id];
    if (entry && entry.quantity > 0) {
      // Item already in cart, just increment
      handleUpdateQuantity(id, 1);
    } else {
      // New item — add directly to cart with empty notes
      setCart(prev => ({
        ...prev,
        [id]: { quantity: 1, notes: '' },
      }));
    }
  };

  const handleUpdateNotes = (id: string, notes: string) => {
    setCart(prev => {
      const entry = prev[id];
      if (!entry) return prev;
      return { ...prev, [id]: { ...entry, notes } };
    });
  };

  const cartItems: CartItem[] = useMemo(() => {
    const entries: [string, CartEntry][] = Object.entries(cart) as [string, CartEntry][];
    return entries
      .map(([id, entry]) => {
        const product = ALL_PRODUCTS.find(p => p.id === id);
        if (!product) return null;
        return { ...product, quantity: entry.quantity, notes: entry.notes };
      })
      .filter((item): item is CartItem => item !== null);
  }, [cart]);

  const totalItems: number = (Object.values(cart) as CartEntry[]).reduce((a: number, entry: CartEntry) => a + entry.quantity, 0);
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
      className="min-h-screen pb-40 max-w-md mx-auto text-[#F5F5F5] transition-colors duration-1000 ease-out relative overflow-hidden"
      style={{ backgroundColor: bgColor }}
    >
      <div className="relative" style={{ zIndex: 1 }}>

      {/* Header */}
      <header className="px-6 pt-16 pb-12">
        <div className="mb-10">
          <h1 className="text-6xl leading-[0.85] tracking-tight font-black text-[#F97316]" style={{ fontFamily: 'Inter, sans-serif' }}>
            BRANDÃO<br/>BURGUER
          </h1>
          <div className="bg-[#2A2A2A] px-3 py-1.5 rounded-full inline-block mt-3 border border-[#333333]">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#F97316]">Desde 2017</span>
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-xl text-[#F5F5F5] font-medium tracking-tight">{TAGLINE}</p>
          <p className="text-xl text-[#F5F5F5] font-medium tracking-tight">do jeito que tem que ser.</p>
          <p className="text-xl text-[#A3A3A3] font-normal tracking-tight">Volta Redonda, RJ</p>
        </div>
      </header>

      {/* Product List */}
      <main className="px-4 flex flex-col gap-6">
        {BURGERS.map(burger => (
          <ProductCard
            key={burger.id}
            item={burger}
            quantity={getQuantity(cart, burger.id)}
            onAdd={() => handleAddNewItem(burger.id)}
            onRemove={() => handleUpdateQuantity(burger.id, -1)}
          />
        ))}
      </main>

      {/* About Section */}
      <section className="px-6 py-16 max-w-lg mx-auto">
        <h3 className="text-2xl font-semibold text-[#F5F5F5] mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
          Nossa Historia
        </h3>

        <div className="flex flex-col gap-6">
          {/* Photo */}
          <div className="w-full aspect-[4/3] rounded-2xl bg-[#242424] overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&q=80"
              alt="Restaurant"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Text */}
          <div>
            <p className="text-[#D4D4D4] text-base leading-relaxed mb-4">
              Tudo comecou com uma pergunta simples: "Por que nao existe um burger que lembre o sabor de verdade?"
              Depois de anos aperfeicoando receitas na cozinha de casa, nascemos com uma missao:
              trazer de volta o sabor autentico das hamburguerias tradicionais.
            </p>
            <p className="text-[#D4D4D4] text-base leading-relaxed mb-4">
              Cada burger e preparado na grelha, com ingredientes selecionados e muito cuidado.
              Porque acreditamos que uma boa refeicao transforma o dia.
            </p>
            <p className="text-[#A3A3A3] text-sm">
              — A Equipe BRANDAO BURGUER
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <div className="text-center py-16 opacity-40">
        <p className="serif italic text-[#A3A3A3]">BRANDAO BURGUER - Sabor & Tradicao</p>
      </div>

      {/* Floating Pill - "Escolher Bebidas" when items in cart */}
      {totalItems > 0 && view === 'home' && (
        <div className="fixed bottom-8 left-6 right-6 z-40 max-w-md mx-auto">
          <button
            onClick={() => setView('drinks')}
            className="w-full bg-[#F5F5F5] text-[#1A1A1A] h-16 rounded-[2rem] shadow-2xl shadow-black/30 flex items-center justify-between px-2 pr-8 transition-transform active:scale-95 hover:scale-[1.02]"
          >
            <div className="flex items-center gap-4">
              <div className="bg-[#F97316] text-white h-12 px-6 rounded-[1.5rem] flex items-center justify-center font-bold text-lg">
                {totalItems}
              </div>
              <span className="text-sm font-bold uppercase tracking-widest">Escolher Bebidas</span>
            </div>
            <ArrowRight size={20} />
          </button>
        </div>
      )}

      </div>

      {/* Drinks Page */}
      {view === 'drinks' && (
        <DrinksPage
          cart={cart}
          totalItems={totalItems}
          onUpdateQuantity={handleUpdateQuantity}
          onContinueToCart={() => setView('cart')}
          onClose={() => setView('home')}
        />
      )}

      {/* Cart Modal */}
      {view === 'cart' && (
        <CartModal
          items={cartItems}
          total={totalPrice}
          onClose={() => setView('drinks')}
          onUpdateQuantity={handleUpdateQuantity}
          onUpdateNotes={handleUpdateNotes}
        />
      )}
    </div>
  );
};

export default App;
