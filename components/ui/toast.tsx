'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils/cn';

type ToastType = 'success' | 'error' | 'info';

type ToastProps = {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose?: () => void;
};

export function Toast({ message, type = 'info', duration = 3000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose?.(), 300);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!isVisible) return null;

  const styles = {
    success: 'bg-green-50 text-green-800 border-green-200',
    error: 'bg-red-50 text-red-800 border-red-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200',
  };

  return (
    <div
      className={cn(
        'fixed bottom-4 right-4 z-50 px-4 py-3 rounded-lg border shadow-lg',
        'animate-in slide-in-from-bottom-5',
        styles[type]
      )}
      role="alert"
    >
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">{message}</span>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(() => onClose?.(), 300);
          }}
          className="ml-2 text-current opacity-70 hover:opacity-100"
          aria-label="닫기"
        >
          ×
        </button>
      </div>
    </div>
  );
}

type ToastContextType = {
  showToast: (message: string, type?: ToastType) => void;
};

export function useToast(): ToastContextType {
  return {
    showToast: (message: string, type: ToastType = 'info') => {
      // 간단한 구현: 전역 상태나 Context API를 사용할 수 있지만
      // 여기서는 컴포넌트 내부에서 직접 관리하는 방식 사용
      const event = new CustomEvent('show-toast', {
        detail: { message, type },
      });
      window.dispatchEvent(event);
    },
  };
}
