import { useState, useCallback, useMemo } from 'react';
import {
  DEPARTAMENTOS_COLOMBIA,
  getCiudadesPorDepartamento,
  esDepartamentoValido,
  esCiudadValidaEnDepartamento,
} from '../data/colombia-departamentos';
import type { Departamento } from '../types';

interface UseColombiaDepartmentsReturn {
  departamentos: Departamento[];
  departamentoSeleccionado: string | null;
  ciudades: string[];
  ciudadSeleccionada: string | null;
  seleccionarDepartamento: (departamento: string) => void;
  seleccionarCiudad: (ciudad: string) => void;
  limpiarSeleccion: () => void;
  validarDepartamento: (departamento: string) => boolean;
  validarCiudad: (ciudad: string, departamento: string) => boolean;
}

/**
 * Hook personalizado para manejar departamentos y ciudades de Colombia
 */
export const useColombiaDepartments = (): UseColombiaDepartmentsReturn => {
  const [departamentoSeleccionado, setDepartamentoSeleccionado] = useState<string | null>(null);
  const [ciudadSeleccionada, setCiudadSeleccionada] = useState<string | null>(null);

  /**
   * Todos los departamentos disponibles
   */
  const departamentos = useMemo(() => DEPARTAMENTOS_COLOMBIA, []);

  /**
   * Ciudades del departamento seleccionado
   */
  const ciudades = useMemo(() => {
    if (!departamentoSeleccionado) {
      return [];
    }
    return getCiudadesPorDepartamento(departamentoSeleccionado);
  }, [departamentoSeleccionado]);

  /**
   * Selecciona un departamento y limpia la ciudad seleccionada
   */
  const seleccionarDepartamento = useCallback((departamento: string) => {
    setDepartamentoSeleccionado(departamento);
    setCiudadSeleccionada(null); // Limpiar ciudad al cambiar departamento
  }, []);

  /**
   * Selecciona una ciudad
   */
  const seleccionarCiudad = useCallback((ciudad: string) => {
    setCiudadSeleccionada(ciudad);
  }, []);

  /**
   * Limpia la selección de departamento y ciudad
   */
  const limpiarSeleccion = useCallback(() => {
    setDepartamentoSeleccionado(null);
    setCiudadSeleccionada(null);
  }, []);

  /**
   * Valida si un departamento es válido
   */
  const validarDepartamento = useCallback((departamento: string): boolean => {
    return esDepartamentoValido(departamento);
  }, []);

  /**
   * Valida si una ciudad pertenece a un departamento
   */
  const validarCiudad = useCallback((ciudad: string, departamento: string): boolean => {
    return esCiudadValidaEnDepartamento(ciudad, departamento);
  }, []);

  return {
    departamentos,
    departamentoSeleccionado,
    ciudades,
    ciudadSeleccionada,
    seleccionarDepartamento,
    seleccionarCiudad,
    limpiarSeleccion,
    validarDepartamento,
    validarCiudad,
  };
};

