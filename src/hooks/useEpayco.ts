import { useState, useEffect, useCallback } from 'react';
import {
  loadEpaycoScript,
  configureEpaycoCheckout,
  getEpaycoConfig,
  EpaycoCheckoutData,
  EpaycoHandler,
} from '../lib/epayco';

interface UseEpaycoReturn {
  isReady: boolean;
  isLoading: boolean;
  error: string | null;
  openCheckout: (data: EpaycoCheckoutData) => void;
  closeCheckout: () => void;
}

export const useEpayco = (): UseEpaycoReturn => {
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [handler, setHandler] = useState<EpaycoHandler | null>(null);

  useEffect(() => {
    const initEpayco = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Cargar el script de ePayco
        await loadEpaycoScript();

        // Configurar el checkout
        const { publicKey, testMode } = getEpaycoConfig();
        
        if (!publicKey) {
          throw new Error('La clave pública de ePayco no está configurada');
        }

        const epaycoHandler = configureEpaycoCheckout(publicKey, testMode);
        
        if (!epaycoHandler) {
          throw new Error('No se pudo configurar ePayco');
        }

        setHandler(epaycoHandler);
        setIsReady(true);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error al inicializar ePayco';
        setError(errorMessage);
        console.error('Error inicializando ePayco:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initEpayco();
  }, []);

  const openCheckout = useCallback(
    (data: EpaycoCheckoutData) => {
      if (!handler) {
        console.error('ePayco no está listo');
        return;
      }

      try {
        handler.open(data);
      } catch (err) {
        console.error('Error al abrir checkout de ePayco:', err);
      }
    },
    [handler]
  );

  const closeCheckout = useCallback(() => {
    if (!handler) {
      return;
    }

    try {
      handler.close();
    } catch (err) {
      console.error('Error al cerrar checkout de ePayco:', err);
    }
  }, [handler]);

  return {
    isReady,
    isLoading,
    error,
    openCheckout,
    closeCheckout,
  };
};

