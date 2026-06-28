"use client";

import React, { useState } from 'react';

export default function ContactsPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    reason: '',
    message: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = 'Будь ласка, введіть ваше ім\'я';
    if (!formData.phone) newErrors.phone = 'Будь ласка, введіть номер телефону';
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Введіть коректний email';
    if (!formData.reason) newErrors.reason = 'Оберіть привід звернення';
    if (!formData.message) newErrors.message = 'Повідомлення не може бути порожнім';
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <div className="container mx-auto px-4 py-20">
      <h1 className="text-4xl font-bold mb-12 text-center">Контакти</h1>
      
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="w-full lg:w-1/3 space-y-8">
<div className="bg-indigo-100 p-8 rounded-3xl border-2 border-indigo-200 shadow-sm">
                <h2 className="text-2xl font-extrabold mb-6 text-indigo-700 uppercase tracking-wide">Зв&apos;яжіться з нами</h2>
                <div className="space-y-4">
              <div className="flex items-center gap-4 text-gray-700">
                <span className="text-xl">📞</span>
                <span>+38 (0XX) XXX-XX-XX</span>
              </div>
              <div className="flex items-center gap-4 text-gray-700">
                <span className="text-xl">📧</span>
                <span>hello@whiskersbows.ua</span>
              </div>
              <div className="flex items-center gap-4 text-gray-700">
                <span className="text-xl">📍</span>
                <span>м. Івано-Франківськ, вул. Чорновола 20а</span>
              </div>
            </div>
          </div>
          
          <div className="bg-black text-white p-8 rounded-3xl">
            <h2 className="text-xl font-bold mb-4">Графік роботи</h2>
            <p className="text-gray-400">Пн-Пт: 8:00 — 20:00</p>
            <p className="text-gray-400">Сб-Нд: вихідні</p>
          </div>
        </div>

        <div className="w-full lg:w-2/3 bg-white p-8 rounded-3xl border border-gray-200 shadow-sm relative">
          {isSubmitted && (
            <div className="absolute inset-0 z-10 bg-white/90 backdrop-blur-sm flex items-center justify-center rounded-3xl">
              <div className="text-center p-8 animate-in zoom-in duration-300">
                <div className="text-6xl mb-4">✅</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Повідомлення надіслано!</h3>
                <p className="text-gray-600">Дякуємо за звернення. Ми відповімо вам найближчим часом.</p>
              </div>
            </div>
          )}

<h2 className="text-2xl font-extrabold mb-6 text-indigo-700 uppercase tracking-wide">Напишіть нам</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
<div className="space-y-2">
                <label className={`text-sm font-medium transition-colors ${errors.name ? 'text-red-500 font-bold' : 'text-gray-700'}`}>Ім&apos;я</label>
                <input 
                  type="text" 
                  className={`w-full p-3 rounded-lg border outline-none transition-colors ${errors.name ? 'border-red-500 focus:border-red-500 bg-red-50' : 'border-gray-200 focus:border-indigo-500'}`} 
                   placeholder="Ваше ім&apos;я"

                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
                {errors.name && <span className="text-xs text-red-500 animate-pulse">{errors.name}</span>}
              </div>
<div className="space-y-2">
                <label className={`text-sm font-medium transition-colors ${errors.phone ? 'text-red-500 font-bold' : 'text-gray-700'}`}>Телефон</label>
                <input 
                  type="tel" 
                  className={`w-full p-3 rounded-lg border outline-none transition-colors text-gray-900 ${errors.phone ? 'border-red-500 focus:border-red-500 bg-red-50' : 'border-gray-200 focus:border-indigo-500'}`} 
                  placeholder="+38..." 
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                />


                {errors.phone && <span className="text-xs text-red-500 animate-pulse">{errors.phone}</span>}
              </div>
<div className="space-y-2 md:col-span-2">
                <label className={`text-sm font-medium transition-colors ${errors.email ? 'text-red-500 font-bold' : 'text-gray-700'}`}>Email</label>
                <input 
                  type="email" 
                  className={`w-full p-3 rounded-lg border outline-none transition-colors text-gray-900 ${errors.email ? 'border-red-500 focus:border-red-500 bg-red-50' : 'border-gray-200 focus:border-indigo-500'}`} 
                  placeholder="email@example.com" 
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
                {errors.email && <span className="text-xs text-red-500 animate-pulse">{errors.email}</span>}
              </div>
<div className="space-y-2 md:col-span-2">
                <label className={`text-sm font-bold transition-colors ${errors.reason ? 'text-red-600' : 'text-indigo-700'}`}>Привід звернення</label>
                <div className="flex flex-wrap gap-4">
                  {['Замовлення', 'Допомога', 'Співпраця', 'Інше'].map(option => (
                    <label key={option} className="flex items-center gap-2 text-sm cursor-pointer group">
                      <input 
                        type="radio" 
                        name="reason" 
                        className="text-indigo-600 cursor-pointer" 
                        checked={formData.reason === option}
                        onChange={() => setFormData({...formData, reason: option})}
                      />
                      <span className={`transition-colors ${formData.reason === option ? 'text-indigo-600 font-bold' : 'text-gray-900 group-hover:text-indigo-600'}`}>
                        {option}
                      </span>
                    </label>
                  ))}
                </div>
                {errors.reason && <span className="text-xs text-red-500 animate-pulse">{errors.reason}</span>}
               </div>
<div className="space-y-2 md:col-span-2">
                <label className={`text-sm font-medium transition-colors ${errors.message ? 'text-red-500 font-bold' : 'text-gray-700'}`}>Повідомлення</label>
                <textarea 
                  className={`w-full p-3 rounded-lg border outline-none transition-colors text-gray-900 h-32 ${errors.message ? 'border-red-500 focus:border-red-500 bg-red-50' : 'border-gray-200 focus:border-indigo-500'}`} 
                  placeholder="Ваше повідомлення..."
                  value={formData.message}
                  onChange={e => setFormData({...formData, message: e.target.value})}
                ></textarea>
                {errors.message && <span className="text-xs text-red-500 animate-pulse">{errors.message}</span>}
              </div>
             <button className="md:col-span-2 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-md cursor-pointer">
               Надіслати
             </button>

          </form>
        </div>
      </div>
    </div>
  );
}
