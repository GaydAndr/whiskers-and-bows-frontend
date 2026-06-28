"use client";

import React from 'react';
import { useWishlist } from '@/context/WishlistContext';
import ProductCard from '@/components/ui/ProductCard';

export default function WishlistPage() {
  const { wishlist } = useWishlist();

  return (
    <div className="container mx-auto px-4 py-20">
      <h1 className="text-3xl font-bold mb-12 text-center">Список бажань</h1>
      
      {wishlist.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {wishlist.map(product => (
            <ProductCard key={`${product.id}_${product.variationId}`} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="text-6xl mb-6">❤️</div>
          <p className="text-gray-400 text-lg mb-8">Ваш список бажань поки що порожній.</p>
          <a href="/catalog" className="inline-block px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors">
            Перейти до каталогу
          </a>
        </div>
      )}
    </div>
  );
}
