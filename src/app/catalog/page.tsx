import React from 'react';
import Link from 'next/link';
import { productService } from '@/services/productService';
import ProductCard from '@/components/ui/ProductCard';
import SortSelect from '@/components/ui/SortSelect';
import SearchBar from '@/components/ui/SearchBar';

export default async function CatalogPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ category?: string, sort?: string, hardware?: string }> 
}) {
  const params = await searchParams;
  const allProducts = await productService.getAllProducts();
  
  let filteredProducts = allProducts;

  const activeCategories = params.category ? params.category.split(',') : [];
  if (activeCategories.length > 0) {
    filteredProducts = filteredProducts.filter(p => 
      activeCategories.some(cat => p.category.toLowerCase() === cat.toLowerCase())
    );
  }

  const activeHardware = params.hardware ? params.hardware.split(',') : [];
  if (activeHardware.length > 0) {
    filteredProducts = filteredProducts.filter(p => 
      p.variations.some(v => activeHardware.some(hw => v.hardware.toLowerCase() === hw.toLowerCase()))
    );
  }
  
  if (params.sort === 'price_asc') {
    filteredProducts = [...filteredProducts].sort((a, b) => a.basePrice - b.basePrice);
  } else if (params.sort === 'price_desc') {
    filteredProducts = [...filteredProducts].sort((a, b) => b.basePrice - a.basePrice);
  }

  const createFilterUrl = (key: string, value: string) => {
    const currentParams = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v) currentParams.set(k, v);
    });

    const existingValues = currentParams.get(key)?.split(',') || [];
    if (existingValues.includes(value)) {
      const newValues = existingValues.filter(v => v !== value);
      if (newValues.length > 0) currentParams.set(key, newValues.join(','));
      else currentParams.delete(key);
    } else {
      existingValues.push(value);
      currentParams.set(key, existingValues.join(','));
    }
    return `/catalog?${currentParams.toString()}`;
  };

  const clearFilters = () => {
    return `/catalog?sort=${params.sort || ''}`;
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Sidebar Filters */}
         <aside className="w-full md:w-64 md:sticky md:top-24 h-fit flex-shrink-0 space-y-8 bg-gray-900 p-6 rounded-3xl text-white">
          <div>
            <h3 className="text-sm font-bold mb-4 text-indigo-400 uppercase tracking-wider">Категорії</h3>
            <div className="flex flex-col gap-2">
              {['Collars', 'Harnesses', 'Leashes', 'Semi-choke', 'Sets'].map(cat => {
                const val = cat.toLowerCase();
                const isActive = params.category?.split(',').includes(val);
                return (
                  <Link 
                    key={cat} 
                    href={createFilterUrl('category', val)}
                    className={`flex items-center gap-2 text-sm py-2 px-3 rounded-lg transition-all cursor-pointer ${isActive ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-300 hover:bg-gray-800'}`}
                  >
                    <div className={`w-4 h-4 border rounded ${isActive ? 'bg-indigo-400 border-indigo-400' : 'border-gray-500'}`}>
                      {isActive && <div className="w-2 h-2 bg-white rounded-full m-auto mt-0.5"></div>}
                    </div>
                    {cat === 'Collars' ? 'Нашийники' : cat === 'Harnesses' ? 'Шлейки' : cat === 'Leashes' ? 'Повідки' : cat === 'Semi-choke' ? 'Напівудавки' : 'Комплекти'}
                  </Link>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold mb-4 text-indigo-400 uppercase tracking-wider">Фурнітура</h3>
            <div className="flex flex-col gap-2">
              {['Classic', 'Total Black', 'Metallic', 'Rose Gold', 'Gold', 'Silver', 'Matte Black'].map(hw => {
                const val = hw.toLowerCase();
                const isActive = params.hardware?.split(',').includes(val);
                return (
                  <Link 
                    key={hw} 
                    href={createFilterUrl('hardware', val)}
                    className={`flex items-center gap-2 text-sm py-2 px-3 rounded-lg transition-all cursor-pointer ${isActive ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-300 hover:bg-gray-800'}`}
                  >
                    <div className={`w-4 h-4 border rounded ${isActive ? 'bg-indigo-400 border-indigo-400' : 'border-gray-500'}`}>
                      {isActive && <div className="w-2 h-2 bg-white rounded-full m-auto mt-0.5"></div>}
                    </div>
                    {hw}
                  </Link>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold mb-4 text-indigo-400 uppercase tracking-wider">Сортування</h3>
            <SortSelect defaultValue={params.sort} />
          </div>

          { (params.category || params.hardware) && (
            <Link 
              href={clearFilters()} 
              className="block text-center text-xs text-indigo-400 hover:underline pt-4 cursor-pointer"
            >
              Скинути всі фільтри
            </Link>
          )}
        </aside>

        {/* Product Grid */}
        <div className="flex-grow">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <h1 className="text-3xl font-bold">
              {params.category ? 'Каталог товарів' : 'Усі аксесуари'}
            </h1>
            <SearchBar />
          </div>
          
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-500">
              Товари за обраними фільтрами не знайдено.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
