import React, { useState, useRef, useEffect } from 'react';
import { Product } from '../../types';
import { supabase } from '../../lib/supabase';

interface AdminProductFormProps {
  product?: Product;
  onSave: (data: Omit<Product, 'id'> | (Partial<Product> & { id: string })) => void;
  onCancel: () => void;
}

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 2 * 1024 * 1024; // 2MB

export const AdminProductForm: React.FC<AdminProductFormProps> = ({ product, onSave, onCancel }) => {
  const isEdit = !!product;

  const [name, setName] = useState(product?.name || '');
  const [description, setDescription] = useState(product?.description || '');
  const [price, setPrice] = useState(product?.price?.toString() || '');
  const [image, setImage] = useState(product?.image || '');
  const [category, setCategory] = useState<'burger' | 'drink'>(product?.category || 'burger');
  const [tags, setTags] = useState(product?.tags?.join(', ') || '');
  const [sortOrder, setSortOrder] = useState(product?.sort_order?.toString() || '0');
  const [available, setAvailable] = useState(product?.available ?? true);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setUploadError('Formato invalido. Use JPEG, PNG ou WebP.');
      return;
    }
    if (file.size > MAX_SIZE) {
      setUploadError('Imagem muito grande. Maximo 2MB.');
      return;
    }

    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsedTags = tags
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const parsedPrice = parseFloat(price) || 0;
    const parsedSortOrder = parseInt(sortOrder, 10) || 0;

    let finalImage = image;

    if (imageFile) {
      setUploading(true);
      setUploadError(null);

      const ext = imageFile.name.split('.').pop() || 'jpg';
      const fileName = `${crypto.randomUUID()}.${ext}`;

      const { error } = await supabase.storage
        .from('product-images')
        .upload(fileName, imageFile, { contentType: imageFile.type });

      if (error) {
        setUploadError('Erro ao enviar imagem. Tente novamente.');
        setUploading(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);

      finalImage = urlData.publicUrl;
      setUploading(false);
    }

    if (isEdit && product) {
      onSave({
        id: product.id,
        name,
        description,
        price: parsedPrice,
        image: finalImage,
        category,
        tags: parsedTags,
        sort_order: parsedSortOrder,
        available,
      });
    } else {
      onSave({
        name,
        description,
        price: parsedPrice,
        image: finalImage,
        category,
        tags: parsedTags,
        sort_order: parsedSortOrder,
        available,
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

  const previewSrc = imagePreview || image || null;

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
          {isEdit ? 'Editar Produto' : 'Novo Produto'}
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
            placeholder="Nome do produto"
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={labelStyle}>
            Descricao
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-3 py-2.5 rounded-lg text-sm outline-none resize-none"
            style={inputStyle}
            placeholder="Descricao do produto"
          />
        </div>

        {/* Price */}
        <div className="mb-4">
          <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={labelStyle}>
            Preco (R$)
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            min="0"
            step="0.01"
            className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
            style={inputStyle}
            placeholder="0.00"
          />
        </div>

        {/* Image Upload */}
        <div className="mb-4">
          <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={labelStyle}>
            Imagem
          </label>
          <div className="flex items-center gap-4">
            {previewSrc && (
              <img
                src={previewSrc}
                alt="Preview"
                className="rounded-lg object-cover"
                style={{
                  width: 120,
                  height: 120,
                  border: '1px solid #333333',
                }}
              />
            )}
            <div className="flex flex-col gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 rounded-lg text-sm font-semibold transition-opacity hover:opacity-80"
                style={{
                  backgroundColor: '#2A2A2A',
                  color: '#F5F5F5',
                  border: '1px solid #333333',
                }}
              >
                {previewSrc ? 'Trocar imagem' : 'Escolher imagem'}
              </button>
              {uploadError && (
                <span className="text-xs" style={{ color: '#EF4444' }}>
                  {uploadError}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Category */}
        <div className="mb-4">
          <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={labelStyle}>
            Categoria
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as 'burger' | 'drink')}
            className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
            style={inputStyle}
          >
            <option value="burger">Burger</option>
            <option value="drink">Bebida</option>
          </select>
        </div>

        {/* Tags */}
        <div className="mb-4">
          <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={labelStyle}>
            Tags (separadas por virgula)
          </label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
            style={inputStyle}
            placeholder="artesanal, especial, novo"
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

        {/* Available */}
        <div className="mb-6 flex items-center gap-3">
          <label className="text-xs font-semibold uppercase tracking-wider" style={labelStyle}>
            Disponivel
          </label>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={available}
              onChange={(e) => setAvailable(e.target.checked)}
              className="sr-only"
            />
            <span
              className="block rounded-full transition-colors"
              style={{
                width: 44,
                height: 24,
                backgroundColor: available ? '#F97316' : '#333333',
              }}
            >
              <span
                className="block rounded-full transition-all"
                style={{
                  width: 18,
                  height: 18,
                  backgroundColor: '#FFFFFF',
                  transform: `translateX(${available ? 23 : 3}px) translateY(3px)`,
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
            disabled={uploading}
            className="flex-1 py-3 rounded-xl font-bold text-sm uppercase tracking-wider transition-opacity hover:opacity-80"
            style={{
              backgroundColor: '#F97316',
              color: '#FFFFFF',
              opacity: uploading ? 0.6 : 1,
            }}
          >
            {uploading ? 'Enviando...' : 'Salvar'}
          </button>
        </div>
      </form>
    </div>
  );
};
