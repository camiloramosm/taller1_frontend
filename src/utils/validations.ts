import { z } from 'zod';
import { esDepartamentoValido, esCiudadValidaEnDepartamento } from '../data/colombia-departamentos';

/**
 * Operadores de telefonía móvil válidos en Colombia
 * Fuente: CRC (Comisión de Regulación de Comunicaciones)
 */
const OPERADORES_VALIDOS = [
  '300', '301', '302', '303', '304', '305', // Claro
  '310', '311', '312', '313', '314', '315', '316', '317', '318', '319', '320', '321', // Movistar, Tigo, etc.
  '350', '351', '352', '353' // Avantel, WOM, etc.
];

/**
 * Valida formato de teléfono colombiano: +57 seguido de 10 dígitos
 * Los primeros 3 dígitos deben ser un operador válido
 */
export const validarTelefonoColombia = (telefono: string): boolean => {
  // Formato: +57XXXXXXXXXX (13 caracteres total)
  const regex = /^\+57\d{10}$/;
  
  if (!regex.test(telefono)) {
    return false;
  }
  
  // Extraer el código de operador (3 primeros dígitos después de +57)
  const operador = telefono.substring(3, 6);
  
  return OPERADORES_VALIDOS.includes(operador);
};

/**
 * Formatea un teléfono colombiano para mostrar: +57 XXX XXX XXXX
 */
export const formatearTelefono = (telefono: string): string => {
  // Remover todos los caracteres no numéricos excepto el +
  const cleaned = telefono.replace(/[^\d+]/g, '');
  
  // Si no comienza con +57, intentar agregarlo si tiene 10 dígitos
  if (!cleaned.startsWith('+57') && cleaned.length === 10) {
    return `+57 ${cleaned.substring(0, 3)} ${cleaned.substring(3, 6)} ${cleaned.substring(6)}`;
  }
  
  // Si ya tiene +57
  if (cleaned.startsWith('+57') && cleaned.length === 13) {
    const numero = cleaned.substring(3);
    return `+57 ${numero.substring(0, 3)} ${numero.substring(3, 6)} ${numero.substring(6)}`;
  }
  
  return telefono;
};

/**
 * Normaliza un teléfono colombiano al formato +57XXXXXXXXXX
 */
export const normalizarTelefono = (telefono: string): string => {
  // Remover todos los caracteres no numéricos excepto el +
  const cleaned = telefono.replace(/[^\d+]/g, '');
  
  // Si no comienza con +57, agregarlo
  if (!cleaned.startsWith('+57') && cleaned.length === 10) {
    return `+57${cleaned}`;
  }
  
  return cleaned;
};

/**
 * Valida formato de email según RFC 5322
 */
export const validarEmail = (email: string): boolean => {
  const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return regex.test(email);
};

/**
 * Valida si el dominio del email es colombiano
 */
export const esEmailColombiano = (email: string): boolean => {
  const dominiosColombianos = ['.co', '.com.co', '.net.co', '.org.co', '.gov.co', '.edu.co'];
  return dominiosColombianos.some(dominio => email.toLowerCase().endsWith(dominio));
};

/**
 * Formatea un número como moneda colombiana (COP)
 */
export const formatearMoneda = (valor: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(valor);
};

/**
 * Formatea una fecha en formato colombiano
 */
export const formatearFecha = (fecha: string | Date): string => {
  const date = typeof fecha === 'string' ? new Date(fecha) : fecha;
  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

// ===================================
// SCHEMAS DE VALIDACIÓN CON ZOD
// ===================================

/**
 * Schema para validar formulario de pedido
 */
export const schemaPedido = z.object({
  correo_electronico: z
    .string()
    .min(1, 'El correo electrónico es requerido')
    .email('Formato de correo electrónico inválido')
    .max(255, 'El correo electrónico es demasiado largo'),
  
  telefono: z
    .string()
    .min(1, 'El teléfono es requerido')
    .refine(validarTelefonoColombia, {
      message: 'El teléfono debe tener formato +57 seguido de un número válido de 10 dígitos',
    }),
  
  departamento: z
    .string()
    .min(1, 'El departamento es requerido')
    .refine(esDepartamentoValido, {
      message: 'Debe seleccionar un departamento válido de Colombia',
    }),
  
  ciudad: z
    .string()
    .min(1, 'La ciudad es requerida')
    .max(100, 'El nombre de la ciudad es demasiado largo'),
  
  direccion_completa: z
    .string()
    .min(10, 'La dirección debe tener al menos 10 caracteres')
    .max(500, 'La dirección es demasiado larga'),
  
  notas_adicionales: z
    .string()
    .max(1000, 'Las notas son demasiado largas')
    .optional(),
}).refine(
  (data) => esCiudadValidaEnDepartamento(data.ciudad, data.departamento),
  {
    message: 'La ciudad no pertenece al departamento seleccionado',
    path: ['ciudad'],
  }
);

/**
 * Schema para validar formulario de contacto
 */
export const schemaContacto = z.object({
  nombre_completo: z
    .string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(100, 'El nombre es demasiado largo')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre solo puede contener letras'),
  
  correo_electronico: z
    .string()
    .min(1, 'El correo electrónico es requerido')
    .email('Formato de correo electrónico inválido')
    .max(255, 'El correo electrónico es demasiado largo'),
  
  telefono: z
    .string()
    .refine(
      (tel) => !tel || tel.length === 0 || validarTelefonoColombia(tel),
      {
        message: 'El teléfono debe tener formato +57 seguido de un número válido de 10 dígitos',
      }
    )
    .optional(),
  
  asunto: z
    .string()
    .min(3, 'El asunto debe tener al menos 3 caracteres')
    .max(200, 'El asunto es demasiado largo'),
  
  mensaje: z
    .string()
    .min(10, 'El mensaje debe tener al menos 10 caracteres')
    .max(2000, 'El mensaje es demasiado largo'),
});

/**
 * Tipos inferidos de los schemas
 */
export type ValidacionPedido = z.infer<typeof schemaPedido>;
export type ValidacionContacto = z.infer<typeof schemaContacto>;

/**
 * Valida un objeto contra un schema de Zod y retorna errores formateados
 */
export const validarConSchema = <T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: Record<string, string> } => {
  const result = schema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  const errors: Record<string, string> = {};
  result.error.errors.forEach((error) => {
    const path = error.path.join('.');
    errors[path] = error.message;
  });
  
  return { success: false, errors };
};

