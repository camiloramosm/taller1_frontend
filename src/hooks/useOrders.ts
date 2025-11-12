import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Pedido, NuevoPedido, EstadoPedido } from '../types/database';
import type { ApiResponse } from '../types';

interface UseOrdersReturn {
  orders: Pedido[];
  loading: boolean;
  error: string | null;
  createOrder: (order: NuevoPedido) => Promise<ApiResponse<Pedido>>;
  getOrders: (filters?: OrderFilters) => Promise<ApiResponse<Pedido[]>>;
  getOrderById: (id: string) => Promise<ApiResponse<Pedido>>;
  updateOrderStatus: (id: string, estado: EstadoPedido) => Promise<ApiResponse<Pedido>>;
  getOrdersByEmail: (email: string) => Promise<ApiResponse<Pedido[]>>;
}

interface OrderFilters {
  estado?: EstadoPedido;
  departamento?: string;
  fecha_desde?: string;
  fecha_hasta?: string;
  limit?: number;
}

/**
 * Hook personalizado para manejar operaciones CRUD de pedidos
 */
export const useOrders = (): UseOrdersReturn => {
  const [orders, setOrders] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Crea un nuevo pedido
   */
  const createOrder = useCallback(async (order: NuevoPedido): Promise<ApiResponse<Pedido>> => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: supabaseError } = await supabase
        .from('pedidos')
        .insert(order)
        .select()
        .single();

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      if (!data) {
        throw new Error('No se recibió respuesta del servidor');
      }

      return {
        success: true,
        data,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al crear el pedido';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Obtiene pedidos con filtros opcionales
   */
  const getOrders = useCallback(async (filters?: OrderFilters): Promise<ApiResponse<Pedido[]>> => {
    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('pedidos')
        .select('*')
        .order('created_at', { ascending: false });

      // Aplicar filtros
      if (filters?.estado) {
        query = query.eq('estado', filters.estado);
      }

      if (filters?.departamento) {
        query = query.eq('departamento', filters.departamento);
      }

      if (filters?.fecha_desde) {
        query = query.gte('created_at', filters.fecha_desde);
      }

      if (filters?.fecha_hasta) {
        query = query.lte('created_at', filters.fecha_hasta);
      }

      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error: supabaseError } = await query;

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      setOrders(data || []);

      return {
        success: true,
        data: data || [],
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al obtener los pedidos';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Obtiene un pedido por ID
   */
  const getOrderById = useCallback(async (id: string): Promise<ApiResponse<Pedido>> => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: supabaseError } = await supabase
        .from('pedidos')
        .select('*')
        .eq('id', id)
        .single();

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      if (!data) {
        throw new Error('Pedido no encontrado');
      }

      return {
        success: true,
        data,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al obtener el pedido';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Actualiza el estado de un pedido
   */
  const updateOrderStatus = useCallback(
    async (id: string, estado: EstadoPedido): Promise<ApiResponse<Pedido>> => {
      setLoading(true);
      setError(null);

      try {
        const { data, error: supabaseError } = await supabase
          .from('pedidos')
          .update({ estado })
          .eq('id', id)
          .select()
          .single();

        if (supabaseError) {
          throw new Error(supabaseError.message);
        }

        if (!data) {
          throw new Error('No se pudo actualizar el pedido');
        }

        // Actualizar el estado local si el pedido está en la lista
        setOrders((prevOrders) =>
          prevOrders.map((order) => (order.id === id ? data : order))
        );

        return {
          success: true,
          data,
        };
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido al actualizar el pedido';
        setError(errorMessage);
        return {
          success: false,
          error: errorMessage,
        };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * Obtiene pedidos por correo electrónico
   */
  const getOrdersByEmail = useCallback(async (email: string): Promise<ApiResponse<Pedido[]>> => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: supabaseError } = await supabase
        .from('pedidos')
        .select('*')
        .eq('correo_electronico', email)
        .order('created_at', { ascending: false });

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      return {
        success: true,
        data: data || [],
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al obtener los pedidos';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    orders,
    loading,
    error,
    createOrder,
    getOrders,
    getOrderById,
    updateOrderStatus,
    getOrdersByEmail,
  };
};

