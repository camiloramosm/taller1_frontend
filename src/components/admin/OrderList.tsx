import React, { useEffect, useState, useCallback } from 'react';
import { useOrders } from '../../hooks/useOrders';
import { formatearMoneda, formatearFecha, formatearTelefono } from '../../utils/validations';
import { Package, Search, Filter } from 'lucide-react';
import type { EstadoPedido } from '../../types/database';

/**
 * Componente para listar y administrar pedidos (Admin)
 * Requiere autenticación
 */
export const OrderList: React.FC = () => {
  const { orders, getOrders, updateOrderStatus, loading } = useOrders();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState<EstadoPedido | ''>('');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const loadOrders = useCallback(async () => {
    await getOrders({
      ...(filterEstado && { estado: filterEstado }),
      limit: 100,
    });
  }, [filterEstado, getOrders]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleUpdateStatus = async (orderId: string, newStatus: EstadoPedido) => {
    const response = await updateOrderStatus(orderId, newStatus);
    if (response.success) {
      // La lista se actualiza automáticamente gracias al hook
    }
  };

  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.correo_electronico.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.telefono.includes(searchTerm) ||
      order.ciudad.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.departamento.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const estadoColores: Record<EstadoPedido, string> = {
    pendiente: 'bg-yellow-100 text-yellow-800',
    procesando: 'bg-blue-100 text-blue-800',
    enviado: 'bg-purple-100 text-purple-800',
    entregado: 'bg-green-100 text-green-800',
    cancelado: 'bg-red-100 text-red-800',
  };

  if (loading && orders.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando pedidos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Gestión de Pedidos
        </h1>
        <p className="text-gray-600">
          Administra y da seguimiento a todos los pedidos
        </p>
      </div>

      {/* Filtros y Búsqueda */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid md:grid-cols-2 gap-4">
          {/* Búsqueda */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por email, teléfono, ciudad..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Filtro de Estado */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value as EstadoPedido | '')}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none"
            >
              <option value="">Todos los estados</option>
              <option value="pendiente">Pendiente</option>
              <option value="procesando">Procesando</option>
              <option value="enviado">Enviado</option>
              <option value="entregado">Entregado</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>
        </div>
      </div>

      {/* Estadísticas Rápidas */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {(['pendiente', 'procesando', 'enviado', 'entregado', 'cancelado'] as EstadoPedido[]).map(
          (estado) => {
            const count = orders.filter((o) => o.estado === estado).length;
            return (
              <div
                key={estado}
                className="bg-white rounded-lg shadow p-4 text-center"
              >
                <p className="text-2xl font-bold text-gray-900">{count}</p>
                <p className="text-sm text-gray-600 capitalize">{estado}</p>
              </div>
            );
          }
        )}
      </div>

      {/* Lista de Pedidos */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No hay pedidos
            </h3>
            <p className="text-gray-600">
              {searchTerm || filterEstado
                ? 'No se encontraron pedidos con los filtros aplicados'
                : 'Aún no hay pedidos registrados'}
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-md">
              {/* Encabezado del Pedido */}
              <div
                className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleOrderDetails(order.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-gray-900">
                        {order.correo_electronico}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          estadoColores[order.estado]
                        }`}
                      >
                        {order.estado.charAt(0).toUpperCase() + order.estado.slice(1)}
                      </span>
                    </div>
                    <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-600">
                      <p>📞 {formatearTelefono(order.telefono)}</p>
                      <p>📍 {order.ciudad}, {order.departamento}</p>
                      <p>📅 {formatearFecha(order.created_at)}</p>
                      <p className="font-semibold text-green-600">
                        {formatearMoneda(order.total)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detalles Expandidos */}
              {expandedOrderId === order.id && (
                <div className="border-t px-6 py-4 bg-gray-50">
                  {/* Productos */}
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Productos ({order.productos.length})
                    </h4>
                    <div className="space-y-2">
                      {order.productos.map((producto, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center text-sm"
                        >
                          <span className="text-gray-700">
                            {producto.nombre} (x{producto.cantidad})
                          </span>
                          <span className="font-medium text-gray-900">
                            {formatearMoneda(producto.cantidad * producto.precio)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Dirección Completa */}
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Dirección de Envío
                    </h4>
                    <p className="text-sm text-gray-700">
                      {order.direccion_completa}
                    </p>
                  </div>

                  {/* Notas Adicionales */}
                  {order.notas_adicionales && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Notas Adicionales
                      </h4>
                      <p className="text-sm text-gray-700">
                        {order.notas_adicionales}
                      </p>
                    </div>
                  )}

                  {/* Actualizar Estado */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Actualizar Estado
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {(['pendiente', 'procesando', 'enviado', 'entregado', 'cancelado'] as EstadoPedido[]).map(
                        (estado) => (
                          <button
                            key={estado}
                            onClick={() => handleUpdateStatus(order.id, estado)}
                            disabled={order.estado === estado || loading}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                              order.estado === estado
                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                : 'bg-green-600 text-white hover:bg-green-700'
                            }`}
                          >
                            {estado.charAt(0).toUpperCase() + estado.slice(1)}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

