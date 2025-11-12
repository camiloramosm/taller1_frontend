// Tipos generados automáticamente para Supabase
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      pedidos: {
        Row: {
          id: string
          created_at: string
          correo_electronico: string
          telefono: string
          departamento: string
          ciudad: string
          direccion_completa: string
          productos: ProductoEnPedido[]
          total: number
          estado: EstadoPedido
          notas_adicionales: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          correo_electronico: string
          telefono: string
          departamento: string
          ciudad: string
          direccion_completa: string
          productos: ProductoEnPedido[]
          total: number
          estado?: EstadoPedido
          notas_adicionales?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          correo_electronico?: string
          telefono?: string
          departamento?: string
          ciudad?: string
          direccion_completa?: string
          productos?: ProductoEnPedido[]
          total?: number
          estado?: EstadoPedido
          notas_adicionales?: string | null
        }
      }
      mensajes_contacto: {
        Row: {
          id: string
          created_at: string
          nombre_completo: string
          correo_electronico: string
          telefono: string | null
          asunto: string
          mensaje: string
          leido: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          nombre_completo: string
          correo_electronico: string
          telefono?: string | null
          asunto: string
          mensaje: string
          leido?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          nombre_completo?: string
          correo_electronico?: string
          telefono?: string | null
          asunto?: string
          mensaje?: string
          leido?: boolean
        }
      }
    }
  }
}

// Tipos auxiliares
export type EstadoPedido = 'pendiente' | 'procesando' | 'enviado' | 'entregado' | 'cancelado';

export interface ProductoEnPedido {
  id: number;
  nombre: string;
  cantidad: number;
  precio: number;
}

export type Pedido = Database['public']['Tables']['pedidos']['Row'];
export type NuevoPedido = Database['public']['Tables']['pedidos']['Insert'];
export type ActualizarPedido = Database['public']['Tables']['pedidos']['Update'];

export type MensajeContacto = Database['public']['Tables']['mensajes_contacto']['Row'];
export type NuevoMensajeContacto = Database['public']['Tables']['mensajes_contacto']['Insert'];
export type ActualizarMensajeContacto = Database['public']['Tables']['mensajes_contacto']['Update'];

