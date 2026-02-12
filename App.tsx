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
          {settings.logoUrl && (
            <img
              src={settings.logoUrl}
              alt={settings.displayName}
              className="h-16 w-16 rounded-full object-cover border-2 border-[#F97316]/30"
            />
          )}
        </div>

        <div>
          <h1 className="text-4xl font-bold tracking-tight text-[#F5F5F5] leading-tight" style={{ fontFamily: 'Inter, sans-serif' }}>
            {settings.featuredTitle}
          </h1>
          <p className="text-lg text-[#A3A3A3] font-normal tracking-tight mt-1">{settings.secondTitle}</p>

          {/* Social Media Icons */}
          {(settings.instagramUrl || settings.facebookUrl || settings.whatsappUrl || settings.tiktokUrl || settings.youtubeUrl) && (
            <div className="flex items-center gap-3 mt-4">
              {settings.instagramUrl && (
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-[#2A2A2A] flex items-center justify-center hover:bg-[#333] transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#A3A3A3">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              )}
              {settings.facebookUrl && (
                <a
                  href={settings.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-[#2A2A2A] flex items-center justify-center hover:bg-[#333] transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#A3A3A3">
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                  </svg>
                </a>
              )}
              {settings.whatsappUrl && (
                <a
                  href={settings.whatsappUrl.startsWith('http') ? settings.whatsappUrl : `https://wa.me/${settings.whatsappUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-[#2A2A2A] flex items-center justify-center hover:bg-[#333] transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#A3A3A3">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                  </svg>
                </a>
              )}
              {settings.tiktokUrl && (
                <a
                  href={settings.tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-[#2A2A2A] flex items-center justify-center hover:bg-[#333] transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#A3A3A3">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                  </svg>
                </a>
              )}
              {settings.youtubeUrl && (
                <a
                  href={settings.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-[#2A2A2A] flex items-center justify-center hover:bg-[#333] transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#A3A3A3">
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                  </svg>
                </a>
              )}
            </div>
          )}
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
