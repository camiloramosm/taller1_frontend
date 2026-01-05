# 🚀 Configurar Variables de Entorno en Vercel

## ⚠️ Problema Actual

Estás viendo el error:
```
⚠️ La clave pública de ePayco no está configurada
```

Esto es porque las variables de entorno no están configuradas en Vercel.

---

## 📋 Paso a Paso

### 1. Ve a tu Proyecto en Vercel

Abre este enlace:
```
https://vercel.com/camilo-ramos-projects/taller1-frontend
```

O desde el dashboard de Vercel, selecciona el proyecto `taller1-frontend`.

---

### 2. Ve a Settings → Environment Variables

1. En el menú lateral, haz clic en **"Settings"**
2. En el menú de Settings, haz clic en **"Environment Variables"**

---

### 3. Agrega las Variables de Entorno

Necesitas agregar **4 variables**. Para cada una:

#### Variable 1: VITE_SUPABASE_URL

1. Haz clic en **"Add New"**
2. **Key**: `VITE_SUPABASE_URL`
3. **Value**: Tu URL de Supabase (obténla de tu proyecto en Supabase)
   - Ve a https://supabase.com/dashboard
   - Selecciona tu proyecto
   - Ve a Settings → API
   - Copia el valor de **"Project URL"**
4. **Environments**: Selecciona **Production**, **Preview** y **Development**
5. Haz clic en **"Save"**

#### Variable 2: VITE_SUPABASE_ANON_KEY

1. Haz clic en **"Add New"**
2. **Key**: `VITE_SUPABASE_ANON_KEY`
3. **Value**: Tu clave anónima de Supabase
   - En Supabase: Settings → API
   - Copia el valor de **"anon / public"** key
4. **Environments**: Selecciona **Production**, **Preview** y **Development**
5. Haz clic en **"Save"**

#### Variable 3: VITE_EPAYCO_PUBLIC_KEY

1. Haz clic en **"Add New"**
2. **Key**: `VITE_EPAYCO_PUBLIC_KEY`
3. **Value**: `68d10a49ae848d5772c2e05844c8b37c`
4. **Environments**: Selecciona **Production**, **Preview** y **Development**
5. Haz clic en **"Save"**

#### Variable 4: VITE_EPAYCO_TEST_MODE

1. Haz clic en **"Add New"**
2. **Key**: `VITE_EPAYCO_TEST_MODE`
3. **Value**: `true` (para modo de prueba) o `false` (para producción)
4. **Environments**: Selecciona **Production**, **Preview** y **Development**
5. Haz clic en **"Save"**

---

### 4. Hacer Redeploy

**MUY IMPORTANTE**: Las variables de entorno solo se aplican en nuevos deploys.

1. Ve a la pestaña **"Deployments"**
2. Busca el último deployment (el que está en producción)
3. Haz clic en los **tres puntos (···)** al lado derecho
4. Selecciona **"Redeploy"**
5. En el modal, selecciona **"Use existing Build Cache"** (más rápido)
6. Haz clic en **"Redeploy"**

**Espera 1-2 minutos** a que termine el deploy.

---

## ✅ Verificar que Funcionó

1. Una vez que el deploy termine, abre tu página:
   ```
   https://taller1-frontend-tzy1.vercel.app/
   ```

2. Agrega productos al carrito

3. Ve al checkout:
   ```
   https://taller1-frontend-tzy1.vercel.app/checkout
   ```

4. Verifica que **NO veas el error** de "La clave pública de ePayco no está configurada"

5. Abre la **Consola del Navegador** (F12 → Console) y deberías ver:
   ```
   📥 Cargando script de ePayco...
   ✅ Script de ePayco cargado exitosamente
   ```

6. El botón "Pagar con ePayco" debería estar habilitado (dorado, no gris)

7. **Ahora al recargar la página (F5), ya NO debería dar error 404**

---

## 🐛 Si Sigue Sin Funcionar

### Error: "La clave pública de ePayco no está configurada"
**Solución**: 
1. Verifica que escribiste correctamente el nombre de las variables (con `VITE_` al inicio)
2. Verifica que hiciste el redeploy
3. Espera 1-2 minutos después del redeploy
4. Limpia la caché del navegador (Ctrl+Shift+R)

### Error: 404 al recargar
**Solución**:
1. Verifica que el archivo `vercel.json` esté en el repositorio
2. Haz commit y push del archivo
3. Espera a que Vercel haga el deploy automático

### Las variables no aparecen
**Solución**:
1. Asegúrate de estar en el proyecto correcto en Vercel
2. Verifica que tienes permisos de administrador en el proyecto

---

## 📊 Ubicación de las Credenciales

### Supabase
- **Dashboard**: https://supabase.com/dashboard
- **Ruta**: Tu Proyecto → Settings → API
- **Qué necesitas**: 
  - Project URL
  - anon/public key

### ePayco
- **Clave pública**: Ya la tienes → `68d10a49ae848d5772c2e05844c8b37c`
- **Test Mode**: `true` (para pruebas) / `false` (para producción real)

---

## 📸 Capturas de Pantalla de Referencia

Las variables deberían verse así en Vercel:

```
VITE_SUPABASE_URL          | https://xxxxx.supabase.co          | Production, Preview, Development
VITE_SUPABASE_ANON_KEY     | eyJhbGci... (muy largo)            | Production, Preview, Development
VITE_EPAYCO_PUBLIC_KEY     | 68d10a49ae848d5772c2e05844c8b37c  | Production, Preview, Development
VITE_EPAYCO_TEST_MODE      | true                               | Production, Preview, Development
```

---

## ⚡ Resumen Rápido

1. ✅ Ir a Vercel → Settings → Environment Variables
2. ✅ Agregar las 4 variables (con `VITE_` al inicio)
3. ✅ Seleccionar Production, Preview y Development
4. ✅ Hacer Redeploy
5. ✅ Esperar 1-2 minutos
6. ✅ Probar la página
7. ✅ El error 404 debería desaparecer después del próximo deploy (cuando se suba `vercel.json`)

---

¿Necesitas ayuda con algún paso? 🚀

