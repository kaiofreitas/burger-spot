import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { useAdminProducts } from '../../hooks/useAdminProducts';
import { useAdminBairros } from '../../hooks/useAdminBairros';
import { useAdminCategories } from '../../hooks/useAdminCategories';
import { useAdminStoreSettings } from '../../hooks/useAdminStoreSettings';
import { AdminProductRow } from './AdminProductRow';
import { AdminProductForm } from './AdminProductForm';
import { AdminBairroRow } from './AdminBairroRow';
import { AdminBairroForm } from './AdminBairroForm';
import { AdminSettingsTab } from './AdminSettingsTab';
import { Product, Bairro } from '../../types';

interface AdminPanelProps {
  onSignOut: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onSignOut }) => {
  const { products, loading: productsLoading, toggleAvailability, updateProduct, createProduct, reorderProducts } = useAdminProducts();
  const { bairros, loading: bairrosLoading, toggleActive, updateBairro, createBairro } = useAdminBairros();
  const { categories, createCategory, deleteCategory } = useAdminCategories();
  const { settings, cardLayout, updateCardLayout, updateSettings, uploadLogo, removeLogo } = useAdminStoreSettings();

  const [view, setView] = useState<'products' | 'bairros' | 'categorias' | 'settings'>('products');
  const [filter, setFilter] = useState<'all' | 'burger' | 'drink'>('all');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingBairro, setEditingBairro] = useState<Bairro | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showBairroForm, setShowBairroForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
  );

  const filteredProducts = filter === 'all'
    ? products
    : products.filter(p => p.category === filter);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = filteredProducts.findIndex(p => p.id === active.id);
    const newIndex = filteredProducts.findIndex(p => p.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove([...filteredProducts], oldIndex, newIndex);
    reorderProducts(reordered.map((p: Product) => p.id));
  };

  const handleProductSave = async (data: Omit<Product, 'id'> | (Partial<Product> & { id: string })) => {
    if ('id' in data && data.id) {
      const { id, ...updates } = data;
      await updateProduct(id, updates);
    } else {
      await createProduct(data as Omit<Product, 'id'>);
    }
    setShowProductForm(false);
    setEditingProduct(null);
  };

  const handleBairroSave = async (data: Omit<Bairro, 'id'> | (Partial<Bairro> & { id: number })) => {
    if ('id' in data && data.id) {
      const { id, ...updates } = data;
      await updateBairro(id, updates);
    } else {
      await createBairro(data as Omit<Bairro, 'id'>);
    }
    setShowBairroForm(false);
    setEditingBairro(null);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleEditBairro = (bairro: Bairro) => {
    setEditingBairro(bairro);
    setShowBairroForm(true);
  };

  const handleCreate = () => {
    if (view === 'products') {
      setEditingProduct(null);
      setShowProductForm(true);
    } else {
      setEditingBairro(null);
      setShowBairroForm(true);
    }
  };

  const loading = view === 'products' ? productsLoading : view === 'bairros' ? bairrosLoading : false;

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center max-w-md mx-auto"
        style={{ backgroundColor: '#1A1A1A' }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            border: '4px solid #333333',
            borderTop: '4px solid #F97316',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen max-w-md mx-auto pb-24"
      style={{ backgroundColor: '#1A1A1A', color: '#F5F5F5' }}
    >
      {/* Header */}
      <header
        className="flex items-center justify-between px-6 py-4 sticky top-0 z-10"
        style={{ backgroundColor: '#1A1A1A', borderBottom: '1px solid #2E2E2E' }}
      >
        <h1 className="text-xl font-bold" style={{ color: '#F97316', fontFamily: 'Inter, sans-serif' }}>
          Admin
        </h1>
        <button
          onClick={onSignOut}
          className="px-4 py-2 rounded-lg text-sm font-semibold transition-opacity hover:opacity-80"
          style={{ backgroundColor: '#2A2A2A', color: '#A3A3A3', border: '1px solid #333333' }}
        >
          Sair
        </button>
      </header>

      {/* View Switcher */}
      <div className="flex gap-2 px-6 pt-4">
        {([
          { key: 'products' as const, label: 'Produtos' },
          { key: 'categorias' as const, label: 'Categorias' },
          { key: 'bairros' as const, label: 'Bairros' },
          { key: 'settings' as const, label: 'Config' },
        ]).map(tab => (
          <button
            key={tab.key}
            onClick={() => setView(tab.key)}
            className="px-4 py-2 rounded-lg text-sm font-bold transition-colors"
            style={{
              backgroundColor: view === tab.key ? '#F97316' : 'transparent',
              color: view === tab.key ? '#FFFFFF' : '#A3A3A3',
              borderBottom: view === tab.key ? 'none' : '2px solid transparent',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Products View */}
      {view === 'products' && (
        <>
          {/* Category Filter Tabs */}
          <div className="flex gap-2 px-6 py-4">
            {([
              { key: 'all' as const, label: 'Todos' },
              { key: 'burger' as const, label: 'Burgers' },
              { key: 'drink' as const, label: 'Bebidas' },
            ]).map(tab => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className="px-4 py-2 rounded-full text-sm font-semibold transition-colors"
                style={{
                  backgroundColor: filter === tab.key ? '#F97316' : '#2A2A2A',
                  color: filter === tab.key ? '#FFFFFF' : '#A3A3A3',
                  border: filter === tab.key ? 'none' : '1px solid #333333',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Product List */}
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={filteredProducts.map(p => p.id)} strategy={verticalListSortingStrategy}>
              <div className="px-4 flex flex-col gap-2">
                {filteredProducts.map(product => (
                  <AdminProductRow
                    key={product.id}
                    product={product}
                    onToggle={toggleAvailability}
                    onEdit={handleEditProduct}
                  />
                ))}
                {filteredProducts.length === 0 && (
                  <p className="text-center py-8" style={{ color: '#A3A3A3' }}>
                    Nenhum produto encontrado.
                  </p>
                )}
              </div>
            </SortableContext>
          </DndContext>
        </>
      )}

      {/* Bairros View */}
      {view === 'bairros' && (
        <div className="px-4 pt-4 flex flex-col gap-2">
          {bairros.map(bairro => (
            <AdminBairroRow
              key={bairro.id}
              bairro={bairro}
              onToggle={toggleActive}
              onEdit={handleEditBairro}
            />
          ))}
          {bairros.length === 0 && (
            <p className="text-center py-8" style={{ color: '#A3A3A3' }}>
              Nenhum bairro encontrado.
            </p>
          )}
        </div>
      )}

      {/* Categorias View */}
      {view === 'categorias' && (
        <div className="px-4 pt-6 flex flex-col gap-4">
          <div className="px-2">
            <h3 className="text-base font-bold mb-1" style={{ color: '#F5F5F5' }}>
              Categorias do Cardapio
            </h3>
            <p className="text-xs mb-4" style={{ color: '#A3A3A3' }}>
              Gerencie as categorias que aparecem no cardapio e no formulario de produtos.
            </p>
          </div>

          {/* Category list — card-style rows */}
          <div className="flex flex-col gap-2">
            {categories.map(cat => (
              <div
                key={cat.id}
                className="flex items-center gap-3 p-3 rounded-xl"
                style={{
                  backgroundColor: '#242424',
                  border: '1px solid #2E2E2E',
                }}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: '#F5F5F5' }}>
                    {cat.name}
                  </p>
                </div>
                <button
                  onClick={() => deleteCategory(cat.id)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-opacity hover:opacity-80 flex-shrink-0"
                  style={{
                    backgroundColor: '#2A2A2A',
                    color: '#EF4444',
                    border: '1px solid #333333',
                  }}
                >
                  Excluir
                </button>
              </div>
            ))}
            {categories.length === 0 && (
              <p className="text-center py-8" style={{ color: '#A3A3A3' }}>
                Nenhuma categoria encontrada.
              </p>
            )}
          </div>

          {/* Add category form */}
          <div className="flex gap-2 px-0 pt-2">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Nova categoria"
              className="flex-1 px-3 py-2 rounded-lg text-sm outline-none"
              style={{ backgroundColor: '#2A2A2A', border: '1px solid #333333', color: '#F5F5F5' }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && newCategoryName.trim()) {
                  createCategory({ name: newCategoryName.trim(), sort_order: categories.length });
                  setNewCategoryName('');
                }
              }}
            />
            <button
              onClick={() => {
                if (!newCategoryName.trim()) return;
                createCategory({ name: newCategoryName.trim(), sort_order: categories.length });
                setNewCategoryName('');
              }}
              className="px-4 py-2 rounded-lg text-sm font-bold transition-opacity hover:opacity-80"
              style={{ backgroundColor: '#F97316', color: '#FFFFFF' }}
            >
              Adicionar
            </button>
          </div>
        </div>
      )}

      {/* Settings View */}
      {view === 'settings' && (
        <AdminSettingsTab
          settings={settings}
          onChangeLayout={updateCardLayout}
          onUpdateSettings={updateSettings}
          onUploadLogo={uploadLogo}
          onRemoveLogo={removeLogo}
        />
      )}

      {/* Floating Add Button (only for products and bairros) */}
      {(view === 'products' || view === 'bairros') && (
        <button
          onClick={handleCreate}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold shadow-lg transition-transform active:scale-90 hover:scale-105 z-20"
          style={{ backgroundColor: '#F97316', color: '#FFFFFF' }}
        >
          +
        </button>
      )}

      {/* Product Form Overlay */}
      {showProductForm && (
        <AdminProductForm
          product={editingProduct || undefined}
          categories={categories}
          onSave={handleProductSave}
          onCancel={() => { setShowProductForm(false); setEditingProduct(null); }}
        />
      )}

      {/* Bairro Form Overlay */}
      {showBairroForm && (
        <AdminBairroForm
          bairro={editingBairro || undefined}
          onSave={handleBairroSave}
          onCancel={() => { setShowBairroForm(false); setEditingBairro(null); }}
        />
      )}
    </div>
  );
};
