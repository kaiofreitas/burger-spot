import React, { useState } from 'react';
import { Cookie } from '../types';
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
        className="fixed bottom-24 right-6 z-40 bg-[#1C1917] text-[#94C9C6] p-4 rounded-full shadow-2xl hover:scale-105 transition-transform flex items-center justify-center ring-2 ring-[#1C1917] ring-offset-2 ring-offset-[#FDFBF7]"
      >
        <Sparkles size={20} strokeWidth={2} />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-[#1C1917]/10 backdrop-blur-sm">
      <div className="bg-[#FDFBF7] w-full max-w-md rounded-2xl p-6 shadow-xl border border-[#E7E5E4] relative animate-in slide-in-from-bottom-10 fade-in duration-300">
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-[#A8A29E] hover:text-[#1C1917]"
        >
          <X size={20} />
        </button>

        <div className="mb-6">
          <h3 className="serif text-xl text-[#1C1917] mb-1">Sommelier de Galletas</h3>
          <p className="text-[#94C9C6] text-xs uppercase tracking-widest font-bold">AMORDIDAS AI</p>
        </div>

        <div className="mb-6">
          {response ? (
            <div className="bg-[#94C9C6]/10 p-5 rounded-xl text-[#1C1917] text-sm leading-relaxed border border-[#94C9C6]/20">
              {response}
              <button 
                onClick={() => { setResponse(''); setQuery(''); }}
                className="block mt-4 text-[#1C1917] font-bold text-xs hover:underline uppercase tracking-wider"
              >
                Preguntar de nuevo
              </button>
            </div>
          ) : (
            <p className="text-[#57534E] text-sm">
              Describe tus gustos. Nosotros recomendamos. <br/>
              <span className="italic opacity-50">ej. "algo con chocolate pero salado"</span>
            </p>
          )}
        </div>

        {!response && (
          <form onSubmit={handleAsk} className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Escribe tu antojo..."
              className="w-full bg-white border border-[#E7E5E4] rounded-lg pl-4 pr-12 py-4 text-[#1C1917] placeholder:text-[#A8A29E] focus:ring-1 focus:ring-[#94C9C6] outline-none text-sm"
              disabled={isLoading}
            />
            <button 
              type="submit"
              disabled={isLoading || !query.trim()}
              className="absolute right-2 top-2 bottom-2 aspect-square flex items-center justify-center bg-[#1C1917] text-[#94C9C6] rounded-md disabled:opacity-50 hover:bg-[#292524]"
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