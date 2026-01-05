// Tipos de ePayco
export interface EpaycoCheckoutConfig {
  key: string;
  test: boolean;
}

export interface EpaycoCheckoutData {
  // Información del comercio
  name: string;
  description: string;
  invoice: string;
  currency: string;
  amount: string;
  tax_base: string;
  tax: string;
  country: string;
  lang: string;
  
  // Información del cliente
  external: string; // true o false como string
  extra1?: string;
  extra2?: string;
  extra3?: string;
  
  // URLs de respuesta
  response?: string;
  confirmation?: string;
  
  // Información del comprador
  name_billing?: string;
  address_billing?: string;
  type_doc_billing?: string;
  mobilephone_billing?: string;
  number_doc_billing?: string;
  
  // Método de pago
  methodsDisable?: string[];
}

export interface EpaycoHandler {
  open: (data: EpaycoCheckoutData) => void;
  close: () => void;
}

declare global {
  interface Window {
    ePayco: {
      checkout: {
        configure: (config: EpaycoCheckoutConfig) => EpaycoHandler;
      };
    };
  }
}

// Cargar el script de ePayco
export const loadEpaycoScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Si ya está cargado, resolver inmediatamente
    if (window.ePayco) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.epayco.co/checkout.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Error al cargar el script de ePayco'));
    
    document.body.appendChild(script);
  });
};

// Configurar ePayco Checkout
export const configureEpaycoCheckout = (
  publicKey: string,
  testMode = false
): EpaycoHandler | null => {
  if (!window.ePayco) {
    console.error('ePayco no está cargado');
    return null;
  }

  return window.ePayco.checkout.configure({
    key: publicKey,
    test: testMode,
  });
};

// Obtener configuración desde variables de entorno
export const getEpaycoConfig = () => {
  const publicKey = import.meta.env.VITE_EPAYCO_PUBLIC_KEY;
  const testMode = import.meta.env.VITE_EPAYCO_TEST_MODE === 'true';

  if (!publicKey) {
    console.error('VITE_EPAYCO_PUBLIC_KEY no está configurada');
  }

  return {
    publicKey,
    testMode,
  };
};

