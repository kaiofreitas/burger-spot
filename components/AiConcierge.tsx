import React, { useState } from 'react';
import { Product } from '../types';

/** @deprecated Alias kept for legacy code */
type Cookie = Product;
import { getCookieRecommendation } from '../services/geminiService';
import { Sparkles, X, ArrowUp } from 'lucide-react';

interface AiConciergeProps {
  cookies: Cookie[];
}

export const AiConcierge: React.FC<AiConciergeProps> = ({ cookies }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    const result = await getCookieRecommendation(query, cookies);
    setResponse(result);
    setIsLoading(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 z-40 bg-[#F97316] text-white p-4 rounded-full shadow-2xl hover:scale-105 transition-transform flex items-center justify-center ring-2 ring-[#F97316] ring-offset-2 ring-offset-[#1A1A1A]"
      >
        <Sparkles size={20} strokeWidth={2} />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-[#242424] w-full max-w-md rounded-2xl p-6 shadow-xl border border-[#333333] relative animate-in slide-in-from-bottom-10 fade-in duration-300">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-[#666666] hover:text-[#F5F5F5]"
        >
          <X size={20} />
        </button>

        <div className="mb-6">
          <h3 className="serif text-xl text-[#F5F5F5] mb-1">Consultor de Burgers</h3>
          <p className="text-[#F97316] text-xs uppercase tracking-widest font-bold">BRANDAO AI</p>
        </div>

        <div className="mb-6">
          {response ? (
            <div className="bg-[#F97316]/10 p-5 rounded-xl text-[#D4D4D4] text-sm leading-relaxed border border-[#F97316]/20">
              {response}
              <button
                onClick={() => { setResponse(''); setQuery(''); }}
                className="block mt-4 text-[#F97316] font-bold text-xs hover:underline uppercase tracking-wider"
              >
                Perguntar novamente
              </button>
            </div>
          ) : (
            <p className="text-[#A3A3A3] text-sm">
              Descreva suas preferencias. Nos recomendamos. <br/>
              <span className="italic opacity-50">ex. "algo com bacon mas nao muito gorduroso"</span>
            </p>
          )}
        </div>

        {!response && (
          <form onSubmit={handleAsk} className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Descreva o que voce quer..."
              className="w-full bg-[#2A2A2A] border border-[#333333] rounded-lg pl-4 pr-12 py-4 text-[#F5F5F5] placeholder:text-[#666666] focus:ring-1 focus:ring-[#F97316] outline-none text-sm"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="absolute right-2 top-2 bottom-2 aspect-square flex items-center justify-center bg-[#F97316] text-white rounded-md disabled:opacity-50 hover:bg-[#EA580C]"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <ArrowUp size={18} />
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};