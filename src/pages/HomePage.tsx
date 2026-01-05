import React from 'react';
import { Hero } from '../components/Hero';
import { SocialLinks } from '../components/SocialLinks';
import { ProductGrid } from '../components/ProductGrid';
import { useLanguage } from '../contexts/LanguageContext';
import type { Product } from '../types';

// Importar imágenes locales
import img450gr from '../images/450gr.jpeg';
import img2500gr from '../images/2500gr.jpeg';

export const HomePage: React.FC = () => {
  const { t } = useLanguage();

  const PRODUCTS: Product[] = [
    {
      id: 1,
      name: t.products.productName450,
      price: 38000,
      image: img450gr,
      description: `${t.products.productDescription} ${t.products.presentation450}`
    },
    {
      id: 2,
      name: t.products.productName2500,
      price: 175000,
      image: img2500gr,
      description: `${t.products.productDescription} ${t.products.presentation2500}`
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <ProductGrid products={PRODUCTS} />
      <SocialLinks />
      <Hero />
    </div>
  );
};

