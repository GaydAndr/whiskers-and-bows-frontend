import { Product } from '@/shared/types';

import { API_BASE_URL } from '../config/api';

export const productService = {
  async getAllProducts(): Promise<Product[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/products`, {
        cache: 'no-store',
      });
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      
      return response.json();
    } catch (error: any) {
      console.error('Fetch error in getAllProducts:', error.message);
      throw error;
    }
  },

  async getProductById(id: string): Promise<Product> {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        cache: 'no-store',
      });
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      
      return response.json();
    } catch (error: any) {
      console.error(`Fetch error in getProductById (${id}):`, error.message);
      throw error;
    }
  },

  async createProduct(product: Partial<Product>): Promise<Product> {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    if (!response.ok) throw new Error('Failed to create product');
    return response.json();
  },

  async updateProduct(id: string, product: Partial<Product>): Promise<Product> {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    if (!response.ok) throw new Error('Failed to update product');
    return response.json();
  },

  async deleteProduct(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete product');
  },

  async getCart(userId: string) {
    const response = await fetch(`${API_BASE_URL}/cart?userId=${userId}`);
    if (!response.ok) throw new Error('Failed to fetch cart');
    return response.json();
  },

  async addToCart(data: { userId: string; productId: string; variationId: string; quantity: number }) {
    const response = await fetch(`${API_BASE_URL}/cart/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to add to cart');
    return response.json();
  },

  async updateCartQuantity(data: { userId: string; productId: string; variationId: string; quantity: number }) {
    const response = await fetch(`${API_BASE_URL}/cart/update`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update cart quantity');
    return response.json();
  },

  async removeFromCart(data: { userId: string; productId: string; variationId: string }) {
    const response = await fetch(`${API_BASE_URL}/cart/remove`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to remove from cart');
    return response.json();
  },

  async clearCart(userId: string) {
    const response = await fetch(`${API_BASE_URL}/cart/clear?userId=${userId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to clear cart');
  },

  async getWishlist(userId: string) {
    const response = await fetch(`${API_BASE_URL}/wishlist?userId=${userId}`);
    if (!response.ok) throw new Error('Failed to fetch wishlist');
    return response.json();
  },

  async addToWishlist(data: { userId: string; productId: string; variationId: string }) {
    const response = await fetch(`${API_BASE_URL}/wishlist/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to add to wishlist');
    return response.json();
  },

  async removeFromWishlist(data: { userId: string; productId: string; variationId: string }) {
    const response = await fetch(`${API_BASE_URL}/wishlist/remove`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to remove from wishlist');
    return response.json();
  },
};
