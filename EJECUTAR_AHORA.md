# ⚡ EJECUTAR AHORA - Último Paso

## ✅ Ya está hecho:
- ✅ Archivo `.env.local` creado con tus credenciales
- ✅ Proyecto conectado a Supabase

## 🔴 SOLO FALTA ESTE PASO (2 minutos):

### Opción A: Ejecutar SQL Manualmente (Recomendado)

1. **Abre este enlace** (se abrirá el SQL Editor):
   👉 [https://supabase.com/dashboard/project/vtvnafaqofqnxhulneoy/sql/new](https://supabase.com/dashboard/project/vtvnafaqofqnxhulneoy/sql/new)

2. **Copia TODO el contenido** del archivo `supabase-schema.sql` (191 líneas)

3. **Pégalo** en el SQL Editor de Supabase

4. **Haz clic en "Run"** (o presiona Ctrl+Enter)

5. **Verifica** que se crearon las tablas:
   - Ve a [Table Editor](https://supabase.com/dashboard/project/vtvnafaqofqnxhulneoy/editor)
   - Deberías ver:
     - ✅ `pedidos` (10 columnas)
     - ✅ `mensajes_contacto` (8 columnas)

### Opción B: Ejecutar Solo lo Esencial (Rápido)

Si prefieres algo más rápido, copia y pega esto en el SQL Editor:

```sql
-- Crear tabla de pedidos
CREATE TABLE pedidos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    correo_electronico TEXT NOT NULL,
    telefono TEXT NOT NULL,
    departamento TEXT NOT NULL,
    ciudad TEXT NOT NULL,
    direccion_completa TEXT NOT NULL,
    productos JSONB NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    estado TEXT NOT NULL DEFAULT 'pendiente',
    notas_adicionales TEXT
);

-- Crear tabla de mensajes de contacto
CREATE TABLE mensajes_contacto (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    nombre_completo TEXT NOT NULL,
    correo_electronico TEXT NOT NULL,
    telefono TEXT,
    asunto TEXT NOT NULL,
    mensaje TEXT NOT NULL,
    leido BOOLEAN NOT NULL DEFAULT FALSE
);

-- Habilitar RLS
ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE mensajes_contacto ENABLE ROW LEVEL SECURITY;

-- Permitir inserción pública
CREATE POLICY "Permitir inserción pública" ON pedidos
    FOR INSERT TO anon WITH CHECK (true);
    
CREATE POLICY "Permitir inserción pública" ON mensajes_contacto
    FOR INSERT TO anon WITH CHECK (true);
```

## 🔄 Después de ejecutar el SQL:

**Reinicia el servidor:**

```bash
# Detén el servidor actual (Ctrl+C en la terminal donde está corriendo)
# Luego ejecuta:
npm run dev
```

## ✅ Verificar que funciona:

1. Abre [http://localhost:5173](http://localhost:5173)
2. Agrega productos al carrito
3. Ve al checkout
4. Llena el formulario:
   - Email: `test@example.com`
   - Teléfono: `+573001234567`
   - Departamento: `Antioquia`
   - Ciudad: `Medellín`
   - Dirección: `Calle 50 #45-30`
5. Haz clic en "Realizar Pedido"
6. Si ves la página de confirmación: **¡FUNCIONA!** 🎉

## 🐛 Si hay errores:

### "Faltan las credenciales de Supabase"
- El archivo `.env.local` ya fue creado
- Reinicia el servidor

### Error al crear pedido
- Ejecuta el SQL del paso anterior
- Verifica que las tablas existen en Table Editor

### La consola muestra errores
- Presiona F12 en el navegador
- Mira la consola y dime qué error aparece

---

**¡Ya casi está!** Solo ejecuta el SQL y reinicia el servidor. 🚀

