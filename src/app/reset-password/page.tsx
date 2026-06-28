"use client";

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authService } from '@/services/authService';
import Link from 'next/link';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('Invalid token');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await authService.resetPassword(token, password);
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    }
  };

  if (!token) {
    return (
      <div className="container mx-auto px-4 py-20 flex justify-center">
        <div className="w-full max-w-md bg-white p-8 rounded-3xl border border-gray-200 shadow-sm text-center">
          <h1 className="text-3xl font-bold mb-2 text-gray-900">Помилка</h1>
          <p className="text-gray-500">Недійсне або відсутнє посилання для скидання пароля.</p>
          <Link href="/auth/forgot" className="inline-block mt-6 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer">
            Запитати нове посилання
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-20 flex justify-center">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 text-gray-900">Скидання пароля</h1>
          <p className="text-gray-500">Введіть новий пароль, щоб відновити доступ до свого облікового запису.</p>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Новий пароль</label>
              <input 
                type="password" 
                className="w-full p-3 rounded-lg border border-gray-200 outline-none focus:border-indigo-500 transition-colors text-gray-900" 
                placeholder="********" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Підтвердіть пароль</label>
              <input 
                type="password" 
                className="w-full p-3 rounded-lg border border-gray-200 outline-none focus:border-indigo-500 transition-colors text-gray-900" 
                placeholder="********" 
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button type="submit" className="w-full py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-md cursor-pointer">
              Оновити пароль
            </button>
          </form>
        ) : (
          <div className="text-center space-y-4">
            <div className="text-5xl">✅</div>
            <h3 className="text-xl font-bold text-gray-900">Пароль успішно оновлено!</h3>
            <p className="text-gray-600">Тепер ви можете увійти за допомогою свого нового пароля.</p>
            <Link href="/auth/login" className="inline-block px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer">
              Перейти до входу
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
