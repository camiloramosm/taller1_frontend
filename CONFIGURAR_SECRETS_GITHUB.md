# 🔐 CONFIGURAR SECRETS EN GITHUB

## 📍 Paso 1: Ir a la Configuración de Secrets

Abre este enlace en tu navegador:

```
https://github.com/camiloramosm/taller1_frontend/settings/secrets/actions
```

O manualmente:
1. Ve a tu repositorio: https://github.com/camiloramosm/taller1_frontend
2. Haz clic en **"Settings"** (arriba a la derecha)
3. En el menú izquierdo, busca **"Secrets and variables"**
4. Haz clic en **"Actions"**

---

## 📍 Paso 2: Agregar el Primer Secret

### Secret 1: VITE_SUPABASE_URL

1. Haz clic en el botón verde **"New repository secret"**

2. Llena el formulario:
   ```
   Name: VITE_SUPABASE_URL
   
   Secret: https://vtvnafaqofqnxhulneoy.supabase.co
   ```

3. Haz clic en **"Add secret"**

---

## 📍 Paso 3: Agregar el Segundo Secret

### Secret 2: VITE_SUPABASE_ANON_KEY

1. Haz clic nuevamente en **"New repository secret"**

2. Llena el formulario:
   ```
   Name: VITE_SUPABASE_ANON_KEY
   
   Secret: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0dm5hZmFxb2ZxbnhodWxuZW95Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NzM3ODMsImV4cCI6MjA3ODU0OTc4M30.8RG8bPn-zx1epfAZDkIo2B_xU7gnlGoUFMMBxKbQh2o
   ```

3. Haz clic en **"Add secret"**

---

## ✅ Paso 4: Verificar que se Agregaron

Deberías ver ambos secrets listados:

```
✅ VITE_SUPABASE_URL           Updated X seconds ago
✅ VITE_SUPABASE_ANON_KEY      Updated X seconds ago
```

---

## 🎯 ¡Listo!

Una vez que agregues los secrets, el pipeline podrá:
- Ejecutar el build correctamente
- Correr las pruebas con Supabase
- Validar todo automáticamente

---

## 📝 NOTA IMPORTANTE:

Los secrets son **seguros** y **no se muestran en los logs**. GitHub los enmascara automáticamente como `***` en cualquier salida.

---

**Continúa con el siguiente paso:** Crear un PR de prueba

