import { useEffect, useCallback, useState, type ReactNode } from 'react';
import { CheckCircleIcon, XCircleIcon, AlertIcon, InfoIcon, XIcon } from './Icons';
import type { ToastMessage } from '../types';

interface ToastContextValue {
  showToast: (type: ToastMessage['type'], message: string, detail?: string) => void;
}

let toastContextValue: ToastContextValue | null = null;

export function useToast() {
  return toastContextValue ?? { showToast: () => {} };
}

const iconMap = {
  success: <CheckCircleIcon size={20} className="text-success-500" />,
  error: <XCircleIcon size={20} className="text-error-500" />,
  warning: <AlertIcon size={20} className="text-warning-500" />,
  info: <InfoIcon size={20} className="text-primary-500" />,
};

const bgMap = {
  success: 'border-success-200',
  error: 'border-error-200',
  warning: 'border-warning-200',
  info: 'border-primary-200',
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((type: ToastMessage['type'], message: string, detail?: string) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, type, message, detail }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    toastContextValue = { showToast };
    return () => { toastContextValue = null; };
  }, [showToast]);

  return (
    <>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex items-start gap-3 rounded-xl border bg-white px-4 py-3 shadow-lg animate-slide-up ${bgMap[t.type]}`}
            style={{ minWidth: 320, maxWidth: 420 }}
          >
            {iconMap[t.type]}
            <div className="flex-1">
              <p className="text-sm font-medium text-neutral-800">{t.message}</p>
              {t.detail && <p className="mt-0.5 text-xs text-neutral-500">{t.detail}</p>}
            </div>
            <button className="btn-icon" onClick={() => dismiss(t.id)} aria-label="Dismiss">
              <XIcon size={16} />
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
