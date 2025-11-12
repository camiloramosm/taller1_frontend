import React, { useState } from 'react';
import { useContactMessages } from '../../hooks/useContactMessages';
import {
  schemaContacto,
  validarConSchema,
  normalizarTelefono,
} from '../../utils/validations';
import { contactoRateLimiter, formatearMensajeRateLimit } from '../../utils/rate-limiter';
import { showSuccessToast, showErrorToast } from '../../store/toastStore';
import type { FormularioContacto } from '../../types';

/**
 * Componente del formulario de contacto
 * Permite a los usuarios enviar mensajes con validaciones completas
 */
export const ContactForm: React.FC = () => {
  const { sendMessage, loading } = useContactMessages();

  const [formData, setFormData] = useState<FormularioContacto>({
    nombre_completo: '',
    correo_electronico: '',
    telefono: '',
    asunto: '',
    mensaje: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === 'telefono' && value) {
      // Formatear teléfono mientras escribe
      const normalized = normalizarTelefono(value);
      setFormData((prev) => ({ ...prev, telefono: normalized }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Limpiar error del campo al escribir
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    // Validar campo individual
    const result = validarConSchema(schemaContacto, formData);
    if (!result.success && result.errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: result.errors[name] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitSuccess(false);

    // Verificar rate limiting
    const rateLimitCheck = contactoRateLimiter.canAttempt();
    if (!rateLimitCheck.allowed) {
      showErrorToast(formatearMensajeRateLimit(rateLimitCheck.retryAfter || 3600));
      return;
    }

    // Marcar todos los campos como touched
    const allTouched: Record<string, boolean> = {};
    Object.keys(formData).forEach((key) => {
      allTouched[key] = true;
    });
    setTouched(allTouched);

    // Validar formulario completo
    const result = validarConSchema(schemaContacto, formData);
    if (!result.success) {
      setErrors(result.errors);
      showErrorToast('Por favor, corrige los errores en el formulario');
      return;
    }

    // Enviar mensaje
    const response = await sendMessage({
      nombre_completo: formData.nombre_completo,
      correo_electronico: formData.correo_electronico,
      telefono: formData.telefono || null,
      asunto: formData.asunto,
      mensaje: formData.mensaje,
    });

    if (response.success) {
      // Registrar intento en rate limiter
      contactoRateLimiter.recordAttempt();

      // Mostrar mensaje de éxito
      showSuccessToast('¡Mensaje enviado con éxito! Te responderemos pronto.');
      setSubmitSuccess(true);

      // Limpiar formulario
      setFormData({
        nombre_completo: '',
        correo_electronico: '',
        telefono: '',
        asunto: '',
        mensaje: '',
      });
      setErrors({});
      setTouched({});

      // Ocultar mensaje de éxito después de 5 segundos
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    } else {
      showErrorToast(response.error || 'Error al enviar el mensaje');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-2 text-gray-900">Contáctanos</h1>
        <p className="text-gray-600 mb-8">
          ¿Tienes alguna pregunta o comentario? Envíanos un mensaje y te
          responderemos lo antes posible.
        </p>

        {submitSuccess && (
          <div
            className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg"
            role="alert"
          >
            <p className="font-medium">¡Mensaje enviado exitosamente!</p>
            <p className="text-sm">
              Gracias por contactarnos. Te responderemos pronto.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nombre Completo */}
          <div>
            <label
              htmlFor="nombre_completo"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nombre Completo *
            </label>
            <input
              type="text"
              id="nombre_completo"
              name="nombre_completo"
              value={formData.nombre_completo}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                errors.nombre_completo && touched.nombre_completo
                  ? 'border-red-500'
                  : 'border-gray-300'
              }`}
              placeholder="Juan Pérez"
              aria-invalid={
                errors.nombre_completo && touched.nombre_completo
                  ? 'true'
                  : 'false'
              }
              aria-describedby={
                errors.nombre_completo ? 'error-nombre_completo' : undefined
              }
            />
            {errors.nombre_completo && touched.nombre_completo && (
              <p id="error-nombre_completo" className="mt-1 text-sm text-red-600">
                {errors.nombre_completo}
              </p>
            )}
          </div>

          {/* Correo Electrónico */}
          <div>
            <label
              htmlFor="correo_electronico"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Correo Electrónico *
            </label>
            <input
              type="email"
              id="correo_electronico"
              name="correo_electronico"
              value={formData.correo_electronico}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                errors.correo_electronico && touched.correo_electronico
                  ? 'border-red-500'
                  : 'border-gray-300'
              }`}
              placeholder="tu@email.com"
              aria-invalid={
                errors.correo_electronico && touched.correo_electronico
                  ? 'true'
                  : 'false'
              }
              aria-describedby={
                errors.correo_electronico ? 'error-correo_electronico' : undefined
              }
            />
            {errors.correo_electronico && touched.correo_electronico && (
              <p
                id="error-correo_electronico"
                className="mt-1 text-sm text-red-600"
              >
                {errors.correo_electronico}
              </p>
            )}
          </div>

          {/* Teléfono (Opcional) */}
          <div>
            <label
              htmlFor="telefono"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Teléfono (Opcional)
            </label>
            <input
              type="tel"
              id="telefono"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                errors.telefono && touched.telefono
                  ? 'border-red-500'
                  : 'border-gray-300'
              }`}
              placeholder="+573001234567"
              aria-invalid={
                errors.telefono && touched.telefono ? 'true' : 'false'
              }
              aria-describedby={errors.telefono ? 'error-telefono' : undefined}
            />
            <p className="mt-1 text-xs text-gray-500">
              Formato: +57 seguido de 10 dígitos
            </p>
            {errors.telefono && touched.telefono && (
              <p id="error-telefono" className="mt-1 text-sm text-red-600">
                {errors.telefono}
              </p>
            )}
          </div>

          {/* Asunto */}
          <div>
            <label
              htmlFor="asunto"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Asunto *
            </label>
            <input
              type="text"
              id="asunto"
              name="asunto"
              value={formData.asunto}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                errors.asunto && touched.asunto
                  ? 'border-red-500'
                  : 'border-gray-300'
              }`}
              placeholder="¿En qué podemos ayudarte?"
              aria-invalid={errors.asunto && touched.asunto ? 'true' : 'false'}
              aria-describedby={errors.asunto ? 'error-asunto' : undefined}
            />
            {errors.asunto && touched.asunto && (
              <p id="error-asunto" className="mt-1 text-sm text-red-600">
                {errors.asunto}
              </p>
            )}
          </div>

          {/* Mensaje */}
          <div>
            <label
              htmlFor="mensaje"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Mensaje *
            </label>
            <textarea
              id="mensaje"
              name="mensaje"
              value={formData.mensaje}
              onChange={handleChange}
              onBlur={handleBlur}
              rows={6}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                errors.mensaje && touched.mensaje
                  ? 'border-red-500'
                  : 'border-gray-300'
              }`}
              placeholder="Escribe tu mensaje aquí..."
              aria-invalid={errors.mensaje && touched.mensaje ? 'true' : 'false'}
              aria-describedby={errors.mensaje ? 'error-mensaje' : undefined}
            />
            {errors.mensaje && touched.mensaje && (
              <p id="error-mensaje" className="mt-1 text-sm text-red-600">
                {errors.mensaje}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Enviando...' : 'Enviar Mensaje'}
          </button>

          <p className="text-xs text-gray-500 text-center">
            * Campos requeridos
          </p>
        </form>
      </div>
    </div>
  );
};

