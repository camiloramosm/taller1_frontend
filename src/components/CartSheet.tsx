"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { ShoppingCart, Plus, Minus, Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-store";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";

export function CartSheet() {
  const { items, removeItem, updateQuantity, totalItems, totalPrice } = useCart();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCheckout = () => {
    router.push('/checkout');
  };

  // Durante SSR, mostrar 0 items para evitar hidratación
  const displayTotalItems = mounted ? totalItems() : 0;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="relative group gap-2 border-primary/20 hover:bg-primary hover:text-primary-foreground transition-all rounded-full px-4 h-10"
        >
          <div className="relative">
            <ShoppingCart className="w-4 h-4 transition-transform group-hover:-rotate-12" />
            {displayTotalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-accent text-[10px] font-black px-1.5 py-0.5 rounded-full text-accent-foreground border-2 border-background animate-in zoom-in">
                {displayTotalItems}
              </span>
            )}
          </div>
          <span className="hidden sm:inline font-bold">Carrito</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col bg-background/95 backdrop-blur-2xl border-l-primary/10 p-0">
        <SheetHeader className="p-6 pb-2">
          <SheetTitle className="font-fraunces text-3xl flex items-center gap-2">
            Tu Pedido <span className="text-primary italic">Don Ramón</span>
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-hidden flex flex-col">
          <AnimatePresence mode="wait">
            {items.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 flex flex-col items-center justify-center text-center p-8"
              >
                <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center mb-8 group">
                  <ShoppingBag className="w-10 h-10 text-muted-foreground opacity-20 group-hover:opacity-40 transition-opacity group-hover:scale-110 duration-500" />
                </div>
                <h3 className="font-fraunces text-2xl font-bold mb-3">Carrito Vacío</h3>
                <p className="text-muted-foreground max-w-[240px]">
                  Parece que aún no has elegido tu dosis de carácter para hoy.
                </p>
                <SheetClose asChild>
                  <Button variant="link" className="mt-4 text-primary font-bold">
                    Seguir explorando
                  </Button>
                </SheetClose>
              </motion.div>
            ) : (
              <>
                <ScrollArea className="flex-1 px-6">
                  <div className="space-y-6 py-4">
                    {items.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex gap-5 group relative"
                      >
                        <div className="relative h-28 w-28 rounded-3xl overflow-hidden bg-secondary flex-shrink-0 shadow-inner">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-contain transition-transform duration-700 group-hover:scale-110"
                            sizes="112px"
                          />
                          <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
                        </div>
                        <div className="flex-1 flex flex-col justify-between py-1">
                          <div>
                            <div className="flex justify-between items-start mb-1">
                              <h4 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">
                                {item.name}
                              </h4>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-full transition-all"
                                onClick={() => removeItem(item.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                            <div className="flex items-center gap-2">
                              <p className="text-primary font-black text-lg">
                                ${item.price.toFixed(2)}
                              </p>
                              <span className="text-xs text-muted-foreground">/ und</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center border border-primary/10 rounded-2xl bg-secondary/30 p-1 backdrop-blur-sm">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-xl hover:bg-background"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </Button>
                              <span className="w-10 text-center text-sm font-black text-foreground">
                                {item.quantity}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-xl hover:bg-background"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                            <p className="font-bold text-foreground">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>

                <div className="p-6 bg-secondary/20 backdrop-blur-md space-y-4 border-t border-primary/5">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Subtotal</span>
                      <span className="font-medium text-foreground">${totalPrice().toFixed(2)}</span>
                    </div>
                    <Separator className="bg-primary/5" />
                    <div className="flex justify-between items-baseline pt-2">
                      <span className="text-lg font-medium">Total Estimado</span>
                      <span className="text-3xl font-black text-primary">${totalPrice().toFixed(2)}</span>
                    </div>
                  </div>

                  <Button
                    className="w-full h-16 rounded-3xl text-lg font-black gap-3 group shadow-2xl shadow-primary/20 bg-primary hover:bg-primary/90 transition-all duration-300 relative overflow-hidden"
                    disabled={items.length === 0}
                    onClick={handleCheckout}
                  >
                    <span className="relative z-10 flex items-center gap-3">
                      Finalizar Pedido
                      <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </Button>
                </div>
              </>
            )}
          </AnimatePresence>
        </div>
      </SheetContent>
    </Sheet>
  );
}
