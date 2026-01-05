/**
 * Rate Limiter simple para prevenir spam en formularios
 * Usa localStorage para rastrear intentos
 */

interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
  storageKey: string;
}

interface AttemptRecord {
  count: number;
  firstAttempt: number;
  blockedUntil?: number;
}

/**
 * Clase para manejar rate limiting por recurso
 */
export class RateLimiter {
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
  }

  /**
   * Verifica si se puede realizar una acción
   */
  canAttempt(): { allowed: boolean; remainingAttempts?: number; retryAfter?: number } {
    const now = Date.now();
    const record = this.getRecord();

    // Si no hay registro previo, permitir
    if (!record) {
      return { allowed: true, remainingAttempts: this.config.maxAttempts - 1 };
    }

    // Si está bloqueado, verificar si ya expiró el bloqueo
    if (record.blockedUntil) {
      if (now < record.blockedUntil) {
        const retryAfter = Math.ceil((record.blockedUntil - now) / 1000);
        return { allowed: false, retryAfter };
      }
      // El bloqueo expiró, limpiar registro
      this.clearRecord();
      return { allowed: true, remainingAttempts: this.config.maxAttempts - 1 };
    }

    // Verificar si la ventana de tiempo expiró
    const windowExpired = now - record.firstAttempt > this.config.windowMs;
    if (windowExpired) {
      this.clearRecord();
      return { allowed: true, remainingAttempts: this.config.maxAttempts - 1 };
    }

    // Calcular intentos restantes
    const remainingAttempts = this.config.maxAttempts - record.count;
    
    // Verificar si alcanzó el máximo de intentos
    if (remainingAttempts <= 0) {
      // Bloquear por la misma duración de la ventana
      const blockedUntil = now + this.config.windowMs;
      this.setRecord({
        ...record,
        blockedUntil,
      });
      const retryAfter = Math.ceil(this.config.windowMs / 1000);
      return { allowed: false, retryAfter };
    }

    // Permitir el intento
    return { allowed: true, remainingAttempts };
  }

  /**
   * Registra un intento
   */
  recordAttempt(): void {
    const now = Date.now();
    const record = this.getRecord();

    if (!record) {
      this.setRecord({
        count: 1,
        firstAttempt: now,
      });
      return;
    }

    // Si la ventana expiró, reiniciar contador
    const windowExpired = now - record.firstAttempt > this.config.windowMs;
    if (windowExpired) {
      this.setRecord({
        count: 1,
        firstAttempt: now,
      });
      return;
    }

    // Incrementar contador
    this.setRecord({
      ...record,
      count: record.count + 1,
    });
  }

  /**
   * Limpia el registro de intentos
   */
  clearRecord(): void {
    try {
      localStorage.removeItem(this.config.storageKey);
    } catch (error) {
      console.error('Error al limpiar rate limiter:', error);
    }
  }

  /**
   * Obtiene el registro de intentos del localStorage
   */
  private getRecord(): AttemptRecord | null {
    try {
      const stored = localStorage.getItem(this.config.storageKey);
      if (!stored) return null;
      return JSON.parse(stored) as AttemptRecord;
    } catch (error) {
      console.error('Error al leer rate limiter:', error);
      return null;
    }
  }

  /**
   * Guarda el registro de intentos en localStorage
   */
  private setRecord(record: AttemptRecord): void {
    try {
      localStorage.setItem(this.config.storageKey, JSON.stringify(record));
    } catch (error) {
      console.error('Error al guardar rate limiter:', error);
    }
  }
}

/**
 * Rate limiter para formulario de pedidos
 * Límite: 3 pedidos por hora
 */
export const pedidosRateLimiter = new RateLimiter({
  maxAttempts: 3,
  windowMs: 60 * 60 * 1000, // 1 hora
  storageKey: 'rate_limit_pedidos',
});

/**
 * Rate limiter para formulario de contacto
 * Límite: 5 mensajes por hora
 */
export const contactoRateLimiter = new RateLimiter({
  maxAttempts: 5,
  windowMs: 60 * 60 * 1000, // 1 hora
  storageKey: 'rate_limit_contacto',
});

/**
 * Formatea el mensaje de error de rate limiting
 */
export const formatearMensajeRateLimit = (retryAfter: number): string => {
  const minutos = Math.ceil(retryAfter / 60);
  
  if (minutos < 60) {
    return `Has alcanzado el límite de intentos. Por favor, espera ${minutos} minuto${minutos > 1 ? 's' : ''} antes de intentar nuevamente.`;
  }
  
  const horas = Math.ceil(minutos / 60);
  return `Has alcanzado el límite de intentos. Por favor, espera ${horas} hora${horas > 1 ? 's' : ''} antes de intentar nuevamente.`;
};

