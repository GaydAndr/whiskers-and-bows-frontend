"use client";

import React, { useState, useEffect } from 'react';
import { Product, CategoryName, ProductVariation } from '@whiskers-bows/shared';
import ImageUpload from '../ui/ImageUpload';

interface ProductFormProps {
  initialData?: Product;
  onSubmit: (data: Partial<Product>) => void;
  onCancel: () => void;
}

export default function ProductForm({ initialData, onSubmit, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    description: '',
    category: 'Collars',
    basePrice: 0,
    images: [],
    isSale: false,
    salePrice: 0,
    isNew: false,
    isAvailable: true,
    sku: '',
    variations: [],
    features: [],
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleImageUpload = (images: string[]) => {
    setFormData(prev => ({ ...prev, images }));
  };

  const handleVariationChange = (index: number, field: keyof ProductVariation, value: any) => {
    const newVariations = [...(formData.variations || [])];
    newVariations[index] = { ...newVariations[index], [field]: value };
    setFormData(prev => ({ ...prev, variations: newVariations }));
  };

  const addVariation = () => {
    const newVariation: ProductVariation = {
      id: Math.random().toString(36).substr(2, 9),
      width: '',
      length: '',
      hardware: 'Classic',
      neoprenePadding: false,
      price: 0,
      stock: 0,
    };
    setFormData(prev => ({ ...prev, variations: [...(prev.variations || []), newVariation] }));
  };

  const removeVariation = (index: number) => {
    const newVariations = (formData.variations || []).filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, variations: newVariations }));
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Назва товару</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">SKU</label>
          <input
            type="text"
            name="sku"
            value={formData.sku}
            onChange={handleInputChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Опис</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          rows={3}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Категорія</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="Collars">Нашийники</option>
            <option value="Harnesses">Шлейки</option>
            <option value="Leashes">Повідки</option>
            <option value="Semi-choke">Напівудавки</option>
            <option value="Sets">Комплекти</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Базова ціна</label>
          <input
            type="number"
            name="basePrice"
            value={formData.basePrice}
            onChange={handleInputChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            required
          />
        </div>
        <div className="flex items-center gap-4 pt-8">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="isAvailable" checked={formData.isAvailable} onChange={handleInputChange} className="w-4 h-4 text-indigo-600" />
            <span className="text-sm text-gray-700 dark:text-gray-300">В наявності</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="isNew" checked={formData.isNew} onChange={handleInputChange} className="w-4 h-4 text-indigo-600" />
            <span className="text-sm text-gray-700 dark:text-gray-300">Новинка</span>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="isSale" checked={formData.isSale} onChange={handleInputChange} className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Акція</span>
          </label>
          {formData.isSale && (
            <input
              type="number"
              name="salePrice"
              value={formData.salePrice}
              onChange={handleInputChange}
              placeholder="Ціна зі знижкою"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              required
            />
          )}
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Зображення</label>
          <ImageUpload onUpload={handleImageUpload} initialImages={formData.images} />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Варіації</label>
          <button 
            type="button" 
            onClick={addVariation} 
            className="text-xs bg-indigo-600 text-white px-3 py-1 rounded-full hover:bg-indigo-700 transition-colors"
          >
            + Додати варіацію
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {(formData.variations || []).map((v, i) => (
            <div key={v.id} className="p-4 border border-gray-200 dark:border-gray-800 rounded-xl grid grid-cols-2 md:grid-cols-5 gap-4 relative bg-gray-50 dark:bg-gray-800/50">
              <button 
                type="button" 
                onClick={() => removeVariation(i)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 transition-colors"
              >
                ✕
              </button>
              <div className="space-y-1">
                <label className="text-[10px] uppercase text-gray-500">Ширина</label>
                <input type="text" value={v.width} onChange={(e) => handleVariationChange(i, 'width', e.target.value)} className="w-full px-2 py-1 text-sm border rounded bg-transparent dark:text-white" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase text-gray-500">Довжина</label>
                <input type="text" value={v.length} onChange={(e) => handleVariationChange(i, 'length', e.target.value)} className="w-full px-2 py-1 text-sm border rounded bg-transparent dark:text-white" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase text-gray-500">Фурнітура</label>
                <select value={v.hardware} onChange={(e) => handleVariationChange(i, 'hardware', e.target.value)} className="w-full px-2 py-1 text-sm border rounded bg-transparent dark:text-white">
                  <option value="Classic">Classic</option>
                  <option value="Total Black">Total Black</option>
                  <option value="Metallic">Metallic</option>
                  <option value="Rose Gold">Rose Gold</option>
                  <option value="Gold">Gold</option>
                  <option value="Silver">Silver</option>
                  <option value="Matte Black">Matte Black</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase text-gray-500">Ціна</label>
                <input type="number" value={v.price} onChange={(e) => handleVariationChange(i, 'price', Number(e.target.value))} className="w-full px-2 py-1 text-sm border rounded bg-transparent dark:text-white" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase text-gray-500">Запас</label>
                <input type="number" value={v.stock} onChange={(e) => handleVariationChange(i, 'stock', Number(e.target.value))} className="w-full px-2 py-1 text-sm border rounded bg-transparent dark:text-white" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-6">
        <button 
          type="button" 
          onClick={onCancel} 
          className="px-6 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors"
        >
          Скасувати
        </button>
        <button 
          type="submit" 
          className="px-6 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/30"
        >
          {initialData ? 'Зберегти зміни' : 'Створити товар'}
        </button>
      </div>
    </form>
  );
}
