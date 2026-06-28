"use client";

import React from 'react';
import Link from 'next/link';
import { Product } from '@whiskers-bows/shared';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { IconHeart } from '@tabler/icons-react';

interface ProductCardProps {
  product: Product | any;
}

  const ProductCard = ({ product }: ProductCardProps) => {
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist, isProductInWishlist } = useWishlist();
    const displayPrice = product.price || (product.isSale ? product.salePrice : product.basePrice);

  return (
    <div className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300">
      <Link href={`/product/${product.id}`} className="relative block aspect-square overflow-hidden">
        <img 
            src={product.images && product.images.length > 0 ? product.images[0] : 'https://placehold.co/400'}
           alt={product.name} 
           className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isNew && (
            <span className="bg-black text-white text-[10px] font-bold px-2 py-1 rounded uppercase">New</span>
          )}
          {product.isSale && (
            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded uppercase">Sale</span>
          )}
        </div>
          <button 
             onClick={(e) => {
               e.preventDefault();
               const vId = product.variationId || product.variations?.[0]?.id || '';
               toggleWishlist(product, vId);
             }}
            className="absolute top-2 right-2 p-2 transition-all active:scale-125 cursor-pointer"
          >
              <IconHeart 
                className={`transition-colors duration-300 w-6 h-6 ${isProductInWishlist(product.id) ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} 
              />
          </button>

      </Link>
      
      <div className="p-4">
        <Link href={`/product/${product.id}`} className="text-sm font-bold text-gray-900 hover:text-indigo-600 transition-colors block mb-1">
          {product.name}
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-indigo-600">
            {displayPrice} грн
          </span>
          {product.isSale && (
            <span className="text-sm text-gray-400 line-through">
              {product.basePrice} грн
            </span>
          )}
        </div>
         <button 
           onClick={() => {
             const variation = product.variations?.[0];
             if (variation) {
               addToCart(product, variation, 1);
             } else if (product.variationId) {
               // This is a simplified product from wishlist, we might need to fetch full product to get variation object
               // For now, we just don't add to cart or handle it differently.
               // But adding a check to prevent crash is good.
             }
           }}
          className="mt-4 block w-full text-center py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Додати в кошик
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
