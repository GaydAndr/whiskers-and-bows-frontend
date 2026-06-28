"use client";

import React, { useState, useEffect } from 'react';
import { orderService } from '@/services/orderService';
import { Order } from '@/shared/types';
import { useNotification } from '@/context/NotificationContext';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterDate, setFilterDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { notify } = useNotification();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getAllOrders();
      setOrders(data);
    } catch (error) {
      notify('Помилка при завантаженні замовлень', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: Order['status']) => {
    try {
      await orderService.updateOrderStatus(id, newStatus);
      notify('Статус замовлення оновлено', 'success');
      fetchOrders();
    } catch (error) {
      notify('Помилка при оновленні статусу', 'error');
    }
  };

  const filteredOrders = orders
    .filter(order => {
      const matchesDate = !filterDate || new Date(order.createdAt!).toISOString().startsWith(filterDate);
      const matchesSearch = !searchQuery || 
        order.orderNumber.toString().includes(searchQuery) || 
        order.shippingAddress.firstName.toLowerCase().includes(searchQuery.toLowerCase()) || 
        order.shippingAddress.lastName.toLowerCase().includes(searchQuery.toLowerCase()) || 
        order.shippingAddress.phone.includes(searchQuery);
      return matchesDate && matchesSearch;
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt!).getTime();
      const dateB = new Date(b.createdAt!).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Керування замовленнями</h1>
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input 
              type="text" 
              placeholder="Пошук за номером, ім'ям або телефоном..."
              className="pl-10 p-2 bg-white border rounded-lg outline-none focus:border-indigo-500 text-gray-900 w-64"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <input 
            type="date" 
            className="p-2 bg-white border rounded-lg outline-none focus:border-indigo-500 text-gray-900"
            value={filterDate}
            onChange={e => setFilterDate(e.target.value)}
          />
          <select 
            className="p-2 bg-white border rounded-lg outline-none focus:border-indigo-500 text-gray-900 cursor-pointer"
            value={sortOrder}
            onChange={e => setSortOrder(e.target.value as 'desc' | 'asc')}
          >
            <option value="desc">Новіest спочатку</option>
            <option value="asc">Старіest спочатку</option>
          </select>
          <button 
            onClick={fetchOrders}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer"
          >
            Оновити
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20">Завантаження...</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-3xl border border-gray-200 shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-4 font-bold text-gray-700">ID Замовлення</th>
                <th className="p-4 font-bold text-gray-700">Клієнт</th>
                <th className="p-4 font-bold text-gray-700">Дата</th>
                <th className="p-4 font-bold text-gray-700">Сума</th>
                <th className="p-4 font-bold text-gray-700">Статус</th>
                <th className="p-4 font-bold text-gray-700">Дії</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map(order => (
                  <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-sm text-gray-600 font-bold">{order.orderNumber}</td>
                    <td className="p-4">
                      <div className="text-sm font-medium text-gray-900">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</div>
                      <div className="text-xs text-gray-500">{order.shippingAddress.phone}</div>
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      {new Date(order.createdAt!).toLocaleString('uk-UA')}
                    </td>
                    <td className="p-4 font-bold text-gray-900">{order.totalAmount} грн</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                        order.status === 'Paid' ? 'bg-green-100 text-green-700' : 
                        order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' : 
                        order.status === 'Delivered' ? 'bg-indigo-100 text-indigo-700' : 
                        order.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer text-xl"
                          title="Переглянути замовлення"
                        >
                          🔍
                        </button>
                        <select 
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
                          className="p-1.5 text-xs border rounded-lg bg-white outline-none focus:border-indigo-500 cursor-pointer text-gray-700"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Paid">Paid</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-gray-500">Замовлень не знайдено</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setSelectedOrder(null)}>
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Деталі замовлення #{selectedOrder.orderNumber}</h2>
                  <p className="text-sm text-gray-500 font-mono">ID: {selectedOrder.id}</p>
                </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 space-y-8">
              {/* Customer Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Клієнт</h3>
                  <div className="text-gray-900 font-medium">
                    {selectedOrder.shippingAddress.firstName} {selectedOrder.shippingAddress.lastName}
                  </div>
                  <div className="text-sm text-gray-600">{selectedOrder.shippingAddress.email}</div>
                  <div className="text-sm text-gray-600">{selectedOrder.shippingAddress.phone}</div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Доставка</h3>
                  <div className="text-gray-900 font-medium">{selectedOrder.shippingAddress.city}</div>
                  <div className="text-sm text-gray-600">Відділення №{selectedOrder.shippingAddress.novaPoshtaBranch}</div>
                  {selectedOrder.shippingAddress.comment && (
                    <div className="text-sm text-gray-500 italic mt-1">"{selectedOrder.shippingAddress.comment}"</div>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Товари</h3>
                <div className="border rounded-2xl overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        <th className="p-3 font-medium text-gray-600">Товар</th>
                        <th className="p-3 font-medium text-gray-600">Деталі</th>
                        <th className="p-3 font-medium text-gray-600 text-center">К-сть</th>
                        <th className="p-3 font-medium text-gray-600 text-right">Ціна</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items.map((item, i) => (
                        <tr key={i} className="border-b border-gray-50 last:border-0">
                          <td className="p-3 font-medium text-gray-900">{item.productName}</td>
                          <td className="p-3 text-gray-500">{item.variationDetails}</td>
                          <td className="p-3 text-center text-gray-600">{item.quantity}</td>
                          <td className="p-3 text-right font-bold text-gray-900">
                            {item.price * item.quantity} грн
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-between items-center pt-6 border-t border-gray-100">
                <div className="text-sm text-gray-500">
                  Дата створення: {new Date(selectedOrder.createdAt!).toLocaleString('uk-UA')}
                </div>
                <div className="text-2xl font-bold text-indigo-600">
                  Разом: {selectedOrder.totalAmount} грн
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
