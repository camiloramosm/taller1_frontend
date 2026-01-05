import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Globe } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useLanguage } from '../contexts/LanguageContext';

export function Header() {
  const { getTotalItems, openCart } = useCartStore();
  const { language, setLanguage, t } = useLanguage();
  const cartItemsCount = getTotalItems();

  const toggleLanguage = () => {
    setLanguage(language === 'es' ? 'en' : 'es');
  };

  return <header className="bg-black text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/">
              <h1 className="text-2xl font-bold text-[#FFD700] hover:text-[#FDB913] transition-colors cursor-pointer">
              {t.header.companyName}
            </h1>
            </Link>
          </div>

          <nav className="hidden md:flex space-x-8">
            <Link to="/#productos" className="hover:text-[#FFD700] transition-colors">
              {t.header.catalog}
            </Link>
            <Link to="/contacto" className="hover:text-[#FFD700] transition-colors">
              {t.header.contact}
            </Link>
            <Link to="/#hero" className="hover:text-[#FFD700] transition-colors">
              {t.header.about}
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            {/* Language Selector */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-900 rounded-lg transition-colors"
              aria-label="Change language"
            >
              <Globe className="w-5 h-5" />
              <span className="text-sm font-semibold uppercase">{language}</span>
            </button>

            {/* Cart Button */}
            <button onClick={openCart} className="relative p-3 bg-[#FFD700] hover:bg-[#FDB913] rounded-lg transition-all transform hover:scale-105 shadow-lg">
              <ShoppingCart className="w-6 h-6 text-black" />
              {cartItemsCount > 0 && <span className="absolute -top-1 -right-1 bg-black text-[#FFD700] text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-[#FFD700]">
                  {cartItemsCount}
                </span>}
            </button>
          </div>
        </div>
      </div>
    </header>;
}