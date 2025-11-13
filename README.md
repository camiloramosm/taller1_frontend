# 🛒 Sistema de E-Commerce con Supabase - React + TypeScript

Sistema completo de e-commerce desarrollado en React con TypeScript, integrado con Supabase para la gestión de pedidos y mensajes de contacto. Incluye validaciones exhaustivas, rate limiting, y soporte completo para Colombia (departamentos y ciudades).

![React](https://img.shields.io/badge/React-18.3-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8)
![Vitest](https://img.shields.io/badge/Vitest-Testing-yellow)
![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-green)

## ✨ Características Principales

### 🛍️ Sistema de Pedidos
- ✅ Carrito de compras con persistencia en localStorage (Zustand)
- ✅ Formulario de checkout con validaciones en tiempo real
- ✅ Selector dinámico de departamentos y ciudades de Colombia (33 departamentos)
- ✅ Validación de teléfono colombiano (+57 con operadores válidos)
- ✅ Cálculo automático de totales
- ✅ Confirmación de pedido con resumen completo
- ✅ Rate limiting para prevenir spam (3 pedidos por hora)

### 📧 Sistema de Contacto
- ✅ Formulario de contacto con validaciones
- ✅ Rate limiting (5 mensajes por hora)
- ✅ Mensajes de éxito/error con toast notifications
- ✅ Limpieza automática del formulario tras envío exitoso

### 👨‍💼 Panel de Administración
- ✅ Lista de pedidos con filtros y búsqueda
- ✅ Actualización de estado de pedidos (pendiente → procesando → enviado → entregado)
- ✅ Lista de mensajes de contacto
- ✅ Marcar mensajes como leídos
- ✅ Estadísticas en tiempo real

### 🔐 Seguridad y Validaciones
- ✅ Validación de formularios con Zod
- ✅ Rate limiting básico contra spam
- ✅ Row Level Security (RLS) en Supabase
- ✅ Validación de teléfonos colombianos
- ✅ Validación de emails según RFC 5322

### 🎨 UX/UI
- ✅ Diseño responsive (mobile-first)
- ✅ Notificaciones toast con react-hot-toast
- ✅ Loading states en todos los formularios
- ✅ Mensajes de error descriptivos
- ✅ Accesibilidad con ARIA labels

## 📋 Tabla de Contenidos

- [Instalación](#-instalación)
- [Configuración](#️-configuración)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Scripts Disponibles](#-scripts-disponibles)
- [Base de Datos](#-base-de-datos)
- [Pruebas](#-pruebas)
- [Tecnologías](#-tecnologías)
- [Ejemplos de Uso](#-ejemplos-de-uso)

## 🚀 Instalación

### Prerrequisitos

- Node.js 18+ y npm
- Cuenta de Supabase (gratuita)

### Pasos

1. **Clonar el repositorio**
```bash
git clone <url-del-repo>
cd taller1
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar Supabase**

Sigue las instrucciones en [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) para:
- Crear un proyecto en Supabase
- Ejecutar el schema SQL
- Obtener las credenciales

4. **Configurar variables de entorno**

Crea un archivo `.env.local` en la raíz:
```bash
VITE_SUPABASE_URL=tu_supabase_url_aqui
VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key_aqui
```

5. **Iniciar el servidor de desarrollo**
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## ⚙️ Configuración

### Supabase

1. Ve a [https://supabase.com](https://supabase.com) y crea un proyecto
2. Ejecuta el contenido de `supabase-schema.sql` en el SQL Editor
3. Copia tus credenciales desde Settings > API
4. Pégalas en el archivo `.env.local`

Para más detalles, consulta [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

## 🚀 CI/CD y Calidad de Código

El proyecto cuenta con un pipeline de CI/CD completo que garantiza la calidad del código:

### Pipeline Automático
- ✅ **ESLint**: Verificación de estándares de código (máx. 10 warnings)
- ✅ **TypeScript**: Verificación de tipos (0 errores)
- ✅ **Tests Unitarios**: 34 tests automatizados
- ✅ **Build**: Verificación de compilación
- ✅ **Cobertura**: Mínimo 70% en líneas, funciones y branches

### Protección de Ramas
- 🔒 Pull Requests requeridos para merge a `main`
- 🔒 CI debe pasar antes de permitir el merge
- 🔒 Revisión de código recomendada

### Comandos de Validación

```bash
# Ejecutar todas las validaciones localmente
npm run validate

# Solo linting
npm run lint

# Solo verificación de tipos
npm run type-check

# Solo tests
npm test

# Ver cobertura
npm run test:coverage
```

### Documentación del CI/CD
- 📖 [Guía del Pipeline](.github/workflows/PIPELINE_README.md)
- 📖 [Protección de Ramas](.github/BRANCH_PROTECTION_GUIDE.md)
- 📖 [Documentación Completa](.github/README.md)

## 🚀 Deployment Automático en Vercel

El proyecto está integrado con **Vercel** y se despliega automáticamente:

### ⚡ Funcionamiento

- **Merge a `main`** → Deployment a producción (automático)
- **Pull Request** → Preview deployment (automático)
- **Framework detectado**: Vite
- **Tiempo**: ~2-3 minutos

### 🔧 Configuración en Vercel

Variables de entorno (Vercel Dashboard → Settings → Environment Variables):
```
VITE_SUPABASE_URL      = URL de tu proyecto Supabase
VITE_SUPABASE_ANON_KEY = Anon key de Supabase
```

### 📊 Flujo

```
PR → CI pasa → Merge a main → Vercel detecta → Build → Deploy → ✅ Producción
```

**No requiere configuración adicional en GitHub Actions** - Vercel maneja todo automáticamente.

## 📁 Estructura del Proyecto

```
taller1/
├── src/
│   ├── components/          # Componentes reutilizables
│   │   ├── admin/          # Componentes de administración
│   │   │   ├── OrderList.tsx
│   │   │   └── MessageList.tsx
│   │   ├── checkout/       # Componentes de checkout
│   │   │   ├── CheckoutForm.tsx
│   │   │   └── OrderConfirmation.tsx
│   │   ├── contact/        # Componentes de contacto
│   │   │   └── ContactForm.tsx
│   │   ├── Cart.tsx
│   │   ├── Header.tsx
│   │   ├── Hero.tsx
│   │   ├── ProductCard.tsx
│   │   ├── ProductGrid.tsx
│   │   └── SocialLinks.tsx
│   ├── data/               # Datos estáticos
│   │   └── colombia-departamentos.ts  # 33 departamentos con ciudades
│   ├── hooks/              # Hooks personalizados
│   │   ├── useColombiaDepartments.ts
│   │   ├── useContactMessages.ts
│   │   ├── useOrders.ts
│   │   └── index.ts
│   ├── lib/                # Configuración de librerías
│   │   └── supabase.ts    # Cliente de Supabase
│   ├── pages/              # Páginas de la aplicación
│   │   ├── AdminMessagesPage.tsx
│   │   ├── AdminOrdersPage.tsx
│   │   ├── CheckoutPage.tsx
│   │   ├── ContactPage.tsx
│   │   ├── HomePage.tsx
│   │   └── OrderConfirmationPage.tsx
│   ├── store/              # Estado global con Zustand
│   │   ├── cartStore.ts   # Store del carrito
│   │   └── toastStore.ts  # Utilidades para toasts
│   ├── tests/              # Pruebas unitarias
│   │   ├── hooks/
│   │   ├── store/
│   │   ├── utils/
│   │   └── setup.ts
│   ├── types/              # Tipos de TypeScript
│   │   ├── database.ts    # Tipos de Supabase
│   │   └── index.ts       # Tipos generales
│   ├── utils/              # Utilidades
│   │   ├── rate-limiter.ts
│   │   └── validations.ts
│   ├── App.tsx             # Componente principal con Router
│   ├── index.css           # Estilos globales
│   └── index.tsx           # Punto de entrada
├── supabase-schema.sql     # Schema de base de datos
├── SUPABASE_SETUP.md       # Guía de configuración
├── vitest.config.ts        # Configuración de Vitest
├── vite.config.ts          # Configuración de Vite
├── tailwind.config.js      # Configuración de Tailwind
├── tsconfig.json           # Configuración de TypeScript
└── package.json
```

## 📜 Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Inicia el servidor de desarrollo

# Build
npm run build            # Genera build de producción

# Tests
npm run test             # Ejecuta pruebas con Vitest
npm run test:ui          # Ejecuta pruebas con interfaz visual
npm run test:coverage    # Genera reporte de cobertura

# Linting
npm run lint             # Ejecuta ESLint

# Preview
npm run preview          # Vista previa del build de producción

# Deploy
npm run deploy           # Build y deploy a Firebase (opcional)
```

## 🗄️ Base de Datos

### Tablas

#### `pedidos` (orders)
```sql
- id: UUID (primary key)
- created_at: TIMESTAMP
- correo_electronico: TEXT
- telefono: TEXT (+57XXXXXXXXXX)
- departamento: TEXT
- ciudad: TEXT
- direccion_completa: TEXT
- productos: JSONB (array de productos)
- total: DECIMAL
- estado: TEXT (pendiente|procesando|enviado|entregado|cancelado)
- notas_adicionales: TEXT (opcional)
```

#### `mensajes_contacto` (contact_messages)
```sql
- id: UUID (primary key)
- created_at: TIMESTAMP
- nombre_completo: TEXT
- correo_electronico: TEXT
- telefono: TEXT (opcional)
- asunto: TEXT
- mensaje: TEXT
- leido: BOOLEAN
```

### Políticas de Seguridad (RLS)

- **Pedidos**: Inserción pública, lectura/actualización autenticada
- **Mensajes**: Inserción pública, lectura/actualización autenticada

## 🧪 Pruebas

El proyecto incluye pruebas unitarias para:

- ✅ Validaciones (teléfono, email, formularios)
- ✅ Rate limiter
- ✅ Hooks personalizados (useColombiaDepartments)
- ✅ Store de Zustand (cartStore)

### Ejecutar pruebas

```bash
# Ejecutar todas las pruebas
npm run test

# Ejecutar con interfaz visual
npm run test:ui

# Generar reporte de cobertura
npm run test:coverage
```

### Ejemplo de test

```typescript
it('debe validar un teléfono colombiano válido', () => {
  expect(validarTelefonoColombia('+573001234567')).toBe(true);
  expect(validarTelefonoColombia('+573101234567')).toBe(true);
});
```

## 🛠️ Tecnologías

### Core
- **React 18.3** - Librería UI
- **TypeScript 5.5** - Tipado estático
- **Vite 5.2** - Build tool ultrarrápido
- **Tailwind CSS 3.4** - Estilos utility-first

### Estado y Datos
- **Zustand** - Manejo de estado global (carrito)
- **Supabase** - Backend as a Service (PostgreSQL)
- **React Router DOM** - Enrutamiento

### Validaciones y Utilidades
- **Zod** - Validación de schemas
- **React Hot Toast** - Notificaciones toast
- **Lucide React** - Íconos

### Testing
- **Vitest** - Framework de testing
- **Testing Library** - Testing de componentes React
- **@testing-library/jest-dom** - Matchers personalizados

## 📝 Ejemplos de Uso

### Crear un pedido

```typescript
import { useOrders } from './hooks/useOrders';
import { useCartStore } from './store/cartStore';

function CheckoutForm() {
  const { createOrder, loading } = useOrders();
  const { items, getTotalPrice, clearCart } = useCartStore();

  const handleSubmit = async (formData) => {
    const response = await createOrder({
      correo_electronico: formData.email,
      telefono: formData.telefono,
      departamento: formData.departamento,
      ciudad: formData.ciudad,
      direccion_completa: formData.direccion,
      productos: items.map(item => ({
        id: item.id,
        nombre: item.name,
        cantidad: item.quantity,
        precio: item.price
      })),
      total: getTotalPrice()
    });

    if (response.success) {
      clearCart();
      // Redirigir a confirmación
    }
  };
}
```

### Validar un formulario

```typescript
import { schemaPedido, validarConSchema } from './utils/validations';

const result = validarConSchema(schemaPedido, formData);

if (result.success) {
  // Datos válidos
  console.log(result.data);
} else {
  // Mostrar errores
  console.log(result.errors);
}
```

### Usar el carrito

```typescript
import { useCartStore } from './store/cartStore';

function ProductCard({ product }) {
  const { addItem } = useCartStore();

  return (
    <button onClick={() => addItem(product)}>
      Agregar al Carrito
    </button>
  );
}
```

## 🎯 Características Destacadas

### Rate Limiting
```typescript
// Límite de 3 pedidos por hora
const rateLimitCheck = pedidosRateLimiter.canAttempt();
if (!rateLimitCheck.allowed) {
  showError(`Espera ${rateLimitCheck.retryAfter} segundos`);
  return;
}
```

### Validación de Teléfonos Colombianos
```typescript
// Valida formato +57 + operador válido (300-305, 310-321, 350-353) + 7 dígitos
validarTelefonoColombia('+573001234567'); // true
validarTelefonoColombia('+572001234567'); // false (operador inválido)
```

### Departamentos y Ciudades
```typescript
// 33 departamentos con todas sus ciudades principales
const { departamentos, ciudades, seleccionarDepartamento } = useColombiaDepartments();

seleccionarDepartamento('Antioquia');
// ciudades: ['Medellín', 'Bello', 'Itagüí', ...]
```

## 🔒 Seguridad

- ✅ Row Level Security (RLS) en Supabase
- ✅ Validaciones en cliente y servidor
- ✅ Rate limiting contra spam
- ✅ Variables de entorno para credenciales
- ✅ Sanitización de inputs

## 📱 Responsive Design

La aplicación es completamente responsive y funciona perfectamente en:
- 📱 Móviles (320px+)
- 📱 Tablets (768px+)
- 💻 Desktop (1024px+)
- 🖥️ Large screens (1440px+)

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 👥 Autor

Desarrollado con ❤️ para El Campo de Don Ramón

## 🐛 Reportar Bugs

Si encuentras algún bug, por favor abre un issue en GitHub con:
- Descripción del problema
- Pasos para reproducirlo
- Comportamiento esperado
- Screenshots (si aplica)

## 📚 Recursos Adicionales

- [Documentación de Supabase](https://supabase.com/docs)
- [Documentación de React](https://react.dev)
- [Documentación de Zustand](https://zustand-demo.pmnd.rs)
- [Documentación de Zod](https://zod.dev)
- [Documentación de Vitest](https://vitest.dev)

---

**¿Necesitas ayuda?** Consulta [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) para configurar la base de datos.
