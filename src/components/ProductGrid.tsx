import React from 'react';
import { ProductCard, Product } from './ProductCard';
import { useCartStore } from '../store/cartStore';
import { useLanguage } from '../contexts/LanguageContext';

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  const { addItem } = useCartStore();
  const { t } = useLanguage();

  return <section id="productos" className="bg-gradient-to-b from-[#FFD700]/10 to-white py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold mb-4 text-black">
            {t.products.catalogTitle} <span className="text-[#FFD700]">{t.products.catalogHighlight}</span>
          </h2>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            {t.products.catalogSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {products.map(product => <ProductCard key={product.id} product={product} onAddToCart={addItem} />)}
        </div>
      </div>
    </section>;
}