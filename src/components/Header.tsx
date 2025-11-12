import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '../store/cartStore';

export function Header() {
  const { getTotalItems, openCart } = useCartStore();
  const cartItemsCount = getTotalItems();

  return <header className="bg-black text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/">
              <h1 className="text-2xl font-bold text-[#FFD700] hover:text-[#FDB913] transition-colors cursor-pointer">
              EL CAMPO DE DON RAMÓN
            </h1>
            </Link>
          </div>

          <nav className="hidden md:flex space-x-8">
            <Link to="/#productos" className="hover:text-[#FFD700] transition-colors">
              Catálogo
            </Link>
            <Link to="/contacto" className="hover:text-[#FFD700] transition-colors">
              Contacto
            </Link>
            <Link to="/#hero" className="hover:text-[#FFD700] transition-colors">
              Sobre Nosotros
            </Link>
          </nav>

          <button onClick={openCart} className="relative p-2 hover:bg-gray-900 rounded-lg transition-colors">
            <ShoppingCart className="w-6 h-6" />
            {cartItemsCount > 0 && <span className="absolute -top-1 -right-1 bg-[#FFD700] text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartItemsCount}
              </span>}
          </button>
        </div>
      </div>
    </header>;
}