"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export function About() {
  return (
    <section id="historia" className="py-24 bg-secondary/20 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative z-10 rounded-[2rem] overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=800"
                alt="Coffee Beans Roasting"
                className="w-full h-[600px] object-cover"
              />
            </div>
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-accent/20 rounded-full blur-3xl -z-10" />
            <div className="absolute -top-10 -left-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl -z-10" />
            
            <div className="absolute bottom-8 left-8 right-8 bg-background/90 backdrop-blur-md p-8 rounded-2xl shadow-xl">
              <p className="font-fraunces text-2xl font-bold text-primary mb-2">"Yo no me rindo."</p>
              <p className="text-muted-foreground italic">— El Espíritu de Don Ramón</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-accent font-bold tracking-widest uppercase mb-4 block">Nuestra Historia</span>
            <h2 className="font-fraunces text-4xl md:text-5xl font-bold mb-8 text-foreground leading-tight">
              Más que un Café, una <span className="text-primary italic">Actitud ante la Vida</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Don Ramón Café nace de la resiliencia y la pasión. Como el legendario personaje, 
              nuestro café es directo, sin pretensiones, pero con una profundidad y carácter 
              que te sorprenderán. Seleccionamos granos que han sobrevivido a las condiciones 
              más duras para ofrecerte la taza más robusta.
            </p>

            <ul className="space-y-4 mb-10">
              {[
                "100% Granos Arábica Seleccionados",
                "Tostado Artesanal por Lotes Pequeños",
                "Comercio Directo con Caficultores"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-foreground font-medium">
                  <CheckCircle2 className="w-6 h-6 text-accent" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="grid grid-cols-3 gap-8 border-t border-border pt-10">
              <div>
                <p className="text-3xl font-bold text-primary">15+</p>
                <p className="text-sm text-muted-foreground uppercase tracking-wider">Años de Tostado</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">24h</p>
                <p className="text-sm text-muted-foreground uppercase tracking-wider">Desde el Tostado</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">100%</p>
                <p className="text-sm text-muted-foreground uppercase tracking-wider">Orgánico</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
