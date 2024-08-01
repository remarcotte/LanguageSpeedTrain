import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ThemedToast } from './ThemedToast';

interface ToastContextType {
  showToast: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastDuration, setToastDuration] = useState<number>(500);

  const showToast = (message: string, duration: number = 500) => {
    setToastMessage(message);
    setToastDuration(duration);
    setTimeout(() => {
      setToastMessage(null);
    }, duration);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toastMessage && <ThemedToast title={toastMessage} duration={toastDuration} />}
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
