'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { AuthProvider } from '@/context/AuthContext';
import { NotificationProvider } from '@/context/NotificationContext';
import { ConfirmationProvider } from '@/context/ConfirmationContext';
import { NotificationContainer } from '@/components/ui/Notification';

const queryClient = new QueryClient();

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <NotificationProvider>
        <ConfirmationProvider>
          <CartProvider>
            <WishlistProvider>
              <QueryClientProvider client={queryClient}>
                <NotificationContainer />
                {children}
              </QueryClientProvider>
            </WishlistProvider>
          </CartProvider>
        </ConfirmationProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}
