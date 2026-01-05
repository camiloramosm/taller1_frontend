# Guía de Configuración de Protección de Ramas

Esta guía te ayudará a configurar las protecciones de rama en GitHub para que solo se puedan hacer merge de Pull Requests que hayan pasado todas las validaciones del CI.

## 🔒 Paso 1: Acceder a la Configuración de Ramas

1. Ve a tu repositorio en GitHub: `https://github.com/camiloramosm/taller1_frontend`
2. Haz clic en **Settings** (⚙️)
3. En el menú lateral izquierdo, haz clic en **Branches**
4. En la sección **Branch protection rules**, haz clic en **Add rule** o **Add branch protection rule**

## 📋 Paso 2: Configurar la Regla de Protección

### Nombre de la Rama
- En **Branch name pattern**, escribe: `main`

### ✅ Reglas de Protección Requeridas

Marca las siguientes opciones:

#### 1. **Require a pull request before merging** ✓
   - ✓ Require approvals (opcional, pero recomendado)
     - Número de aprobaciones requeridas: `1` (o más según tu equipo)
   - ✓ Dismiss stale pull request approvals when new commits are pushed
   - ✓ Require review from Code Owners (opcional)

#### 2. **Require status checks to pass before merging** ✓ (IMPORTANTE)
   - ✓ Require branches to be up to date before merging
   - En **Status checks that are required**, busca y selecciona:
     - ✅ `Pruebas Unitarias y Linting`
     - ✅ `Verificación de Tipos (TypeScript)`
     - ✅ `Estado Final del Pipeline`
   
   > 💡 **Nota**: Estos checks aparecerán después de que el workflow se ejecute por primera vez en un PR.

#### 3. **Require conversation resolution before merging** ✓ (Recomendado)
   - Todos los comentarios deben resolverse antes del merge

#### 4. **Require signed commits** (Opcional)
   - Solo si tu equipo usa commits firmados con GPG

#### 5. **Require linear history** (Opcional)
   - Para mantener un historial lineal sin merge commits

#### 6. **Include administrators** ✓ (Recomendado)
   - Aplica las reglas incluso a los administradores

#### 7. **Restrict who can push to matching branches** (Opcional)
   - Solo para equipos grandes donde quieres limitar quién puede hacer push directo

#### 8. **Allow force pushes** ✗ (DESMARCAR)
   - Nunca permitir force push a main

#### 9. **Allow deletions** ✗ (DESMARCAR)
   - Nunca permitir eliminar la rama main

## 🎯 Configuración Recomendada Mínima

Para un proyecto profesional, la configuración mínima debe incluir:

```
✅ Require a pull request before merging
   └─ ✅ Require approvals: 1

✅ Require status checks to pass before merging
   ├─ ✅ Require branches to be up to date before merging
   └─ Status checks requeridos:
       ├─ Pruebas Unitarias y Linting
       ├─ Verificación de Tipos (TypeScript)
       └─ Estado Final del Pipeline

✅ Require conversation resolution before merging
✅ Include administrators
❌ Allow force pushes (DESMARCAR)
❌ Allow deletions (DESMARCAR)
```

## 📊 Qué Valida el CI Antes del Merge

El workflow de CI (`ci.yml`) ejecuta automáticamente:

### 1. **ESLint** 🔍
- Verifica errores de código
- Máximo 10 warnings permitidos
- **Si falla**: No se puede hacer merge

### 2. **TypeScript Type Check** 🔷
- Verifica errores de tipos
- **Si falla**: No se puede hacer merge

### 3. **Tests Unitarios** 🧪
- Ejecuta todos los tests (actualmente 34)
- **Si falla**: No se puede hacer merge

### 4. **Build** 🏗️
- Verifica que el proyecto compile correctamente
- **Si falla**: No se puede hacer merge

### 5. **Cobertura de Código** 📊 (Opcional)
- Genera reporte de cobertura
- No bloquea el merge

### 6. **Auditoría de Seguridad** 🔒 (Opcional)
- Revisa vulnerabilidades en dependencias
- No bloquea el merge (pero deberías revisarlo)

## 🚀 Flujo de Trabajo con Protección de Ramas

### Crear un Pull Request

