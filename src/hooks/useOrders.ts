'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { NuevoPedido, Pedido } from '@/types/database';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export const useOrders = () => {
  const [loading, setLoading] = useState(false);

  const createOrder = async (orderData: NuevoPedido): Promise<ApiResponse<Pedido>> => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('pedidos')
        .insert([orderData])
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Error al crear pedido:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
    } finally {
      setLoading(false);
    }
  };

  const getOrderById = async (id: string): Promise<ApiResponse<Pedido>> => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('pedidos')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Error al obtener pedido:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    createOrder,
    getOrderById,
  };
};
