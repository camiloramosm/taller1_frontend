import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product } from '../types';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

/**
 * Store de Zustand para manejar el carrito de compras
 * Persiste en localStorage automáticamente
 */
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      /**
       * Agrega un producto al carrito o incrementa su cantidad si ya existe
       */
      addItem: (product: Product) => {
        set((state) => {
          const existingItem = state.items.find((item) => item.id === product.id);

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }

          return {
            items: [...state.items, { ...product, quantity: 1 }],
          };
        });
      },

      /**
       * Elimina un producto del carrito
       */
      removeItem: (productId: number) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        }));
      },

      /**
       * Actualiza la cantidad de un producto en el carrito
       */
      updateQuantity: (productId: number, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.id === productId ? { ...item, quantity } : item
          ),
        }));
      },

      /**
       * Vacía el carrito
       */
      clearCart: () => {
        set({ items: [] });
      },

      /**
       * Alterna la visibilidad del carrito
       */
      toggleCart: () => {
        set((state) => ({ isOpen: !state.isOpen }));
      },

      /**
       * Abre el carrito
       */
      openCart: () => {
        set({ isOpen: true });
      },

      /**
       * Cierra el carrito
       */
      closeCart: () => {
        set({ isOpen: false });
      },

      /**
       * Calcula el total de items en el carrito
       */
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      /**
       * Calcula el precio total del carrito
       */
      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },
    }),
    {
      name: 'cart-storage', // nombre en localStorage
      // Solo persistir los items, no el estado de isOpen
      partialize: (state) => ({ items: state.items }),
    }
  )
);

