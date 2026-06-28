"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { productService } from '@/services/productService';
import { useNotification } from '@/context/NotificationContext';
import { useConfirmation } from '@/context/ConfirmationContext';
import { Product } from '@whiskers-bows/shared';
import { ImageUpload } from '@/components/ui/ImageUpload';
import Link from 'next/link';
import { API_BASE_URL } from '@/config/api';

export default function AdminPage() {
  const { user } = useAuth();
  const { notify } = useNotification();
  const { confirm } = useConfirmation();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({});
  const [initialFormData, setInitialFormData] = useState<Partial<Product>>({});
  
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [sortColumn, setSortColumn] = useState<keyof Product>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      router.push('/auth/login');
    } else {
      async function loadProducts() {
        try {
          const data = await productService.getAllProducts();
          setProducts(data);
        } catch (e) {
          console.error(e);
        } finally {
          setLoading(false);
        }
      }
      loadProducts();
    }
  }, [user, router]);

  const generateSKU = (name: string) => {
    const base = name
      .split(' ')
      .filter(word => word.length > 0)
      .map(word => word.charAt(0).toUpperCase())
      .join('') || 'PROD';
    const random = Math.floor(1000 + Math.random() * 9000);
    return `${base}-${random}`;
  };

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData(product);
      setInitialFormData(product);
    } else {
      setEditingProduct(null);
      const savedDraft = localStorage.getItem('admin_product_draft');
        const defaultData = {
          name: '',
          category: 'Collars',
          basePrice: 0,
          isNew: false,
          isSale: false,
          isAvailable: true,
          variations: [],
          images: [],
          description: '',
          sku: '',
          material: '',
          countryOfOrigin: '',
          features: [],
          sizeChart: '',
          additionalInfo: '',
        };

      const initial = savedDraft ? JSON.parse(savedDraft) : defaultData;
      setFormData(initial);
      setInitialFormData(initial);
    }
    setIsModalOpen(true);
  };

  useEffect(() => {
    if (!editingProduct && isModalOpen) {
      localStorage.setItem('admin_product_draft', JSON.stringify(formData));
    }
  }, [formData, editingProduct, isModalOpen]);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isModalOpen]);

  const hasUnsavedChanges = () => {
    return (
      formData.name !== initialFormData.name ||
      formData.category !== initialFormData.category ||
      formData.basePrice !== initialFormData.basePrice ||
      formData.sku !== initialFormData.sku ||
      formData.isNew !== initialFormData.isNew ||
      formData.isSale !== initialFormData.isSale ||
      formData.isAvailable !== initialFormData.isAvailable ||
       formData.description !== initialFormData.description ||
       formData.sizeChart !== initialFormData.sizeChart ||
       formData.material !== initialFormData.material ||
       formData.countryOfOrigin !== initialFormData.countryOfOrigin ||
       formData.additionalInfo !== initialFormData.additionalInfo ||
       JSON.stringify(formData.images) !== JSON.stringify(initialFormData.images) ||
      JSON.stringify(formData.variations) !== JSON.stringify(initialFormData.variations) ||
      JSON.stringify(formData.features) !== JSON.stringify(initialFormData.features)
    );
  };

  const handleCloseModal = async () => {
    if (hasUnsavedChanges()) {
      const shouldClose = await confirm({
        title: 'Незбережені зміни',
        message: 'У вас є незбережені зміни. Ви дійсно хочете закрити вікно?',
        confirmText: 'Так',
        cancelText: 'Залишитися'
      });
      if (!shouldClose) {
        return;
      }
    }

    // Cleanup uploaded images if modal is closed without saving
      if (formData.images && formData.images.length > 0) {
        const imagesToRemove = editingProduct 
          ? formData.images.filter(url => !editingProduct.images.includes(url))
          : formData.images;
 
        if (imagesToRemove.length > 0) {
          try {
            await fetch(`${API_BASE_URL}/images/bulk`, {
              method: 'DELETE',

            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ urls: imagesToRemove }),
          });
        } catch (e) {
          console.error('Failed to cleanup images on modal close:', e);
        }
      }
    }

    setIsModalOpen(false);
  };

  const handleDeleteProduct = async (id: string) => {
    const shouldDelete = await confirm({
      title: 'Видалення товару',
      message: 'Ви дійсно хочете видалити цей товар? Ця дія є незворотною.',
      confirmText: 'Видалити',
      cancelText: 'Скасувати'
    });
    if (!shouldDelete) return;

    try {
      await productService.deleteProduct(id);
      notify('Товар успішно видалено', 'success');
      const updatedProducts = await productService.getAllProducts();
      setProducts(updatedProducts);
    } catch (e) {
      notify('Помилка при видаленні товару', 'error');
    }
  };

  const toggleStatus = async (id: string, field: 'isNew' | 'isSale' | 'isAvailable') => {
    const product = products.find(p => p.id === id);
    if (!product) return;
    try {
      await productService.updateProduct(id, { [field]: !product[field] });
      notify('Статус оновлено', 'success');
      const updatedProducts = await productService.getAllProducts();
      setProducts(updatedProducts);
    } catch (e) {
      notify('Помилка оновлення статусу', 'error');
    }
  };

  const addVariation = () => {
    const newVariation = {
      id: Math.random().toString(36).substr(2, 9),
      width: '',
      length: '',
      hardware: 'Classic' as any,
      neoprenePadding: false,
      price: formData.basePrice || 0,
      stock: 0,
    };
    setFormData({ ...formData, variations: [...(formData.variations || []), newVariation] });
  };

  const updateVariation = (id: string, updates: Partial<ProductVariation>) => {
    const variations = (formData.variations || []).map(v => v.id === id ? { ...v, ...updates } : v);
    setFormData({ ...formData, variations });
  };

  const removeVariation = (id: string) => {
    setFormData({ ...formData, variations: (formData.variations || []).filter(v => v.id !== id) });
  };

  const addFeature = () => {
    const newFeature = { title: '', description: '', icon: '✨' };
    setFormData({ ...formData, features: [...(formData.features || []), newFeature] });
  };

  const updateFeature = (index: number, updates: any) => {
    const features = [...(formData.features || [])];
    features[index] = { ...features[index], ...updates };
    setFormData({ ...formData, features });
  };

  const removeFeature = (index: number) => {
    const features = (formData.features || []).filter((_, i) => i !== index);
    setFormData({ ...formData, features });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await productService.updateProduct(editingProduct.id, formData);
        notify('Товар успішно оновлено!', 'success');
      } else {
        await productService.createProduct(formData);
        notify('Товар успішно додано!', 'success');
        localStorage.removeItem('admin_product_draft');
      }
      
      const updatedProducts = await productService.getAllProducts();
      setProducts(updatedProducts);
      setIsModalOpen(false);
    } catch (e) {
      console.error(e);
      notify('Помилка при збереженні товару', 'error');
    }
  };

  if (loading) return <div className="container mx-auto py-20 text-center">Завантаження адмін-панелі...</div>;

  const filteredProducts = products
    .filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.sku.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-bold text-white">Адмін-панель</h1>
          <p className="text-gray-400">Керування асортиментом Whiskers & Bows</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg cursor-pointer"
        >
          + Додати товар
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-grow relative">
          <input 
            type="text" 
            placeholder="Пошук за назвою або SKU..." 
            className="w-full p-3 pl-10 rounded-xl border border-gray-200 outline-none focus:border-indigo-500 text-gray-900 bg-white"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
        </div>
        <select 
          className="p-3 rounded-xl border border-gray-200 outline-none focus:border-indigo-500 text-gray-900 bg-white"
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
        >
          <option value="All">Всі категорії</option>
          <option value="Collars">Нашийники</option>
          <option value="Harnesses">Шлейки</option>
          <option value="Leashes">Повідки</option>
          <option value="Semi-choke">Напівудавки</option>
          <option value="Sets">Комплекти</option>
        </select>
      </div>

      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-sm font-bold text-gray-600 cursor-pointer hover:text-indigo-600" onClick={() => { setSortColumn('name'); setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc'); }}>
                  Товар {sortColumn === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-6 py-4 text-sm font-bold text-gray-600 cursor-pointer hover:text-indigo-600" onClick={() => { setSortColumn('category'); setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc'); }}>
                  Категорія {sortColumn === 'category' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-6 py-4 text-sm font-bold text-gray-600 cursor-pointer hover:text-indigo-600" onClick={() => { setSortColumn('basePrice'); setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc'); }}>
                  Ціна {sortColumn === 'basePrice' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-6 py-4 text-sm font-bold text-gray-600">Статус</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-600">Дії</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.map(product => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={product.images[0] || 'https://placehold.co/40'} alt={product.name} className="w-10 h-10 rounded-lg object-cover" />
                        <div>
                          <div className="font-medium text-gray-900">
                            <Link href={`/product/${product.id}`} className="hover:text-indigo-600 transition-colors">
                              {product.name}
                            </Link>
                          </div>
                          <div className="text-[10px] text-gray-400">{product.sku}</div>
                        </div>
                      </div>
                  </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{product.category}</td>
                    <td className="px-6 py-4 text-sm font-bold text-indigo-600">{product.basePrice} грн</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => toggleStatus(product.id, 'isNew')}
                          className={`px-2 py-1 text-[10px] font-bold rounded uppercase transition-colors cursor-pointer ${product.isNew ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
                        >
                          New
                        </button>
                        <button 
                          onClick={() => toggleStatus(product.id, 'isSale')}
                          className={`px-2 py-1 text-[10px] font-bold rounded uppercase transition-colors cursor-pointer ${product.isSale ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
                        >
                          Sale
                        </button>
                        <button 
                          onClick={() => toggleStatus(product.id, 'isAvailable')}
                          className={`px-2 py-1 text-[10px] font-bold rounded uppercase transition-colors cursor-pointer ${product.isAvailable ? 'bg-blue-100 text-blue-700' : 'bg-gray-800 text-white'}`}
                        >
                          {product.isAvailable ? 'В наявності' : 'Немає'}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-3">
                        <button 
                          onClick={() => handleOpenModal(product)}
                          className="text-indigo-600 hover:text-indigo-800 text-sm font-medium cursor-pointer"
                        >
                          Редагувати
                        </button>
                        <button 
                          className="text-red-600 hover:text-red-800 text-sm font-medium cursor-pointer"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          Видалити
                        </button>
                      </div>
                    </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
  
      {/* Product Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={handleCloseModal}
        >
          <div 
            className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl p-8 max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingProduct ? 'Редагувати товар' : 'Додати новий товар'}
              </h2>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600 text-2xl cursor-pointer">&times;</button>
            </div>
  
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Назва товару</label>
                   <input 
                      type="text" 
                      className="w-full p-3 rounded-lg border border-gray-200 outline-none focus:border-indigo-500 text-gray-900" 
                      value={formData.name || ''}
                       onChange={e => {
                         const newName = e.target.value;
                         setFormData(prev => ({
                           ...prev, 
                           name: newName,
                           sku: (!editingProduct && !prev.sku) ? generateSKU(newName) : prev.sku
                         }));
                       }}
                      required
                    />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Категорія</label>
                   <select 
                      className="w-full p-3 rounded-lg border border-gray-200 outline-none focus:border-indigo-500 text-gray-900"
                      value={formData.category || 'Collars'}
                       onChange={e => setFormData(prev => ({...prev, category: e.target.value as any}))}
                      required
                    >
                     <option value="Collars">Нашийники</option>
                     <option value="Harnesses">Шлейки</option>
                     <option value="Leashes">Повідки</option>
                     <option value="Semi-choke">Напівудавки</option>
                     <option value="Sets">Комплекти</option>
                   </select>
                </div>
                 <div className="space-y-2">
                   <label className="text-sm font-medium text-gray-700">Базова ціна (грн)</label>
                    <input 
                      type="number" 
                      className="w-full p-3 rounded-lg border border-gray-200 outline-none focus:border-indigo-500 text-gray-900" 
                      value={formData.basePrice === 0 ? '' : formData.basePrice}
                       onChange={e => setFormData(prev => ({...prev, basePrice: e.target.value === '' ? 0 : Number(e.target.value)}))}
                      required
                    />
                 </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">SKU</label>
                   <input 
                      type="text" 
                      className="w-full p-3 rounded-lg border border-gray-200 outline-none focus:border-indigo-500 text-gray-900" 
                      value={formData.sku || ''}
                       onChange={e => setFormData(prev => ({...prev, sku: e.target.value}))}
                      required
                    />
                </div>
              </div>
  
               <div className="flex gap-6 items-center">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 text-indigo-600" 
                      checked={formData.isNew || false}
                       onChange={e => setFormData(prev => ({...prev, isNew: e.target.checked}))}
                    />
                    <span className="text-sm text-gray-700">Новинка</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 text-indigo-600" 
                      checked={formData.isSale || false}
                       onChange={e => setFormData(prev => ({...prev, isSale: e.target.checked}))}
                    />
                    <span className="text-sm text-gray-700">Розпродаж</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 text-indigo-600" 
                      checked={formData.isAvailable ?? true}
                       onChange={e => setFormData(prev => ({...prev, isAvailable: e.target.checked}))}
                    />
                    <span className="text-sm text-gray-700">В наявності</span>
                  </label>
                </div>
  
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Опис</label>
                   <textarea 
                     className="w-full p-3 rounded-lg border border-gray-200 outline-none focus:border-indigo-500 h-32 text-gray-900" 
                     value={formData.description || ''}
                     onChange={e => setFormData(prev => ({...prev, description: e.target.value}))}
                   />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Розмірна сітка</label>
                    <textarea 
                      className="w-full p-3 rounded-lg border border-gray-200 outline-none focus:border-indigo-500 h-24 text-gray-900" 
                      value={formData.sizeChart || ''}
                      onChange={e => setFormData(prev => ({...prev, sizeChart: e.target.value}))}
                      placeholder="Наприклад: S: 20-25см, M: 25-30см..."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Додаткова інформація</label>
                    <textarea 
                      className="w-full p-3 rounded-lg border border-gray-200 outline-none focus:border-indigo-500 h-24 text-gray-900" 
                      value={formData.additionalInfo || ''}
                      onChange={e => setFormData(prev => ({...prev, additionalInfo: e.target.value}))}
                      placeholder="Будь-які додаткові деталі про товар..."
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Матеріал</label>
                    <input 
                      type="text" 
                      className="w-full p-3 rounded-lg border border-gray-200 outline-none focus:border-indigo-500 text-gray-900" 
                      value={formData.material || ''}
                      onChange={e => setFormData(prev => ({...prev, material: e.target.value}))}
                      placeholder="Наприклад: Натуральна шкіра, Нейлон..."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Країна виробника</label>
                    <input 
                      type="text" 
                      className="w-full p-3 rounded-lg border border-gray-200 outline-none focus:border-indigo-500 text-gray-900" 
                      value={formData.countryOfOrigin || ''}
                      onChange={e => setFormData(prev => ({...prev, countryOfOrigin: e.target.value}))}
                      placeholder="Наприклад: Україна"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Варіації товару</label>
                    <button 
                      type="button" 
                      onClick={addVariation}
                      className="px-3 py-1 text-xs bg-indigo-100 text-indigo-600 rounded-lg font-bold hover:bg-indigo-200 transition-colors cursor-pointer"
                    >
                      + Додати варіацію
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {(formData.variations || []).map((v) => (
                      <div key={v.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200 grid grid-cols-2 md:grid-cols-6 gap-3 relative">
                        <button 
                          type="button"
                          onClick={() => removeVariation(v.id)}
                          className="absolute -right-2 -top-2 w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-bold hover:bg-red-200 transition-colors cursor-pointer"
                        >
                          &times;
                        </button>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-500 uppercase">Ширина</label>
                          <input 
                            type="text" 
                            className="w-full p-2 text-xs rounded border border-gray-200 outline-none focus:border-indigo-500 text-gray-900" 
                            value={v.width}
                            onChange={e => updateVariation(v.id, { width: e.target.value })}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-500 uppercase">Довжина</label>
                          <input 
                            type="text" 
                            className="w-full p-2 text-xs rounded border border-gray-200 outline-none focus:border-indigo-500 text-gray-900" 
                            value={v.length}
                            onChange={e => updateVariation(v.id, { length: e.target.value })}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-500 uppercase">Фурнітура</label>
                          <select 
                            className="w-full p-2 text-xs rounded border border-gray-200 outline-none focus:border-indigo-500 text-gray-900" 
                            value={v.hardware}
                            onChange={e => updateVariation(v.id, { hardware: e.target.value as any })}
                          >
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
                          <label className="text-[10px] font-bold text-gray-500 uppercase">Ціна</label>
                           <input 
                             type="number" 
                             className="w-full p-2 text-xs rounded border border-gray-200 outline-none focus:border-indigo-500 text-gray-900" 
                             value={v.price === 0 ? '' : v.price}
                             onChange={e => updateVariation(v.id, { price: e.target.value === '' ? 0 : Number(e.target.value) })}
                           />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-500 uppercase">Запас</label>
                           <input 
                             type="number" 
                             className="w-full p-2 text-xs rounded border border-gray-200 outline-none focus:border-indigo-500 text-gray-900" 
                             value={v.stock === 0 ? '' : v.stock}
                             onChange={e => updateVariation(v.id, { stock: e.target.value === '' ? 0 : Number(e.target.value) })}
                           />
                        </div>
                        <div className="flex items-center gap-2 pt-5">
                          <input 
                            type="checkbox" 
                            className="w-3 h-3 text-indigo-600" 
                            checked={v.neoprenePadding}
                            onChange={e => updateVariation(v.id, { neoprenePadding: e.target.checked })}
                          />
                          <span className="text-[10px] font-medium text-gray-600">Неопрен</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Особливості (Features)</label>
                    <button 
                      type="button" 
                      onClick={addFeature}
                      className="px-3 py-1 text-xs bg-indigo-100 text-indigo-600 rounded-lg font-bold hover:bg-indigo-200 transition-colors cursor-pointer"
                    >
                      + Додати особливість
                    </button>
                  </div>
                  <div className="space-y-3">
                    {(formData.features || []).map((f, idx) => (
                      <div key={idx} className="p-4 bg-gray-50 rounded-xl border border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-3 relative">
                        <button 
                          type="button"
                          onClick={() => removeFeature(idx)}
                          className="absolute -right-2 -top-2 w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-bold hover:bg-red-200 transition-colors cursor-pointer"
                        >
                          &times;
                        </button>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-500 uppercase">Іконка</label>
                          <input 
                            type="text" 
                            className="w-full p-2 text-xs rounded border border-gray-200 outline-none focus:border-indigo-500 text-gray-900" 
                            value={f.icon}
                            onChange={e => updateFeature(idx, { icon: e.target.value })}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-500 uppercase">Заголовок</label>
                          <input 
                            type="text" 
                            className="w-full p-2 text-xs rounded border border-gray-200 outline-none focus:border-indigo-500 text-gray-900" 
                            value={f.title}
                            onChange={e => updateFeature(idx, { title: e.target.value })}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-500 uppercase">Опис</label>
                          <input 
                            type="text" 
                            className="w-full p-2 text-xs rounded border border-gray-200 outline-none focus:border-indigo-500 text-gray-900" 
                            value={f.description}
                            onChange={e => updateFeature(idx, { description: e.target.value })}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

  
               <ImageUpload 
                 value={formData.images || []} 
                  onChange={urls => setFormData(prev => ({...prev, images: urls}))} 
                 error={!formData.images || formData.images.length === 0 ? 'Додайте хоча б одне фото' : undefined}
               />
  
               <div className="flex justify-end gap-4 pt-6">
                  <button 
                    type="button" 
                    onClick={handleCloseModal}
                    className="px-6 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                  >
                    Скасувати
                  </button>
                 <button 
                   type="submit" 
                   className="px-6 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md cursor-pointer"
                 >
                   Зберегти товар
                 </button>
               </div>
             </form>
           </div>
         </div>
       )}
     </div>
   );
 }
