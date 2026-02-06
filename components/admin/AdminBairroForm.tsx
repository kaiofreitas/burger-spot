import React, { useState } from 'react';
import { Bairro } from '../../types';

interface AdminBairroFormProps {
  bairro?: Bairro;
  onSave: (data: Omit<Bairro, 'id'> | (Partial<Bairro> & { id: number })) => void;
  onCancel: () => void;
}

export const AdminBairroForm: React.FC<AdminBairroFormProps> = ({ bairro, onSave, onCancel }) => {
  const isEdit = !!bairro;

  const [name, setName] = useState(bairro?.name || '');
  const [fee, setFee] = useState(bairro?.fee?.toString() || '');
  const [sortOrder, setSortOrder] = useState(bairro?.sort_order?.toString() || '0');
  const [active, setActive] = useState(bairro?.active ?? true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const parsedFee = parseFloat(fee) || 0;
    const parsedSortOrder = parseInt(sortOrder, 10) || 0;

    if (isEdit && bairro) {
      onSave({
        id: bairro.id,
        name,
        fee: parsedFee,
        sort_order: parsedSortOrder,
        active,
      });
    } else {
      onSave({
        name,
        fee: parsedFee,
        sort_order: parsedSortOrder,
        active,
      });
    }
  };

  const inputStyle: React.CSSProperties = {
    backgroundColor: '#2A2A2A',
    border: '1px solid #333333',
    color: '#F5F5F5',
  };

  const labelStyle: React.CSSProperties = {
    color: '#A3A3A3',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md mx-4 my-8 rounded-2xl p-6"
        style={{ backgroundColor: '#242424', border: '1px solid #2E2E2E' }}
      >
        <h2
          className="text-lg font-bold mb-6"
          style={{ color: '#F97316', fontFamily: 'Inter, sans-serif' }}
        >
          {isEdit ? 'Editar Bairro' : 'Novo Bairro'}
        </h2>

        {/* Name */}
        <div className="mb-4">
          <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={labelStyle}>
            Nome
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
            style={inputStyle}
            placeholder="Nome do bairro"
          />
        </div>

        {/* Fee */}
        <div className="mb-4">
          <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={labelStyle}>
            Taxa (R$)
          </label>
          <input
            type="number"
            value={fee}
            onChange={(e) => setFee(e.target.value)}
            required
            min="0"
            step="0.01"
            className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
            style={inputStyle}
            placeholder="0.00"
          />
        </div>

        {/* Sort Order */}
        <div className="mb-4">
          <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={labelStyle}>
            Ordem
          </label>
          <input
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
            style={inputStyle}
            placeholder="0"
          />
        </div>

        {/* Active */}
        <div className="mb-6 flex items-center gap-3">
          <label className="text-xs font-semibold uppercase tracking-wider" style={labelStyle}>
            Ativo
          </label>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="sr-only"
            />
            <span
              className="block rounded-full transition-colors"
              style={{
                width: 44,
                height: 24,
                backgroundColor: active ? '#F97316' : '#333333',
              }}
            >
              <span
                className="block rounded-full transition-all"
                style={{
                  width: 18,
                  height: 18,
                  backgroundColor: '#FFFFFF',
                  transform: `translateX(${active ? 23 : 3}px) translateY(3px)`,
                }}
              />
            </span>
          </label>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl font-bold text-sm uppercase tracking-wider transition-opacity hover:opacity-80"
            style={{
              backgroundColor: '#2A2A2A',
              color: '#A3A3A3',
              border: '1px solid #333333',
            }}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="flex-1 py-3 rounded-xl font-bold text-sm uppercase tracking-wider transition-opacity hover:opacity-80"
            style={{
              backgroundColor: '#F97316',
              color: '#FFFFFF',
            }}
          >
            Salvar
          </button>
        </div>
      </form>
    </div>
  );
};
