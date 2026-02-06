import React from 'react';
import { Bairro } from '../../types';
import { AdminToggle } from './AdminToggle';

interface AdminBairroRowProps {
  bairro: Bairro;
  onToggle: (id: number, active: boolean) => void;
  onEdit: (bairro: Bairro) => void;
}

export const AdminBairroRow: React.FC<AdminBairroRowProps> = ({ bairro, onToggle, onEdit }) => {
  const formattedFee = `R$${bairro.fee.toFixed(2)}`;

  return (
    <div
      className="flex items-center gap-3 p-3 rounded-xl"
      style={{
        backgroundColor: '#242424',
        border: '1px solid #2E2E2E',
        opacity: bairro.active ? 1 : 0.6,
      }}
    >
      {/* Name */}
      <div className="flex-1 min-w-0">
        <p
          className="text-sm font-semibold truncate"
          style={{ color: '#F5F5F5' }}
        >
          {bairro.name}
        </p>
      </div>

      {/* Fee Badge */}
      <span
        className="px-2.5 py-1 rounded-lg text-xs font-bold flex-shrink-0"
        style={{
          backgroundColor: '#2A2A2A',
          color: '#F97316',
          border: '1px solid #333333',
        }}
      >
        {formattedFee}
      </span>

      {/* Toggle */}
      <AdminToggle
        checked={bairro.active}
        onChange={(checked) => onToggle(bairro.id, checked)}
      />

      {/* Edit Button */}
      <button
        onClick={() => onEdit(bairro)}
        className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-opacity hover:opacity-80 flex-shrink-0"
        style={{
          backgroundColor: '#2A2A2A',
          color: '#F97316',
          border: '1px solid #333333',
        }}
      >
        Editar
      </button>
    </div>
  );
};
