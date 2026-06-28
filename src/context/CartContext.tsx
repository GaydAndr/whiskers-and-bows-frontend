import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, ProductVariation } from '@/shared/types';
import { useAuth } from './AuthContext';
import { productService } from '@/services/productService';
import { useNotification } from '@/context/NotificationContext';

interface CartItem {
  id: string;
  productId: string;
  name: string;
  variationId: string;
  details: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, variation: ProductVariation, quantity: number) => Promise<void>;
  removeFromCart: (id: string, productId: string, variationId: string) => Promise<void>;
  updateQuantity: (id: string, productId: string, variationId: string, delta: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { notify } = useNotification();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshCart = async () => {
    if (!user?.id) return;
    try {
      const data = await productService.getCart(user.id);
      const mappedItems = data.items.map((item: any) => ({
        id: `${item.productId}_${item.variationId}`,
        productId: item.productId,
        name: item.name,
        variationId: item.variationId,
        details: item.details,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      }));
      setCart(mappedItems);
    } catch (error) {
      console.error('Failed to refresh cart:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      refreshCart();
    } else {
      setCart([]);
      setLoading(false);
    }
  }, [user?.id]);

  const addToCart = async (product: Product, variation: ProductVariation, quantity: number) => {
    if (!user?.id) {
      notify('Будь ласка, увійдіть в обліковий запис, щоб додати товар до кошика', 'info');
      return;
    }
    try {
      console.log('Adding to cart:', { userId: user.id, productId: product.id, variationId: variation.id });
      await productService.addToCart({
        userId: user.id,
        productId: product.id,
        variationId: variation.id,
        quantity,
      });
      await refreshCart();
      notify('Товар додано до кошика!', 'success');
    } catch (error: any) {
      console.error('Error adding to cart:', error);
      notify(error.message || 'Помилка при додаванні в кошик', 'error');
    }
  };

  const removeFromCart = async (id: string, productId: string, variationId: string) => {
    if (!user?.id) return;
    try {
      await productService.removeFromCart({
        userId: user.id,
        productId,
        variationId,
      });
      await refreshCart();
    } catch (error: any) {
      console.error('Error removing from cart:', error);
      notify(error.message || 'Помилка при видаленні з кошика', 'error');
    }
  };

  const updateQuantity = async (id: string, productId: string, variationId: string, delta: number) => {
    if (!user?.id) return;
    try {
      const currentItem = cart.find(i => i.id === id);
      const newQuantity = currentItem ? currentItem.quantity + delta : 1;
      if (newQuantity < 1) {
        await removeFromCart(id, productId, variationId);
      } else {
        await productService.updateCartQuantity({
          userId: user.id,
          productId,
          variationId,
          quantity: newQuantity,
        });
        await refreshCart();
      }
    } catch (error: any) {
      console.error('Error updating quantity:', error);
      notify(error.message || 'Помилка при оновленні кількості', 'error');
    }
  };

  const clearCart = async () => {
    if (!user?.id) return;
    try {
      await productService.clearCart(user.id);
      setCart([]);
    } catch (error: any) {
      console.error('Error clearing cart:', error);
      notify(error.message || 'Помилка при очищенні кошика', 'error');
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, refreshCart }}>
      {!loading && children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}
