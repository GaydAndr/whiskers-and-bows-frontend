"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { authService } from '@/services/authService';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await authService.forgotPassword(email);
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    }
  };

  return (
    <div className="container mx-auto px-4 py-20 flex justify-center">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 text-gray-900">Відновлення пароля</h1>
          <p className="text-gray-500">Введіть ваш email, і ми надішлемо інструкції для скидання пароля.</p>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input 
                type="email" 
                className="w-full p-3 rounded-lg border border-gray-200 outline-none focus:border-indigo-500 transition-colors text-gray-900" 
                placeholder="email@example.com" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button type="submit" className="w-full py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-md cursor-pointer">
              Надіслати посилання
            </button>
          </form>
        ) : (
          <div className="text-center space-y-4">
            <div className="text-5xl">✉️</div>
            <h3 className="text-xl font-bold text-gray-900">Лист надіслано!</h3>
            <p className="text-gray-600">Перевірте свою пошту для завершення процесу відновлення.</p>
            <Link href="/auth/login" className="inline-block px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer">
              Повернутися до входу
            </Link>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link href="/auth/login" className="text-sm text-indigo-600 font-medium hover:underline cursor-pointer">
            Згадали пароль? Увійти
          </Link>
        </div>
      </div>
    </div>
  );
}
