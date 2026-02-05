import React, { useState } from 'react';
import { CartItem, UserDetails } from '../types';
import { WHATSAPP_NUMBER } from '../constants';
import { X, Minus, Plus } from 'lucide-react';

interface CartModalProps {
  items: CartItem[];
  onClose: () => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  total: number;
}

export const CartModal: React.FC<CartModalProps> = ({ items, onClose, onUpdateQuantity, total }) => {
  const [step, setStep] = useState<'review' | 'details'>('review');
  const [details, setDetails] = useState<UserDetails>({ name: '', address: '', notes: '' });

  // Prevent body scroll when modal is open
  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleCheckout = () => {
    const itemsList = items.map(i => `• ${i.quantity}x ${i.name} (R$${(i.price * i.quantity).toFixed(2)})`).join('\n');
    const message = `
Olá BURGER SPOT! 🍔 Novo pedido:

*ITENS:*
${itemsList}

*TOTAL: R$${total.toFixed(2)}*

*CLIENTE:*
${details.name}
${details.address}
${details.notes ? `Observação: ${details.notes}` : ''}
`.trim();

    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#1C1917]/20 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white w-full h-full flex flex-col overflow-hidden">

        {/* Header */}
        <div className="p-6 border-b border-[#E7E5E4] flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-[#1C1917]">
            {step === 'review' ? 'Seu Pedido' : 'Entrega'}
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#F5F5F4] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === 'review' ? (
            <div className="space-y-4">
              {items.length === 0 ? (
                <div className="text-center py-20 text-[#78716C]">
                  <p className="text-lg">Seu pedido está vazio</p>
                </div>
              ) : (
                items.map(item => (
                  <div key={item.id} className="flex gap-4 p-4 rounded-2xl bg-[#F5F5F4]">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-lg text-[#1C1917] mb-1">{item.name}</h4>
                      <p className="text-sm text-[#78716C] mb-3">R${item.price.toFixed(2)}</p>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="w-8 h-8 flex items-center justify-center bg-white rounded-lg hover:bg-[#E7E5E4] transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="font-semibold text-sm w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="w-8 h-8 flex items-center justify-center bg-white rounded-lg hover:bg-[#E7E5E4] transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="block text-base font-semibold text-[#1C1917] mb-3">Nome</label>
                <input
                  type="text"
                  required
                  className="w-full px-5 py-4 bg-[#F5F5F4] rounded-2xl text-base text-[#1C1917] focus:outline-none focus:ring-2 focus:ring-[#F97316] placeholder:text-[#A8A29E]"
                  placeholder="Seu nome"
                  value={details.name}
                  onChange={e => setDetails({...details, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-base font-semibold text-[#1C1917] mb-3">Endereço</label>
                <textarea
                  required
                  className="w-full px-5 py-4 bg-[#F5F5F4] rounded-2xl text-base text-[#1C1917] focus:outline-none focus:ring-2 focus:ring-[#F97316] h-32 resize-none placeholder:text-[#A8A29E]"
                  placeholder="Endereço de entrega"
                  value={details.address}
                  onChange={e => setDetails({...details, address: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-base font-semibold text-[#1C1917] mb-3">Observações (opcional)</label>
                <input
                  type="text"
                  className="w-full px-5 py-4 bg-[#F5F5F4] rounded-2xl text-base text-[#1C1917] focus:outline-none focus:ring-2 focus:ring-[#F97316] placeholder:text-[#A8A29E]"
                  placeholder="Instruções especiais"
                  value={details.notes}
                  onChange={e => setDetails({...details, notes: e.target.value})}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[#E7E5E4] bg-white">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-[#78716C]">Total</span>
            <span className="text-2xl font-bold text-[#F97316]">R${total.toFixed(2)}</span>
          </div>

          {step === 'review' ? (
            <button
              onClick={() => setStep('details')}
              disabled={items.length === 0}
              className="w-full h-14 bg-[#F97316] text-white rounded-2xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-transform"
            >
              Continuar
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={() => setStep('review')}
                className="h-14 px-6 bg-[#F5F5F4] text-[#1C1917] rounded-2xl font-semibold active:scale-[0.98] transition-transform"
              >
                Voltar
              </button>
              <button
                onClick={handleCheckout}
                disabled={!details.name || !details.address}
                className="flex-1 h-14 bg-[#25D366] text-white rounded-2xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-transform"
              >
                Enviar WhatsApp
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
