import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useOrders } from '../../hooks/useOrders';
import { formatearMoneda, formatearFecha, formatearTelefono } from '../../utils/validations';
import { CheckCircle, Package, Mail, Phone, MapPin } from 'lucide-react';
import type { Pedido } from '../../types/database';

/**
 * Componente de confirmación de pedido
 * Muestra los detalles del pedido realizado
 */
export const OrderConfirmation: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { getOrderById, loading } = useOrders();
  const [order, setOrder] = useState<Pedido | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setError('ID de pedido no válido');
        return;
      }

      const response = await getOrderById(orderId);
      if (response.success && response.data) {
        setOrder(response.data);
      } else {
        setError(response.error || 'No se pudo cargar el pedido');
      }
    };

    fetchOrder();
  }, [orderId, getOrderById]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando pedido...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error || 'Pedido no encontrado'}</p>
          <Link
            to="/"
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Volver al Inicio
          </Link>
        </div>
      </div>
    );
  }

  const estadoColores: Record<string, string> = {
    pendiente: 'bg-yellow-100 text-yellow-800',
    procesando: 'bg-blue-100 text-blue-800',
    enviado: 'bg-purple-100 text-purple-800',
    entregado: 'bg-green-100 text-green-800',
    cancelado: 'bg-red-100 text-red-800',
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Encabezado de Confirmación */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6 text-center">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ¡Pedido Confirmado!
          </h1>
          <p className="text-gray-600 mb-4">
            Gracias por tu compra. Hemos recibido tu pedido correctamente.
          </p>
          <div className="inline-flex items-center space-x-2">
            <span className="text-sm text-gray-500">Número de Pedido:</span>
            <span className="font-mono font-semibold text-gray-900">
              {order.id.split('-')[0].toUpperCase()}
            </span>
          </div>
        </div>

        {/* Estado del Pedido */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Package className="w-6 h-6 text-gray-600" />
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Estado del Pedido
                </h2>
                <p className="text-sm text-gray-500">
                  {formatearFecha(order.created_at)}
                </p>
              </div>
            </div>
            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold ${
                estadoColores[order.estado]
              }`}
            >
              {order.estado.charAt(0).toUpperCase() + order.estado.slice(1)}
            </span>
          </div>
        </div>

        {/* Información de Contacto */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Información de Contacto
          </h2>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <Mail className="w-5 h-5 text-gray-600 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Correo Electrónico</p>
                <p className="text-gray-900">{order.correo_electronico}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Phone className="w-5 h-5 text-gray-600 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Teléfono</p>
                <p className="text-gray-900">{formatearTelefono(order.telefono)}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-gray-600 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Dirección de Envío</p>
                <p className="text-gray-900">{order.direccion_completa}</p>
                <p className="text-gray-600 text-sm">
                  {order.ciudad}, {order.departamento}
                </p>
              </div>
            </div>
          </div>

          {order.notas_adicionales && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Notas Adicionales</p>
              <p className="text-gray-900">{order.notas_adicionales}</p>
            </div>
          )}
        </div>

        {/* Productos */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Productos
          </h2>
          <div className="space-y-4">
            {order.productos.map((producto, index) => (
              <div
                key={index}
                className="flex justify-between items-center pb-4 border-b last:border-b-0 last:pb-0"
              >
                <div>
                  <p className="font-medium text-gray-900">{producto.nombre}</p>
                  <p className="text-sm text-gray-600">
                    Cantidad: {producto.cantidad} × {formatearMoneda(producto.precio)}
                  </p>
                </div>
                <p className="font-semibold text-gray-900">
                  {formatearMoneda(producto.cantidad * producto.precio)}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">Total</span>
              <span className="text-2xl font-bold text-green-600">
                {formatearMoneda(order.total)}
              </span>
            </div>
          </div>
        </div>

        {/* Próximos Pasos */}
        <div className="bg-blue-50 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            ¿Qué sigue?
          </h2>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <span className="mr-2">1.</span>
              <span>
                Recibirás un correo de confirmación en{' '}
                <strong>{order.correo_electronico}</strong>
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">2.</span>
              <span>
                Procesaremos tu pedido en las próximas 24-48 horas
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">3.</span>
              <span>
                Te contactaremos al <strong>{formatearTelefono(order.telefono)}</strong>{' '}
                antes del envío
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">4.</span>
              <span>
                El tiempo estimado de entrega es de 3-7 días hábiles
              </span>
            </li>
          </ul>
        </div>

        {/* Botones de Acción */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/"
            className="flex-1 bg-green-600 text-white text-center py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Continuar Comprando
          </Link>
          <button
            onClick={() => window.print()}
            className="flex-1 bg-white text-gray-700 border border-gray-300 text-center py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Imprimir Comprobante
          </button>
        </div>
      </div>
    </div>
  );
};

