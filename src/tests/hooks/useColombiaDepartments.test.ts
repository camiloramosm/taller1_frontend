import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useColombiaDepartments } from '../../hooks/useColombiaDepartments';

describe('useColombiaDepartments', () => {
  it('debe inicializar con valores por defecto', () => {
    const { result } = renderHook(() => useColombiaDepartments());

    expect(result.current.departamentos).toHaveLength(33); // 32 departamentos + Bogotá D.C.
    expect(result.current.departamentoSeleccionado).toBeNull();
    expect(result.current.ciudadSeleccionada).toBeNull();
    expect(result.current.ciudades).toEqual([]);
  });

  it('debe seleccionar un departamento y cargar sus ciudades', () => {
    const { result } = renderHook(() => useColombiaDepartments());

    act(() => {
      result.current.seleccionarDepartamento('Antioquia');
    });

    expect(result.current.departamentoSeleccionado).toBe('Antioquia');
    expect(result.current.ciudades.length).toBeGreaterThan(0);
    expect(result.current.ciudades).toContain('Medellín');
  });

  it('debe limpiar la ciudad al cambiar de departamento', () => {
    const { result } = renderHook(() => useColombiaDepartments());

    act(() => {
      result.current.seleccionarDepartamento('Antioquia');
      result.current.seleccionarCiudad('Medellín');
    });

    expect(result.current.ciudadSeleccionada).toBe('Medellín');

    act(() => {
      result.current.seleccionarDepartamento('Cundinamarca');
    });

    expect(result.current.ciudadSeleccionada).toBeNull();
    expect(result.current.ciudades).toContain('Soacha');
  });

  it('debe validar departamentos correctamente', () => {
    const { result } = renderHook(() => useColombiaDepartments());

    expect(result.current.validarDepartamento('Antioquia')).toBe(true);
    expect(result.current.validarDepartamento('Bogotá D.C.')).toBe(true);
    expect(result.current.validarDepartamento('Departamento Inválido')).toBe(false);
  });

  it('debe validar ciudades en departamentos correctamente', () => {
    const { result } = renderHook(() => useColombiaDepartments());

    expect(result.current.validarCiudad('Medellín', 'Antioquia')).toBe(true);
    expect(result.current.validarCiudad('Cali', 'Valle del Cauca')).toBe(true);
    expect(result.current.validarCiudad('Medellín', 'Cundinamarca')).toBe(false);
  });

  it('debe limpiar la selección completa', () => {
    const { result } = renderHook(() => useColombiaDepartments());

    act(() => {
      result.current.seleccionarDepartamento('Antioquia');
      result.current.seleccionarCiudad('Medellín');
    });

    expect(result.current.departamentoSeleccionado).toBe('Antioquia');
    expect(result.current.ciudadSeleccionada).toBe('Medellín');

    act(() => {
      result.current.limpiarSeleccion();
    });

    expect(result.current.departamentoSeleccionado).toBeNull();
    expect(result.current.ciudadSeleccionada).toBeNull();
  });
});

