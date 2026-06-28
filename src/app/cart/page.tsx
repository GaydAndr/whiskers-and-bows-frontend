"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { orderService } from '@/services/orderService';
import { useAuth } from '@/context/AuthContext';
import { useNotification } from '@/context/NotificationContext';
import { Order } from '@whiskers-bows/shared';


export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const { notify } = useNotification();
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    city: '',
    branch: '',
    phone: '',
    email: '',
    comment: '',
    payment: 'Card' as Order['paymentMethod'],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName) newErrors.firstName = 'Обов\'язкове поле';
    if (!formData.lastName) newErrors.lastName = 'Обов\'язкове поле';
    if (!formData.city) newErrors.city = 'Обов\'язкове поле';
    if (!formData.branch) newErrors.branch = 'Обов\'язкове поле';
    if (!formData.phone) newErrors.phone = 'Обов\'язкове поле';
    if (!formData.email) newErrors.email = 'Обов\'язкове поле';
    return newErrors;
  };

  const handleCheckout = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await orderService.createOrder({
        userId: user?.id || 'guest',
        items: cart.map(item => ({
          productId: item.productId,
          variationId: item.variationId,
          quantity: item.quantity,
          price: item.price,
          productName: item.name,
          variationDetails: item.details,
        })),
        totalAmount: total,
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          city: formData.city,
          novaPoshtaBranch: formData.branch,
          phone: formData.phone,
          email: formData.email,
          comment: formData.comment,
        },
         paymentMethod: formData.payment,
         createdAt: new Date(),
      });

      notify('Замовлення успішно оформлене!', 'success');
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        clearCart();
      }, 5000);
    } catch (e) {
      notify('Помилка при оформленні замовлення', 'error');
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-12">Кошик</h1>
      
       {showSuccess && (
         <div 
           className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
           onClick={() => setShowSuccess(false)}
         >
           <div 
             className="bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full text-center animate-in zoom-in duration-300"
             onClick={e => e.stopPropagation()}
           >
             <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Замовлення успішне!</h3>
             <p className="text-gray-600 mb-6">Дякуємо за покупку. Ми зв&apos;яжемося з вами найближчим часом для уточнення деталей доставки.</p>

            <button 
              onClick={() => setShowSuccess(false)}
              className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Закрити
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Order Form */}
        <div className="w-full lg:w-1/2 space-y-8">
<div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
                <h2 className="text-2xl font-extrabold mb-6 text-indigo-700 uppercase tracking-wide">Дані для доставки</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900">Ім&apos;я</label>
                <input 
                  type="text" 
                  className={`w-full p-3 rounded-lg border outline-none transition-colors text-gray-900 ${errors.firstName ? 'border-red-500' : 'border-gray-200 focus:border-indigo-500'}`} 
                  placeholder="Олександр" 
                  value={formData.firstName}
                  onChange={e => setFormData({...formData, firstName: e.target.value})}
                />
                {errors.firstName && <span className="text-[10px] text-red-500">{errors.firstName}</span>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900">Прізвище</label>
                <input 
                  type="text" 
                  className={`w-full p-3 rounded-lg border outline-none transition-colors text-gray-900 ${errors.lastName ? 'border-red-500' : 'border-gray-200 focus:border-indigo-500'}`} 
                  placeholder="Петренко" 
                  value={formData.lastName}
                  onChange={e => setFormData({...formData, lastName: e.target.value})}
                />
                {errors.lastName && <span className="text-[10px] text-red-500">{errors.lastName}</span>}
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-gray-900">Місто</label>
                <input 
                  type="text" 
                  className={`w-full p-3 rounded-lg border outline-none transition-colors text-gray-900 ${errors.city ? 'border-red-500' : 'border-gray-200 focus:border-indigo-500'}`} 
                  placeholder="Київ" 
                  value={formData.city}
                  onChange={e => setFormData({...formData, city: e.target.value})}
                />
                {errors.city && <span className="text-[10px] text-red-500">{errors.city}</span>}
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-gray-900">№ Відділення Нової Пошти</label>
                <input 
                  type="text" 
                  className={`w-full p-3 rounded-lg border outline-none transition-colors text-gray-900 ${errors.branch ? 'border-red-500' : 'border-gray-200 focus:border-indigo-500'}`} 
                  placeholder="123" 
                  value={formData.branch}
                  onChange={e => setFormData({...formData, branch: e.target.value})}
                />
                {errors.branch && <span className="text-[10px] text-red-500">{errors.branch}</span>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900">Телефон</label>
                <input 
                  type="tel" 
                  className={`w-full p-3 rounded-lg border outline-none transition-colors text-gray-900 ${errors.phone ? 'border-red-500' : 'border-gray-200 focus:border-indigo-500'}`} 
                  placeholder="+380..." 
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                />
                {errors.phone && <span className="text-[10px] text-red-500">{errors.phone}</span>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900">Email</label>
                <input 
                  type="email" 
                  className={`w-full p-3 rounded-lg border outline-none transition-colors text-gray-900 ${errors.email ? 'border-red-500' : 'border-gray-200 focus:border-indigo-500'}`} 
                  placeholder="email@example.com" 
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
                {errors.email && <span className="text-[10px] text-red-500">{errors.email}</span>}
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-gray-900">Коментар</label>
                <textarea 
                  className={`w-full p-3 rounded-lg border outline-none transition-colors text-gray-900 h-32 ${errors.message ? 'border-red-500 focus:border-red-500 bg-red-50' : 'border-gray-200 focus:border-indigo-500'}`} 
                  placeholder="Будь ласка, зателефонуйте перед відправкою..." 
                  value={formData.comment}
                  onChange={e => setFormData({...formData, comment: e.target.value})}
                ></textarea>

              </div>
            </div>
          </div>

           <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
             <h2 className="text-xl font-bold mb-6 text-gray-900">Спосіб оплати</h2>
             <div className="flex flex-col gap-4">

                <label className="flex items-center gap-3 p-4 border rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                    <input 
                      type="radio" 
                      name="payment" 
                      className="w-4 h-4 text-indigo-600 cursor-pointer" 
                      checked={formData.payment === 'Card'}
                      onChange={() => setFormData({...formData, payment: 'Card'})}
                    />
                  <span className="font-medium text-gray-900 cursor-pointer">Банківська картка</span>
                </label>

                <label className="flex items-center gap-3 p-4 border rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                    <input 
                      type="radio" 
                      name="payment" 
                      className="w-4 h-4 text-indigo-600 cursor-pointer" 
                      checked={formData.payment === 'Cash'}
                      onChange={() => setFormData({...formData, payment: 'Cash'})}
                    />
                  <span className="font-medium text-gray-900 cursor-pointer">Готівкою при отриманні</span>
                </label>

            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-1/2">
<div className="bg-gray-50 p-8 rounded-3xl border border-gray-200 sticky top-24">
                <h2 className="text-2xl font-extrabold mb-6 text-indigo-700 uppercase tracking-wide">Ваше замовлення</h2>
                {cart.length > 0 ? (
              <div className="space-y-6 mb-8">
                {cart.map(item => (
                  <div key={item.id} className="flex gap-4">
                    <img src={item.image || 'https://placehold.co/80'} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                    <div className="flex-grow">
                      <div className="flex justify-between font-medium text-gray-900">
                        <span>{item.name}</span>
                        <span>{item.price * item.quantity} грн</span>
                      </div>
                      <div className="text-xs text-gray-500 mb-2">{item.details}</div>
                      <div className="flex items-center justify-between">
                <div className="flex items-center border rounded-lg overflow-hidden text-xs bg-gray-900 text-white">
                           <button onClick={() => updateQuantity(item.id, item.productId, item.variationId, -1)} className="px-2 py-1 hover:bg-gray-800 transition-colors cursor-pointer">-</button>
                           <span className="px-2 py-1 font-bold">{item.quantity}</span>
                           <button onClick={() => updateQuantity(item.id, item.productId, item.variationId, 1)} className="px-2 py-1 hover:bg-gray-800 transition-colors cursor-pointer">+</button>
                         </div>
                         <button onClick={() => removeFromCart(item.id, item.productId, item.variationId)} className="text-xs text-red-500 hover:underline">Видалити</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500 mb-8">
                Ваш кошик порожній
              </div>
            )}
            
            <div className="border-t pt-6 space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Товари</span>
                <span>{total} грн</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Доставка</span>
                <span>Безкоштовно</span>
              </div>
              <div className="flex justify-between text-2xl font-bold text-gray-900 pt-3">
                <span>Разом</span>
                <span>{total} грн</span>
              </div>
            </div>

             <button 
               onClick={handleCheckout}
               disabled={cart.length === 0} 
               className={`w-full mt-8 py-4 font-bold rounded-xl transition-colors shadow-lg cursor-pointer ${cart.length > 0 ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
             >
               Оформити замовлення
             </button>

          </div>
        </div>
      </div>
    </div>
  );
}
