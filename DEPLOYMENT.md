# 🚀 Guía de Deployment

Esta guía explica cómo desplegar tu aplicación de e-commerce en producción.

## 📋 Pre-requisitos

- ✅ Proyecto configurado y funcionando localmente
- ✅ Base de datos de Supabase configurada
- ✅ Cuenta en plataforma de hosting

## 🌐 Opciones de Deployment

### Opción 1: Vercel (Recomendado)

**Ventajas**: Gratuito, configuración automática, CI/CD integrado

#### Pasos:

1. **Instalar Vercel CLI (opcional)**
```bash
npm install -g vercel
```

2. **Deploy desde GitHub (Recomendado)**
   - Ve a [vercel.com](https://vercel.com)
   - Conecta tu repositorio de GitHub
   - Selecciona el proyecto
   - Configura las variables de entorno
   - Deploy automático

3. **Deploy con CLI**
```bash
# Login
vercel login

# Deploy
vercel

# Deploy a producción
vercel --prod
```

4. **Configurar Variables de Entorno en Vercel**
   - Ve a tu proyecto en Vercel
   - Settings > Environment Variables
   - Agrega:
     ```
     VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
     VITE_SUPABASE_ANON_KEY=tu-anon-key
     ```
   - Redeploy

---

### Opción 2: Netlify

**Ventajas**: Gratuito, fácil configuración, funciones serverless

#### Pasos:

1. **Instalar Netlify CLI (opcional)**
```bash
npm install -g netlify-cli
```

2. **Deploy desde GitHub**
   - Ve a [netlify.com](https://netlify.com)
   - New site from Git
   - Conecta repositorio
   - Configuración:
     ```
     Build command: npm run build
     Publish directory: dist
     ```

3. **Configurar Variables de Entorno**
   - Site settings > Environment variables
   - Agrega las variables de Supabase

4. **Deploy con CLI**
```bash
# Login
netlify login

# Deploy
netlify deploy

# Deploy a producción
netlify deploy --prod
```

---

### Opción 3: Firebase Hosting

**Ya configurado en el proyecto**

#### Pasos:

1. **Instalar Firebase CLI**
```bash
npm install -g firebase-tools
```

2. **Login**
```bash
firebase login
```

3. **Inicializar (si no está inicializado)**
```bash
firebase init hosting
```

4. **Build y Deploy**
```bash
npm run deploy
```

**Nota**: El comando `npm run deploy` ya ejecuta `npm run build && firebase deploy`

---

### Opción 4: GitHub Pages

**Gratuito, ideal para demos**

#### Pasos:

1. **Instalar gh-pages**
```bash
npm install -D gh-pages
```

2. **Agregar al package.json**
```json
{
  "homepage": "https://tu-usuario.github.io/tu-repo",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

3. **Configurar base en vite.config.ts**
```typescript
export default defineConfig({
  base: '/tu-repo/',
  // ...
});
```

4. **Deploy**
```bash
npm run deploy
```

---

## ⚙️ Configuración de Producción

### 1. Variables de Entorno

**IMPORTANTE**: Nunca incluyas secretos en el código

```bash
# .env.production (no commitear)
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-produccion
```

### 2. Optimizaciones de Build

En `vite.config.ts`:

```typescript
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          supabase: ['@supabase/supabase-js'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
});
```

### 3. Configurar CORS en Supabase

1. Ve a Supabase Dashboard
2. Settings > API
3. CORS Allowed Origins
4. Agrega tu dominio: `https://tu-dominio.com`

### 4. Configurar Dominio Personalizado

#### Vercel
1. Settings > Domains
2. Add domain
3. Configurar DNS según instrucciones

#### Netlify
1. Domain settings > Add custom domain
2. Configurar DNS

---

## 🔒 Seguridad en Producción

### Checklist de Seguridad

- ✅ Variables de entorno configuradas correctamente
- ✅ RLS policies activas en Supabase
- ✅ HTTPS habilitado (automático en Vercel/Netlify)
- ✅ Rate limiting configurado
- ✅ CORS configurado en Supabase
- ✅ Headers de seguridad configurados

### Headers de Seguridad (Vercel)

Crear `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

### Headers de Seguridad (Netlify)

Crear `netlify.toml`:

```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

---

## 📊 Monitoreo y Analytics

### 1. Google Analytics

```typescript
// src/lib/analytics.ts
export const GA_TRACKING_ID = 'G-XXXXXXXXXX';

export const pageview = (url: string) => {
  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
  });
};
```

Agregar en `index.html`:

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### 2. Sentry (Error Tracking)

```bash
npm install @sentry/react
```

```typescript
// src/main.tsx
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: 'tu-sentry-dsn',
  environment: import.meta.env.MODE,
});
```

---

## 🚦 CI/CD

### GitHub Actions (Vercel)

Crear `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test
      - run: npm run build
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

---

## 🔄 Actualizaciones

### Estrategia de Deploy

1. **Desarrollo**
   ```bash
   git checkout develop
   # hacer cambios
   npm run test
   git commit -m "feat: nueva funcionalidad"
   git push origin develop
   ```

2. **Staging** (opcional)
   ```bash
   git checkout staging
   git merge develop
   git push origin staging
   # Deploy automático a staging
   ```

3. **Producción**
   ```bash
   git checkout main
   git merge staging  # o develop
   git tag v1.0.1
   git push origin main --tags
   # Deploy automático a producción
   ```

---

## 🐛 Troubleshooting en Producción

### Build Falla

**Error**: Module not found
```bash
# Limpiar caché y reinstalar
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Variables de Entorno no Funcionan

- Verificar que comiencen con `VITE_`
- Redeploy después de agregar variables
- Limpiar caché del build

### Errores de CORS

- Agregar dominio en Supabase
- Verificar URL exacta (con/sin www)
- Revisar headers de seguridad

### Performance Lento

1. Analizar bundle:
```bash
npm run build -- --mode=analyze
```

2. Optimizar imágenes
3. Implementar lazy loading
4. Usar CDN para assets

---

## 📈 Post-Deployment

### Checklist

- ✅ Verificar todas las páginas funcionan
- ✅ Probar formularios (pedido y contacto)
- ✅ Verificar carrito persiste
- ✅ Probar en móvil
- ✅ Revisar analytics
- ✅ Configurar alertas de error
- ✅ Backup de base de datos
- ✅ Documentar URL de producción

### Monitoreo

1. **Supabase Dashboard**
   - Revisar uso de base de datos
   - Monitorear queries lentas
   - Verificar RLS policies

2. **Vercel/Netlify Analytics**
   - Tiempo de carga
   - Core Web Vitals
   - Tráfico

3. **Error Tracking**
   - Configurar Sentry
   - Alertas por email
   - Revisar errores diariamente

---

## 🎯 URLs Útiles

- **Vercel**: [vercel.com](https://vercel.com)
- **Netlify**: [netlify.com](https://netlify.com)
- **Firebase**: [firebase.google.com](https://firebase.google.com)
- **Supabase**: [supabase.com](https://supabase.com)

---

## 💡 Consejos Finales

1. **Siempre probar en local antes de deploy**
2. **Usar staging environment para cambios grandes**
3. **Mantener backups de la base de datos**
4. **Monitorear logs regularmente**
5. **Tener un plan de rollback**
6. **Documentar cambios importantes**

---

**¡Listo para producción! 🚀**

Si necesitas ayuda específica para tu plataforma de hosting, consulta su documentación oficial.

