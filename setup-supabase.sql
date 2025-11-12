-- =====================================================
-- SETUP RÁPIDO - E-COMMERCE SUPABASE
-- Ejecuta este archivo completo en el SQL Editor
-- =====================================================

-- PASO 1: CREAR TABLAS
-- =====================================================

-- TABLA: pedidos
CREATE TABLE IF NOT EXISTS pedidos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    correo_electronico TEXT NOT NULL CHECK (correo_electronico ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$'),
    telefono TEXT NOT NULL CHECK (telefono ~ '^\+57[0-9]{10}$'),
    departamento TEXT NOT NULL,
    ciudad TEXT NOT NULL,
    direccion_completa TEXT NOT NULL,
    productos JSONB NOT NULL,
    total DECIMAL(10, 2) NOT NULL CHECK (total >= 0),
    estado TEXT NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'procesando', 'enviado', 'entregado', 'cancelado')),
    notas_adicionales TEXT
);

-- TABLA: mensajes_contacto
CREATE TABLE IF NOT EXISTS mensajes_contacto (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    nombre_completo TEXT NOT NULL CHECK (LENGTH(nombre_completo) >= 3),
    correo_electronico TEXT NOT NULL CHECK (correo_electronico ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$'),
    telefono TEXT,
    asunto TEXT NOT NULL CHECK (LENGTH(asunto) >= 3),
    mensaje TEXT NOT NULL CHECK (LENGTH(mensaje) >= 10),
    leido BOOLEAN NOT NULL DEFAULT FALSE
);

-- PASO 2: CREAR ÍNDICES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_pedidos_correo ON pedidos(correo_electronico);
CREATE INDEX IF NOT EXISTS idx_pedidos_estado ON pedidos(estado);
CREATE INDEX IF NOT EXISTS idx_pedidos_created_at ON pedidos(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pedidos_departamento ON pedidos(departamento);
CREATE INDEX IF NOT EXISTS idx_mensajes_leido ON mensajes_contacto(leido);
CREATE INDEX IF NOT EXISTS idx_mensajes_created_at ON mensajes_contacto(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_mensajes_correo ON mensajes_contacto(correo_electronico);

-- PASO 3: HABILITAR ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE mensajes_contacto ENABLE ROW LEVEL SECURITY;

-- PASO 4: CREAR POLÍTICAS DE SEGURIDAD
-- =====================================================

-- Políticas para PEDIDOS
DROP POLICY IF EXISTS "Permitir inserción pública de pedidos" ON pedidos;
CREATE POLICY "Permitir inserción pública de pedidos" ON pedidos
    FOR INSERT
    TO anon
    WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir lectura autenticada de pedidos" ON pedidos;
CREATE POLICY "Permitir lectura autenticada de pedidos" ON pedidos
    FOR SELECT
    TO authenticated
    USING (true);

DROP POLICY IF EXISTS "Permitir actualización autenticada de pedidos" ON pedidos;
CREATE POLICY "Permitir actualización autenticada de pedidos" ON pedidos
    FOR UPDATE
    TO authenticated
    USING (true);

-- Políticas para MENSAJES DE CONTACTO
DROP POLICY IF EXISTS "Permitir inserción pública de mensajes" ON mensajes_contacto;
CREATE POLICY "Permitir inserción pública de mensajes" ON mensajes_contacto
    FOR INSERT
    TO anon
    WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir lectura autenticada de mensajes" ON mensajes_contacto;
CREATE POLICY "Permitir lectura autenticada de mensajes" ON mensajes_contacto
    FOR SELECT
    TO authenticated
    USING (true);

DROP POLICY IF EXISTS "Permitir actualización autenticada de mensajes" ON mensajes_contacto;
CREATE POLICY "Permitir actualización autenticada de mensajes" ON mensajes_contacto
    FOR UPDATE
    TO authenticated
    USING (true);

-- PASO 5: CREAR FUNCIONES Y TRIGGERS
-- =====================================================

-- Función para validar productos en pedidos
CREATE OR REPLACE FUNCTION validar_productos_pedido()
RETURNS TRIGGER AS $$
BEGIN
    -- Verificar que productos sea un array con al menos un elemento
    IF jsonb_array_length(NEW.productos) = 0 THEN
        RAISE EXCEPTION 'El pedido debe contener al menos un producto';
    END IF;
    
    -- Verificar que cada producto tenga los campos requeridos
    IF NOT (
        SELECT bool_and(
            producto ? 'id' AND 
            producto ? 'nombre' AND 
            producto ? 'cantidad' AND 
            producto ? 'precio' AND
            (producto->>'cantidad')::int > 0 AND
            (producto->>'precio')::decimal >= 0
        )
        FROM jsonb_array_elements(NEW.productos) AS producto
    ) THEN
        RAISE EXCEPTION 'Cada producto debe tener id, nombre, cantidad (> 0) y precio (>= 0)';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_validar_productos ON pedidos;
CREATE TRIGGER trigger_validar_productos
    BEFORE INSERT OR UPDATE ON pedidos
    FOR EACH ROW
    EXECUTE FUNCTION validar_productos_pedido();

-- PASO 6: AGREGAR COMENTARIOS
-- =====================================================

COMMENT ON TABLE pedidos IS 'Almacena todos los pedidos realizados en el sistema de e-commerce';
COMMENT ON COLUMN pedidos.productos IS 'Array JSON con los productos del pedido: [{id, nombre, cantidad, precio}]';
COMMENT ON COLUMN pedidos.estado IS 'Estado actual del pedido: pendiente, procesando, enviado, entregado, cancelado';
COMMENT ON TABLE mensajes_contacto IS 'Almacena los mensajes de contacto enviados por los usuarios';
COMMENT ON COLUMN mensajes_contacto.leido IS 'Indica si el mensaje ha sido leído por un administrador';

-- =====================================================
-- ¡LISTO! Ahora verifica que las tablas se crearon:
-- Ve a Table Editor y deberías ver 'pedidos' y 'mensajes_contacto'
-- =====================================================


