import React from 'react';
import { Youtube, Instagram, Facebook } from 'lucide-react';
export function SocialLinks() {
  const socialNetworks = [{
    name: 'YouTube',
    icon: Youtube,
    url: 'https://youtube.com/@elcampodedonramon',
    color: 'hover:bg-red-600',
    description: 'Videos sobre la vida en el campo'
  }, {
    name: 'Instagram',
    icon: Instagram,
    url: 'https://instagram.com/elcampodedonramon',
    color: 'hover:bg-pink-600',
    description: 'Fotos y reels del día a día'
  }, {
    name: 'TikTok',
    icon: () => <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
        </svg>,
    url: 'https://tiktok.com/@elcampodedonramon',
    color: 'hover:bg-black',
    description: 'Videos cortos y entretenidos'
  }, {
    name: 'Facebook',
    icon: Facebook,
    url: 'https://facebook.com/elcampodedonramon',
    color: 'hover:bg-blue-600',
    description: 'Comunidad y noticias'
  }];
  return <section id="redes" className="bg-[#F5E6D3] py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-4 text-black">
          <span className="text-[#FFD700]">Contacto</span> y Redes Sociales
        </h2>
        <p className="text-center text-gray-700 mb-12 text-lg">
          Síguenos en nuestras redes y mantente conectado con nosotros
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {socialNetworks.map(network => {
          const Icon = network.icon;
          return <a key={network.name} href={network.url} target="_blank" rel="noopener noreferrer" className={`bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 duration-300 flex flex-col items-center text-center ${network.color} group`}>
                <div className="bg-black text-white p-4 rounded-full mb-4 group-hover:bg-[#FFD700] group-hover:text-black transition-colors">
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-black mb-2">
                  {network.name}
                </h3>
                <p className="text-gray-600 text-sm">{network.description}</p>
              </a>;
        })}
        </div>
      </div>
    </section>;
}