import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCartStore } from '../../store/cartStore';
import type { Product } from '../../types';

const mockProduct: Product = {
  id: 1,
  name: 'Producto de Prueba',
  price: 100,
  image: 'https://example.com/image.jpg',
  description: 'Descripción de prueba',
};

const mockProduct2: Product = {
  id: 2,
  name: 'Producto de Prueba 2',
  price: 200,
  image: 'https://example.com/image2.jpg',
  description: 'Descripción de prueba 2',
};

describe('useCartStore', () => {
  beforeEach(() => {
    // Limpiar el store antes de cada test
    const { result } = renderHook(() => useCartStore());
    act(() => {
      result.current.clearCart();
    });
  });

  it('debe inicializar con un carrito vacío', () => {
    const { result } = renderHook(() => useCartStore());
    
    expect(result.current.items).toEqual([]);
    expect(result.current.isOpen).toBe(false);
    expect(result.current.getTotalItems()).toBe(0);
    expect(result.current.getTotalPrice()).toBe(0);
  });

  it('debe agregar un producto al carrito', () => {
    const { result } = renderHook(() => useCartStore());

    act(() => {
      result.current.addItem(mockProduct);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(1);
    expect(result.current.getTotalItems()).toBe(1);
  });

  it('debe incrementar la cantidad si el producto ya existe', () => {
    const { result } = renderHook(() => useCartStore());

    act(() => {
      result.current.addItem(mockProduct);
      result.current.addItem(mockProduct);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(2);
    expect(result.current.getTotalItems()).toBe(2);
  });

  it('debe eliminar un producto del carrito', () => {
    const { result } = renderHook(() => useCartStore());

    act(() => {
      result.current.addItem(mockProduct);
      result.current.removeItem(mockProduct.id);
    });

    expect(result.current.items).toHaveLength(0);
    expect(result.current.getTotalItems()).toBe(0);
  });

  it('debe actualizar la cantidad de un producto', () => {
    const { result } = renderHook(() => useCartStore());

    act(() => {
      result.current.addItem(mockProduct);
      result.current.updateQuantity(mockProduct.id, 5);
    });

    expect(result.current.items[0].quantity).toBe(5);
    expect(result.current.getTotalItems()).toBe(5);
  });

  it('debe eliminar el producto si la cantidad es 0 o menor', () => {
    const { result } = renderHook(() => useCartStore());

    act(() => {
      result.current.addItem(mockProduct);
      result.current.updateQuantity(mockProduct.id, 0);
    });

    expect(result.current.items).toHaveLength(0);
  });

  it('debe calcular el precio total correctamente', () => {
    const { result } = renderHook(() => useCartStore());

    act(() => {
      result.current.addItem(mockProduct); // 100
      result.current.addItem(mockProduct2); // 200
    });

    expect(result.current.getTotalPrice()).toBe(300);
  });

  it('debe calcular el precio total con cantidades múltiples', () => {
    const { result } = renderHook(() => useCartStore());

    act(() => {
      result.current.addItem(mockProduct);
      result.current.addItem(mockProduct);
      result.current.addItem(mockProduct2);
    });

    // 2 * 100 + 1 * 200 = 400
    expect(result.current.getTotalPrice()).toBe(400);
  });

  it('debe limpiar el carrito', () => {
    const { result } = renderHook(() => useCartStore());

    act(() => {
      result.current.addItem(mockProduct);
      result.current.addItem(mockProduct2);
      result.current.clearCart();
    });

    expect(result.current.items).toHaveLength(0);
    expect(result.current.getTotalItems()).toBe(0);
    expect(result.current.getTotalPrice()).toBe(0);
  });

  it('debe abrir y cerrar el carrito', () => {
    const { result } = renderHook(() => useCartStore());

    expect(result.current.isOpen).toBe(false);

    act(() => {
      result.current.openCart();
    });

    expect(result.current.isOpen).toBe(true);

    act(() => {
      result.current.closeCart();
    });

    expect(result.current.isOpen).toBe(false);
  });

  it('debe alternar la visibilidad del carrito', () => {
    const { result } = renderHook(() => useCartStore());

    expect(result.current.isOpen).toBe(false);

    act(() => {
      result.current.toggleCart();
    });

    expect(result.current.isOpen).toBe(true);

    act(() => {
      result.current.toggleCart();
    });

    expect(result.current.isOpen).toBe(false);
  });
});

