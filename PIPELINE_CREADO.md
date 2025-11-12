# ✅ PIPELINE DE CI/CD CREADO

## 🎉 ¡Tu pipeline está listo!

He creado un pipeline completo de CI/CD con GitHub Actions que valida automáticamente:

---

## 📋 ¿Qué Valida?

### ✅ 1. Pruebas Unitarias
- Ejecuta todas las pruebas con Vitest
- Se ejecuta en Node.js 18.x y 20.x (matriz)
- Genera reporte de cobertura
- **Umbral mínimo**: 70% de cobertura

### ✅ 2. Linting (Calidad de Código)
- ESLint con reglas estrictas
- **0 warnings permitidos** (--max-warnings=0)
- Verifica estándares de código React y TypeScript

### ✅ 3. Type Checking
- Verificación de tipos con TypeScript
- Detecta errores de tipos antes de mergear

### ✅ 4. Build Verification
- Compila el proyecto con Vite
- Verifica que no haya errores de build

### ✅ 5. Security Audit
- npm audit para detectar vulnerabilidades
- Bloquea si hay vulnerabilidades de nivel alto o crítico

### ✅ 6. Code Quality Analysis
- SonarCloud para análisis avanzado (opcional)
- Métricas de complejidad, duplicación, etc.

---

## 📁 Archivos Creados

```
.github/
├── workflows/
│   ├── ci.yml                    # Pipeline principal
│   └── PIPELINE_README.md        # Documentación del pipeline
├── PULL_REQUEST_TEMPLATE.md      # Template para PRs
sonar-project.properties          # Configuración SonarCloud
vitest.config.ts                  # Actualizado con cobertura
package.json                      # Scripts actualizados
```

---

## 🚀 Cómo Usarlo

### 1. Configurar Secrets en GitHub

Ve a tu repositorio: `https://github.com/camiloramosm/taller1_frontend`

1. **Settings** > **Secrets and variables** > **Actions**
2. **New repository secret**
3. Agrega estos secrets:

```
VITE_SUPABASE_URL=https://vtvnafaqofqnxhulneoy.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2. Hacer un Commit y Push

```bash
git add .
git commit -m "ci: agregar pipeline de CI/CD"
git push origin main
```

### 3. Crear un Pull Request de Prueba

```bash
# Crear rama nueva
git checkout -b test/pipeline

# Hacer un cambio pequeño
echo "# Test" >> TEST.md
git add TEST.md
git commit -m "test: verificar pipeline"

# Push y crear PR
git push origin test/pipeline
```

Luego ve a GitHub y crea el Pull Request. Verás el pipeline ejecutándose automáticamente.

---

## 📊 Scripts Nuevos Disponibles

```bash
# Ejecutar pruebas (modo CI)
npm run test

# Ejecutar pruebas en modo watch
npm run test:watch

# Ejecutar pruebas con UI
npm run test:ui

# Generar reporte de cobertura
npm run test:coverage

# Ejecutar linting
npm run lint

# Arreglar errores de linting automáticamente
npm run lint:fix

# Verificar tipos TypeScript
npm run type-check

# Ejecutar todas las validaciones (lint + type-check + test)
npm run validate
```

---

## 🎯 Flujo de Trabajo Recomendado

### Antes de crear un PR:

```bash
# 1. Ejecutar todas las validaciones localmente
npm run validate

# 2. Si todo pasa, hacer commit y push
git add .
git commit -m "feat: nueva funcionalidad"
git push
```

### Después de crear el PR:

1. ✅ Espera a que el pipeline termine (2-3 minutos)
2. ✅ Verifica que todos los checks pasen (verde)
3. ✅ Si algo falla, revisa los logs y corrige
4. ✅ Una vez todo verde, puedes mergear

---

## 🔍 Ejemplo de Salida

Cuando crees un PR, verás algo así en GitHub:

```
✅ test-and-lint (18.x)     Passed in 2m 34s
✅ test-and-lint (20.x)     Passed in 2m 28s
✅ type-check               Passed in 1m 12s
✅ security-check           Passed in 1m 45s
⚪ code-quality            Skipped (optional)
✅ status-check            All checks passed
```

---

## 📈 Métricas de Cobertura

El pipeline genera reportes de cobertura automáticamente:

- **Mínimo requerido**: 70%
- **Reportes**: HTML, JSON, LCOV, Text
- **Ubicación**: `/coverage` (ignorado por git)

Para ver el reporte localmente:

```bash
npm run test:coverage
open coverage/index.html  # macOS/Linux
start coverage/index.html # Windows
```

---

## 🛠️ Configuración Avanzada (Opcional)

### SonarCloud

1. Ve a [SonarCloud](https://sonarcloud.io/)
2. Importa tu repositorio
3. Obtén el `SONAR_TOKEN`
4. Agrégalo como secret en GitHub
5. El análisis se ejecutará automáticamente

### Codecov

1. Ve a [Codecov](https://codecov.io/)
2. Importa tu repositorio
3. Obtén el `CODECOV_TOKEN`
4. Agrégalo como secret en GitHub
5. Los reportes de cobertura se subirán automáticamente

---

## ❌ Troubleshooting

### Error: "VITE_SUPABASE_URL is not defined"
**Solución**: Agrega los secrets de Supabase en GitHub Settings

### Error: "npm ci" failed
**Solución**: Verifica que package-lock.json esté en el repo

### Tests pasan localmente pero fallan en CI
**Solución**: Verifica las variables de entorno y que no haya dependencias del entorno local

### Linting pasa localmente pero falla en CI
**Solución**: Ejecuta `npm run lint` (sin --fix) para ver los errores exactos

---

## 📚 Documentación Adicional

- **Pipeline README**: `.github/workflows/PIPELINE_README.md`
- **Template de PR**: `.github/PULL_REQUEST_TEMPLATE.md`
- **Configuración Vitest**: `vitest.config.ts`
- **Configuración SonarCloud**: `sonar-project.properties`

---

## 🎯 Próximos Pasos

1. ✅ Haz commit de estos cambios
2. ✅ Push a GitHub
3. ✅ Configura los secrets
4. ✅ Crea un PR de prueba
5. ✅ Verifica que el pipeline funcione

---

## 📞 Comandos Rápidos

```bash
# Validar todo antes de PR
npm run validate

# Ver cobertura
npm run test:coverage

# Arreglar lint automáticamente
npm run lint:fix

# Verificar tipos
npm run type-check
```

---

**¡El pipeline está listo para usar!** 🚀

Cuando crees un PR, GitHub Actions lo validará automáticamente y te dirá si puede ser mergeado.

