 "use client";
 
import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useNotification } from '@/context/NotificationContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const { notify } = useNotification();
  const router = useRouter();
  const [formData, setFormData] = useState({
     firstName: '',
     lastName: '',
     email: '',
     password: '',
     confirmPassword: '',
   });
   const [loading, setLoading] = useState(false);
 
   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     if (formData.password !== formData.confirmPassword) {
       alert('Паролі не збігаються');
       return;
     }
 
     setLoading(true);
      try {
        await register(formData);
        notify('Реєстрація успішна!', 'success');
        router.push('/auth/login');
      } catch (e) {
        notify('Помилка реєстрації. Можливо, email вже зайнятий.', 'error');
      } finally {
        setLoading(false);
      }
   };
 
   return (
     <div className="container mx-auto px-4 py-20 flex justify-center">
       <div className="w-full max-w-lg bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
         <div className="text-center mb-8">
           <h1 className="text-3xl font-bold mb-2 text-gray-900">Реєстрація</h1>
           <p className="text-gray-500">Приєднуйтесь до спільноти Whiskers & Bows</p>
         </div>
 
         <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="space-y-2">
             <label className="text-sm font-medium text-gray-700">Ім&apos;я</label>
             <input 
               type="text" 
               className="w-full p-3 rounded-lg border border-gray-200 outline-none focus:border-indigo-500 transition-colors text-gray-900 placeholder-gray-400" 
               placeholder="Олександр" 
               value={formData.firstName}
               onChange={e => setFormData({...formData, firstName: e.target.value})}
               required
             />
           </div>
           <div className="space-y-2">
             <label className="text-sm font-medium text-gray-700">Прізвище</label>
             <input 
               type="text" 
               className="w-full p-3 rounded-lg border border-gray-200 outline-none focus:border-indigo-500 transition-colors text-gray-900 placeholder-gray-400" 
               placeholder="Петренко" 
               value={formData.lastName}
               onChange={e => setFormData({...formData, lastName: e.target.value})}
               required
             />
           </div>
           <div className="space-y-2 md:col-span-2">
             <label className="text-sm font-medium text-gray-700">Email</label>
             <input 
               type="email" 
               className="w-full p-3 rounded-lg border border-gray-200 outline-none focus:border-indigo-500 transition-colors text-gray-900 placeholder-gray-400" 
               placeholder="email@example.com" 
               value={formData.email}
               onChange={e => setFormData({...formData, email: e.target.value})}
               required
             />
           </div>
           <div className="space-y-2">
             <label className="text-sm font-medium text-gray-700">Пароль</label>
             <input 
               type="password" 
               className="w-full p-3 rounded-lg border border-gray-200 outline-none focus:border-indigo-500 transition-colors text-gray-900 placeholder-gray-400" 
               placeholder="••••••••" 
               value={formData.password}
               onChange={e => setFormData({...formData, password: e.target.value})}
               required
             />
           </div>
           <div className="space-y-2">
             <label className="text-sm font-medium text-gray-700">Повторіть пароль</label>
             <input 
               type="password" 
               className="w-full p-3 rounded-lg border border-gray-200 outline-none focus:border-indigo-500 transition-colors text-gray-900 placeholder-gray-400" 
               placeholder="••••••••" 
               value={formData.confirmPassword}
               onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
               required
             />
           </div>
           <button 
             type="submit" 
             disabled={loading}
             className="md:col-span-2 w-full py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-md cursor-pointer disabled:bg-gray-400"
           >
             {loading ? 'Реєстрація...' : 'Створити аккаунт'}
           </button>
         </form>
 
         <div className="mt-8 text-center">
           <p className="text-sm text-gray-500">
             Вже маєте аккаунт? <Link href="/auth/login" className="text-indigo-600 font-medium hover:underline">Увійти</Link>
           </p>
         </div>
       </div>
     </div>
   );
 }

