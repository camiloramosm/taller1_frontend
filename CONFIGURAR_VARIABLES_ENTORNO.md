# 🔧 Configuración de Variables de Entorno

## 📋 Variables Requeridas

Para que la aplicación funcione correctamente, necesitas configurar las siguientes variables de entorno:

### 1. Crear archivo `.env.local`

Crea un archivo llamado `.env.local` en la raíz del proyecto con el siguiente contenido:

```env
# Supabase
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase

# ePayco
VITE_EPAYCO_PUBLIC_KEY=68d10a49ae848d5772c2e05844c8b37c
VITE_EPAYCO_TEST_MODE=true
```

### 2. Obtener Credenciales

#### Supabase
1. Ve a tu proyecto en [Supabase](https://supabase.com)
2. Ve a Settings → API
3. Copia la `URL` y la `anon/public key`

#### ePayco
Usa las credenciales proporcionadas:
- **PUBLIC_KEY**: `68d10a49ae848d5772c2e05844c8b37c`
- **Test Mode**: `true` (para pruebas) / `false` (para producción)

### 3. Reiniciar el Servidor

Después de crear o modificar el archivo `.env.local`, **DEBES REINICIAR** el servidor de desarrollo:

```bash
# Detener el servidor (Ctrl+C)
# Luego reiniciar:
pnpm dev
```

## ⚠️ Importante

- El archivo `.env.local` **NO debe** ser incluido en Git (ya está en `.gitignore`)
- Las variables deben empezar con `VITE_` para estar disponibles en el frontend
- Después de cambiar variables de entorno, siempre reinicia el servidor

## 🧪 Verificar Configuración

Para verificar que las variables están correctamente configuradas:

1. Abre la consola del navegador (F12)
2. Al cargar la página de checkout, deberías ver:
   - `✅ ePayco ya está cargado` o
   - `📥 Cargando script de ePayco...` seguido de
   - `✅ Script de ePayco cargado exitosamente`

Si ves errores, revisa:
1. Que el archivo `.env.local` exista en la raíz del proyecto
2. Que las variables empiecen con `VITE_`
3. Que hayas reiniciado el servidor después de crear/modificar el archivo

