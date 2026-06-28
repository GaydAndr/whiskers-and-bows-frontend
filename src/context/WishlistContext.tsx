"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/shared/types';
import { useAuth } from './AuthContext';
import { productService } from '@/services/productService';
import { useNotification } from '@/context/NotificationContext';

interface WishlistContextType {
  wishlist: any[];
  toggleWishlist: (product: Product, variationId: string) => Promise<void>;
  isInWishlist: (productId: string, variationId: string) => boolean;
  isProductInWishlist: (productId: string) => boolean;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { notify } = useNotification();
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshWishlist = async () => {
    if (!user?.id) return;
    try {
      const data = await productService.getWishlist(user.id);
      setWishlist(data.items);
    } catch (error) {
      console.error('Failed to refresh wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      refreshWishlist();
    } else {
      setWishlist([]);
      setLoading(false);
    }
  }, [user?.id]);

  const toggleWishlist = async (product: Product, variationId: string) => {
    if (!user?.id) {
      notify('Будь ласка, увійдіть в обліковий запис, щоб додати товар у обране', 'info');
      return;
    }
    try {
      console.log('Toggling wishlist:', { userId: user.id, productId: product.id, variationId });
      const exists = wishlist.some(item => item.productId === product.id && item.variationId === variationId);
      if (exists) {
        await productService.removeFromWishlist({
          userId: user.id,
          productId: product.id,
          variationId,
        });
        notify('Видалено з обраного', 'info');
      } else {
        await productService.addToWishlist({
          userId: user.id,
          productId: product.id,
          variationId,
        });
        notify('Додано до обраного', 'success');
      }
      await refreshWishlist();
    } catch (error: any) {
      console.error('Error toggling wishlist:', error);
      notify(error.message || 'Помилка при роботі з обраним', 'error');
    }
  };

  const isInWishlist = (productId: string, variationId: string) => 
    wishlist.some(item => item.productId?.toString() === productId?.toString() && item.variationId === variationId);

  const isProductInWishlist = (productId: string) => 
    wishlist.some(item => item.productId?.toString() === productId?.toString());

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist, isProductInWishlist, refreshWishlist }}>
      {!loading && children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within a WishlistProvider');
  return context;
}
