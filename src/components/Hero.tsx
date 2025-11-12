import React from 'react';
export function Hero() {
  return <section id="hero" className="bg-black text-white py-20 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-5xl md:text-6xl font-bold mb-6">
          El Campo de <span className="text-[#FFD700]">Don Ramón</span>
        </h2>
        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Compartiendo la vida del campo, tradiciones y el trabajo honesto de la
          tierra. Sígueme en mis redes sociales para más contenido auténtico.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="#redes" className="inline-block bg-[#FFD700] text-black font-bold px-8 py-4 rounded-lg hover:bg-[#FDB913] transition-all transform hover:scale-105 shadow-lg">
            Sígueme en Redes
          </a>
          <a href="#productos" className="inline-block bg-transparent border-2 border-[#FFD700] text-[#FFD700] font-bold px-8 py-4 rounded-lg hover:bg-[#FFD700] hover:text-black transition-all shadow-lg">
            Ver Tienda
          </a>
        </div>
      </div>
    </section>;
}