# 🚀 Guía de Inicio Rápido

Esta guía te ayudará a tener el sistema funcionando en menos de 10 minutos.

## ⚡ Pasos Rápidos

### 1. Instalar Dependencias (2 minutos)

```bash
npm install
```

### 2. Configurar Supabase (5 minutos)

#### A. Crear proyecto en Supabase
1. Ve a [https://supabase.com](https://supabase.com)
2. Crea una cuenta o inicia sesión
3. Crea un nuevo proyecto
4. Espera a que se complete la configuración (2-3 minutos)

#### B. Ejecutar el schema SQL
1. Ve a **SQL Editor** en el panel lateral de Supabase
2. Copia todo el contenido del archivo `supabase-schema.sql`
3. Pégalo en el editor y haz clic en **Run**
4. Verifica que aparezcan las tablas `pedidos` y `mensajes_contacto` en **Table Editor**

#### C. Obtener credenciales
1. Ve a **Settings** > **API**
2. Copia:
   - **Project URL**
   - **anon public key**

### 3. Configurar Variables de Entorno (1 minuto)

Crea un archivo `.env.local` en la raíz del proyecto:

```bash
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-aqui
```

### 4. Iniciar la Aplicación (1 minuto)

```bash
npm run dev
```

Abre tu navegador en [http://localhost:5173](http://localhost:5173)

## ✅ Verificación

### Probar el Sistema de Pedidos

1. Ve a la página principal
2. Agrega productos al carrito
3. Haz clic en el ícono del carrito
4. Haz clic en "Proceder al Pago"
5. Llena el formulario:
   - Email: `test@example.com`
   - Teléfono: `+573001234567`
   - Departamento: `Antioquia`
   - Ciudad: `Medellín`
   - Dirección: `Calle 50 #45-30, Apartamento 501`
6. Haz clic en "Realizar Pedido"
7. Verás la página de confirmación

### Verificar en Supabase

1. Ve a Supabase > **Table Editor** > `pedidos`
2. Verás tu pedido de prueba

### Probar el Formulario de Contacto

1. Ve a `/contacto`
2. Llena el formulario
3. Envía el mensaje
4. Verifica en Supabase > **Table Editor** > `mensajes_contacto`

## 🎨 Páginas Disponibles

- `/` - Página principal con productos
- `/contacto` - Formulario de contacto
- `/checkout` - Formulario de pedido (requiere productos en carrito)
- `/confirmacion/:orderId` - Confirmación de pedido
- `/admin/pedidos` - Lista de pedidos (requiere autenticación en el futuro)
- `/admin/mensajes` - Lista de mensajes (requiere autenticación en el futuro)

## 🧪 Ejecutar Pruebas

```bash
# Pruebas en modo watch
npm run test

# Pruebas con interfaz visual
npm run test:ui

# Cobertura de código
npm run test:coverage
```

## 🔧 Comandos Útiles

```bash
# Ver logs de desarrollo
npm run dev -- --debug

# Build de producción
npm run build

# Vista previa del build
npm run preview

# Linting
npm run lint
```

## 🐛 Problemas Comunes

### Error: "Faltan las credenciales de Supabase"
- ✅ Verifica que el archivo `.env.local` exista
- ✅ Verifica que las variables comiencen con `VITE_`
- ✅ Reinicia el servidor de desarrollo

### Error al crear pedido
- ✅ Verifica que ejecutaste el schema SQL en Supabase
- ✅ Verifica las políticas RLS en Supabase
- ✅ Revisa la consola del navegador para más detalles

### El carrito no persiste
- ✅ Asegúrate de que localStorage esté habilitado en tu navegador
- ✅ Limpia la caché del navegador

### Rate limiting
- Si recibes un error de "límite alcanzado":
  - ✅ Espera el tiempo indicado
  - ✅ O limpia localStorage: `localStorage.clear()`

## 📱 Probar en Móvil

1. Encuentra tu IP local:
   ```bash
   # Windows
   ipconfig
   
   # Mac/Linux
   ifconfig
   ```

2. Accede desde tu móvil:
   ```
   http://tu-ip-local:5173
   ```

## 🎯 Próximos Pasos

1. ✅ Personaliza los productos en `src/pages/HomePage.tsx`
2. ✅ Configura autenticación para el panel de admin
3. ✅ Personaliza los estilos en los componentes
4. ✅ Agrega más productos
5. ✅ Configura email notifications (opcional)

## 📚 Más Información

- [README.md](./README.md) - Documentación completa
- [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) - Guía detallada de Supabase

## 💡 Consejos

- **Desarrollo**: Los cambios se reflejan automáticamente (hot reload)
- **Testing**: Ejecuta las pruebas mientras desarrollas
- **TypeScript**: Los errores de tipo se muestran en el editor
- **Tailwind**: Usa las clases de Tailwind para estilos rápidos

## 🆘 ¿Necesitas Ayuda?

1. Revisa los logs en la terminal
2. Revisa la consola del navegador (F12)
3. Verifica la pestaña Network para errores de API
4. Consulta la documentación de Supabase
5. Revisa los archivos de ejemplo en `src/`

---

**¡Listo!** Ya tienes el sistema completo funcionando. 🎉

Para más detalles técnicos, consulta el [README.md](./README.md) completo.

