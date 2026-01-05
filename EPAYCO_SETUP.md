# 💳 Integración de ePayco - Guía de Configuración

## 📋 Requisitos Previos

1. **Cuenta de ePayco**: Crea una cuenta en [https://secure.epayco.co/register](https://secure.epayco.co/register)
2. **Verificación**: Completa el proceso de verificación de tu cuenta
3. **Credenciales**: Obtén tus claves API desde el panel de ePayco

---

## 🔑 Paso 1: Obtener las Credenciales de ePayco

### 1.1. Ingresar al Panel de ePayco
1. Accede a [https://dashboard.epayco.co/](https://dashboard.epayco.co/)
2. Inicia sesión con tu cuenta

### 1.2. Obtener las Claves API
1. Ve a **Configuración** → **API Keys**
2. Encontrarás dos tipos de claves:
   - **Public Key** (P_CUST_XXXXXXXXXXX): Para el frontend
   - **Private Key** (XXXXXXXXXXXXXXXXXXXXX): Para el backend (opcional)
3. Puedes usar las claves de **Pruebas** o **Producción**

---

## ⚙️ Paso 2: Configurar Variables de Entorno

### 2.1. Archivo `.env` Local

Crea o actualiza tu archivo `.env` en la raíz del proyecto:

```env
# Supabase Configuration (ya existentes)
VITE_SUPABASE_URL=tu_supabase_url
VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key

# ePayco Configuration
VITE_EPAYCO_PUBLIC_KEY=tu_clave_publica_de_epayco
VITE_EPAYCO_TEST_MODE=true
```

**Ejemplo con claves reales:**
```env
VITE_EPAYCO_PUBLIC_KEY=P_CUST_a1b2c3d4e5f6g7h8
VITE_EPAYCO_TEST_MODE=true
```

### 2.2. Configuración en Vercel (Producción)

1. Ve a tu proyecto en [Vercel](https://vercel.com/)
2. **Settings** → **Environment Variables**
3. Agrega las siguientes variables:

| Name | Value | Environment |
|------|-------|-------------|
| `VITE_EPAYCO_PUBLIC_KEY` | Tu clave pública de producción | Production |
| `VITE_EPAYCO_TEST_MODE` | `false` | Production |
| `VITE_EPAYCO_PUBLIC_KEY` | Tu clave pública de pruebas | Preview, Development |
| `VITE_EPAYCO_TEST_MODE` | `true` | Preview, Development |

---

## 🧪 Paso 3: Modo de Pruebas

### 3.1. Habilitar Modo Test
Cuando `VITE_EPAYCO_TEST_MODE=true`, ePayco funciona en modo sandbox:
- **No se realizan cargos reales**
- Puedes probar con tarjetas de prueba

### 3.2. Tarjetas de Prueba de ePayco

#### ✅ Transacción Aprobada
```
Número: 4575 6231 0126 2916
CVV: 123
Fecha: Cualquier fecha futura
```

#### ❌ Transacción Rechazada
```
Número: 4151 6111 1111 1118
CVV: 123
Fecha: Cualquier fecha futura
```

#### ⏳ Transacción Pendiente
```
Número: 4575 6231 0126 3004
CVV: 123
Fecha: Cualquier fecha futura
```

---

## 🚀 Paso 4: Flujo de Pago

### 4.1. Proceso Completo

1. **Usuario completa el formulario de checkout**
2. **Sistema crea el pedido** en Supabase (estado: `pendiente`)
3. **Se abre el checkout de ePayco** con:
   - Información del pedido
   - Monto total
   - Datos del comprador
4. **Usuario completa el pago** en ePayco
5. **ePayco procesa la transacción**
6. **Redirección automática** a página de confirmación

### 4.2. Estados del Pedido

| Estado | Descripción |
|--------|-------------|
| `pendiente` | Pedido creado, esperando pago |
| `procesando` | Pago en proceso |
| `enviado` | Pago confirmado, pedido enviado |
| `entregado` | Pedido entregado |
| `cancelado` | Pago fallido o pedido cancelado |

---

## 🔒 Paso 5: URLs de Respuesta

### 5.1. URL de Respuesta (Response URL)
```
https://tu-dominio.com/confirmacion/{orderId}
```
- El usuario es redirigido aquí después del pago
- Muestra el estado de la transacción

### 5.2. URL de Confirmación (Confirmation URL)
```
https://tu-dominio.com/api/epayco/confirmation
```
- ePayco envía una notificación POST aquí
- **Opcional**: Requiere implementar un endpoint backend
- Actualiza el estado del pedido automáticamente

---

## 📊 Paso 6: Monitoreo de Transacciones

### 6.1. Dashboard de ePayco
1. Accede a [https://dashboard.epayco.co/](https://dashboard.epayco.co/)
2. Ve a **Transacciones** para ver todos los pagos
3. Filtros disponibles:
   - Estado (Aprobada, Rechazada, Pendiente)
   - Fecha
   - Monto

### 6.2. Logs de Supabase
1. Accede a tu proyecto en [Supabase](https://supabase.com/)
2. Ve a **Table Editor** → **pedidos**
3. Verifica el estado de cada pedido

---

## ⚠️ Solución de Problemas

### Error: "La clave pública de ePayco no está configurada"
**Solución:**
1. Verifica que el archivo `.env` existe en la raíz del proyecto
2. Confirma que la variable se llama exactamente `VITE_EPAYCO_PUBLIC_KEY`
3. Reinicia el servidor de desarrollo: `pnpm run dev`

### Error: "ePayco no está listo"
**Solución:**
1. Revisa la consola del navegador para ver errores específicos
2. Verifica tu conexión a internet
3. Comprueba que no haya bloqueadores de scripts

### El checkout de ePayco no se abre
**Solución:**
1. Verifica que los montos sean números válidos
2. Asegúrate de que el correo electrónico sea válido
3. Revisa la consola del navegador para errores

### Transacción aprobada pero pedido no actualizado
**Solución:**
1. Verifica manualmente en el dashboard de ePayco
2. Actualiza el estado del pedido en Supabase manualmente
3. Considera implementar el endpoint de confirmación

---

## 🎨 Personalización

### Cambiar Colores del Checkout
El checkout de ePayco se puede personalizar desde el dashboard:
1. **Configuración** → **Checkout**
2. Cambia colores, logo y otros elementos visuales

### Métodos de Pago Disponibles
Por defecto, ePayco habilita:
- Tarjetas de crédito
- PSE (transferencia bancaria)
- Efectivo (Baloto, Efecty, etc.)

Para deshabilitar métodos:
```typescript
openCheckout({
  // ...otros parámetros
  methodsDisable: ['PSE', 'CASH'],
});
```

---

## 📝 Migración a Producción

### Checklist Pre-Producción
- [ ] Obtener claves de **Producción** en ePayco
- [ ] Actualizar `VITE_EPAYCO_PUBLIC_KEY` con la clave de producción
- [ ] Cambiar `VITE_EPAYCO_TEST_MODE=false`
- [ ] Configurar variables en Vercel
- [ ] Probar con una transacción real pequeña
- [ ] Verificar emails de confirmación
- [ ] Monitorear primeras transacciones

---

## 🔗 Enlaces Útiles

- **Dashboard de ePayco**: https://dashboard.epayco.co/
- **Documentación Oficial**: https://docs.epayco.co/
- **Soporte ePayco**: soporte@epayco.co
- **API Reference**: https://docs.epayco.co/payments/checkout

---

## 💡 Preguntas Frecuentes

### ¿Cuánto cobra ePayco por transacción?
- Tarjeta de Crédito: ~3.5% + IVA
- PSE: ~$900 COP + IVA
- Efectivo: Varía según método

### ¿Cuánto tardan en acreditar los pagos?
- Tarjeta: Inmediato
- PSE: 1-2 días hábiles
- Efectivo: 1-2 días hábiles después del pago

### ¿Puedo usar ePayco en otros países?
Sí, ePayco opera en:
- 🇨🇴 Colombia
- 🇲🇽 México
- 🇵🇪 Perú
- 🇨🇱 Chile
- 🇧🇷 Brasil

---

## 📞 Contacto y Soporte

Si tienes problemas con la integración:

1. **Documentación**: Revisa este documento primero
2. **ePayco Support**: soporte@epayco.co
3. **Supabase**: [Documentación oficial](https://supabase.com/docs)

---

**¡Listo! Tu tienda ya está configurada para recibir pagos con ePayco.** 🎉

