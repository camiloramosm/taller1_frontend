# 🚀 EJECUTAR SQL AHORA - 3 Pasos Simples

## ✅ Ya hice esto por ti:

1. ✅ Abrí el **SQL Editor de Supabase** en tu navegador
2. ✅ Abrí el archivo **setup-supabase.sql** en tu editor
3. ✅ Creé un script SQL optimizado con TODO lo necesario

---

## 📋 SOLO TIENES QUE HACER ESTO:

### Paso 1: Copiar el SQL
- En el editor de código, deberías ver el archivo **setup-supabase.sql**
- Presiona `Ctrl+A` para seleccionar todo
- Presiona `Ctrl+C` para copiar

### Paso 2: Pegar en Supabase
- Ve a la pestaña del navegador que se abrió (SQL Editor)
- Si no se abrió, haz clic aquí: [SQL Editor](https://supabase.com/dashboard/project/vtvnafaqofqnxhulneoy/sql/new)
- Haz clic en el área de texto grande
- Presiona `Ctrl+V` para pegar

### Paso 3: Ejecutar
- Haz clic en el botón verde **"Run"** (o presiona `Ctrl+Enter`)
- ¡Espera unos segundos!

---

## ✅ Verificar que funcionó:

1. Ve a [Table Editor](https://supabase.com/dashboard/project/vtvnafaqofqnxhulneoy/editor)
2. Deberías ver 2 tablas nuevas:
   - ✅ **pedidos** (con 10 columnas)
   - ✅ **mensajes_contacto** (con 8 columnas)

Si las ves, ¡ESTÁ LISTO! 🎉

---

## 🔄 Ahora reinicia el servidor:

```bash
# En la terminal, presiona Ctrl+C para detener el servidor
# Luego ejecuta:
npm run dev
```

---

## 🎯 Probar que funciona:

1. Abre [http://localhost:5173](http://localhost:5173)
2. Agrega productos al carrito (haz clic en "Agregar al Carrito")
3. Haz clic en el ícono del carrito en la esquina superior derecha
4. Haz clic en "Proceder al Pago"
5. Llena el formulario:
   ```
   Email: test@example.com
   Teléfono: +573001234567
   Departamento: Antioquia
   Ciudad: Medellín
   Dirección: Calle 50 #45-30, Apartamento 501
   ```
6. Haz clic en "Realizar Pedido"
7. Si ves una página de confirmación: **¡FUNCIONA!** 🚀

---

## 🐛 Si hay algún error:

### "Failed to fetch" o error de conexión
- Verifica que el archivo `.env.local` existe
- Reinicia el servidor

### "Table already exists"
- ¡Perfecto! Significa que ya estaba creada
- Solo reinicia el servidor

### Error en el SQL Editor
- Asegúrate de copiar TODO el archivo `setup-supabase.sql`
- Verifica que estás logueado en Supabase

---

## 📊 ¿Qué hace el script SQL?

1. ✅ Crea la tabla **pedidos** con validaciones
2. ✅ Crea la tabla **mensajes_contacto** con validaciones
3. ✅ Crea índices para optimizar las consultas
4. ✅ Habilita Row Level Security (RLS)
5. ✅ Crea políticas de seguridad (permite crear pedidos sin login)
6. ✅ Crea triggers de validación automática
7. ✅ Agrega comentarios a las tablas

---

**¿Ya ejecutaste el SQL?** 
👉 Reinicia el servidor y prueba crear un pedido!


