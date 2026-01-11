'use client';

import { useState, useEffect } from 'react';
import { loadEpaycoScript, configureEpaycoCheckout, getEpaycoConfig } from '@/lib/epayco';
import type { EpaycoHandler, EpaycoCheckoutData } from '@/lib/epayco';

export const useEpayco = () => {
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

        // Obtener configuración
        const config = getEpaycoConfig();

        if (!config.publicKey) {
          throw new Error('La clave pública de ePayco no está configurada');
        }

        // Configurar checkout
        const checkoutHandler = configureEpaycoCheckout(config.publicKey, config.testMode);

        if (!checkoutHandler) {
          throw new Error('No se pudo configurar ePayco');
        }

        setHandler(checkoutHandler);
        setIsReady(true);
      } catch (err) {
        console.error('Error al inicializar ePayco:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
        setIsReady(false);
      } finally {
        setIsLoading(false);
      }
    };

    initEpayco();
  }, []);

  const openCheckout = (data: EpaycoCheckoutData) => {
    if (!handler) {
      console.error('ePayco no está listo');
      return;
    }

    try {
      handler.open(data);
    } catch (err) {
      console.error('Error al abrir checkout de ePayco:', err);
      setError(err instanceof Error ? err.message : 'Error al abrir checkout');
    }
  };

  return {
    isReady,
    isLoading,
    error,
    openCheckout,
  };
};
