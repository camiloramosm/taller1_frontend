# 🚀 Guía de Deployment Automático en Vercel

Esta guía te ayudará a configurar el deployment automático a Vercel cada vez que hagas merge a la rama `main`.

## 📋 Requisitos Previos

- Cuenta en [Vercel](https://vercel.com)
- Repositorio conectado a GitHub
- Acceso a la configuración del repositorio en GitHub

## 🔧 Configuración Paso a Paso

### Paso 1: Crear Proyecto en Vercel

#### Opción A: Importar desde GitHub (Recomendado)

1. Ve a [Vercel Dashboard](https://vercel.com/dashboard)
2. Haz clic en **"Add New..."** → **"Project"**
3. Selecciona **"Import Git Repository"**
4. Autoriza a Vercel para acceder a tu GitHub
5. Busca y selecciona: `camiloramosm/taller1_frontend`
6. **IMPORTANTE**: En la configuración:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build` (debería detectarse automáticamente)
   - **Output Directory**: `dist` (debería detectarse automáticamente)
   - **Install Command**: `npm ci`

7. **Variables de Entorno** (en Vercel):
   - Haz clic en **"Environment Variables"**
   - Agrega:
     ```
     VITE_SUPABASE_URL = tu_supabase_url
     VITE_SUPABASE_ANON_KEY = tu_supabase_anon_key
     ```
   - Selecciona: Production, Preview, Development

8. Haz clic en **"Deploy"**

9. **Importante**: Ve a Settings → Git y **desactiva**:
   - ❌ **Automatic Deployments** (lo haremos con GitHub Actions)

#### Opción B: Crear Proyecto Manualmente

1. Ve a [Vercel Dashboard](https://vercel.com/dashboard)
2. Crea un nuevo proyecto
3. Anota el nombre del proyecto

### Paso 2: Obtener Tokens de Vercel

#### 2.1 Vercel Token

1. Ve a [Vercel Account Settings → Tokens](https://vercel.com/account/tokens)
2. Haz clic en **"Create Token"**
3. Nombre: `GitHub Actions - taller1_frontend`
4. Scope: **Full Account**
5. Expiration: **No Expiration** (o el tiempo que prefieras)
6. Haz clic en **"Create"**
7. **⚠️ IMPORTANTE**: Copia el token inmediatamente (no se mostrará de nuevo)
   ```
   Ejemplo: vercel_aBcDeFgHiJkLmNoPqRsTuVwXyZ1234567890
   ```

#### 2.2 Organization ID

**Método 1: Desde Vercel CLI (Recomendado)**

```bash
# Instalar Vercel CLI globalmente
npm install -g vercel

# Login en Vercel
vercel login

# Ir a tu proyecto local
cd D:/projects/CW/reactjs/taller1

# Vincular el proyecto (esto genera .vercel/project.json)
vercel link

# Ver el Organization ID
cat .vercel/project.json
```

El archivo `.vercel/project.json` tendrá:
```json
{
  "orgId": "team_aBcDeFgHiJkLmNoPqRsTuVw",
  "projectId": "prj_XyZ1234567890aBcDeFgHiJkL"
}
```

**Método 2: Desde la URL de Vercel**

1. Ve a tu proyecto en Vercel
2. La URL será algo como:
   ```
   https://vercel.com/tu-username/proyecto/settings
   ```
3. El Organization ID es el nombre después de `vercel.com/`
4. Para proyectos personales, usa tu username de Vercel

**Método 3: Desde Settings**

1. Ve a tu proyecto en Vercel
2. Settings → General
3. Busca "Project ID" en la parte inferior
4. También puedes ir a tu cuenta: Settings → General → Team ID

#### 2.3 Project ID

Desde el mismo archivo `.vercel/project.json` o:

1. Ve a tu proyecto en Vercel
2. Settings → General
3. Busca **"Project ID"** al final de la página
   ```
   Ejemplo: prj_XyZ1234567890aBcDeFgHiJkL
   ```

### Paso 3: Configurar Secrets en GitHub

1. Ve a tu repositorio: https://github.com/camiloramosm/taller1_frontend

2. **Settings** → **Secrets and variables** → **Actions**

3. Haz clic en **"New repository secret"**

4. Agrega los siguientes secrets (uno por uno):

#### Secret 1: VERCEL_TOKEN
```
Name: VERCEL_TOKEN
Value: vercel_aBcDeFgHiJkLmNoPqRsTuVwXyZ1234567890
```

#### Secret 2: VERCEL_ORG_ID
```
Name: VERCEL_ORG_ID
Value: team_aBcDeFgHiJkLmNoPqRsTuVw
```
(O tu username si es proyecto personal)

#### Secret 3: VERCEL_PROJECT_ID
```
Name: VERCEL_PROJECT_ID
Value: prj_XyZ1234567890aBcDeFgHiJkL
```

#### Secrets ya existentes (verifica que estén):
```
Name: VITE_SUPABASE_URL
Value: https://tu-proyecto.supabase.co

Name: VITE_SUPABASE_ANON_KEY
Value: tu_supabase_anon_key
```

### Paso 4: Verificar Configuración

Una vez configurados todos los secrets, deberías tener:

```
✅ VERCEL_TOKEN
✅ VERCEL_ORG_ID
✅ VERCEL_PROJECT_ID
✅ VITE_SUPABASE_URL
✅ VITE_SUPABASE_ANON_KEY
```

## 🎯 Cómo Funciona

### Flujo de Deployment

```
Merge a main
    ↓
GitHub Actions se activa
    ↓
1. Checkout del código
2. Instalar Node.js
3. Instalar dependencias (npm ci)
4. Build del proyecto (npm run build)
5. Deploy a Vercel (usando vercel-action)
    ↓
✅ App en producción en Vercel
```

### Cuándo se Despliega

El workflow se ejecuta **solamente** cuando:
- ✅ Haces merge de un PR a `main`
- ✅ Haces push directo a `main`

**NO se ejecuta** cuando:
- ❌ Creas un PR (solo ejecuta el CI)
- ❌ Haces push a otras ramas

### Tiempo de Deployment

- **Build**: 1-2 minutos
- **Deploy a Vercel**: 30-60 segundos
- **Total**: 2-3 minutos aproximadamente

## 🔍 Verificar Deployment

### En GitHub Actions

1. Ve a tu repositorio → **Actions**
2. Verás dos workflows:
   - 🔵 **CI - Pruebas y Calidad de Código** (en PRs)
   - 🟢 **Deploy to Vercel** (en merge a main)
3. Haz clic en el workflow de Deploy
4. Verás los pasos ejecutándose en tiempo real

### En Vercel

1. Ve a [Vercel Dashboard](https://vercel.com/dashboard)
2. Selecciona tu proyecto
3. Verás los deployments:
   - **Production**: Deployments a main
   - **Preview**: Deployments de branches (si están habilitados)

### URL de tu Aplicación

Después del primer deploy, tu app estará en:
```
https://taller1-frontend.vercel.app
```
O el dominio personalizado que configures.

## 🛠️ Comandos Útiles

### Desplegar Manualmente desde Local

```bash
# Instalar Vercel CLI (si no lo tienes)
npm install -g vercel

# Login
vercel login

# Deploy a producción
vercel --prod

# Deploy a preview
vercel
```

### Ver Logs de Deployment

```bash
# Ver lista de deployments
vercel list

# Ver logs del último deployment
vercel logs
```

### Vincular Proyecto Local

```bash
# Vincular con proyecto existente en Vercel
vercel link
```

## ⚙️ Configuración Avanzada

### Configurar Dominio Personalizado

1. Ve a tu proyecto en Vercel
2. **Settings** → **Domains**
3. Agrega tu dominio
4. Configura los DNS según las instrucciones

### Variables de Entorno por Ambiente

En Vercel, puedes tener diferentes valores para:
- **Production**: Variables para producción
- **Preview**: Variables para PRs
- **Development**: Variables para desarrollo local

### Desactivar Preview Deployments

Si solo quieres deployments a producción:

1. Ve a **Settings** → **Git**
2. Desactiva **"Automatic Deployments from Git"**
3. El workflow de GitHub Actions manejará todo

## 🐛 Solución de Problemas

### Error: "Vercel token not found"

**Causa**: El secret `VERCEL_TOKEN` no está configurado o es inválido.

**Solución**:
1. Verifica que el secret esté en GitHub: Settings → Secrets → Actions
2. Genera un nuevo token en Vercel si es necesario
3. Actualiza el secret en GitHub

### Error: "Project not found"

**Causa**: Los IDs de organización o proyecto son incorrectos.

**Solución**:
1. Ejecuta `vercel link` en tu proyecto local
2. Copia los IDs del archivo `.vercel/project.json`
3. Actualiza los secrets en GitHub

### Error: "Build failed"

**Causa**: El build falla (usualmente por variables de entorno).

**Solución**:
1. Verifica que `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` estén configurados
2. Ejecuta `npm run build` localmente para reproducir el error
3. Revisa los logs en GitHub Actions

### El deployment no se ejecuta

**Causa**: El workflow no se activó o hay errores en el YAML.

**Solución**:
1. Verifica que el archivo esté en `.github/workflows/deploy.yml`
2. Ve a Actions en GitHub y busca errores
3. Asegúrate de que el push fue a la rama `main`

### El sitio muestra errores

**Causa**: Variables de entorno incorrectas o faltantes.

**Solución**:
1. Ve a Vercel → Settings → Environment Variables
2. Verifica que todas las variables estén correctas
3. Redeploy desde Vercel o haz un nuevo push a main

## 📊 Monitoreo

### Vercel Analytics (Opcional)

Para ver estadísticas de tu app:

1. Ve a tu proyecto en Vercel
2. **Analytics** tab
3. Habilita Web Analytics
4. Agrega el script en tu `index.html` (opcional, Vercel lo hace automáticamente)

### Logs y Debugging

```bash
# Ver logs en tiempo real
vercel logs --follow

# Ver logs de producción
vercel logs --prod
```

## 🔐 Seguridad

### Proteger Secrets

- ✅ **NUNCA** hagas commit de los tokens
- ✅ Los secrets de GitHub Actions están encriptados
- ✅ Rota los tokens periódicamente (cada 3-6 meses)
- ✅ Usa tokens con el mínimo scope necesario

### Verificar Deployments

Antes de aprobar un deployment a producción:
- ✅ Revisa que el CI haya pasado
- ✅ Verifica en preview si es necesario
- ✅ Revisa los logs por errores

## 📈 Mejoras Futuras

- [ ] Preview deployments para cada PR
- [ ] Deployment a staging environment
- [ ] Notificaciones en Slack/Discord
- [ ] Tests E2E antes del deployment
- [ ] Rollback automático en caso de errores

## 📚 Referencias

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel CLI](https://vercel.com/docs/cli)
- [GitHub Actions for Vercel](https://github.com/amondnet/vercel-action)
- [Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

## 🆘 Ayuda

Si tienes problemas:
1. Revisa los logs en GitHub Actions
2. Revisa los logs en Vercel Dashboard
3. Verifica que todos los secrets estén correctos
4. Contacta al equipo o abre un issue

---

**Última actualización**: Noviembre 2024  
**Repositorio**: taller1_frontend  
**Maintainer**: @camiloramosm

