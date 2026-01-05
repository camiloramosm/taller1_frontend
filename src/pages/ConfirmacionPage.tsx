import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';
import { formatearMoneda } from '../utils/validations';
import type { Pedido } from '../types/database';

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

export const ConfirmacionPage: React.FC = () => {
  const { pedidoId } = useParams<{ pedidoId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useLanguage();

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
          ref_payco: searchParams.get('ref_payco') || undefined,
          x_transaction_id: searchParams.get('x_transaction_id') || undefined,
          x_response: searchParams.get('x_response') || undefined,
          x_approval_code: searchParams.get('x_approval_code') || undefined,
          x_response_reason_text: searchParams.get('x_response_reason_text') || undefined,
          x_amount: searchParams.get('x_amount') || undefined,
          x_currency_code: searchParams.get('x_currency_code') || undefined,
        };
        setTransaccion(datosTransaccion);

        // Determinar estado del pago según respuesta de ePayco
        // x_response: 1 = Aprobada, 2 = Rechazada, 3 = Pendiente, 4 = Fallida
        const respuesta = searchParams.get('x_response');
        if (respuesta === '1' || respuesta === 'Aceptada') {
          setEstadoPago('aprobado');
          // Actualizar estado del pedido en la base de datos
          await supabase
            .from('pedidos')
            .update({ 
              estado_pago: 'aprobado',
              referencia_pago: datosTransaccion.ref_payco || datosTransaccion.x_transaction_id,
            })
            .eq('id', pedidoId);
        } else if (respuesta === '2' || respuesta === 'Rechazada') {
          setEstadoPago('rechazado');
          await supabase
            .from('pedidos')
            .update({ estado_pago: 'rechazado' })
            .eq('id', pedidoId);
        } else if (respuesta === '3' || respuesta === 'Pendiente') {
          setEstadoPago('pendiente');
          await supabase
            .from('pedidos')
            .update({ estado_pago: 'pendiente' })
            .eq('id', pedidoId);
        } else if (!respuesta) {
          // Si no hay parámetros de ePayco, el pago está pendiente
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
      <div className="min-h-screen bg-gradient-to-b from-[#2D5016] to-[#1a2f0d] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-[#FFD700]"></div>
          <p className="mt-4 text-white text-lg">Cargando información del pedido...</p>
        </div>
      </div>
    );
  }

  if (error || !pedido) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#2D5016] to-[#1a2f0d] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error</h1>
          <p className="text-gray-600 mb-6">{error || 'Pedido no encontrado'}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-[#2D5016] text-white px-6 py-3 rounded-lg hover:bg-[#3a6b1d] transition-colors"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  const iconoEstado = {
    aprobado: (
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
        <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
    ),
    rechazado: (
      <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
    ),
    pendiente: (
      <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    ),
    procesando: (
      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    ),
    error: (
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
    ),
  };

  const mensajes = {
    aprobado: {
      titulo: t.cart?.success || '¡Pago Aprobado!',
      descripcion: 'Tu pago ha sido procesado exitosamente. Recibirás un correo con los detalles de tu pedido.',
      color: 'green',
    },
    rechazado: {
      titulo: 'Pago Rechazado',
      descripcion: 'Tu pago no pudo ser procesado. Por favor, intenta nuevamente con otro método de pago.',
      color: 'red',
    },
    pendiente: {
      titulo: 'Pago Pendiente',
      descripcion: 'Tu pago está siendo procesado. Te notificaremos por correo cuando se confirme.',
      color: 'yellow',
    },
    procesando: {
      titulo: 'Procesando...',
      descripcion: 'Estamos verificando tu pago.',
      color: 'blue',
    },
    error: {
      titulo: 'Error en la Transacción',
      descripcion: 'Hubo un problema al procesar tu pago. Por favor, contacta con soporte.',
      color: 'gray',
    },
  };

  const mensaje = mensajes[estadoPago];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2D5016] to-[#1a2f0d] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Card principal */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header con estado */}
          <div className={`bg-gradient-to-r from-${mensaje.color}-500 to-${mensaje.color}-600 p-6`}>
            <h1 className="text-white text-center text-2xl font-bold">
              EL CAMPO DE DON RAMÓN
            </h1>
          </div>

          {/* Contenido */}
          <div className="p-8">
            {iconoEstado[estadoPago]}
            
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-2">
              {mensaje.titulo}
            </h2>
            <p className="text-gray-600 text-center mb-8">
              {mensaje.descripcion}
            </p>

            {/* Detalles del pedido */}
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Detalles del Pedido</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Número de Pedido:</span>
                  <span className="font-semibold text-gray-900">#{pedido.id.substring(0, 8).toUpperCase()}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Fecha:</span>
                  <span className="font-semibold text-gray-900">
                    {new Date(pedido.created_at).toLocaleDateString('es-CO', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Total:</span>
                  <span className="font-bold text-xl text-[#2D5016]">
                    {formatearMoneda(pedido.total)}
                  </span>
                </div>

                {transaccion.ref_payco && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Referencia ePayco:</span>
                    <span className="font-mono text-sm text-gray-900">{transaccion.ref_payco}</span>
                  </div>
                )}

                {transaccion.x_transaction_id && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">ID Transacción:</span>
                    <span className="font-mono text-sm text-gray-900">{transaccion.x_transaction_id}</span>
                  </div>
                )}

                {transaccion.x_approval_code && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Código de Aprobación:</span>
                    <span className="font-mono text-sm text-gray-900">{transaccion.x_approval_code}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Información de contacto */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h4 className="font-semibold text-blue-900 mb-1">¿Necesitas ayuda?</h4>
                  <p className="text-sm text-blue-700">
                    Si tienes alguna pregunta sobre tu pedido, contáctanos:<br />
                    📧 Email: {pedido.correo_electronico}<br />
                    📱 WhatsApp: +57 {pedido.telefono}
                  </p>
                </div>
              </div>
            </div>

            {/* Información de envío */}
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Información de Envío</h3>
              <div className="space-y-2 text-gray-700">
                <p><strong>Departamento:</strong> {pedido.departamento}</p>
                <p><strong>Ciudad:</strong> {pedido.ciudad}</p>
                <p><strong>Dirección:</strong> {pedido.direccion_completa}</p>
                {pedido.notas_adicionales && (
                  <p><strong>Notas:</strong> {pedido.notas_adicionales}</p>
                )}
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate('/')}
                className="flex-1 bg-[#2D5016] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#3a6b1d] transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Volver al Inicio
              </button>

              {estadoPago === 'rechazado' && (
                <button
                  onClick={() => navigate('/checkout')}
                  className="flex-1 bg-[#FFD700] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#FDB913] transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Reintentar Pago
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-white text-sm">
          <p>Gracias por tu compra en EL CAMPO DE DON RAMÓN</p>
          <p className="mt-2">🌿 Café orgánico cultivado a 1800-2000 msnm 🌿</p>
        </div>
      </div>
    </div>
  );
};

