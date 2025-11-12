# 👋 Bienvenido al Sistema de E-Commerce

¡Gracias por visitar este repositorio! Este es un sistema completo de e-commerce desarrollado con React, TypeScript y Supabase.

## 🚀 Inicio Rápido (< 10 minutos)

### 1️⃣ Clonar el Repositorio

```bash
git clone https://github.com/camiloramosm/taller1_frontend.git
cd taller1_frontend
```

### 2️⃣ Instalar Dependencias

```bash
npm install
```

### 3️⃣ Configurar Supabase

1. Crea una cuenta gratuita en [Supabase](https://supabase.com)
2. Crea un nuevo proyecto
3. Ve a **SQL Editor** y ejecuta el contenido de `supabase-schema.sql`
4. Ve a **Settings > API** y copia tus credenciales

### 4️⃣ Configurar Variables de Entorno

Crea un archivo `.env.local` en la raíz:

```bash
VITE_SUPABASE_URL=tu_supabase_url_aqui
VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key_aqui
```

### 5️⃣ Iniciar el Proyecto

```bash
npm run dev
```

¡Abre [http://localhost:5173](http://localhost:5173) en tu navegador!

## 📚 Documentación Completa

- **[INICIO_RAPIDO.md](./INICIO_RAPIDO.md)** - Guía detallada de inicio (10 min)
- **[README.md](./README.md)** - Documentación técnica completa
- **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)** - Configuración de base de datos
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Guía de deployment
- **[PROYECTO_COMPLETADO.md](./PROYECTO_COMPLETADO.md)** - Resumen del proyecto

## ✨ Características Principales

- 🛒 **Carrito de Compras** con persistencia en localStorage
- 📦 **Sistema de Pedidos** completo con validaciones
- 📧 **Formulario de Contacto** con rate limiting
- 👨‍💼 **Panel de Administración** para gestionar pedidos y mensajes
- 🇨🇴 **33 Departamentos de Colombia** con ciudades
- 📱 **Responsive Design** (mobile-first)
- 🔒 **Validaciones Exhaustivas** (teléfono colombiano, email, etc.)
- 🧪 **Pruebas Unitarias** con Vitest
- ♿ **Accesibilidad** con ARIA labels

## 🛠️ Stack Tecnológico

- **React 18.3** + **TypeScript 5.5**
- **Supabase** (PostgreSQL)
- **Zustand** (estado global)
- **Zod** (validaciones)
- **React Router DOM**
- **Tailwind CSS 3.4**
- **Vitest** (testing)

## 📜 Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run test         # Ejecutar tests
npm run test:ui      # Tests con interfaz visual
npm run lint         # Linting
```

## 🎯 Páginas Disponibles

- `/` - Página principal con productos
- `/contacto` - Formulario de contacto
- `/checkout` - Checkout de pedido
- `/confirmacion/:id` - Confirmación de pedido
- `/admin/pedidos` - Gestión de pedidos
- `/admin/mensajes` - Gestión de mensajes

## 🔐 Seguridad

- ✅ Row Level Security (RLS) en Supabase
- ✅ Validaciones con Zod
- ✅ Rate limiting contra spam
- ✅ Variables de entorno seguras

## 🐛 Problemas Comunes

### "Faltan las credenciales de Supabase"
➡️ Verifica que el archivo `.env.local` existe y tiene las variables correctas

### Error al crear pedido
➡️ Asegúrate de ejecutar el schema SQL en Supabase

### El carrito no persiste
➡️ Verifica que localStorage esté habilitado en tu navegador

## 🤝 Contribuir

¡Las contribuciones son bienvenidas!

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Soporte

Si tienes alguna pregunta o problema:

1. Revisa la [documentación completa](./README.md)
2. Consulta [INICIO_RAPIDO.md](./INICIO_RAPIDO.md)
3. Abre un issue en GitHub

## 📊 Estadísticas del Proyecto

- **Archivos**: 59
- **Líneas de código**: 19,000+
- **Componentes**: 15+
- **Tests**: 5 archivos
- **Documentación**: 5 archivos

## 🌟 Demo

Para ver una demo del proyecto:

```bash
npm run dev
```

Luego:
1. Agrega productos al carrito
2. Ve al checkout
3. Llena el formulario con datos de prueba:
   - Email: `test@example.com`
   - Teléfono: `+573001234567`
   - Departamento: `Antioquia`
   - Ciudad: `Medellín`

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 👨‍💻 Autor

**Camilo Ramos**
- GitHub: [@camiloramosm](https://github.com/camiloramosm)

---

## 🚀 ¡Empieza Ahora!

```bash
# Clona el repo
git clone https://github.com/camiloramosm/taller1_frontend.git

# Instala dependencias
cd taller1_frontend
npm install

# Configura .env.local
# (Ver paso 4 arriba)

# ¡Inicia el servidor!
npm run dev
```

**¿Necesitas ayuda más detallada?** 👉 [INICIO_RAPIDO.md](./INICIO_RAPIDO.md)

---

⭐ Si este proyecto te fue útil, ¡no olvides darle una estrella!

