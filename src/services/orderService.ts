import { Order, OrderItem } from '@whiskers-bows/shared';

import { API_BASE_URL } from '../config/api';

export const orderService = {
  async getOrdersByUserId(userId: string): Promise<Order[]> {
    const response = await fetch(`${API_BASE_URL}/orders/user?userId=${userId}`);
    if (!response.ok) throw new Error('Failed to fetch orders');
    return response.json();
  },

  async getAllOrders(): Promise<Order[]> {
    const response = await fetch(`${API_BASE_URL}/orders/admin/all`);
    if (!response.ok) throw new Error('Failed to fetch all orders');
    return response.json();
  },

  async updateOrderStatus(id: string, status: Order['status']) {
    const response = await fetch(`${API_BASE_URL}/orders/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error('Failed to update order status');
    return response.json();
  },

  async createOrder(orderData: Partial<Order>): Promise<Order> {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
    if (!response.ok) throw new Error('Failed to create order');
    return response.json();
  },
};
