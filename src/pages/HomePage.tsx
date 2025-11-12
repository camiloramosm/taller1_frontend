import React from 'react';
import { Hero } from '../components/Hero';
import { SocialLinks } from '../components/SocialLinks';
import { ProductGrid } from '../components/ProductGrid';
import type { Product } from '../types';

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Camiseta Oficial',
    price: 299,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop',
    description: 'Camiseta oficial de "El Campo de Don Ramón". 100% algodón, diseño exclusivo con el logo del canal.'
  },
  {
    id: 2,
    name: 'Café del Campo',
    price: 180,
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&h=800&fit=crop',
    description: 'Café artesanal cultivado en nuestras tierras. 100% natural, tostado tradicional. Paquete de 500g.'
  },
  {
    id: 3,
    name: 'Miel Orgánica',
    price: 250,
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784f4f?w=800&h=800&fit=crop',
    description: 'Miel 100% pura y orgánica de nuestras colmenas. Frasco de 500g.'
  },
  {
    id: 4,
    name: 'Queso Campesino',
    price: 320,
    image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=800&h=800&fit=crop',
    description: 'Queso artesanal elaborado con leche fresca de nuestras vacas. 1kg.'
  }
];

export const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <ProductGrid products={PRODUCTS} />
      <SocialLinks />
      <Hero />
    </div>
  );
};

