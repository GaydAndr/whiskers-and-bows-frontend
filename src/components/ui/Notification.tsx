'use client';

import React, { useEffect } from 'react';
import { useNotification } from '@/context/NotificationContext';

const Notification = ({ id, message, type, onRemove }: { id: string, message: string, type: string, onRemove: (id: string) => void }) => {
  useEffect(() => {
    const timer = setTimeout(() => onRemove(id), 5000);
    return () => clearTimeout(timer);
  }, [id, onRemove]);

  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-indigo-600',
  }[type as 'success' | 'error' | 'info'] || 'bg-indigo-600';

  return (
    <div className={`${bgColor} text-white px-6 py-4 rounded-2xl shadow-lg flex items-center justify-between gap-4 animate-in slide-in-from-left duration-300 min-w-[300px]`}>
      <span className="font-medium">{message}</span>
      <button onClick={() => onRemove(id)} className="text-white/70 hover:text-white transition-colors text-xl">&times;</button>
    </div>
  );
};

export const NotificationContainer = () => {
  const { notifications, removeNotification } = useNotification();

  return (
    <div className="fixed bottom-6 left-6 z-[100] flex flex-col gap-3 pointer-events-none">
      {notifications.map(n => (
        <div key={n.id} className="pointer-events-auto">
          <Notification {...n} onRemove={removeNotification} />
        </div>
      ))}
    </div>
  );
};
