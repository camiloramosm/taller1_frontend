import toast from 'react-hot-toast';

/**
 * Utilidades centralizadas para mostrar notificaciones toast
 * Estilos personalizados para mantener consistencia en toda la app
 */

const toastConfig = {
  duration: 4000,
  position: 'top-center' as const,
  style: {
    background: '#363636',
    color: '#fff',
    padding: '16px',
    borderRadius: '8px',
  },
};

export const showSuccessToast = (message: string) => {
  toast.success(message, {
    ...toastConfig,
    icon: '✅',
    style: {
      ...toastConfig.style,
      background: '#10b981',
    },
  });
};

export const showErrorToast = (message: string) => {
  toast.error(message, {
    ...toastConfig,
    icon: '❌',
    style: {
      ...toastConfig.style,
      background: '#ef4444',
    },
  });
};

export const showWarningToast = (message: string) => {
  toast(message, {
    ...toastConfig,
    icon: '⚠️',
    style: {
      ...toastConfig.style,
      background: '#f59e0b',
    },
  });
};

export const showInfoToast = (message: string) => {
  toast(message, {
    ...toastConfig,
    icon: 'ℹ️',
    style: {
      ...toastConfig.style,
      background: '#3b82f6',
    },
  });
};

export const showLoadingToast = (message: string) => {
  return toast.loading(message, {
    ...toastConfig,
  });
};

export const dismissToast = (toastId: string) => {
  toast.dismiss(toastId);
};

export const dismissAllToasts = () => {
  toast.dismiss();
};

