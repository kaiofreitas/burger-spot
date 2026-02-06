import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { Product } from '../../types';
import { AdminToggle } from './AdminToggle';

interface AdminProductRowProps {
  product: Product;
  onToggle: (id: string, available: boolean) => void;
  onEdit: (product: Product) => void;
}

export const AdminProductRow: React.FC<AdminProductRowProps> = ({ product, onToggle, onEdit }) => {
  const formattedPrice = `R$${product.price.toFixed(2)}`;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: product.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    backgroundColor: '#242424',
    border: '1px solid #2E2E2E',
    opacity: isDragging ? 0.5 : product.available ? 1 : 0.6,
    zIndex: isDragging ? 50 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 p-3 rounded-xl"
    >
      {/* Drag Handle */}
      <button
        {...attributes}
        {...listeners}
        className="flex-shrink-0 touch-none"
        style={{ color: '#555', cursor: 'grab' }}
        aria-label="Reordenar"
      >
        <GripVertical size={18} />
      </button>

      {/* Thumbnail */}
      <div
        className="rounded-lg overflow-hidden flex-shrink-0"
        style={{ width: 40, height: 40, backgroundColor: '#2A2A2A' }}
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Name + Price */}
      <div className="flex-1 min-w-0">
        <p
          className="text-sm font-semibold truncate"
          style={{ color: '#F5F5F5' }}
        >
          {product.name}
        </p>
        <p
          className="text-xs"
          style={{ color: '#A3A3A3' }}
        >
          {formattedPrice}
        </p>
      </div>

      {/* Toggle */}
      <AdminToggle
        checked={product.available}
        onChange={(checked) => onToggle(product.id, checked)}
      />

      {/* Edit Button */}
      <button
        onClick={() => onEdit(product)}
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
