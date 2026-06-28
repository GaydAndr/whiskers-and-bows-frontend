'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

interface ConfirmationOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

interface ConfirmationContextType {
  confirm: (options: ConfirmationOptions) => Promise<boolean>;
}

const ConfirmationContext = createContext<ConfirmationContextType | undefined>(undefined);

export function ConfirmationProvider({ children }: { children: React.ReactNode }) {
  const [confirmConfig, setConfirmConfig] = useState<{ options: ConfirmationOptions; resolve: (value: boolean) => void } | null>(null);

  const confirm = useCallback((options: ConfirmationOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setConfirmConfig({ options, resolve });
    });
  }, []);

  const handleConfirm = () => {
    if (confirmConfig) {
      confirmConfig.resolve(true);
      setConfirmConfig(null);
    }
  };

  const handleCancel = () => {
    if (confirmConfig) {
      confirmConfig.resolve(false);
      setConfirmConfig(null);
    }
  };

  return (
    <ConfirmationContext.Provider value={{ confirm }}>
      {children}
      {confirmConfig && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full text-center animate-in zoom-in duration-300">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{confirmConfig.options.title}</h3>
            <p className="text-gray-600 mb-8">{confirmConfig.options.message}</p>
            <div className="flex justify-center gap-4">
              <button 
                onClick={handleCancel} 
                className="px-6 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {confirmConfig.options.cancelText || 'Скасувати'}
              </button>
              <button 
                onClick={handleConfirm} 
                className="px-6 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
              >
                {confirmConfig.options.confirmText || 'Так'}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmationContext.Provider>
  );
}

export function useConfirmation() {
  const context = useContext(ConfirmationContext);
  if (!context) throw new Error('useConfirmation must be used within a ConfirmationProvider');
  return context;
}
