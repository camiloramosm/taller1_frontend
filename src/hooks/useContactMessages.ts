import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { MensajeContacto, NuevoMensajeContacto, Database } from '../types/database';
import type { ApiResponse } from '../types';

interface UseContactMessagesReturn {
  messages: MensajeContacto[];
  loading: boolean;
  error: string | null;
  sendMessage: (message: NuevoMensajeContacto) => Promise<ApiResponse<MensajeContacto>>;
  getMessages: (filters?: MessageFilters) => Promise<ApiResponse<MensajeContacto[]>>;
  markAsRead: (id: string) => Promise<ApiResponse<MensajeContacto>>;
  getUnreadCount: () => Promise<ApiResponse<number>>;
}

interface MessageFilters {
  leido?: boolean;
  fecha_desde?: string;
  fecha_hasta?: string;
  limit?: number;
}

/**
 * Hook personalizado para manejar operaciones CRUD de mensajes de contacto
 */
export const useContactMessages = (): UseContactMessagesReturn => {
  const [messages, setMessages] = useState<MensajeContacto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Envía un nuevo mensaje de contacto
   */
  const sendMessage = useCallback(
    async (message: NuevoMensajeContacto): Promise<ApiResponse<MensajeContacto>> => {
      setLoading(true);
      setError(null);

      try {
        const { data, error: supabaseError } = await supabase
          .from('mensajes_contacto')
          .insert(message as any)
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
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido al enviar el mensaje';
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
   * Obtiene mensajes con filtros opcionales
   */
  const getMessages = useCallback(
    async (filters?: MessageFilters): Promise<ApiResponse<MensajeContacto[]>> => {
      setLoading(true);
      setError(null);

      try {
        let query = supabase
          .from('mensajes_contacto')
          .select('*')
          .order('created_at', { ascending: false });

        // Aplicar filtros
        if (filters?.leido !== undefined) {
          query = query.eq('leido', filters.leido);
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

        setMessages(data || []);

        return {
          success: true,
          data: data || [],
        };
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido al obtener los mensajes';
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
   * Marca un mensaje como leído
   */
  const markAsRead = useCallback(
    async (id: string): Promise<ApiResponse<MensajeContacto>> => {
      setLoading(true);
      setError(null);

      try {
        const { data, error: supabaseError } = await supabase
          .from('mensajes_contacto')
          // @ts-expect-error - Supabase type inference issue
          .update({ leido: true })
          .eq('id', id)
          .select()
          .single();

        if (supabaseError) {
          throw new Error(supabaseError.message);
        }

        if (!data) {
          throw new Error('No se pudo actualizar el mensaje');
        }

        // Actualizar el estado local si el mensaje está en la lista
        setMessages((prevMessages) =>
          prevMessages.map((msg) => (msg.id === id ? data : msg))
        );

        return {
          success: true,
          data,
        };
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido al actualizar el mensaje';
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
   * Obtiene el conteo de mensajes no leídos
   */
  const getUnreadCount = useCallback(async (): Promise<ApiResponse<number>> => {
    setLoading(true);
    setError(null);

    try {
      const { count, error: supabaseError } = await supabase
        .from('mensajes_contacto')
        .select('*', { count: 'exact', head: true })
        .eq('leido', false);

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      return {
        success: true,
        data: count || 0,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al obtener el conteo';
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
    messages,
    loading,
    error,
    sendMessage,
    getMessages,
    markAsRead,
    getUnreadCount,
  };
};

