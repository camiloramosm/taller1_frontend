"use client";

import Link from "next/link";
import { Coffee, Instagram, Facebook, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const TikTokIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

const MercadoLibreIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="24" cy="24" rx="19.5" ry="12.978" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9.7044,15.5305A20.8345,20.8345,0,0,0,16.09,17.3957a22.8207,22.8207,0,0,0,4.546-.7731" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M38.8824,15.6143a8.6157,8.6157,0,0,1-5.1653,1.4849c-3.3351,0-6.2255-2.1987-9.2148-2.1987-2.6681,0-7.189,4.3727-7.189,5.1633s1.3094,1.26,2.3717.7411c.6215-.3036,3.31-2.9151,5.4843-2.9151s9.2186,7.1361,9.8571,7.8066c.9882,1.0376-.9264,3.2733-2.1493,2.05s-3.4092-3.1621-3.4092-3.1621" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M43.4,22.6826a23.9981,23.9981,0,0,0-8.5467,2.6926" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M32.5807,27.4555c.9881,1.0376-.9265,3.2733-2.1493,2.05S27.85,26.9933,27.85,26.9933" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M30.1349,29.2147c.9882,1.0376-.9264,3.2733-2.1493,2.05S25.96,29.3032,25.96,29.3032" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M24.2015,31.3156A2.309,2.309,0,0,0,27.85,31.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M24.2015,31.3156c.5306-.6964.49-3.1817-2.2437-2.6876.6423-1.2188.0658-3.1457-2.3881-2.0093A1.69,1.69,0,0,0,16.424,25.96a1.4545,1.4545,0,0,0-2.8-.28c-.5435,1.1035.2964,3.0963,2.0916,1.9763-.1812,1.9435.84,2.5364,2.6845,1.7788.0989,1.91,1.367,1.7457,2.2728,1.3011A1.9376,1.9376,0,0,0,24.2015,31.3156Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4.6706,22.2785a18.3081,18.3081,0,0,1,9.0635,3.2144" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export function Footer() {
  const socialNetworks = [
    { name: 'YouTube', Icon: Youtube, url: 'https://youtube.com/@elcampodedonramon', color: 'hover:bg-red-600' },
    { name: 'Instagram', Icon: Instagram, url: 'https://instagram.com/elcampodedonramon', color: 'hover:bg-pink-600' },
    { name: 'TikTok', Icon: TikTokIcon, url: 'https://tiktok.com/@elcampodedonramon', color: 'hover:bg-black' },
    { name: 'Facebook', Icon: Facebook, url: 'https://www.facebook.com/profile.php?id=61578868924055', color: 'hover:bg-blue-600' },
    { name: 'Mercado Libre', Icon: MercadoLibreIcon, url: 'https://listado.mercadolibre.com.co/_CustId_3115312726', color: 'hover:bg-yellow-400' },
  ];
  return (
    <footer className="bg-foreground text-background py-20">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-primary p-2 rounded-xl">
                <Coffee className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="font-fraunces text-2xl font-bold tracking-tight">
                EL CAMPO DE <span className="text-accent">DON RAMÓN</span>
              </span>
            </Link>
            <p className="text-muted-foreground/80 leading-relaxed">
              Café 100% orgánico de las montañas colombianas. 
              Cultivado con amor y tradición para llevar el mejor sabor a tu mesa.
            </p>
            <div className="flex gap-4">
              {socialNetworks.map(({ name, Icon, url, color }) => (
                <a 
                  key={name}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`rounded-full border border-background/20 p-2.5 transition-all duration-300 hover:scale-110 ${color} hover:border-transparent`}
                  aria-label={name}
                >
                  <Icon className={name === 'Mercado Libre' ? 'w-5 h-5' : 'w-4 h-4'} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-fraunces text-xl font-bold mb-6">Explorar</h4>
            <ul className="space-y-4">
              {["Inicio", "Productos", "Nuestra Historia", "Preguntas Frecuentes"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-muted-foreground/80 hover:text-accent transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-fraunces text-xl font-bold mb-6">Contacto</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-muted-foreground/80">
                <MapPin className="w-5 h-5 text-accent" />
                <span>Colombia</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground/80">
                <Phone className="w-5 h-5 text-accent" />
                <a href="tel:+573019311827" className="hover:text-accent transition-colors">
                  +57 301 9311827
                </a>
              </li>
              <li className="flex items-start gap-3 text-muted-foreground/80">
                <Mail className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <a href="mailto:contacto.elcampodedonramon@gmail.com" className="hover:text-accent transition-colors break-all text-sm">
                  contacto.elcampodedonramon@gmail.com
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-fraunces text-xl font-bold mb-6">Boletín</h4>
            <p className="text-muted-foreground/80 mb-6">
              Suscríbete para recibir ofertas exclusivas y consejos de barista.
            </p>
            <div className="flex gap-2">
              <Input
                placeholder="Tu email"
                className="bg-background/10 border-background/20 text-background placeholder:text-muted-foreground/50"
              />
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                Unirse
              </Button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-background/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground/60">
          <p>© 2026 EL CAMPO DE DON RAMÓN. Todos los derechos reservados.</p>
          <div className="flex gap-8">
            <Link href="#" className="hover:text-accent">Política de Privacidad</Link>
            <Link href="#" className="hover:text-accent">Términos y Condiciones</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
