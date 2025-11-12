# 🔥 Guía Completa: Desplegar a Firebase Hosting

## 📋 Paso 1: Crear el Proyecto en Firebase Console

### Opción A: Desde la Web (Recomendado para principiantes)

1. **Abre tu navegador** y ve a: https://console.firebase.google.com/

2. **Inicia sesión** con tu cuenta de Google

3. **Crea un nuevo proyecto:**
   - Haz clic en el botón **"Agregar proyecto"** o **"Crear un proyecto"**
   - Escribe un nombre para tu proyecto (ejemplo: `el-campo-don-ramon`)
   - Haz clic en **"Continuar"**

4. **Google Analytics (Opcional):**
   - Puedes activarlo o desactivarlo según prefieras
   - Si lo activas, elige una cuenta de Analytics o crea una nueva
   - Haz clic en **"Continuar"** o **"Crear proyecto"**

5. **Espera** a que Firebase termine de crear el proyecto (unos segundos)

6. **Obtén el ID del proyecto:**
   - En la página principal, haz clic en el **⚙️ (engranaje)** junto a "Información del proyecto"
   - Selecciona **"Configuración del proyecto"**
   - En la pestaña "General", busca **"ID del proyecto"**
   - **Copia ese ID** (ejemplo: `el-campo-don-ramon-abc123`)

### Opción B: Desde la Terminal (Más rápido)

Si ya tienes Firebase CLI instalado, puedes crear el proyecto desde la terminal:

```bash
firebase projects:create el-campo-don-ramon
```

---

## 📋 Paso 2: Instalar Firebase CLI

Abre PowerShell o CMD en la carpeta de tu proyecto y ejecuta:

```bash
npm install -g firebase-tools
```

Si tienes problemas, prueba con:

```bash
npm install -g firebase-tools --force
```

---

## 📋 Paso 3: Iniciar Sesión en Firebase

Ejecuta en la terminal:

```bash
firebase login
```

Esto abrirá tu navegador para que inicies sesión con tu cuenta de Google.

---

## 📋 Paso 4: Configurar tu Proyecto Local

### 4.1. Actualizar el archivo `.firebaserc`

Abre el archivo `.firebaserc` y reemplaza `"tu-proyecto-id"` con el ID real que copiaste:

```json
{
  "projects": {
    "default": "el-campo-don-ramon-abc123"
  }
}
```

### 4.2. Inicializar Firebase Hosting

Ejecuta en la terminal:

```bash
firebase init hosting
```

**Preguntas que te hará:**

1. **"¿Qué directorio usar como directorio público?"**
   - Escribe: `dist`
   - Presiona Enter

2. **"¿Configurar como aplicación de una sola página?"**
   - Escribe: `y` (yes)
   - Presiona Enter

3. **"¿Configurar GitHub Actions?"**
   - Escribe: `n` (no)
   - Presiona Enter

4. **"¿Sobrescribir index.html?"**
   - Escribe: `n` (no)
   - Presiona Enter

---

## 📋 Paso 5: Construir y Desplegar

### Construir la aplicación:

```bash
npm run build
```

Esto creará la carpeta `dist/` con todos los archivos listos para producción.

### Desplegar a Firebase:

```bash
firebase deploy
```

O usa el script que ya está configurado:

```bash
npm run deploy
```

---

## 📋 Paso 6: ¡Listo! 🎉

Al finalizar, verás algo como:

```
✔ Deploy complete!

Hosting URL: https://el-campo-don-ramon-abc123.web.app
```

**¡Tu sitio ya está en línea!** 🌐

---

## 🔄 Para Actualizar tu Sitio

Cada vez que hagas cambios, simplemente ejecuta:

```bash
npm run deploy
```

---

## ❓ Solución de Problemas

### Error: "Firebase CLI not found"
```bash
npm install -g firebase-tools
```

### Error: "No se encuentra el proyecto"
- Verifica que el ID en `.firebaserc` sea correcto
- Asegúrate de estar logueado: `firebase login`

### Error: "No se encuentra la carpeta dist"
- Ejecuta primero: `npm run build`

---

## 📞 ¿Necesitas Ayuda?

Si tienes algún problema, comparte el mensaje de error y te ayudo a resolverlo.

