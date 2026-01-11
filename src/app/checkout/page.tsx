'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart-store';
import { useOrders } from '@/hooks/useOrders';
import { useEpayco } from '@/hooks/useEpayco';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import { DEPARTAMENTOS_COLOMBIA } from '@/data/colombia-departamentos';
import Link from 'next/link';
import type { ProductoEnPedido } from '@/types/database';

interface FormData {
  correo_electronico: string;
  telefono: string;
  departamento: string;
  ciudad: string;
  direccion_completa: string;
  notas_adicionales: string;
}

interface FormErrors {
  [key: string]: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const { createOrder, loading } = useOrders();
  const { isReady: epaycoReady, isLoading: epaycoLoading, error: epaycoError, openCheckout } = useEpayco();

  const [formData, setFormData] = useState<FormData>({
    correo_electronico: '',
    telefono: '',
    departamento: '',
    ciudad: '',
    direccion_completa: '',
    notas_adicionales: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.correo_electronico || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo_electronico)) {
      newErrors.correo_electronico = 'Correo electrónico no válido';
    }

    if (!formData.telefono || !/^\d{10}$/.test(formData.telefono.replace(/\D/g, '').slice(-10))) {
      newErrors.telefono = 'Teléfono no válido (10 dígitos)';
    }

    if (!formData.departamento) {
      newErrors.departamento = 'Selecciona un departamento';
    }

    if (!formData.ciudad) {
      newErrors.ciudad = 'Selecciona una ciudad';
    }

