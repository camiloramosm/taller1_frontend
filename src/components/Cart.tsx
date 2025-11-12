import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { formatearMoneda } from '../utils/validations';

export function Cart() {
  const navigate = useNavigate();
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    getTotalPrice,
    getTotalItems
  } = useCartStore();

  const total = getTotalPrice();

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  if (!isOpen) return null;

  return <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={closeCart} />

      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-[#F5E6D3] shadow-2xl z-50 flex flex-col">
        <div className="bg-black text-white p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Carrito</h2>
            {items.length > 0 && (
              <p className="text-sm text-gray-300">{getTotalItems()} {getTotalItems() === 1 ? 'producto' : 'productos'}</p>
            )}
          </div>
          <button onClick={closeCart} className="p-2 hover:bg-gray-900 rounded-lg transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? <div className="text-center py-12">
              <p className="text-gray-600 text-lg">Tu carrito está vacío</p>
              <button
                onClick={closeCart}
                className="mt-4 text-black font-semibold hover:underline"
              >
                Continuar Comprando
              </button>
            </div> : <div className="space-y-4">
              {items.map(item => <div key={item.id} className="bg-white rounded-lg p-4 shadow-md">
                  <div className="flex gap-4">
                    <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />

                    <div className="flex-1">
                      <h3 className="font-bold text-black">{item.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{formatearMoneda(item.price)} c/u</p>
                      
                      {/* Control de cantidad */}
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 bg-gray-200 hover:bg-gray-300 rounded"
                          aria-label="Disminuir cantidad"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 bg-gray-200 hover:bg-gray-300 rounded"
                          aria-label="Aumentar cantidad"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <p className="font-bold text-black mt-2">
                        {formatearMoneda(item.price * item.quantity)}
                      </p>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-600 hover:text-red-800 p-2 self-start"
                      aria-label="Eliminar producto"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>)}
            </div>}
        </div>

        {items.length > 0 && <div className="bg-black text-white p-6 space-y-4">
            <div className="flex justify-between text-xl font-bold">
              <span>Total:</span>
              <span className="text-[#FFD700]">{formatearMoneda(total)}</span>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-[#FFD700] text-black font-bold py-4 rounded-lg hover:bg-[#FDB913] transition-all shadow-lg"
            >
              Proceder al Pago
            </button>

            <button
              onClick={closeCart}
              className="w-full text-white text-sm hover:underline"
            >
              Continuar Comprando
            </button>
          </div>}
      </div>
    </>;
}