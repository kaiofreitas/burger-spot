import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { CartEntry, CartItem } from './types';
import { ProductCard } from './components/ProductCard';
import { CartModal } from './components/CartModal';
import { DrinksPage } from './components/DrinksPage';
import { useProducts } from './hooks/useProducts';
import { useStoreSettings } from './hooks/useStoreSettings';
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
  const { burgers, drinks, allProducts, categories, loading } = useProducts();
  const { settings, cardLayout } = useStoreSettings();
  const [cart, setCart] = useState<Record<string, CartEntry>>({});
  const [view, setView] = useState<View>('home');
  const [bgColor, setBgColor] = useState(warmColors[0]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredBurgers = useMemo(() => {
    if (!activeCategory) return burgers;
    return burgers.filter(b => b.menu_category_id === activeCategory);
  }, [burgers, activeCategory]);

  // Reset active category if it gets deleted
  useEffect(() => {
    if (activeCategory && !categories.find(c => c.id === activeCategory)) {
      setActiveCategory(null);
    }
  }, [categories, activeCategory]);

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
        const product = allProducts.find(p => p.id === id);
        if (!product) return null;
        return { ...product, quantity: entry.quantity, notes: entry.notes };
      })
      .filter((item): item is CartItem => item !== null);
  }, [cart, allProducts]);

  const totalItems: number = (Object.values(cart) as CartEntry[]).reduce((a: number, entry: CartEntry) => a + entry.quantity, 0);
  const totalPrice = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  // View transition state
  const [showDrinks, setShowDrinks] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [closingDrinks, setClosingDrinks] = useState(false);
  const [closingCart, setClosingCart] = useState(false);

  const handleOpenDrinks = useCallback(() => {
    setView('drinks');
    setShowDrinks(true);
  }, []);

  const handleCloseDrinks = useCallback(() => {
    setClosingDrinks(true);
    setTimeout(() => {
      setClosingDrinks(false);
      setShowDrinks(false);
      setView('home');
    }, 200);
  }, []);

  const handleCloseCart = useCallback(() => {
    setClosingCart(true);
    setTimeout(() => {
      setClosingCart(false);
      setShowCart(false);
      setView('home');
    }, 200);
  }, []);

  const handleContinueToCart = useCallback(() => {
    // Close drinks with animation, then open cart
    setClosingDrinks(true);
    setTimeout(() => {
      setClosingDrinks(false);
      setShowDrinks(false);
      setView('cart');
      setShowCart(true);
    }, 200);
  }, []);

  // Throttled scroll handler
  const rafRef = useRef<number>(0);
  useEffect(() => {
    const handleScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        const scrollPosition = window.scrollY;
        const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercentage = scrollPosition / windowHeight;

        const colorIndex = Math.min(
          Math.floor(scrollPercentage * warmColors.length),
          warmColors.length - 1
        );

        setBgColor(warmColors[colorIndex]);
        rafRef.current = 0;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  if (loading) {
    return (
      <div
        className="min-h-[100dvh] max-w-md mx-auto"
        style={{ backgroundColor: '#1A1A1A' }}
      >
        {/* Header skeleton */}
        <div className="px-6 pt-16 pb-12">
          <div className="flex items-center justify-between mb-10">
            <div className="h-6 w-40 bg-[#242424] rounded animate-pulse" />
            <div className="h-16 w-16 bg-[#242424] rounded-full animate-pulse" />
          </div>
          <div className="space-y-2">
            <div className="h-10 w-64 bg-[#242424] rounded animate-pulse" />
            <div className="h-6 w-52 bg-[#242424] rounded animate-pulse" />
            <div className="h-4 w-36 bg-[#242424] rounded animate-pulse mt-2" />
          </div>
        </div>
        {/* Product card skeletons */}
        <div className="px-4 flex flex-col gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-[#242424] p-3 rounded-[2.5rem] border border-[#2E2E2E] animate-pulse">
              <div className="aspect-square rounded-[2rem] bg-[#1A1A1A] mb-4" />
              <div className="px-3 pb-3">
                <div className="h-6 w-40 bg-[#1A1A1A] rounded mb-3 mt-8" />
                <div className="flex gap-2 mb-4">
                  <div className="h-5 w-16 bg-[#1A1A1A] rounded-full" />
                  <div className="h-5 w-20 bg-[#1A1A1A] rounded-full" />
                </div>
                <div className="h-4 w-full bg-[#1A1A1A] rounded mb-2" />
                <div className="h-4 w-3/4 bg-[#1A1A1A] rounded mb-6" />
                <div className="h-12 w-full bg-[#1A1A1A] rounded-2xl" />
              </div>
            </div>
          ))}
          {/* Compact card skeletons */}
          {[1, 2].map(i => (
            <div key={`compact-${i}`} className="bg-[#242424] rounded-2xl border border-[#2E2E2E] animate-pulse flex items-center gap-3 p-3">
              <div className="w-16 h-16 rounded-xl bg-[#1A1A1A] flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="h-4 w-28 bg-[#1A1A1A] rounded mb-2" />
                <div className="h-3 w-16 bg-[#1A1A1A] rounded" />
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#1A1A1A] flex-shrink-0" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-[100dvh] pb-40 max-w-md mx-auto text-[#F5F5F5] transition-colors duration-1000 ease-out relative overflow-hidden"
      style={{ backgroundColor: bgColor }}
    >
      <div className="relative" style={{ zIndex: 1 }}>

      {/* Header */}
      <header className="px-6 pt-16 pb-12">
        <div className="flex items-center justify-between mb-10">
          <span className="text-lg font-bold tracking-wide text-[#F97316] uppercase" style={{ fontFamily: 'Inter, sans-serif' }}>
            {settings.displayName}
          </span>
          <img
            src={settings.logoUrl || '/logo.png'}
            alt={settings.displayName}
            className="h-16 w-16 rounded-full object-cover border-2 border-[#F97316]/30"
          />
        </div>

        <div>
          <h1 className="text-4xl font-bold tracking-tight text-[#F5F5F5] leading-tight" style={{ fontFamily: 'Inter, sans-serif' }}>
            {settings.featuredTitle}
          </h1>
          <p className="text-lg text-[#A3A3A3] font-normal tracking-tight mt-1">{settings.secondTitle}</p>
        </div>
      </header>

      {/* Category Pills */}
      {categories.length > 0 && (
        <div className="sticky top-0 z-10 px-4 py-3 overflow-x-auto no-scrollbar" style={{ backgroundColor: bgColor }}>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveCategory(null)}
              className="px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors"
              style={{
                backgroundColor: activeCategory === null ? '#F97316' : '#2A2A2A',
                color: activeCategory === null ? '#FFFFFF' : '#A3A3A3',
              }}
            >
              Todos
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className="px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors"
                style={{
                  backgroundColor: activeCategory === cat.id ? '#F97316' : '#2A2A2A',
                  color: activeCategory === cat.id ? '#FFFFFF' : '#A3A3A3',
                }}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Product List */}
      <main className="px-4 flex flex-col gap-6">
        {filteredBurgers.map(burger => (
          <ProductCard
            key={burger.id}
            item={burger}
            quantity={getQuantity(cart, burger.id)}
            onAdd={() => handleAddNewItem(burger.id)}
            onRemove={() => handleUpdateQuantity(burger.id, -1)}
            layout={cardLayout}
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
        <div className="fixed left-0 right-0 z-40 px-6" style={{ bottom: 'calc(2rem + var(--sab))' }}>
          <div className="max-w-md mx-auto">
            <button
              onClick={handleOpenDrinks}
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
        </div>
      )}

      </div>

      {/* Drinks Page */}
      {showDrinks && (
        <DrinksPage
          cart={cart}
          drinks={drinks}
          totalItems={totalItems}
          onUpdateQuantity={handleUpdateQuantity}
          onContinueToCart={handleContinueToCart}
          onClose={handleCloseDrinks}
          closing={closingDrinks}
        />
      )}

      {/* Cart Modal */}
      {showCart && (
        <CartModal
          items={cartItems}
          total={totalPrice}
          onClose={handleCloseCart}
          onUpdateQuantity={handleUpdateQuantity}
          onUpdateNotes={handleUpdateNotes}
          closing={closingCart}
        />
      )}
    </div>
  );
};

export default App;
