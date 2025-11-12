import React from 'react';
import { ShoppingCart } from 'lucide-react';
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
  return <div className="bg-[#F5E6D3] rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 duration-300">
      <div className="aspect-square overflow-hidden bg-white">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
      </div>

      <div className="p-6">
        <h3 className="text-2xl font-bold text-black mb-2">{product.name}</h3>
        <p className="text-gray-700 mb-4 line-clamp-2">{product.description}</p>

        <div className="flex items-center justify-between">
          <span className="text-3xl font-bold text-black">
            ${product.price.toLocaleString()}
          </span>

          <button onClick={() => onAddToCart(product)} className="bg-[#FFD700] text-black px-6 py-3 rounded-lg font-bold hover:bg-[#FDB913] transition-all flex items-center gap-2 shadow-md hover:shadow-lg">
            <ShoppingCart className="w-5 h-5" />
            Agregar
          </button>
        </div>
      </div>
    </div>;
}