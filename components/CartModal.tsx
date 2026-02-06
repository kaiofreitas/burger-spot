import React, { useState, useMemo } from 'react';
import { CartItem, UserDetails, PaymentMethod } from '../types';
import { WHATSAPP_NUMBER, PIX_KEY, BAIRROS } from '../constants';
import { BairroSelect } from './BairroSelect';
import { X, Minus, Plus, Smartphone, CreditCard, Banknote, Copy, Check } from 'lucide-react';

interface CartModalProps {
  items: CartItem[];
  onClose: () => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onUpdateNotes: (id: string, notes: string) => void;
  total: number;
}

export const CartModal: React.FC<CartModalProps> = ({ items, onClose, onUpdateQuantity, onUpdateNotes, total }) => {
  const [step, setStep] = useState<'review' | 'details' | 'payment'>('review');
  const [details, setDetails] = useState<UserDetails>({ name: '', address: '', bairro: '', notes: '', payment: '' });
  const [copied, setCopied] = useState(false);

  const deliveryFee = useMemo(() => {
    if (!details.bairro) return 0;
    const found = BAIRROS.find(b => b.name === details.bairro);
    return found ? found.fee : 0;
  }, [details.bairro]);

  const grandTotal = total + deliveryFee;

  const handleCopyPix = async () => {
    await navigator.clipboard.writeText(PIX_KEY);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Prevent body scroll when modal is open
  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const PAYMENT_LABELS: Record<PaymentMethod, string> = {
    pix: 'Pix',
    cartao: 'Cartão na entrega',
    dinheiro: 'Dinheiro na entrega',
  };

  const handleCheckout = () => {
    const itemsList = items.map(i => {
      let line = `• ${i.quantity}x ${i.name} (R$${(i.price * i.quantity).toFixed(2)})`;
      if (i.notes) {
        line += `\n  Obs: ${i.notes}`;
      }
      return line;
    }).join('\n');
    const paymentLabel = details.payment ? PAYMENT_LABELS[details.payment] : '';
    const deliveryLine = details.bairro && deliveryFee > 0
      ? `\n(Subtotal R$${total.toFixed(2)} + Entrega R$${deliveryFee.toFixed(2)})`
      : '';
    const message = `
Olá BRANDÃO BURGUER, esse é o meu pedido:

*ITENS:*
${itemsList}

*TOTAL: R$${grandTotal.toFixed(2)}*${deliveryLine}

*PAGAMENTO:* ${paymentLabel}

*CLIENTE:*
${details.name}
${details.address}
${details.bairro ? `Bairro: ${details.bairro}` : ''}
${details.notes ? `Observação: ${details.notes}` : ''}
`.trim();

    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-[#1A1A1A] w-full h-full overflow-y-auto">
        <div className="min-h-full flex flex-col p-6">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-[#F5F5F5]">
            {step === 'review' ? 'Revise seu pedido' : step === 'details' ? 'Entrega' : 'Pagamento'}
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#2A2A2A] transition-colors text-[#A3A3A3]"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1">
          {step === 'review' ? (
            <div className="divide-y divide-[#2E2E2E]">
              {items.length === 0 ? (
                <div className="text-center py-20 text-[#A3A3A3]">
                  <p className="text-lg">Seu pedido está vazio</p>
                </div>
              ) : (
                items.map(item => (
                  <div key={item.id} className="py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-[15px] text-[#F5F5F5]">{item.name}</h4>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="w-7 h-7 flex items-center justify-center rounded-full border border-[#333] text-[#A3A3A3] hover:text-[#F5F5F5] hover:border-[#555] transition-colors"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="font-semibold text-sm w-5 text-center text-[#F5F5F5]">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="w-7 h-7 flex items-center justify-center rounded-full border border-[#333] text-[#A3A3A3] hover:text-[#F5F5F5] hover:border-[#555] transition-colors"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <span className="text-sm font-semibold text-[#F97316] w-20 text-right flex-shrink-0">R${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                    {item.category !== 'drink' && (
                      <input
                        type="text"
                        value={item.notes}
                        onChange={e => onUpdateNotes(item.id, e.target.value)}
                        placeholder="Alguma observação? (ex: sem alface, sem cebola)"
                        className="w-full mt-2 px-3 py-2 bg-[#242424] border border-[#333333] rounded-lg text-xs text-[#F5F5F5] focus:outline-none focus:ring-1 focus:ring-[#F97316] placeholder:text-[#555555]"
                      />
                    )}
                  </div>
                ))
              )}
            </div>
          ) : step === 'details' ? (
            <div className="space-y-6">
              <div>
                <label className="block text-base font-semibold text-[#F5F5F5] mb-3">Nome</label>
                <input
                  type="text"
                  required
                  className="w-full px-5 py-4 bg-[#2A2A2A] border border-[#333333] rounded-2xl text-base text-[#F5F5F5] focus:outline-none focus:ring-2 focus:ring-[#F97316] placeholder:text-[#666666]"
                  placeholder="Seu nome"
                  value={details.name}
                  onChange={e => setDetails({...details, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-base font-semibold text-[#F5F5F5] mb-3">Endereço</label>
                <textarea
                  required
                  className="w-full px-5 py-4 bg-[#2A2A2A] border border-[#333333] rounded-2xl text-base text-[#F5F5F5] focus:outline-none focus:ring-2 focus:ring-[#F97316] h-32 resize-none placeholder:text-[#666666]"
                  placeholder="Endereço de entrega"
                  value={details.address}
                  onChange={e => setDetails({...details, address: e.target.value})}
                />
              </div>
              <BairroSelect
                bairros={BAIRROS}
                value={details.bairro}
                onChange={(bairro) => setDetails({...details, bairro})}
              />
              <div>
                <label className="block text-base font-semibold text-[#F5F5F5] mb-3">Observações (opcional)</label>
                <input
                  type="text"
                  className="w-full px-5 py-4 bg-[#2A2A2A] border border-[#333333] rounded-2xl text-base text-[#F5F5F5] focus:outline-none focus:ring-2 focus:ring-[#F97316] placeholder:text-[#666666]"
                  placeholder="Instruções especiais"
                  value={details.notes}
                  onChange={e => setDetails({...details, notes: e.target.value})}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-[#A3A3A3] mb-2">Como você prefere pagar?</p>
              {([
                { id: 'pix' as PaymentMethod, label: 'Pix', icon: Smartphone, desc: 'Transferência instantânea' },
                { id: 'cartao' as PaymentMethod, label: 'Cartão na entrega', icon: CreditCard, desc: 'Débito ou crédito' },
                { id: 'dinheiro' as PaymentMethod, label: 'Dinheiro na entrega', icon: Banknote, desc: 'Pagamento em espécie' },
              ]).map(option => (
                <button
                  key={option.id}
                  onClick={() => setDetails({ ...details, payment: option.id })}
                  className={`w-full flex items-center gap-4 p-5 rounded-2xl border-2 transition-colors text-left ${
                    details.payment === option.id
                      ? 'border-[#F97316] bg-[#F97316]/10'
                      : 'border-[#333333] bg-[#242424] hover:border-[#404040]'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    details.payment === option.id ? 'bg-[#F97316] text-white' : 'bg-[#333333] text-[#A3A3A3]'
                  }`}>
                    <option.icon size={22} />
                  </div>
                  <div>
                    <p className="font-semibold text-[#F5F5F5]">{option.label}</p>
                    <p className="text-sm text-[#A3A3A3]">{option.desc}</p>
                  </div>
                </button>
              ))}

              {details.payment === 'pix' && (
                <div className="mt-6 p-5 bg-[#2A2A2A] border border-[#333333] rounded-2xl space-y-4">
                  <p className="text-sm font-semibold text-[#F5F5F5]">Chave Pix</p>
                  <button
                    onClick={handleCopyPix}
                    className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-[#2A2A2A] rounded-xl border border-[#333333] active:scale-[0.98] transition-transform"
                  >
                    <span className="text-base font-mono text-[#F5F5F5] truncate">{PIX_KEY}</span>
                    {copied ? (
                      <Check size={18} className="text-[#22C55E] flex-shrink-0" />
                    ) : (
                      <Copy size={18} className="text-[#A3A3A3] flex-shrink-0" />
                    )}
                  </button>
                  {copied && (
                    <p className="text-xs text-[#22C55E] font-medium">Chave copiada!</p>
                  )}
                  <p className="text-xs text-[#A3A3A3] leading-relaxed">
                    Salve o comprovante, você vai precisar enviá-lo depois via WhatsApp.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-[#2E2E2E]">
          {deliveryFee > 0 ? (
            <div className="mb-4 space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#A3A3A3]">Subtotal</span>
                <span className="text-sm text-[#A3A3A3]">R${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#A3A3A3]">Entrega ({details.bairro})</span>
                <span className="text-sm text-[#A3A3A3]">R${deliveryFee.toFixed(2)}</span>
              </div>
              <div className="border-t border-[#2E2E2E] pt-2 mt-2 flex justify-between items-center">
                <span className="text-sm font-medium text-[#F5F5F5]">Total</span>
                <span className="text-2xl font-bold text-[#F97316]">R${grandTotal.toFixed(2)}</span>
              </div>
            </div>
          ) : (
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-[#A3A3A3]">Total</span>
              <span className="text-2xl font-bold text-[#F97316]">R${grandTotal.toFixed(2)}</span>
            </div>
          )}

          {step === 'review' ? (
            <button
              onClick={() => setStep('details')}
              disabled={items.length === 0}
              className="w-full h-14 bg-[#F97316] text-white rounded-2xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-transform"
            >
              Continuar
            </button>
          ) : step === 'details' ? (
            <div className="flex gap-3">
              <button
                onClick={() => setStep('review')}
                className="h-14 px-6 bg-[#2A2A2A] text-[#F5F5F5] border border-[#333333] rounded-2xl font-semibold active:scale-[0.98] transition-transform"
              >
                Voltar
              </button>
              <button
                onClick={() => setStep('payment')}
                disabled={!details.name || !details.address || !details.bairro}
                className="flex-1 h-14 bg-[#F97316] text-white rounded-2xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-transform"
              >
                Continuar
              </button>
            </div>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={() => setStep('details')}
                className="h-14 px-6 bg-[#2A2A2A] text-[#F5F5F5] border border-[#333333] rounded-2xl font-semibold active:scale-[0.98] transition-transform"
              >
                Voltar
              </button>
              <button
                onClick={handleCheckout}
                disabled={!details.payment}
                className="flex-1 h-14 bg-[#25D366] text-white rounded-2xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-transform"
              >
                Enviar WhatsApp
              </button>
            </div>
          )}
        </div>
        </div>
      </div>
    </div>
  );
};
