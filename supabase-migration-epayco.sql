-- =====================================================
-- MIGRACIÓN: Agregar soporte para ePayco
-- Fecha: 2026-01-05
-- Descripción: Agrega campos para rastrear el estado
--              del pago y la referencia de ePayco
-- =====================================================

-- Agregar columna estado_pago a la tabla pedidos
ALTER TABLE pedidos 
ADD COLUMN IF NOT EXISTS estado_pago TEXT DEFAULT 'pendiente' 
CHECK (estado_pago IN ('pendiente', 'procesando', 'aprobado', 'rechazado', 'reembolsado'));

-- Agregar columna referencia_pago para almacenar el ID de transacción de ePayco
ALTER TABLE pedidos 
ADD COLUMN IF NOT EXISTS referencia_pago TEXT;

-- Crear índice para búsquedas por estado de pago
CREATE INDEX IF NOT EXISTS idx_pedidos_estado_pago ON pedidos(estado_pago);

-- Crear índice para búsquedas por referencia de pago
CREATE INDEX IF NOT EXISTS idx_pedidos_referencia_pago ON pedidos(referencia_pago);

-- Agregar comentarios a las nuevas columnas
COMMENT ON COLUMN pedidos.estado_pago IS 'Estado del pago en ePayco: pendiente, procesando, aprobado, rechazado, reembolsado';
COMMENT ON COLUMN pedidos.referencia_pago IS 'Referencia de transacción de ePayco (ref_payco o x_transaction_id)';

-- =====================================================
-- ACTUALIZAR POLÍTICAS RLS (si es necesario)
-- =====================================================

-- Permitir que los usuarios anónimos actualicen el estado_pago después del pago
-- NOTA: Esto es necesario para que la página de confirmación pueda actualizar el estado
CREATE POLICY IF NOT EXISTS "Permitir actualización de estado_pago desde confirmación" 
ON pedidos
FOR UPDATE
TO anon
USING (true)
WITH CHECK (true);

-- Si prefieres mayor seguridad, puedes crear una función RPC específica
-- y solo permitir actualizaciones a través de esa función.

-- =====================================================
-- FUNCIÓN OPCIONAL: Actualizar estado de pago
-- =====================================================

-- Función para actualizar el estado del pago de forma segura
CREATE OR REPLACE FUNCTION actualizar_estado_pago(
    p_pedido_id UUID,
    p_estado_pago TEXT,
    p_referencia_pago TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Validar que el estado sea válido
    IF p_estado_pago NOT IN ('pendiente', 'procesando', 'aprobado', 'rechazado', 'reembolsado') THEN
        RAISE EXCEPTION 'Estado de pago inválido: %', p_estado_pago;
    END IF;
    
    -- Actualizar el pedido
    UPDATE pedidos 
    SET 
        estado_pago = p_estado_pago,
        referencia_pago = COALESCE(p_referencia_pago, referencia_pago)
    WHERE id = p_pedido_id;
    
    -- Retornar verdadero si se actualizó al menos una fila
    RETURN FOUND;
END;
$$;

-- Permitir que usuarios anónimos ejecuten esta función
GRANT EXECUTE ON FUNCTION actualizar_estado_pago TO anon;

COMMENT ON FUNCTION actualizar_estado_pago IS 'Actualiza el estado del pago de un pedido de forma segura';

-- =====================================================
-- DATOS DE EJEMPLO (OPCIONAL)
-- =====================================================

-- Actualizar pedidos existentes para que tengan el nuevo campo
-- (Solo si ya tienes datos en la tabla)
UPDATE pedidos 
SET estado_pago = 'pendiente' 
WHERE estado_pago IS NULL;

-- =====================================================
-- VERIFICACIÓN
-- =====================================================

-- Verificar que las columnas se hayan creado correctamente
DO $$
BEGIN
    -- Verificar columna estado_pago
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'pedidos' 
        AND column_name = 'estado_pago'
    ) THEN
        RAISE EXCEPTION 'La columna estado_pago no se creó correctamente';
    END IF;
    
    -- Verificar columna referencia_pago
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'pedidos' 
        AND column_name = 'referencia_pago'
    ) THEN
        RAISE EXCEPTION 'La columna referencia_pago no se creó correctamente';
    END IF;
    
    RAISE NOTICE '✅ Migración completada exitosamente';
END $$;

