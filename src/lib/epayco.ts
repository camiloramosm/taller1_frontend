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
      console.log('✅ ePayco ya está cargado');
      resolve();
      return;
    }

    // Verificar si ya existe un script de ePayco cargándose
    const existingScript = document.querySelector('script[src*="checkout.epayco.co"]');
    if (existingScript) {
      console.log('⏳ Script de ePayco ya está cargándose...');
      // Esperar a que termine de cargar
      existingScript.addEventListener('load', () => resolve());
      existingScript.addEventListener('error', () => reject(new Error('Error al cargar el script de ePayco')));
      return;
    }

    console.log('📥 Cargando script de ePayco...');
    const script = document.createElement('script');
    script.src = 'https://checkout.epayco.co/checkout.js';
    script.async = true;
    script.setAttribute('data-epayco', 'true');
    
    script.onload = () => {
      console.log('✅ Script de ePayco cargado exitosamente');
      // Dar un pequeño tiempo para que ePayco se inicialice
      setTimeout(() => resolve(), 100);
    };
    
    script.onerror = (error) => {
      console.error('❌ Error al cargar el script de ePayco:', error);
      reject(new Error('No se pudo cargar la pasarela de pagos. Verifica tu conexión a internet.'));
    };
    
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

  console.log('🔍 Configuración de ePayco:');
  console.log('  - Public Key:', publicKey ? `${publicKey.substring(0, 10)}...` : '❌ NO CONFIGURADA');
  console.log('  - Test Mode:', testMode);
  console.log('  - Variables disponibles:', Object.keys(import.meta.env).filter(k => k.startsWith('VITE_')));

  if (!publicKey) {
    console.error('❌ VITE_EPAYCO_PUBLIC_KEY no está configurada');
    console.error('💡 Solución:');
    console.error('   1. Ve a Vercel → Settings → Environment Variables');
    console.error('   2. Agrega: VITE_EPAYCO_PUBLIC_KEY = 68d10a49ae848d5772c2e05844c8b37c');
    console.error('   3. Haz Redeploy del proyecto');
  }

  return {
    publicKey,
    testMode,
  };
};

