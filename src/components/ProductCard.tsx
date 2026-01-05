import React, { useState } from 'react';
import { ShoppingCart, ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
}
interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}
export function ProductCard({
  product,
  onAddToCart
}: ProductCardProps) {
  const [expanded, setExpanded] = useState(false);
  const { t } = useLanguage();

  return <div className="bg-[#F5E6D3] rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 duration-300">
      <div className="aspect-square overflow-hidden bg-white">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
      </div>

      <div className="p-6">
        <h3 className="text-2xl font-bold text-black mb-2">{product.name}</h3>
        
        <div className="mb-4">
          <p className={`text-gray-700 text-sm ${expanded ? '' : 'line-clamp-3'}`}>
            {product.description}
          </p>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-[#FFD700] hover:text-[#FDB913] font-semibold text-sm mt-2 flex items-center gap-1 transition-colors"
          >
            {expanded ? (
              <>
                {t.products.seeLess} <ChevronUp className="w-4 h-4" />
              </>
            ) : (
              <>
                {t.products.seeMore} <ChevronDown className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-3xl font-bold text-black">
            ${product.price.toLocaleString()}
          </span>

          <button onClick={() => onAddToCart(product)} className="bg-[#FFD700] text-black px-6 py-3 rounded-lg font-bold hover:bg-[#FDB913] transition-all flex items-center gap-2 shadow-md hover:shadow-lg">
            <ShoppingCart className="w-5 h-5" />
            {t.products.addToCart}
          </button>
        </div>
      </div>
    </div>;
}