```bash
# 1. Crea una nueva rama para tu feature
git checkout -b feature/nueva-funcionalidad

# 2. Haz tus cambios y commits
git add .
git commit -m "feat: agregar nueva funcionalidad"

# 3. Ejecuta las validaciones localmente (opcional pero recomendado)
npm run validate

# 4. Sube tu rama
git push origin feature/nueva-funcionalidad

# 5. Crea el Pull Request en GitHub
```

### Revisar el Pull Request

1. GitHub automáticamente ejecutará el workflow de CI
2. Verás los checks en el PR:
   - ⏳ En progreso: Amarillo
   - ✅ Pasó: Verde
   - ❌ Falló: Rojo

3. **Si todos los checks pasan** ✅:
   - El botón "Merge" estará habilitado (verde)
   - Puedes hacer el merge

4. **Si algún check falla** ❌:
   - El botón "Merge" estará deshabilitado (gris)
   - Debes corregir los errores
   - Hacer push de las correcciones
   - El CI se ejecutará automáticamente de nuevo

### Ejemplo de PR Exitoso

```
Pull Request #42: Agregar validación de formularios

Checks:
✅ Pruebas Unitarias y Linting (2m 15s)
✅ Verificación de Tipos (TypeScript) (1m 30s)
✅ Verificación de Seguridad (45s)
✅ Estado Final del Pipeline (10s)

[Merge pull request] <- Botón habilitado ✅
```

### Ejemplo de PR Fallido

```
Pull Request #43: Refactorizar componentes

Checks:
❌ Pruebas Unitarias y Linting (1m 45s)
   └─ Error: 2 tests fallaron
✅ Verificación de Tipos (TypeScript) (1m 30s)
❌ Estado Final del Pipeline (5s)
   └─ Error: Las pruebas unitarias fallaron

[Merge pull request] <- Botón deshabilitado ❌
```

## 🔧 Comandos Útiles para Desarrolladores

### Antes de hacer Push

```bash
# Ejecutar todas las validaciones localmente
npm run validate

# Solo ESLint
npm run lint

# Solo TypeScript
npm run type-check

# Solo Tests
npm test

# Ver cobertura
npm run test:coverage
```

### Si el CI falla

1. **Ver los logs en GitHub**:
   - Haz clic en "Details" junto al check fallido

2. **Corregir localmente**:
   ```bash
   # Corrige el código
   npm run validate  # Verifica que esté todo bien
   
   # Haz commit y push
   git add .
   git commit -m "fix: corregir errores del CI"
   git push
   ```

3. **El CI se ejecutará automáticamente de nuevo**

## ⚠️ Bypass de Emergencia (Solo Administradores)

En caso de emergencia, los administradores pueden:

1. Temporalmente deshabilitar la protección de rama
2. Hacer el merge
3. **IMPORTANTE**: Volver a habilitar la protección inmediatamente

**NO SE RECOMIENDA** a menos que sea absolutamente necesario.

## 📝 Notas Adicionales

- Los checks se ejecutan automáticamente en cada push a un PR
- No es necesario cerrar y reabrir el PR
- Puedes hacer múltiples commits, el CI se ejecutará en cada uno
- El último estado de los checks es el que determina si se puede hacer merge

## ✅ Verificación de Configuración

Para verificar que la protección está configurada correctamente:

1. Crea un PR de prueba
2. Verifica que los checks se ejecuten
3. Intenta hacer merge sin que pasen los checks
4. Deberías ver el botón de merge deshabilitado

## 🆘 Solución de Problemas

### Los checks no aparecen en el PR

- **Solución**: Espera a que el workflow se ejecute al menos una vez. Después aparecerán en la lista de status checks disponibles.

### El botón de merge está habilitado pero los checks fallaron

- **Solución**: Revisa la configuración de protección de rama. Asegúrate de tener marcado "Require status checks to pass before merging".

### No puedo seleccionar los status checks

- **Solución**: Primero ejecuta el workflow en un PR. Una vez que se ejecute, los checks aparecerán disponibles para seleccionar.

## 📚 Referencias

- [Documentación oficial de GitHub: Branch Protection Rules](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [GitHub Actions: Workflow Syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)

---

**Última actualización**: Noviembre 2024
**Repositorio**: taller1_frontend

