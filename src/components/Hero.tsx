"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import Image from "next/image";

import { toast } from "sonner";

export function Hero() {
  const handleWatchProcess = () => {
    toast.info("Próximamente", {
      description: "Estamos grabando el proceso de tostado artesanal para ti.",
    });
  };

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=2000"
          alt="Coffee Beans"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 mb-6 text-sm font-bold tracking-widest uppercase bg-accent/20 text-accent rounded-full border border-accent/30">
              Cosecha 2026 • 100% Orgánico
            </span>
            <h1 className="font-fraunces text-6xl md:text-8xl font-bold leading-[1.1] mb-6 text-foreground">
              El Café del <br />
              <span className="text-primary italic">Campo Colombiano.</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-10 leading-relaxed max-w-lg">
              Desde las montañas más altas de Colombia hasta tu taza. 
              El sabor auténtico cultivado entre 1800-2000 metros sobre el nivel del mar.
            </p>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Button 
                  asChild
                  size="lg" 
                  className="h-14 px-8 text-lg gap-2 rounded-full w-full sm:w-auto shadow-lg shadow-primary/20 cursor-pointer"
                >
                  <a href="#productos">
                    Comprar Ahora <ArrowRight className="w-5 h-5" />
                  </a>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                    className="h-14 px-8 text-lg gap-2 rounded-full w-full sm:w-auto border-2"
                    onClick={handleWatchProcess}
                  >
                    <Play className="w-5 h-5 fill-current" /> Ver Proceso
                  </Button>

              </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="mt-16 flex items-center gap-8"
          >
            <div className="flex -space-x-4">
              {[1, 2, 3, 4].map((i) => (
                <img
                  key={i}
                  src={`https://i.pravatar.cc/100?img=${i + 10}`}
                  alt="User"
                  className="w-12 h-12 rounded-full border-4 border-background object-cover"
                />
              ))}
            </div>
            <div>
              <p className="font-bold text-foreground">+5,000 Clientes Felices</p>
              <div className="flex text-accent">
                {"★★★★★".split("").map((s, i) => (
                  <span key={i}>{s}</span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating element */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute right-[10%] top-[20%] hidden lg:block"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-accent blur-[100px] opacity-20" />
          <div className="relative w-80 h-[450px] rounded-[40px] shadow-2xl rotate-6 border-[12px] border-white/10 backdrop-blur-sm overflow-hidden">
            <Image
              src="/images/450gr.jpeg"
              alt="Café Premium 450g - EL CAMPO DE DON RAMÓN"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
