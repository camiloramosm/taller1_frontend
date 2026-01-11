'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Clock, AlertTriangle, Home, RotateCcw, Mail, Phone, MapPin, Package } from 'lucide-react';
import Link from 'next/link';
import type { Pedido } from '@/types/database';
import { motion } from 'framer-motion';

type EstadoPago = 'procesando' | 'aprobado' | 'rechazado' | 'pendiente' | 'error';

interface TransaccionEpayco {
  ref_payco?: string;
  x_transaction_id?: string;
  x_response?: string;
  x_approval_code?: string;
  x_response_reason_text?: string;
  x_amount?: string;
  x_currency_code?: string;
}

export default function ConfirmacionPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pedidoId = params?.pedidoId as string;

  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [estadoPago, setEstadoPago] = useState<EstadoPago>('procesando');
  const [transaccion, setTransaccion] = useState<TransaccionEpayco>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarDatosPedido = async () => {
      if (!pedidoId) {
        setError('ID de pedido no válido');
        setLoading(false);
        return;
      }

      try {
        // Obtener datos del pedido
        const { data: pedidoData, error: pedidoError } = await supabase
          .from('pedidos')
          .select('*')
          .eq('id', pedidoId)
          .single();

        if (pedidoError) throw pedidoError;
        setPedido(pedidoData);

        // Procesar parámetros de respuesta de ePayco
        const datosTransaccion: TransaccionEpayco = {
          ref_payco: searchParams?.get('ref_payco') || undefined,
          x_transaction_id: searchParams?.get('x_transaction_id') || undefined,
          x_response: searchParams?.get('x_response') || undefined,
          x_approval_code: searchParams?.get('x_approval_code') || undefined,
          x_response_reason_text: searchParams?.get('x_response_reason_text') || undefined,
          x_amount: searchParams?.get('x_amount') || undefined,
          x_currency_code: searchParams?.get('x_currency_code') || undefined,
        };
        setTransaccion(datosTransaccion);

        // Determinar estado del pago según respuesta de ePayco
        const respuesta = searchParams?.get('x_response');
        if (respuesta === '1' || respuesta === 'Aceptada') {
          setEstadoPago('aprobado');
          // @ts-expect-error - Campos estado_pago y referencia_pago agregados en migración
          await supabase
            .from('pedidos')
            .update({ 
              estado_pago: 'aprobado',
              referencia_pago: datosTransaccion.ref_payco || datosTransaccion.x_transaction_id,
            })
            .eq('id', pedidoId);
        } else if (respuesta === '2' || respuesta === 'Rechazada') {
          setEstadoPago('rechazado');
          // @ts-expect-error - Campo estado_pago agregado en migración
          await supabase
            .from('pedidos')
            .update({ estado_pago: 'rechazado' })
            .eq('id', pedidoId);
        } else if (respuesta === '3' || respuesta === 'Pendiente') {
          setEstadoPago('pendiente');
          // @ts-expect-error - Campo estado_pago agregado en migración
          await supabase
            .from('pedidos')
            .update({ estado_pago: 'pendiente' })
            .eq('id', pedidoId);
        } else if (!respuesta) {
          setEstadoPago('pendiente');
        } else {
          setEstadoPago('error');
        }
      } catch (err) {
        console.error('Error al cargar datos del pedido:', err);
        setError('No se pudo cargar la información del pedido');
        setEstadoPago('error');
      } finally {
        setLoading(false);
      }
    };

    cargarDatosPedido();
  }, [pedidoId, searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-muted-foreground text-lg">Cargando información del pedido...</p>
        </div>
      </div>
    );
  }

  if (error || !pedido) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full"
        >
          <Card className="border-none shadow-2xl">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
              <h1 className="text-2xl font-fraunces font-bold mb-2">Error</h1>
              <p className="text-muted-foreground mb-6">{error || 'Pedido no encontrado'}</p>
              <Button asChild className="w-full">
                <Link href="/">
                  <Home className="w-4 h-4 mr-2" />
                  Volver al inicio
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  const iconosEstado = {
    aprobado: <CheckCircle2 className="w-16 h-16 text-green-600" />,
    rechazado: <XCircle className="w-16 h-16 text-red-600" />,
    pendiente: <Clock className="w-16 h-16 text-yellow-600" />,
    procesando: <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent" />,
    error: <AlertTriangle className="w-16 h-16 text-gray-600" />,
  };

  const mensajes = {
    aprobado: {
      titulo: '¡Pago Aprobado!',
      descripcion: 'Tu pago ha sido procesado exitosamente. Recibirás un correo con los detalles de tu pedido.',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    },
    rechazado: {
      titulo: 'Pago Rechazado',
      descripcion: 'Tu pago no pudo ser procesado. Por favor, intenta nuevamente con otro método de pago.',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
    },
    pendiente: {
      titulo: 'Pago Pendiente',
      descripcion: 'Tu pago está siendo procesado. Te notificaremos por correo cuando se confirme.',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
    },
    procesando: {
      titulo: 'Procesando...',
      descripcion: 'Estamos verificando tu pago.',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
    error: {
      titulo: 'Error en la Transacción',
      descripcion: 'Hubo un problema al procesar tu pago. Por favor, contacta con soporte.',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
    },
  };

  const mensaje = mensajes[estadoPago];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-none shadow-2xl overflow-hidden">
            {/* Header */}
            <CardHeader className="bg-primary text-primary-foreground p-6">
              <CardTitle className="text-center text-2xl font-fraunces">
                EL CAMPO DE DON RAMÓN
              </CardTitle>
            </CardHeader>

            {/* Contenido */}
            <CardContent className="p-8">
              {/* Icono de estado */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="flex justify-center mb-6"
              >
                <div className={`p-4 rounded-full ${mensaje.bgColor}`}>
                  {iconosEstado[estadoPago]}
                </div>
              </motion.div>

              {/* Título y descripción */}
              <h2 className="text-3xl font-fraunces font-bold text-center mb-2">
                {mensaje.titulo}
              </h2>
              <p className="text-muted-foreground text-center mb-8">
                {mensaje.descripcion}
              </p>

              {/* Detalles del pedido */}
              <Card className={`mb-6 ${mensaje.bgColor} border ${mensaje.borderColor}`}>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Detalles del Pedido
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Número de Pedido:</span>
                      <span className="font-mono font-semibold">#{pedido.id.substring(0, 8).toUpperCase()}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Fecha:</span>
                      <span className="font-semibold">
                        {new Date(pedido.created_at).toLocaleDateString('es-CO', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="text-muted-foreground font-semibold">Total:</span>
                      <span className="font-bold text-2xl text-primary">
                        ${pedido.total.toLocaleString('es-CO')}
                      </span>
                    </div>

                    {transaccion.ref_payco && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Ref. ePayco:</span>
                        <span className="font-mono">{transaccion.ref_payco}</span>
                      </div>
                    )}

                    {transaccion.x_transaction_id && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">ID Transacción:</span>
                        <span className="font-mono">{transaccion.x_transaction_id}</span>
                      </div>
                    )}

                    {transaccion.x_approval_code && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Código de Aprobación:</span>
                        <span className="font-mono">{transaccion.x_approval_code}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Información de envío */}
              <Card className="mb-6">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Información de Envío
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Departamento:</strong> {pedido.departamento}</p>
                    <p><strong>Ciudad:</strong> {pedido.ciudad}</p>
                    <p><strong>Dirección:</strong> {pedido.direccion_completa}</p>
                    {pedido.notas_adicionales && (
                      <p><strong>Notas:</strong> {pedido.notas_adicionales}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Información de contacto */}
              <Card className="mb-6 bg-blue-50 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Mail className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-2">¿Necesitas ayuda?</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Si tienes alguna pregunta sobre tu pedido, contáctanos:
                      </p>
                      <div className="space-y-1 text-sm">
                        <p className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          contacto@elcampodedonramon.com
                        </p>
                        <p className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          +57 318 741 0586
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Botones de acción */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="flex-1" size="lg">
                  <Link href="/">
                    <Home className="w-5 h-5 mr-2" />
                    Volver al Inicio
                  </Link>
                </Button>

                {estadoPago === 'rechazado' && (
                  <Button asChild variant="outline" className="flex-1" size="lg">
                    <Link href="/checkout">
                      <RotateCcw className="w-5 h-5 mr-2" />
                      Reintentar Pago
                    </Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center mt-8 text-muted-foreground text-sm">
            <p className="font-semibold">Gracias por tu compra en EL CAMPO DE DON RAMÓN</p>
            <p className="mt-2">🌿 Café orgánico cultivado a 1800-2000 msnm 🌿</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
