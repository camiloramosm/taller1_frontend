import React, { useEffect, useState, useCallback } from 'react';
import { useContactMessages } from '../../hooks/useContactMessages';
import { formatearFecha, formatearTelefono } from '../../utils/validations';
import { Mail, MailOpen, Search, Filter } from 'lucide-react';

/**
 * Componente para listar y administrar mensajes de contacto (Admin)
 * Requiere autenticación
 */
export const MessageList: React.FC = () => {
  const { messages, getMessages, markAsRead, loading } = useContactMessages();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLeido, setFilterLeido] = useState<'all' | 'leido' | 'no_leido'>('all');
  const [expandedMessageId, setExpandedMessageId] = useState<string | null>(null);

  const loadMessages = useCallback(async () => {
    const filters =
      filterLeido === 'all'
        ? {}
        : { leido: filterLeido === 'leido' };

    await getMessages({
      ...filters,
      limit: 100,
    });
  }, [filterLeido, getMessages]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const handleMarkAsRead = async (messageId: string) => {
    await markAsRead(messageId);
  };

  const toggleMessageDetails = (messageId: string) => {
    setExpandedMessageId(expandedMessageId === messageId ? null : messageId);
  };

  const filteredMessages = messages.filter((message) => {
    const matchesSearch =
      message.nombre_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.correo_electronico.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.asunto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.mensaje.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const unreadCount = messages.filter((m) => !m.leido).length;

  if (loading && messages.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando mensajes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Mensajes de Contacto
        </h1>
        <p className="text-gray-600">
          Administra y responde a los mensajes de los usuarios
        </p>
      </div>

      {/* Filtros y Búsqueda */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid md:grid-cols-2 gap-4">
          {/* Búsqueda */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por nombre, email, asunto o mensaje..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Filtro de Estado */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={filterLeido}
              onChange={(e) => setFilterLeido(e.target.value as 'all' | 'leido' | 'no_leido')}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none"
            >
              <option value="all">Todos los mensajes</option>
              <option value="no_leido">No leídos</option>
              <option value="leido">Leídos</option>
            </select>
          </div>
        </div>
      </div>

      {/* Estadísticas Rápidas */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{messages.length}</p>
          <p className="text-sm text-gray-600">Total</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{unreadCount}</p>
          <p className="text-sm text-gray-600">No leídos</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <p className="text-2xl font-bold text-green-600">
            {messages.length - unreadCount}
          </p>
          <p className="text-sm text-gray-600">Leídos</p>
        </div>
      </div>

      {/* Lista de Mensajes */}
      <div className="space-y-4">
        {filteredMessages.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Mail className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No hay mensajes
            </h3>
            <p className="text-gray-600">
              {searchTerm || filterLeido !== 'all'
                ? 'No se encontraron mensajes con los filtros aplicados'
                : 'Aún no hay mensajes de contacto'}
            </p>
          </div>
        ) : (
          filteredMessages.map((message) => (
            <div
              key={message.id}
              className={`bg-white rounded-lg shadow-md transition-all ${
                !message.leido ? 'border-l-4 border-blue-500' : ''
              }`}
            >
              {/* Encabezado del Mensaje */}
              <div
                className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleMessageDetails(message.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    {/* Icono de leído/no leído */}
                    <div className="pt-1">
                      {message.leido ? (
                        <MailOpen className="w-5 h-5 text-gray-400" />
                      ) : (
                        <Mail className="w-5 h-5 text-blue-500" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-gray-900">
                          {message.nombre_completo}
                        </h3>
                        {!message.leido && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">
                            Nuevo
                          </span>
                        )}
                      </div>

                      <p className="text-sm font-medium text-gray-700 mb-1">
                        {message.asunto}
                      </p>

                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600">
                        <span>✉️ {message.correo_electronico}</span>
                        {message.telefono && (
                          <span>📞 {formatearTelefono(message.telefono)}</span>
                        )}
                        <span>📅 {formatearFecha(message.created_at)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detalles Expandidos */}
              {expandedMessageId === message.id && (
                <div className="border-t px-6 py-4 bg-gray-50">
                  {/* Mensaje Completo */}
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Mensaje</h4>
                    <div className="bg-white p-4 rounded border border-gray-200">
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {message.mensaje}
                      </p>
                    </div>
                  </div>

                  {/* Información de Contacto Completa */}
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Información de Contacto
                    </h4>
                    <div className="grid sm:grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-600">Nombre:</span>{' '}
                        <span className="text-gray-900">
                          {message.nombre_completo}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Email:</span>{' '}
                        <a
                          href={`mailto:${message.correo_electronico}`}
                          className="text-blue-600 hover:underline"
                        >
                          {message.correo_electronico}
                        </a>
                      </div>
                      {message.telefono && (
                        <div>
                          <span className="text-gray-600">Teléfono:</span>{' '}
                          <a
                            href={`tel:${message.telefono}`}
                            className="text-blue-600 hover:underline"
                          >
                            {formatearTelefono(message.telefono)}
                          </a>
                        </div>
                      )}
                      <div>
                        <span className="text-gray-600">Fecha:</span>{' '}
                        <span className="text-gray-900">
                          {formatearFecha(message.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="flex flex-wrap gap-3">
                    {!message.leido && (
                      <button
                        onClick={() => handleMarkAsRead(message.id)}
                        disabled={loading}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                      >
                        Marcar como Leído
                      </button>
                    )}
                    <a
                      href={`mailto:${message.correo_electronico}?subject=Re: ${message.asunto}`}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      Responder por Email
                    </a>
                    {message.telefono && (
                      <a
                        href={`https://wa.me/${message.telefono.replace(/\+/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
                      >
                        WhatsApp
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

