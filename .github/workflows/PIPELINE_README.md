# 🚀 Pipeline de CI/CD - Documentación

Este proyecto incluye un pipeline completo de CI/CD configurado con **GitHub Actions** que se ejecuta automáticamente en cada Pull Request.

---

## 📋 ¿Qué Valida el Pipeline?

### ✅ 1. Pruebas Unitarias (`test-and-lint`)
- Ejecuta todas las pruebas con Vitest
- Se ejecuta en Node.js 18.x y 20.x
- Genera reporte de cobertura
- **Criterio de éxito**: Todas las pruebas deben pasar

### ✅ 2. Linting (`test-and-lint`)
- Ejecuta ESLint en todo el código
- Verifica estándares de código
- **Criterio de éxito**: Sin errores de linting

### ✅ 3. Verificación de Tipos (`type-check`)
- Ejecuta TypeScript Compiler
- Verifica que no haya errores de tipos
- **Criterio de éxito**: Sin errores de TypeScript

### ✅ 4. Build del Proyecto (`test-and-lint`)
- Construye el proyecto con Vite
- Verifica que no haya errores de compilación
- **Criterio de éxito**: Build exitoso

### ✅ 5. Auditoría de Seguridad (`security-check`)
- Ejecuta `npm audit`
- Busca vulnerabilidades en dependencias
- **Criterio de éxito**: Sin vulnerabilidades de nivel alto o crítico

### ✅ 6. Análisis de Calidad (`code-quality`) - Opcional
- Análisis con SonarCloud
- Métricas de calidad de código
- **Criterio de éxito**: Informativo (no bloquea)

---

## ⚙️ Configuración Requerida

### Secrets de GitHub

Debes agregar estos secrets en tu repositorio:

1. **Para Supabase** (requerido para build):
   ```
   VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
   VITE_SUPABASE_ANON_KEY=tu_anon_key
   ```

2. **Para SonarCloud** (opcional):
   ```
   SONAR_TOKEN=tu_token_de_sonarcloud
   ```

3. **Para Codecov** (opcional):
   ```
   CODECOV_TOKEN=tu_token_de_codecov
   ```

### Cómo Agregar Secrets:

1. Ve a tu repositorio en GitHub
2. Settings > Secrets and variables > Actions
3. Haz clic en "New repository secret"
4. Agrega cada secret con su nombre y valor

---

## 🔧 Cómo Funciona

### Trigger del Pipeline

El pipeline se ejecuta cuando:
- ✅ Creas un Pull Request hacia `main` o `master`
- ✅ Haces push a `main` o `master`

### Flujo de Ejecución

```
PR creado/actualizado
  ↓
Checkout del código
  ↓
Instalar dependencias
  ↓
┌─────────────┬──────────────┬─────────────┐
│   Linting   │    Tests     │  Type Check │
└─────────────┴──────────────┴─────────────┘
  ↓               ↓                ↓
Build         Cobertura      Seguridad
  ↓               ↓                ↓
✅ Todos pasan → ✅ PR puede mergearse
❌ Alguno falla → ❌ PR bloqueado
```

---

## 📊 Requerimientos de Cobertura

El proyecto requiere un mínimo de **70% de cobertura** en:
- Líneas de código
- Funciones
- Branches
- Statements

---

## 🚦 Estados del Pipeline

### ✅ Success (Verde)
- Todas las pruebas pasaron
- Sin errores de linting
- Sin errores de tipos
- Build exitoso
- **El PR puede ser mergeado**

### ❌ Failed (Rojo)
- Alguna prueba falló
- Hay errores de linting
- Hay errores de TypeScript
- El build falló
- **El PR NO puede ser mergeado**

### 🟡 Running (Amarillo)
- El pipeline está ejecutándose
- Espera a que termine

---

## 🛠️ Ejecutar Localmente

Antes de crear un PR, puedes ejecutar las validaciones localmente:

```bash
# Pruebas unitarias
npm run test

# Cobertura de código
npm run test:coverage

# Linting
npm run lint

# Verificación de tipos
npx tsc --noEmit

# Build
npm run build
```

---

## 📝 Ejemplo de Uso

### 1. Crear una rama nueva
```bash
git checkout -b feature/nueva-funcionalidad
```

### 2. Hacer tus cambios
```bash
# Editar archivos...
git add .
git commit -m "feat: agregar nueva funcionalidad"
```

### 3. Ejecutar validaciones localmente
```bash
npm run test
npm run lint
npm run build
```

### 4. Push y crear PR
```bash
git push origin feature/nueva-funcionalidad
# Crear PR en GitHub
```

### 5. Esperar a que el pipeline pase
- Ve a tu PR en GitHub
- Observa los checks en la parte inferior
- Si todo está verde ✅, puedes mergear

---

## 🔍 Debugging

### Si las pruebas fallan:
```bash
# Ver qué prueba falló
npm run test

# Ejecutar una prueba específica
npm run test src/tests/utils/validations.test.ts
```

### Si el linting falla:
```bash
# Ver errores de linting
npm run lint

# Intentar arreglar automáticamente
npx eslint . --fix
```

### Si el type check falla:
```bash
# Ver errores de TypeScript
npx tsc --noEmit
```

---

## 📈 Mejoras Futuras

- [ ] Agregar pruebas E2E con Playwright
- [ ] Integrar análisis de bundle size
- [ ] Agregar lighthouse CI para performance
- [ ] Deploy automático en preview environments
- [ ] Notificaciones en Slack/Discord

---

## 🆘 Problemas Comunes

### Error: "VITE_SUPABASE_URL is not defined"
**Solución**: Agrega los secrets de Supabase en GitHub

### Error: "Cannot find module"
**Solución**: Asegúrate de que `npm ci` se ejecutó correctamente

### Error: "Test timeout"
**Solución**: Aumenta el timeout en vitest.config.ts

---

## 📚 Referencias

- [GitHub Actions](https://docs.github.com/en/actions)
- [Vitest](https://vitest.dev/)
- [SonarCloud](https://sonarcloud.io/)
- [Codecov](https://codecov.io/)

---

**¿Preguntas?** Consulta la documentación o abre un issue en el repositorio.

