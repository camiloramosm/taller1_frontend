# Configuración de Supabase para el Sistema E-Commerce

## Paso 1: Crear proyecto en Supabase

1. Ve a [https://supabase.com](https://supabase.com)
2. Crea una cuenta o inicia sesión
3. Crea un nuevo proyecto:
   - Nombre del proyecto: `ecommerce-el-campo`
   - Base de datos password: (guarda este password de forma segura)
   - Región: Selecciona la más cercana a Colombia (ej: South America - São Paulo)

## Paso 2: Ejecutar el Schema SQL

1. Una vez creado el proyecto, ve a **SQL Editor** en el panel lateral
2. Copia todo el contenido del archivo `supabase-schema.sql`
3. Pégalo en el editor SQL
4. Haz clic en "Run" para ejecutar el script
5. Verifica que las tablas se hayan creado correctamente en **Table Editor**

## Paso 3: Obtener las credenciales

1. Ve a **Settings** > **API**
2. Copia las siguientes credenciales:
   - **Project URL**: Tu URL de Supabase (ej: https://xxxxx.supabase.co)
   - **anon public key**: La clave pública anónima

## Paso 4: Configurar variables de entorno

1. Crea un archivo `.env.local` en la raíz del proyecto
2. Agrega las siguientes variables:

```bash
VITE_SUPABASE_URL=tu_project_url_aqui
VITE_SUPABASE_ANON_KEY=tu_anon_key_aqui
```

## Paso 5: Verificar las políticas RLS

1. Ve a **Authentication** > **Policies**
2. Verifica que las políticas de seguridad estén activas:
   - `pedidos`: Permitir inserción pública, lectura/actualización autenticada
   - `mensajes_contacto`: Permitir inserción pública, lectura/actualización autenticada

## Paso 6: (Opcional) Configurar autenticación para admin

Si deseas crear un panel de administración:

1. Ve a **Authentication** > **Providers**
2. Habilita "Email" como método de autenticación
3. Crea un usuario admin desde **Authentication** > **Users**

## Estructura de las tablas

### Tabla: pedidos
- `id`: UUID (auto-generado)
- `created_at`: Timestamp
- `correo_electronico`: Email del cliente
- `telefono`: Teléfono colombiano (+57XXXXXXXXXX)
- `departamento`: Departamento de Colombia
- `ciudad`: Ciudad
- `direccion_completa`: Dirección completa
- `productos`: JSONB con array de productos
- `total`: Total del pedido
- `estado`: pendiente | procesando | enviado | entregado | cancelado
- `notas_adicionales`: Notas opcionales

### Tabla: mensajes_contacto
- `id`: UUID (auto-generado)
- `created_at`: Timestamp
- `nombre_completo`: Nombre del cliente
- `correo_electronico`: Email del cliente
- `telefono`: Teléfono (opcional)
- `asunto`: Asunto del mensaje
- `mensaje`: Contenido del mensaje
- `leido`: Boolean (default: false)

## Notas importantes

- Las políticas RLS están configuradas para permitir inserciones públicas pero solo lecturas/actualizaciones autenticadas
- Los triggers validan automáticamente la estructura de productos en pedidos
- Los índices están optimizados para consultas frecuentes

## Siguientes pasos

Una vez completada la configuración de Supabase:
1. Verifica la conexión desde la aplicación React
2. Prueba crear un pedido de prueba
3. Prueba enviar un mensaje de contacto
4. Verifica que los datos se almacenen correctamente en Supabase

