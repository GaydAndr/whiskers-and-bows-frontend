"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';
import { orderService } from '@/services/orderService';
import { useNotification } from '@/context/NotificationContext';
import { User, Order } from '@whiskers-bows/shared';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const { notify } = useNotification();
  const router = useRouter();
  const [profile, setProfile] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '' });

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    async function loadData() {
      try {
        const userData = await authService.getProfile(user!.id);
        setProfile(userData);
        setFormData({ 
          firstName: userData.firstName, 
          lastName: userData.lastName, 
          email: userData.email 
        });
        
        const userOrders = await orderService.getOrdersByUserId(user!.id);
        setOrders(userOrders);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [user, router]);

  const handleSave = async () => {
    try {
      const updated = await authService.updateProfile(user!.id, formData);
      setProfile(updated);
      setEditing(false);
      notify('Профіль успішно оновлено!', 'success');
    } catch (e) {
      notify('Помилка при збереженні профілю', 'error');
    }
  };

  if (loading) return <div className="container mx-auto py-20 text-center">Завантаження...</div>;

  return (
    <div className="container mx-auto px-4 py-20 max-w-2xl">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-3xl font-bold">Мій профіль</h1>
        <button 
          onClick={logout}
          className="text-sm text-red-600 hover:underline"
        >
          Вийти
        </button>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ім&apos;я</label>
          {editing ? (
            <input 
              type="text" 
              className="w-full p-3 rounded-lg border border-gray-200 text-gray-900" 
              value={formData.firstName} 
              onChange={e => setFormData({...formData, firstName: e.target.value})} 
            />
          ) : (
            <input type="text" className="w-full p-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-900" value={profile?.firstName} readOnly />
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Прізвище</label>
          {editing ? (
            <input 
              type="text" 
              className="w-full p-3 rounded-lg border border-gray-200 text-gray-900" 
              value={formData.lastName} 
              onChange={e => setFormData({...formData, lastName: e.target.value})} 
            />
          ) : (
            <input type="text" className="w-full p-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-900" value={profile?.lastName} readOnly />
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          {editing ? (
            <input 
              type="email" 
              className="w-full p-3 rounded-lg border border-gray-200 text-gray-900" 
              value={formData.email} 
              onChange={e => setFormData({...formData, email: e.target.value})} 
            />
          ) : (
            <input type="email" className="w-full p-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-900" value={profile?.email} readOnly />
          )}
        </div>

        <div className="flex justify-end">
          {editing ? (
            <div className="flex gap-2">
              <button onClick={() => setEditing(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Скасувати</button>
              <button onClick={handleSave} className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Зберегти</button>
            </div>
          ) : (
            <button onClick={() => setEditing(true)} className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Редагувати</button>
          )}
        </div>

        <div className="pt-6 border-t">
          <h2 className="text-xl font-bold mb-4 text-gray-900">Мої замовлення</h2>
          {orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order: Order) => (
                <div 
                  key={order.id} 
                  onClick={() => setSelectedOrder(order)}
                  className="p-4 border rounded-xl flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <p className="font-medium">Замовлення #{order.id.slice(-4)}</p>
                    <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <p className="font-bold text-indigo-600">{order.totalAmount} грн</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">У вас ще немає замовлень.</p>
          )}
        </div>
      </div>

      {selectedOrder && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() => setSelectedOrder(null)}
        >
          <div 
            className="bg-white p-8 rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-in zoom-in duration-300"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Деталі замовлення #{selectedOrder.id.slice(-4)}</h3>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Дата</p>
                  <p className="font-medium text-gray-900">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-500">Статус</p>
                  <p className="font-medium text-gray-900">{selectedOrder.status}</p>
                </div>
                <div>
                  <p className="text-gray-500">Оплата</p>
                  <p className="font-medium text-gray-900">{selectedOrder.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-gray-500">Сума</p>
                  <p className="font-bold text-indigo-600">{selectedOrder.totalAmount} грн</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Адреса доставки</p>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>{selectedOrder.shippingAddress.firstName} {selectedOrder.shippingAddress.lastName}</p>
                  <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.novaPoshtaBranch}</p>
                  <p>{selectedOrder.shippingAddress.phone}</p>
                  {selectedOrder.shippingAddress.comment && <p className="italic mt-2">Коментар: {selectedOrder.shippingAddress.comment}</p>}
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm font-medium text-gray-700 mb-4">Товари</p>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <div className="text-gray-600">
                        <Link 
                          href={`/product/${item.productId}`} 
                          className="font-medium text-gray-900 hover:text-indigo-600 transition-colors"
                        >
                          {item.productName}
                        </Link>
                        <span className="ml-2 text-xs text-gray-400">x{item.quantity}</span>
                        <div className="text-xs text-gray-500">{item.variationDetails}</div>
                      </div>
                      <span className="text-gray-900">{item.price * item.quantity} грн</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button 
              onClick={() => setSelectedOrder(null)} 
              className="w-full mt-8 py-3 bg-gray-100 text-gray-900 font-bold rounded-xl hover:bg-gray-200 transition-colors"
            >
              Закрити
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
