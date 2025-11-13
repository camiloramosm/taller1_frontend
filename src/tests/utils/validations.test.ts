import { describe, it, expect } from 'vitest';
import {
  validarTelefonoColombia,
  formatearTelefono,
  normalizarTelefono,
  validarEmail,
  formatearMoneda,
  formatearFecha,
  validarConSchema,
  schemaPedido,
  schemaContacto,
} from '../../utils/validations';

describe('Validaciones de Teléfono', () => {
  describe('validarTelefonoColombia', () => {
    it('debe validar un teléfono colombiano válido', () => {
      expect(validarTelefonoColombia('+573001234567')).toBe(true);
      expect(validarTelefonoColombia('+573101234567')).toBe(true);
      expect(validarTelefonoColombia('+573501234567')).toBe(true);
    });

    it('debe rechazar un teléfono con formato inválido', () => {
      expect(validarTelefonoColombia('3001234567')).toBe(false);
      expect(validarTelefonoColombia('+57300123456')).toBe(false);
      expect(validarTelefonoColombia('+5730012345678')).toBe(false);
    });

    it('debe rechazar operadores no válidos', () => {
      expect(validarTelefonoColombia('+573991234567')).toBe(false);
      expect(validarTelefonoColombia('+572001234567')).toBe(false);
    });
  });

  describe('formatearTelefono', () => {
    it('debe formatear un teléfono correctamente', () => {
      expect(formatearTelefono('+573001234567')).toBe('+57 300 123 4567');
      expect(formatearTelefono('3001234567')).toBe('+57 300 123 4567');
    });
  });

  describe('normalizarTelefono', () => {
    it('debe normalizar un teléfono al formato estándar', () => {
      expect(normalizarTelefono('300 123 4567')).toBe('+573001234567');
      expect(normalizarTelefono('+57 300 123 4567')).toBe('+573001234567');
    });
  });
});

describe('Validaciones de Email', () => {
  it('debe validar un email válido', () => {
    expect(validarEmail('test@example.com')).toBe(true);
    expect(validarEmail('user.name@domain.co')).toBe(true);
  });

  it('debe rechazar un email inválido', () => {
    expect(validarEmail('invalid-email')).toBe(false);
    expect(validarEmail('@example.com')).toBe(false);
    expect(validarEmail('test@')).toBe(false);
  });
});

describe('Formateo de Datos', () => {
  describe('formatearMoneda', () => {
    it('debe formatear un número como moneda colombiana', () => {
      expect(formatearMoneda(1000)).toContain('1.000');
      expect(formatearMoneda(50000)).toContain('50.000');
    });
  });

  describe('formatearFecha', () => {
    it('debe formatear una fecha correctamente', () => {
      const fecha = new Date('2024-01-15T10:30:00');
      const formatted = formatearFecha(fecha);
      expect(formatted).toContain('2024');
      expect(formatted).toContain('enero');
    });
  });
});

describe('Schemas de Validación', () => {
  describe('schemaPedido', () => {
    it('debe validar un pedido correcto', () => {
      const pedido = {
        correo_electronico: 'test@example.com',
        telefono: '+573001234567',
        departamento: 'Antioquia',
        ciudad: 'Medellín',
        direccion_completa: 'Calle 50 #45-30, Apartamento 501',
      };

      const result = validarConSchema(schemaPedido, pedido);
      expect(result.success).toBe(true);
    });

    it('debe rechazar un pedido con datos inválidos', () => {
      const pedido = {
        correo_electronico: 'invalid-email',
        telefono: '123',
        departamento: '',
        ciudad: '',
        direccion_completa: 'corta',
      };

      const result = validarConSchema(schemaPedido, pedido);
      expect(result.success).toBe(false);
      if (!result.success) {
        const errors = (result as { success: false; errors: Record<string, string> }).errors;
        expect(errors).toHaveProperty('correo_electronico');
        expect(errors).toHaveProperty('telefono');
      }
    });
  });

  describe('schemaContacto', () => {
    it('debe validar un mensaje de contacto correcto', () => {
      const mensaje = {
        nombre_completo: 'Juan Pérez',
        correo_electronico: 'juan@example.com',
        asunto: 'Consulta sobre productos',
        mensaje: 'Me gustaría saber más sobre sus productos del campo.',
      };

      const result = validarConSchema(schemaContacto, mensaje);
      expect(result.success).toBe(true);
    });

    it('debe rechazar un mensaje con datos inválidos', () => {
      const mensaje = {
        nombre_completo: 'AB',
        correo_electronico: 'invalid',
        asunto: 'ok',
        mensaje: 'corto',
      };

      const result = validarConSchema(schemaContacto, mensaje);
      expect(result.success).toBe(false);
      if (!result.success) {
        const errors = (result as { success: false; errors: Record<string, string> }).errors;
        expect(errors).toHaveProperty('nombre_completo');
        expect(errors).toHaveProperty('correo_electronico');
      }
    });
  });
});

