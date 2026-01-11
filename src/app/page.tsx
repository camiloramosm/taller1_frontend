"use client";

import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Products } from "@/components/Products";
import { About } from "@/components/About";
import { Footer } from "@/components/Footer";
import { ClientOnly } from "@/components/ClientOnly";
import { Coffee, Truck, Leaf, ShieldCheck } from "lucide-react";

import { toast } from "sonner";

export default function Home() {
  const handleSubscribe = () => {
    toast.success("¡Bienvenido al Club Don Ramón!", {
      description: "Próximamente recibirás nuestras mejores ofertas y noticias.",
    });
  };

  return (
    <main className="min-h-screen bg-background selection:bg-accent/30">
      <ClientOnly>
        <Navbar />
      </ClientOnly>
      <Hero />
      
      {/* Features/Values Section */}
      <section className="py-20 border-y border-border bg-card">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              {
                icon: Coffee,
                title: "Tostado Fresco",
                desc: "Tostamos cada lote solo después de recibir tu pedido.",
              },
              {
                icon: Truck,
                title: "Envío Rápido",
                desc: "Llegamos a tu puerta en menos de 48 horas.",
              },
              {
                icon: Leaf,
                title: "Sostenible",
                desc: "Apoyamos directamente a pequeños caficultores locales.",
              },
              {
                icon: ShieldCheck,
                title: "Calidad Premium",
                desc: "Solo el 40% de los granos califica para Don Ramón.",
              },
            ].map((feature, i) => (
              <div key={i} className="flex flex-col items-center text-center group">
                <div className="mb-6 p-4 rounded-2xl bg-secondary group-hover:bg-primary transition-colors duration-300">
                  <feature.icon className="w-8 h-8 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <h3 className="font-fraunces text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Products />
      <About />

    { /* {/* Testimonials/Newsletter CTA 
      <section id="suscripciones" className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent rounded-full blur-[120px]" />
        </div>
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="font-fraunces text-4xl md:text-6xl font-bold mb-8">
            ¿Listo para despertar <br className="hidden md:block" />
            con <span className="text-accent">Carácter?</span>
          </h2>
          <p className="text-xl text-primary-foreground/80 mb-12 max-w-2xl mx-auto">
            Únete a nuestra suscripción mensual y nunca te quedes sin el café 
            que te da la fuerza para enfrentar cualquier renta pendiente.
          </p>
          <button 
            onClick={handleSubscribe}
            className="h-16 px-10 bg-accent text-accent-foreground font-bold text-lg rounded-full hover:scale-105 transition-transform shadow-2xl shadow-black/20"
          >
            Suscribirme Ahora
          </button>
        </div>
      </section>
*/}
     <Footer />
    </main>
  );
}
