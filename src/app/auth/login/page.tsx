"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useNotification } from '@/context/NotificationContext';

export default function LoginPage() {
  const { login } = useAuth();
  const { notify } = useNotification();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const user = await login(email, password);
      router.push('/');
    } catch (error) {
      notify('Невірний email або пароль', 'error');
    }
  };

  return (
    <div className="container mx-auto px-4 py-20 flex justify-center">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 text-gray-900">Вхід</h1>
          <p className="text-gray-500">Вітаємо назад у Whiskers & Bows!</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900">Email</label>
            <input 
              type="email" 
              className="w-full p-3 rounded-lg border border-gray-200 outline-none focus:border-indigo-500 transition-colors text-gray-900" 
              placeholder="email@example.com" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-900">Пароль</label>
              <Link href="/auth/forgot" className="text-xs text-indigo-600 hover:underline cursor-pointer">Забули пароль?</Link>
            </div>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                className="w-full p-3 rounded-lg border border-gray-200 outline-none focus:border-indigo-500 transition-colors text-gray-900" 
                placeholder="••••••••" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
              >
                {showPassword ? 'Приховати' : 'Показати'}
              </button>
            </div>
          </div>
          <button type="submit" className="w-full py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-md cursor-pointer">
            Увійти
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Перший раз тут? <Link href="/auth/register" className="text-indigo-600 font-medium hover:underline cursor-pointer">Зареєструйтесь</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
