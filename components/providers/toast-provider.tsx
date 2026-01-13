'use client';

import { useState, useEffect } from 'react';
import { Toast } from '@/components/ui/toast';

type ToastMessage = {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
};

export default function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const handleShowToast = (event: CustomEvent<{ message: string; type: 'success' | 'error' | 'info' }>) => {
      const id = Math.random().toString(36).substring(7);
      setToasts((prev) => [...prev, { id, message: event.detail.message, type: event.detail.type }]);
    };

    window.addEventListener('show-toast', handleShowToast as EventListener);

    return () => {
      window.removeEventListener('show-toast', handleShowToast as EventListener);
    };
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <>
      {children}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </>
  );
}
