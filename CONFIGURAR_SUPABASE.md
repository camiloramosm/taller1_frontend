# 🔐 Configuración de Supabase - Proyecto vtvnafaqofqnxhulneoy

## ⚡ Paso 1: Crear archivo .env.local

Crea un archivo llamado `.env.local` en la raíz del proyecto con este contenido:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://vtvnafaqofqnxhulneoy.supabase.co
VITE_SUPABASE_ANON_KEY=tu_anon_key_aqui
```

## 🔑 Paso 2: Obtener tu Anon Key

1. Ve a tu proyecto en Supabase:
   👉 [https://supabase.com/dashboard/project/vtvnafaqofqnxhulneoy/settings/api](https://supabase.com/dashboard/project/vtvnafaqofqnxhulneoy/settings/api)

2. En la sección **Project API keys**, encontrarás:
   - **anon public** ← Esta es la key que necesitas

3. Copia el valor de **anon public** y pégalo en `.env.local` reemplazando `tu_anon_key_aqui`

## 📊 Paso 3: Ejecutar el Schema SQL

1. Ve al SQL Editor:
   👉 [https://supabase.com/dashboard/project/vtvnafaqofqnxhulneoy/sql](https://supabase.com/dashboard/project/vtvnafaqofqnxhulneoy/sql)

2. Abre el archivo `supabase-schema.sql` de este proyecto

3. Copia TODO su contenido

4. Pégalo en el SQL Editor de Supabase

5. Haz clic en **Run** (o presiona Ctrl+Enter)

6. Verifica que aparezcan las tablas:
   - `pedidos`
   - `mensajes_contacto`

## 🔄 Paso 4: Reiniciar el Servidor

Después de crear el archivo `.env.local`:

```bash
# Detener el servidor (Ctrl+C en la terminal)
# Luego reiniciar:
npm run dev
```

## ✅ Verificar la Conexión

Abre http://localhost:5173 y:
1. Agrega productos al carrito
2. Ve a checkout
3. Llena el formulario
4. Si no hay errores en la consola, ¡estás conectado! 🎉

## 🆘 Si tienes problemas

### Error: "Faltan las credenciales de Supabase"
- Verifica que el archivo `.env.local` existe en la raíz
- Verifica que las variables comiencen con `VITE_`
- Reinicia el servidor de desarrollo

### Error al crear pedido
- Asegúrate de haber ejecutado el schema SQL
- Verifica las políticas RLS en Supabase

### No puedo acceder al proyecto
- Verifica que tienes acceso al proyecto vtvnafaqofqnxhulneoy
- Asegúrate de estar logueado en Supabase

## 📝 Ejemplo de .env.local completo

```bash
VITE_SUPABASE_URL=https://vtvnafaqofqnxhulneoy.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0dm5hZmFxb2Zxbnhodwxudbweoy...
```

(La key es mucho más larga, este es solo un ejemplo)

---

**¿Listo?** Una vez configurado, ¡el sistema estará completamente funcional! 🚀

