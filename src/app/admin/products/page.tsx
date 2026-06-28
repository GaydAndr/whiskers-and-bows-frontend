"use client";

import React, { useState, useEffect } from 'react';
import { productService } from '@/services/productService';
import { Product } from '@whiskers-bows/shared';
import Modal from '@/components/ui/Modal';
import ProductForm from '@/components/admin/ProductForm';
import { IconPlus, IconEdit, IconTrash, IconPackage } from '@tabler/icons-react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAllProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Ви впевнені, що хочете видалити цей товар?')) return;
    try {
      await productService.deleteProduct(id);
      await fetchProducts();
    } catch (error) {
      alert('Помилка при видаленні товару');
    }
  };

  const handleSubmitProduct = async (data: Partial<Product>) => {
    try {
      if (editingProduct) {
        await productService.updateProduct(editingProduct.id, data);
      } else {
        await productService.createProduct(data);
      }
      setIsModalOpen(false);
      await fetchProducts();
    } catch (error) {
      alert('Помилка при збереженні товару');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        Завантаження товарів...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Керування товарами</h1>
          <p className="text-gray-500 dark:text-gray-400">Додавайте, редагуйте та видаляйте товари в магазині</p>
        </div>
        <button 
          onClick={handleAddProduct}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/30 font-medium"
        >
          <IconPlus size={20} />
          Додати товар
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
                <th className="px-6 py-4 text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Товар</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Категорія</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Ціна</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Статус</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-gray-500 dark:text-gray-400 text-right">Дії</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={product.images[0] || '/placeholder.jpg'} alt={product.name} className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{product.name}</div>
                        <div className="text-xs text-gray-500">{product.sku}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                    {product.basePrice} ₴
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${product.isAvailable ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {product.isAvailable ? 'Доступний' : 'Немає в наявності'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleEditProduct(product)}
                        className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-all"
                      >
                         <IconEdit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDeleteProduct(product.id)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all"
                      >
                         <IconTrash size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-3">
                      <IconPackage size={48} className="text-gray-300" />
                      <p>Товарів поки немає. Додайте перший товар!</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setEditingProduct(null); }} 
        title={editingProduct ? 'Редагувати товар' : 'Додати новий товар'}
      >
        <ProductForm 
          initialData={editingProduct || undefined} 
          onSubmit={handleSubmitProduct} 
          onCancel={() => setIsModalOpen(false)} 
        />
      </Modal>
    </div>
  );
}
