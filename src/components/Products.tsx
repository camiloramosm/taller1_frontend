"use client";

import { motion } from "framer-motion";
import { ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/lib/cart-store";
import { toast } from "sonner";
import Image from "next/image";

const products = [
  {
    id: 1,
    name: "Café Premium - 450 g",
    description: "Café 100% orgánico cultivado entre 1800-2000 metros sobre el nivel del mar. Esta altitud privilegiada permite un desarrollo lento del grano, concentrando sabores complejos y aromáticos.",
    price: 38000,
    rating: 5.0,
    image: "/images/450gr.jpeg",
    tag: "Bestseller",
  },
  {
    id: 2,
    name: "Café Premium - 2500 g",
    description: "Presentación familiar de nuestro café premium. Perfecto para toda la familia. Café 100% orgánico con el mejor sabor y aroma de las montañas colombianas.",
    price: 175000,
    rating: 5.0,
    image: "/images/2500gr.jpeg",
    tag: "Familiar",
  },
];

export function Products() {
  const addItem = useCart((state) => state.addItem);

  return (
    <section id="productos" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-xl">
              <h2 className="font-fraunces text-4xl md:text-5xl font-bold mb-4 text-foreground">
                Nuestro <span className="text-primary italic">Café Premium</span>
              </h2>
              <p className="text-muted-foreground text-lg">
                Cada grano es seleccionado a mano de las montañas más altas de Colombia.
                Café 100% orgánico con carácter auténtico.
              </p>
            </div>
            <Button 
              asChild
              variant="outline" 
              className="rounded-full border-primary/20 hover:bg-primary hover:text-primary-foreground cursor-pointer"
            >
              <a href="#productos">
                Ver Todo el Catálogo
              </a>
            </Button>
          </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="group overflow-hidden border-none bg-secondary/30 hover:bg-secondary/50 transition-all duration-500 rounded-3xl">
                <CardContent className="p-0 relative">
                  <div className="relative h-72 overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-background/80 backdrop-blur-md text-foreground border-none px-3 py-1">
                        {product.tag}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-1 mb-2">
                      <Star className="w-4 h-4 fill-accent text-accent" />
                      <span className="text-sm font-bold">{product.rating}</span>
                    </div>
                    <h3 className="font-fraunces text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {product.description}
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="p-6 pt-0 flex justify-between items-center">
                  <span className="text-2xl font-bold text-foreground">
                    ${product.price.toLocaleString('es-CO')}
                  </span>
                    <Button 
                      size="icon" 
                      className="rounded-full h-12 w-12 bg-primary hover:scale-110 transition-transform"
                      onClick={() => {
                        addItem({
                          id: product.id,
                          name: product.name,
                          price: product.price,
                          image: product.image
                        });
                        toast.success(`${product.name} añadido al carrito`, {
                          description: "Se agregó correctamente a tu pedido.",
                        });
                      }}
                    >
                      <ShoppingCart className="w-5 h-5" />
                    </Button>

                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
