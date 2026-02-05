import React, { useState, useMemo, useEffect } from 'react';
import { COOKIES } from './constants';
import { CartItem } from './types';
import { ProductCard } from './components/ProductCard';
import { CartModal } from './components/CartModal';

const pastelColors = [
  '#F5F1E8', // Light beige
  '#E9F3FF', // Light blue
  '#E8F5E9', // Light green
  '#FFF3E0', // Light orange
  '#F3E5F5', // Light purple
  '#FCE4EC', // Light pink
  '#F5F1E8', // Light beige (loops back to start)
];

const App: React.FC = () => {
  const [cart, setCart] = useState<Record<string, number>>({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [bgColor, setBgColor] = useState(pastelColors[0]);

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
        const cookie = COOKIES.find(c => c.id === id);
        if (!cookie) return null;
        return { ...cookie, quantity };
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

      // Calculate which color to use based on scroll
      const colorIndex = Math.min(
        Math.floor(scrollPercentage * pastelColors.length),
        pastelColors.length - 1
      );

      setBgColor(pastelColors[colorIndex]);
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
          <h1 className="logo-font text-6xl text-[#A8D5BA] leading-[0.85] tracking-tight font-bold">
            AMOR<br/>DIDAS
          </h1>
          <div className="bg-[#FCE4EC] px-3 py-1.5 rounded-full mt-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#1C1917]">Hecho en CDMX</span>
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-xl text-[#1C1917] font-medium tracking-tight">Galletas gorditas.</p>
          <p className="text-xl text-[#1C1917] font-medium tracking-tight">Corazón suave.</p>
          <p className="text-xl text-[#1C1917]/60 font-normal tracking-tight">Hechas a mano.</p>
        </div>
      </header>

      {/* Product List */}
      <main className="px-4 flex flex-col gap-6">
        {COOKIES.map(cookie => (
          <ProductCard 
            key={cookie.id}
            cookie={cookie}
            quantity={cart[cookie.id] || 0}
            onAdd={() => handleUpdateQuantity(cookie.id, 1)}
            onRemove={() => handleUpdateQuantity(cookie.id, -1)}
          />
        ))}
      </main>

      {/* Bio Section */}
      <section className="px-6 py-16 max-w-lg mx-auto">
        <h3 className="text-2xl font-semibold text-[#1C1917] mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
          Sobre Nosotros
        </h3>

        <div className="flex flex-col gap-6">
          {/* Photo */}
          <div className="w-full aspect-[4/3] rounded-2xl bg-[#F5F5F4] overflow-hidden">
            <img
              src="https://via.placeholder.com/600x450"
              alt="Maker"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Text */}
          <div>
            <p className="text-[#1C1917] text-base leading-relaxed mb-4">
              Desde niña, siempre soñé con crear algo que hiciera sonreír a la gente. Después de años trabajando en oficinas, decidí arriesgarme y seguir mi pasión: hornear. AMORDIDAS nació en mi pequeña cocina en CDMX, experimentando con recetas hasta encontrar el equilibrio perfecto entre bordes crujientes y centros suaves.
            </p>
            <p className="text-[#1C1917] text-base leading-relaxed mb-4">
              Cada galleta es hecha a mano con ingredientes de calidad, porque creo que la comida hecha con amor sabe diferente. Mi sueño es que cada mordida te recuerde a esos momentos especiales de la infancia, cuando todo parecía más simple y dulce.
            </p>
            <p className="text-[#78716C] text-sm">
              — Sarah
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <div className="text-center py-16 opacity-40">
        <p className="serif italic">corazón colombiano, hecho con amor en cdmx</p>
      </div>

      {/* Floating Cart Pill */}
      {totalItems > 0 && (
        <div className="fixed bottom-8 left-6 right-6 z-40 max-w-md mx-auto">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-[#1C1917] text-[#FDFBF7] h-16 rounded-[2rem] shadow-2xl shadow-[#1C1917]/20 flex items-center justify-between px-2 pr-8 transition-transform active:scale-95 hover:scale-[1.02]"
          >
            <div className="flex items-center gap-4">
              <div className="bg-[#94C9C6] text-[#0f2e2c] h-12 px-6 rounded-[1.5rem] flex items-center justify-center font-bold text-lg">
                {totalItems}
              </div>
              <span className="text-sm font-bold uppercase tracking-widest">Ver Caja</span>
            </div>
            <span className="text-2xl font-bold" style={{ fontFamily: 'Inter, sans-serif' }}>${totalPrice.toFixed(2)} MXN</span>
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