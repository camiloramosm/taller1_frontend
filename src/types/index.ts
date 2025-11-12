export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Departamento {
  nombre: string;
  ciudades: string[];
}

export interface FormularioPedido {
  correo_electronico: string;
  telefono: string;
  departamento: string;
  ciudad: string;
  direccion_completa: string;
  notas_adicionales?: string;
}

export interface FormularioContacto {
  nombre_completo: string;
  correo_electronico: string;
  telefono?: string;
  asunto: string;
  mensaje: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}

