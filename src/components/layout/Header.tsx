"use client";

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';

const Header = () => {
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const { user, login } = useAuth();

  return (
    <header className="bg-black text-white sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold flex items-center gap-2">
          <span className="text-indigo-500">🐾</span> Whiskers & Bows
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link href="/catalog" className="hover:text-indigo-400 transition-colors">Каталог</Link>
          <Link href="/about" className="hover:text-indigo-400 transition-colors">Про нас</Link>
           <Link href="/cooperation" className="hover:text-indigo-400 transition-colors">Співпраця</Link>
           <Link href="/contacts" className="hover:text-indigo-400 transition-colors">Контакти</Link>
           {user?.role === 'ADMIN' && (
             <>
               <Link href="/admin/orders" className="text-indigo-400 hover:text-indigo-300 transition-colors font-bold">Замовлення</Link>
               <Link href="/admin" className="text-indigo-400 hover:text-indigo-300 transition-colors font-bold">Адмін-панель</Link>
             </>
           )}
         </nav>

        {/* User Actions */}
        <div className="flex items-center gap-4">
          <Link href="/wishlist" className="relative p-2 hover:bg-gray-800 rounded-full transition-colors">
            <span>❤️</span>
            {wishlist.length > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                {wishlist.length}
              </span>
            )}
          </Link>
          <Link href="/cart" className="relative p-2 hover:bg-gray-800 rounded-full transition-colors">
            <span>🛒</span>
            {cart.length > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </Link>
          <Link href="/profile" className="p-2 hover:bg-gray-800 rounded-full transition-colors">
            <span>👤</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
