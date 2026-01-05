import React from 'react';

/**
 * Página de diagnóstico para verificar configuración
 * Ruta: /diagnostico
 */
export const DiagnosticoPage: React.FC = () => {
  const variables = {
    VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
    VITE_EPAYCO_PUBLIC_KEY: import.meta.env.VITE_EPAYCO_PUBLIC_KEY,
    VITE_EPAYCO_TEST_MODE: import.meta.env.VITE_EPAYCO_TEST_MODE,
  };

  const todasConfigurables = Object.keys(import.meta.env)
    .filter(k => k.startsWith('VITE_'))
    .sort();

  const checkVariable = (value: string | undefined) => {
    if (!value) return { icon: '❌', status: 'No configurada', color: 'red' };
    if (value === 'undefined') return { icon: '⚠️', status: 'String "undefined"', color: 'yellow' };
    return { icon: '✅', status: 'Configurada', color: 'green' };
  };

  const maskValue = (value: string | undefined, prefix = 10) => {
    if (!value) return 'N/A';
    if (value.length <= prefix) return value;
    return `${value.substring(0, prefix)}...${value.substring(value.length - 4)}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🔍 Diagnóstico de Configuración
          </h1>
          <p className="text-gray-600">
            Verifica que todas las variables de entorno estén correctamente configuradas
          </p>
        </div>

        {/* Variables Requeridas */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Variables Requeridas
          </h2>
          
          <div className="space-y-4">
            {Object.entries(variables).map(([key, value]) => {
              const check = checkVariable(value);
              return (
                <div key={key} className="border-l-4 border-gray-200 pl-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl">{check.icon}</span>
                        <code className="text-sm font-mono font-semibold text-gray-900">
                          {key}
                        </code>
                      </div>
                      <p className={`text-sm text-${check.color}-600 mb-1`}>
                        {check.status}
                      </p>
                      {value && (
                        <p className="text-xs font-mono text-gray-500 bg-gray-50 p-2 rounded">
                          {maskValue(value)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Todas las Variables VITE_ */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Todas las Variables VITE_* Disponibles
          </h2>
          
          {todasConfigurables.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-red-600 font-semibold mb-2">
                ⚠️ No se encontraron variables de entorno con prefijo VITE_
              </p>
              <p className="text-sm text-gray-600">
                Esto indica que las variables no están configuradas o no se reinició el servidor después de configurarlas.
              </p>
            </div>
          ) : (
            <div className="bg-gray-50 rounded p-4">
              <ul className="space-y-1">
                {todasConfigurables.map((key) => (
                  <li key={key} className="text-sm font-mono text-gray-700">
                    • {key}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Instrucciones */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            📝 Cómo Solucionar Problemas
          </h3>
          
          <div className="space-y-3 text-sm text-blue-800">
            <div>
              <strong>Si estás en desarrollo local:</strong>
              <ol className="list-decimal ml-5 mt-1 space-y-1">
                <li>Crea un archivo <code className="bg-blue-100 px-1 rounded">.env.local</code> en la raíz del proyecto</li>
                <li>Agrega las variables de entorno (ver CONFIGURAR_VERCEL.md)</li>
                <li><strong>Reinicia el servidor</strong> (detén y vuelve a ejecutar <code className="bg-blue-100 px-1 rounded">pnpm dev</code>)</li>
                <li>Recarga esta página</li>
              </ol>
            </div>

            <div>
              <strong>Si estás en Vercel:</strong>
              <ol className="list-decimal ml-5 mt-1 space-y-1">
                <li>Ve a Settings → Environment Variables en Vercel</li>
                <li>Agrega las 4 variables requeridas</li>
                <li>Selecciona Production, Preview y Development</li>
                <li><strong>Haz Redeploy</strong> del proyecto</li>
                <li>Espera 1-2 minutos y recarga esta página</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Botón para volver */}
        <div className="mt-6 text-center">
          <a
            href="/"
            className="inline-block bg-[#2D5016] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#3a6b1d] transition-colors"
          >
            ← Volver al Inicio
          </a>
        </div>
      </div>
    </div>
  );
};

