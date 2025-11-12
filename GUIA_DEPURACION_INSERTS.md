# 🔍 Guía de Depuración - Problema con Inserts

## ✅ Estado Actual:

- ✅ La página carga correctamente
- ✅ Las credenciales de Supabase están configuradas
- ✅ Las tablas están creadas
- ✅ Las políticas RLS permiten inserción pública (anon)
- ❌ No está insertando datos en Supabase

---

## 🔍 NECESITO QUE HAGAS ESTO:

### Paso 1: Intentar Crear un Pedido

1. Ve a http://localhost:5175 (o el puerto que estés usando)
2. **Agrega productos al carrito**
3. **Haz clic en el ícono del carrito**
4. **Haz clic en "Proceder al Pago"**
5. **Llena el formulario:**
   ```
   Email: test@example.com
   Teléfono: +573001234567
   Departamento: Antioquia
   Ciudad: Medellín
   Dirección: Calle 50 #45-30, Apartamento 501
   ```
6. **Haz clic en "Realizar Pedido"**

### Paso 2: Abrir la Consola del Navegador

**IMPORTANTE:** Presiona **F12** para abrir las DevTools

Ve a la pestaña **Console** y busca:

#### ¿Qué error aparece?

**Cópiame EXACTAMENTE el error que ves en rojo.**

Podría ser algo como:

- `Error: Failed to insert...`
- `Error: violates check constraint...`
- `Error: 400 Bad Request...`
- `Error: PGRST...`
- Otro mensaje en rojo

---

## 🔍 También Verifica:

### Pestaña Network en DevTools:

1. Ve a la pestaña **Network** (en DevTools, F12)
2. Intenta crear el pedido de nuevo
3. Busca una petición que diga **"pedidos"** (en rojo si falló)
4. Haz clic en ella
5. Ve a la pestaña **Response**
6. **Cópiame ese mensaje de error**

---

## 🧪 Prueba Alternativa - Insertar Directo:

Mientras tanto, voy a probar si podemos insertar directamente desde SQL:

```sql
-- Ejecuta esto en el SQL Editor de Supabase
INSERT INTO pedidos (
    correo_electronico, 
    telefono, 
    departamento, 
    ciudad, 
    direccion_completa, 
    productos, 
    total, 
    estado
) VALUES (
    'test@example.com',
    '+573001234567',
    'Antioquia',
    'Medellín',
    'Calle 50 #45-30',
    '[{"id": 1, "nombre": "Test", "cantidad": 1, "precio": 100}]'::jsonb,
    100.00,
    'pendiente'
);
```

Ve a [SQL Editor](https://supabase.com/dashboard/project/vtvnafaqofqnxhulneoy/sql/new) y ejecuta eso.

**¿Funciona o da error?** Dime qué pasa.

---

## 📋 Posibles Causas:

### 1. Error en el formato del teléfono
El trigger valida que sea `+57` seguido de 10 dígitos

### 2. Error en el formato de productos
Debe ser un array JSON válido con los campos correctos

### 3. Error en las validaciones CHECK
Las constraints de la base de datos pueden estar rechazando los datos

### 4. Error en el código frontend
Puede haber un problema con cómo se envían los datos

---

## 🎯 Lo que necesito de ti:

**Por favor, envíame:**

1. ✅ El **error exacto** de la consola del navegador (F12 > Console)
2. ✅ El **error de la pestaña Network** (F12 > Network > Response)
3. ✅ Si la inserción SQL directa funcionó o no

Con esa información te daré la solución exacta! 🚀

