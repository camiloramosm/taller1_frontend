import { describe, it, expect, beforeEach, vi } from 'vitest';
import { RateLimiter } from '../../utils/rate-limiter';

describe('RateLimiter', () => {
  let rateLimiter: RateLimiter;

  beforeEach(() => {
    // Limpiar localStorage antes de cada test
    localStorage.clear();
    
    rateLimiter = new RateLimiter({
      maxAttempts: 3,
      windowMs: 60000, // 1 minuto
      storageKey: 'test_rate_limiter',
    });
  });

  it('debe permitir el primer intento', () => {
    const result = rateLimiter.canAttempt();
    expect(result.allowed).toBe(true);
    expect(result.remainingAttempts).toBe(2);
  });

  it('debe rastrear los intentos correctamente', () => {
    // Primera intento
    expect(rateLimiter.canAttempt().allowed).toBe(true);
    rateLimiter.recordAttempt();

    // Segundo intento
    expect(rateLimiter.canAttempt().allowed).toBe(true);
    rateLimiter.recordAttempt();

    // Tercer intento
    expect(rateLimiter.canAttempt().allowed).toBe(true);
    rateLimiter.recordAttempt();

    // Cuarto intento - debe ser bloqueado
    const result = rateLimiter.canAttempt();
    expect(result.allowed).toBe(false);
    expect(result.retryAfter).toBeGreaterThan(0);
  });

  it('debe limpiar el registro correctamente', () => {
    rateLimiter.recordAttempt();
    rateLimiter.clearRecord();
    
    const result = rateLimiter.canAttempt();
    expect(result.allowed).toBe(true);
    expect(result.remainingAttempts).toBe(2);
  });

  it('debe reiniciar el contador después de expirar la ventana', () => {
    // Mock de Date.now()
    const now = Date.now();
    vi.spyOn(Date, 'now').mockReturnValue(now);

    rateLimiter.recordAttempt();
    rateLimiter.recordAttempt();
    rateLimiter.recordAttempt();

    // Avanzar el tiempo más allá de la ventana
    vi.spyOn(Date, 'now').mockReturnValue(now + 61000); // 61 segundos después

    const result = rateLimiter.canAttempt();
    expect(result.allowed).toBe(true);

    vi.restoreAllMocks();
  });
});