    if (!formData.direccion_completa || formData.direccion_completa.length < 10) {
      newErrors.direccion_completa = 'Dirección debe tener al menos 10 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Por favor, corrige los errores en el formulario');
      return;
    }

    if (items.length === 0) {
      toast.error('Tu carrito está vacío');
      return;
    }

    // Preparar productos para el pedido
    const productos: ProductoEnPedido[] = items.map((item) => ({
      id: item.id,
      nombre: item.name,
      cantidad: item.quantity,
      precio: item.price,
    }));

    const total = totalPrice();

    // Normalizar teléfono: solo los 10 dígitos
    const telefonoNormalizado = formData.telefono
      .replace(/\s/g, '') // Quitar espacios
      .replace(/^\+?57/, ''); // Quitar código de país

    // Crear pedido en Supabase primero (estado pendiente)
    const response = await createOrder({
      correo_electronico: formData.correo_electronico,
      telefono: telefonoNormalizado,
      departamento: formData.departamento,
      ciudad: formData.ciudad,
      direccion_completa: formData.direccion_completa,
      productos,
      total,
      notas_adicionales: formData.notas_adicionales || null,
    });

    if (response.success && response.data) {
      const pedido = response.data;

      // Abrir checkout de ePayco
      if (epaycoReady) {
        openCheckout({
          // Información del producto/servicio
          name: 'EL CAMPO DE DON RAMÓN',
          description: `Pedido ${pedido.id.substring(0, 8)}`,
          invoice: pedido.id,
          currency: 'cop',
          amount: total.toString(),
          tax_base: '0',
          tax: '0',
          country: 'co',
          lang: 'es',

          // Información del cliente
          external: 'false',
          extra1: pedido.id,
          extra2: formData.correo_electronico,
          extra3: formData.telefono,

          // URLs de respuesta
          response: `${process.env.NEXT_PUBLIC_SITE_URL}/confirmacion/${pedido.id}`,
          confirmation: `${process.env.NEXT_PUBLIC_SITE_URL}/api/confirmacion`,

          // Información del comprador
          name_billing: formData.correo_electronico.split('@')[0],
          address_billing: formData.direccion_completa,
          mobilephone_billing: formData.telefono,
        });

        toast.success('Redirigiendo a la pasarela de pagos...');
      } else {
        toast.error('Error: La pasarela de pagos no está lista. Por favor, recarga la página.');
      }
    } else {
      toast.error(response.error || 'Error al crear el pedido');
    }
  };

  const selectedDepartment = DEPARTAMENTOS_COLOMBIA.find((d) => d.nombre === formData.departamento);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            Volver a la tienda
          </Link>
          <h1 className="font-fraunces text-4xl md:text-5xl font-bold text-foreground">
            Finalizar <span className="text-primary italic">Pedido</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulario */}
          <div className="lg:col-span-2">
            <Card className="border-none shadow-xl bg-card">
              <CardHeader>
                <CardTitle className="font-fraunces text-2xl">Información de Envío</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email */}
                  <div>
                    <Label htmlFor="correo_electronico">Correo Electrónico *</Label>
                    <Input
                      id="correo_electronico"
                      type="email"
                      value={formData.correo_electronico}
                      onChange={(e) => setFormData({ ...formData, correo_electronico: e.target.value })}
                      className={errors.correo_electronico ? 'border-red-500' : ''}
                      placeholder="tu@email.com"
                    />
                    {errors.correo_electronico && (
                      <p className="text-sm text-red-500 mt-1">{errors.correo_electronico}</p>
                    )}
                  </div>

                  {/* Teléfono */}
                  <div>
                    <Label htmlFor="telefono">Teléfono *</Label>
                    <Input
                      id="telefono"
                      type="tel"
                      value={formData.telefono}
                      onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                      className={errors.telefono ? 'border-red-500' : ''}
                      placeholder="+57 301 1234567"
                    />
                    {errors.telefono && (
                      <p className="text-sm text-red-500 mt-1">{errors.telefono}</p>
                    )}
                  </div>

                  {/* Departamento y Ciudad */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="departamento">Departamento *</Label>
                      <Select
                        value={formData.departamento}
                        onValueChange={(value) => setFormData({ ...formData, departamento: value, ciudad: '' })}
                      >
                        <SelectTrigger className={errors.departamento ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Selecciona" />
                        </SelectTrigger>
                        <SelectContent>
                          {DEPARTAMENTOS_COLOMBIA.map((dept) => (
                            <SelectItem key={dept.nombre} value={dept.nombre}>
                              {dept.nombre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.departamento && (
                        <p className="text-sm text-red-500 mt-1">{errors.departamento}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="ciudad">Ciudad *</Label>
                      <Select
                        value={formData.ciudad}
                        onValueChange={(value) => setFormData({ ...formData, ciudad: value })}
                        disabled={!formData.departamento}
                      >
                        <SelectTrigger className={errors.ciudad ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Selecciona" />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedDepartment?.ciudades.map((ciudad) => (
                            <SelectItem key={ciudad} value={ciudad}>
                              {ciudad}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.ciudad && (
                        <p className="text-sm text-red-500 mt-1">{errors.ciudad}</p>
                      )}
                    </div>
                  </div>

                  {/* Dirección */}
                  <div>
                    <Label htmlFor="direccion_completa">Dirección Completa *</Label>
                    <Input
                      id="direccion_completa"
                      value={formData.direccion_completa}
                      onChange={(e) => setFormData({ ...formData, direccion_completa: e.target.value })}
                      className={errors.direccion_completa ? 'border-red-500' : ''}
                      placeholder="Calle 123 #45-67, Apto 8B"
                    />
                    {errors.direccion_completa && (
                      <p className="text-sm text-red-500 mt-1">{errors.direccion_completa}</p>
                    )}
                  </div>

                  {/* Notas adicionales */}
                  <div>
                    <Label htmlFor="notas_adicionales">Notas Adicionales (Opcional)</Label>
                    <Textarea
                      id="notas_adicionales"
                      value={formData.notas_adicionales}
                      onChange={(e) => setFormData({ ...formData, notas_adicionales: e.target.value })}
                      placeholder="Indicaciones especiales para la entrega..."
                      rows={3}
                    />
                  </div>

                  {/* Botón de pago */}
                  <Button
                    type="submit"
                    disabled={loading || items.length === 0 || !epaycoReady || epaycoLoading}
                    className="w-full h-14 text-lg font-bold bg-primary hover:bg-primary/90"
                    size="lg"
                  >
                    {loading ? (
                      'Procesando...'
                    ) : epaycoLoading ? (
                      'Cargando pasarela de pagos...'
                    ) : (
                      <>
                        Pagar con ePayco - ${totalPrice().toLocaleString('es-CO')}
                      </>
                    )}
                  </Button>

                  {epaycoError && (
                    <p className="text-red-500 text-sm text-center mt-2">
                      {epaycoError}
                    </p>
                  )}

                  {!epaycoReady && !epaycoError && (
                    <p className="text-xs text-gray-600 text-center mt-2">
                      Preparando pasarela de pagos segura...
                    </p>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Resumen del pedido */}
          <div>
            <Card className="border-none shadow-xl bg-card sticky top-24">
              <CardHeader>
                <CardTitle className="font-fraunces text-2xl flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  Resumen
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-start pb-4 border-b">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Cantidad: {item.quantity} × ${item.price.toLocaleString('es-CO')}
                      </p>
                    </div>
                    <p className="font-semibold">
                      ${(item.quantity * item.price).toLocaleString('es-CO')}
                    </p>
                  </div>
                ))}

                <div className="pt-4 space-y-2">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary text-2xl">
                      ${totalPrice().toLocaleString('es-CO')}
                    </span>
                  </div>
                </div>

                <div className="pt-4 text-xs text-muted-foreground text-center">
                  <p>🔒 Pago seguro con ePayco</p>
                  <p className="mt-1">Aceptamos todas las tarjetas y medios de pago</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
