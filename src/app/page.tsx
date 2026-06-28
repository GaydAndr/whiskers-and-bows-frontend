import React from 'react';
import Link from 'next/link';
import { productService } from '@/services/productService';
import ProductCard from '@/components/ui/ProductCard';

export default async function HomePage() {
  const products = await productService.getAllProducts();
  const popularProducts = products.slice(0, 4);

  const categories = [
    { name: 'Повідки', slug: 'leashes', color: 'bg-blue-100', icon: '🐕' },
    { name: 'Шлейки', slug: 'harnesses', color: 'bg-green-100', icon: '🐱' },
    { name: 'Нашийники', slug: 'collars', color: 'bg-yellow-100', icon: '🎀' },
    { name: 'Комплекти', slug: 'sets', color: 'bg-purple-100', icon: '🎁' },
  ];

  return (
    <div className="flex flex-col gap-20 pb-20">
      {/* Hero Section */}
       <section className="relative h-[600px] w-full bg-gray-900 overflow-hidden">
         <div className="absolute inset-0 grid grid-cols-4 grid-rows-2 gap-2 p-2">
           <Link href="/catalog" className="col-span-2 row-span-2 relative group cursor-pointer overflow-hidden rounded-lg">
             <img src="https://placehold.co/1000x1200" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Cat Hero" />
             <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
               <span className="text-white text-4xl font-bold">Колекція 2026</span>
             </div>
           </Link>
           <Link href="/catalog?category=harnesses" className="relative group cursor-pointer overflow-hidden rounded-lg">
             <img src="https://placehold.co/500x500" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Cat 1" />
             <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
               <span className="text-white text-xl font-medium">Шлейки</span>
             </div>
           </Link>
           <Link href="/catalog?category=collars" className="relative group cursor-pointer overflow-hidden rounded-lg">
             <img src="https://placehold.co/500x500" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Cat 2" />
             <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
               <span className="text-white text-xl font-medium">Нашийники</span>
             </div>
           </Link>
           <Link href="/catalog?category=leashes" className="col-span-2 relative group cursor-pointer overflow-hidden rounded-lg">
             <img src="https://placehold.co/1000x500" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Cat 3" />
             <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
               <span className="text-white text-xl font-medium">Повідки</span>
             </div>
           </Link>
         </div>
       </section>

      {/* Categories */}
      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Категорії товарів</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link 
              key={cat.slug} 
              href={`/catalog?category=${cat.slug}`}
              className={`${cat.color} p-8 rounded-2xl text-center hover:shadow-md transition-all group`}
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{cat.icon}</div>
              <div className="text-lg font-bold text-gray-800">{cat.name}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Products */}
      <section className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-bold">Популярні товари</h2>
          <Link href="/catalog" className="text-indigo-600 font-medium hover:underline">Дивитись всі →</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {popularProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* About Teaser */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
           <div className="w-full md:w-1/2 rounded-3xl overflow-hidden shadow-2xl">
             <img src="https://placehold.co/800x600" alt="About Us" />
           </div>
           <div className="w-full md:w-1/2">
             <h2 className="text-3xl font-bold mb-6 text-gray-900">Створено з любов'ю до котів</h2>
             <p className="text-gray-600 text-lg mb-8 leading-relaxed">
               Whiskers & Bows — це не просто магазин, це майстерня, де кожна деталь продумана для комфорту та безпеки вашого пухнастика. Ми використовуємо лише перевірені матеріали та створюємо аксесуари, які витримають навіть найактивніші ігри.
             </p>
             <Link href="/about" className="inline-block px-8 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors">

              Дізнатися більше
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
