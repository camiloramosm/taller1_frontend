import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import { useOrders } from '../../hooks/useOrders';
import { useColombiaDepartments } from '../../hooks/useColombiaDepartments';
import {
  schemaPedido,
  validarConSchema,
  formatearTelefono,
  normalizarTelefono,
  formatearMoneda,
} from '../../utils/validations';
import { pedidosRateLimiter, formatearMensajeRateLimit } from '../../utils/rate-limiter';
import { showSuccessToast, showErrorToast, showWarningToast } from '../../store/toastStore';
import type { FormularioPedido } from '../../types';
import type { ProductoEnPedido } from '../../types/database';

/**
 * Componente principal del formulario de checkout
 * Maneja la creación de pedidos con validaciones completas
 */
export const CheckoutForm: React.FC = () => {
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { createOrder, loading } = useOrders();
  const {
    departamentos,
    ciudades,
    seleccionarDepartamento,
    seleccionarCiudad,
    departamentoSeleccionado,
    ciudadSeleccionada,
  } = useColombiaDepartments();

  const [formData, setFormData] = useState<FormularioPedido>({
    correo_electronico: '',
    telefono: '',
    departamento: '',
    ciudad: '',
    direccion_completa: '',
    notas_adicionales: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Sincronizar departamento y ciudad con el hook
  useEffect(() => {
    if (departamentoSeleccionado) {
      setFormData((prev) => ({ ...prev, departamento: departamentoSeleccionado }));
    }
  }, [departamentoSeleccionado]);

  useEffect(() => {
    if (ciudadSeleccionada) {
      setFormData((prev) => ({ ...prev, ciudad: ciudadSeleccionada }));
    }
  }, [ciudadSeleccionada]);

  // Redirigir si el carrito está vacío
  useEffect(() => {
    if (items.length === 0) {
      showWarningToast('Tu carrito está vacío');
      navigate('/');
    }
  }, [items, navigate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === 'departamento') {
      seleccionarDepartamento(value);
      // Limpiar ciudad al cambiar departamento
      setFormData((prev) => ({ ...prev, departamento: value, ciudad: '' }));
      setErrors((prev) => ({ ...prev, ciudad: '' }));
    } else if (name === 'ciudad') {
      seleccionarCiudad(value);
      setFormData((prev) => ({ ...prev, ciudad: value }));
    } else if (name === 'telefono') {
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

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    // Validar campo individual
    const result = validarConSchema(schemaPedido, formData);
    if (!result.success) {
      const errors = (result as { success: false; errors: Record<string, string> }).errors;
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: errors[name] }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Verificar rate limiting
    const rateLimitCheck = pedidosRateLimiter.canAttempt();
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
    const result = validarConSchema(schemaPedido, formData);
    
    if (!result.success) {
      setErrors((result as { success: false; errors: Record<string, string> }).errors);
      showErrorToast('Por favor, corrige los errores en el formulario');
      return;
    }

    // Preparar productos para el pedido
    const productos: ProductoEnPedido[] = items.map((item) => ({
      id: item.id,
      nombre: item.name,
      cantidad: item.quantity,
      precio: item.price,
    }));

    // Crear pedido
    const response = await createOrder({
      correo_electronico: formData.correo_electronico,
      telefono: formData.telefono,
      departamento: formData.departamento,
      ciudad: formData.ciudad,
      direccion_completa: formData.direccion_completa,
      productos,
      total: getTotalPrice(),
      notas_adicionales: formData.notas_adicionales || null,
    });

    if (response.success && response.data) {
      // Registrar intento en rate limiter
      pedidosRateLimiter.recordAttempt();

      // Limpiar carrito
      clearCart();

      // Mostrar mensaje de éxito
      showSuccessToast('¡Pedido realizado con éxito!');

      // Redirigir a confirmación
      navigate(`/confirmacion/${response.data.id}`);
    } else {
      showErrorToast(response.error || 'Error al procesar el pedido');
    }
  };

  const totalPrice = getTotalPrice();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Finalizar Pedido</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Formulario */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">
            Información de Envío
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
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
                aria-invalid={errors.correo_electronico && touched.correo_electronico ? 'true' : 'false'}
                aria-describedby={errors.correo_electronico ? 'error-correo_electronico' : undefined}
              />
              {errors.correo_electronico && touched.correo_electronico && (
                <p id="error-correo_electronico" className="mt-1 text-sm text-red-600">
                  {errors.correo_electronico}
                </p>
              )}
            </div>

            {/* Teléfono */}
            <div>
              <label
                htmlFor="telefono"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Teléfono *
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
                aria-invalid={errors.telefono && touched.telefono ? 'true' : 'false'}
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

            {/* Departamento */}
            <div>
              <label
                htmlFor="departamento"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Departamento *
              </label>
              <select
                id="departamento"
                name="departamento"
                value={formData.departamento}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.departamento && touched.departamento
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
                aria-invalid={errors.departamento && touched.departamento ? 'true' : 'false'}
                aria-describedby={errors.departamento ? 'error-departamento' : undefined}
              >
                <option value="">Selecciona un departamento</option>
                {departamentos.map((dept) => (
                  <option key={dept.nombre} value={dept.nombre}>
                    {dept.nombre}
                  </option>
                ))}
              </select>
              {errors.departamento && touched.departamento && (
                <p id="error-departamento" className="mt-1 text-sm text-red-600">
                  {errors.departamento}
                </p>
              )}
            </div>

            {/* Ciudad */}
            <div>
              <label
                htmlFor="ciudad"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Ciudad *
              </label>
              <select
                id="ciudad"
                name="ciudad"
                value={formData.ciudad}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={!departamentoSeleccionado || ciudades.length === 0}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed ${
                  errors.ciudad && touched.ciudad
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
                aria-invalid={errors.ciudad && touched.ciudad ? 'true' : 'false'}
                aria-describedby={errors.ciudad ? 'error-ciudad' : undefined}
              >
                <option value="">Selecciona una ciudad</option>
                {ciudades.map((ciudad) => (
                  <option key={ciudad} value={ciudad}>
                    {ciudad}
                  </option>
                ))}
              </select>
              {errors.ciudad && touched.ciudad && (
                <p id="error-ciudad" className="mt-1 text-sm text-red-600">
                  {errors.ciudad}
                </p>
              )}
            </div>

            {/* Dirección Completa */}
            <div>
              <label
                htmlFor="direccion_completa"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Dirección Completa *
              </label>
              <textarea
                id="direccion_completa"
                name="direccion_completa"
                value={formData.direccion_completa}
                onChange={handleChange}
                onBlur={handleBlur}
                rows={3}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.direccion_completa && touched.direccion_completa
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
                placeholder="Calle 123 #45-67, Apartamento 890"
                aria-invalid={errors.direccion_completa && touched.direccion_completa ? 'true' : 'false'}
                aria-describedby={errors.direccion_completa ? 'error-direccion_completa' : undefined}
              />
              {errors.direccion_completa && touched.direccion_completa && (
                <p id="error-direccion_completa" className="mt-1 text-sm text-red-600">
                  {errors.direccion_completa}
                </p>
              )}
            </div>

            {/* Notas Adicionales */}
            <div>
              <label
                htmlFor="notas_adicionales"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Notas Adicionales (Opcional)
              </label>
              <textarea
                id="notas_adicionales"
                name="notas_adicionales"
                value={formData.notas_adicionales}
                onChange={handleChange}
                onBlur={handleBlur}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Instrucciones especiales para la entrega..."
              />
            </div>

            <button
              type="submit"
              disabled={loading || items.length === 0}
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Procesando...' : `Realizar Pedido - ${formatearMoneda(totalPrice)}`}
            </button>
          </form>
        </div>

        {/* Resumen del Pedido */}
        <div className="bg-white p-6 rounded-lg shadow-md h-fit">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">
            Resumen del Pedido
          </h2>

          <div className="space-y-4 mb-6">
            {items.map((item) => (
              <div key={item.id} className="flex items-center space-x-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-600">
                    Cantidad: {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    {formatearMoneda(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between text-lg font-bold text-gray-900">
              <span>Total:</span>
              <span>{formatearMoneda(totalPrice)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

