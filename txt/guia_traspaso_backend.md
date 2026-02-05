# 🔄 Guía completa de traspaso del backend a cliente

Esta guía te explica paso a paso cómo traspasar toda la infraestructura del backend del scrapeador de Substack a una nueva cuenta de GitHub y Render para que el cliente tenga autonomía completa.

---

## 📋 Índice

1. [Resumen ejecutivo](#resumen-ejecutivo)
2. [Requisitos previos](#requisitos-previos)
3. [Paso 1: Crear cuenta de GitHub del cliente](#paso-1-crear-cuenta-de-github-del-cliente)
4. [Paso 2: Transferir el repositorio](#paso-2-transferir-el-repositorio)
5. [Paso 3: Configurar GitHub Actions](#paso-3-configurar-github-actions)
6. [Paso 4: Crear cuenta de Render](#paso-4-crear-cuenta-de-render)
7. [Paso 5: Desplegar el backend en Render](#paso-5-desplegar-el-backend-en-render)
8. [Paso 6: Actualizar la URL del feed](#paso-6-actualizar-la-url-del-feed)
9. [Paso 7: Verificación final](#paso-7-verificación-final)
10. [Troubleshooting](#troubleshooting)
11. [Mantenimiento futuro](#mantenimiento-futuro)

---

## 🎯 Resumen ejecutivo

El proyecto **rikamichie** tiene dos partes:

1. **Frontend (GitHub Pages):** La web estática que se ve en `https://meowrhino.github.io/rikamichie/`
2. **Backend (Render):** Un servidor Node.js que scrapea el feed de Substack y lo convierte en JSON

**Objetivo del traspaso:** Que el cliente tenga control total de ambas partes en sus propias cuentas.

**Tiempo estimado:** 30-45 minutos

---

## 📦 Requisitos previos

### Para el cliente (Erika)

- [ ] Cuenta de email activa
- [ ] Acceso a internet
- [ ] Navegador web actualizado

### Para ti (desarrollador)

- [ ] Acceso actual al repositorio `meowrhino/rikamichie`
- [ ] Acceso actual al backend en Render
- [ ] Email del cliente para invitaciones

---

## 🆕 Paso 1: Crear cuenta de GitHub del cliente

### 1.1. Registrarse en GitHub

1. El cliente debe ir a https://github.com/signup
2. Completar el registro con:
   - Email (ej: `rikamichie@gmail.com`)
   - Contraseña segura
   - Username (ej: `erikamichi` o `rikamichie`)
3. Verificar el email
4. Completar el perfil (opcional pero recomendado)

### 1.2. Configurar autenticación de dos factores (recomendado)

1. Ir a Settings → Password and authentication
2. Activar 2FA con app de autenticación (Google Authenticator, Authy, etc.)
3. Guardar códigos de recuperación en lugar seguro

---

## 🔄 Paso 2: Transferir el repositorio

Hay dos opciones para transferir el repositorio. **Recomiendo la Opción A** (transferencia directa) porque mantiene todo el historial y configuración.

### Opción A: Transferencia directa (recomendada)

**Ventajas:**
- Mantiene todo el historial de commits
- Mantiene issues, pull requests, etc.
- Mantiene configuración de GitHub Pages
- Mantiene GitHub Actions
- Proceso más limpio

**Pasos:**

1. **Tú (desarrollador)** vas al repositorio:
   - https://github.com/meowrhino/rikamichie

2. Click en **Settings** (arriba a la derecha)

3. Scroll hasta el final → sección **Danger Zone**

4. Click en **Transfer ownership**

5. Completar:
   - New owner's GitHub username: `erikamichi` (o el username del cliente)
   - Repository name: `rikamichie` (mantener el mismo)
   - Escribir el nombre del repo para confirmar

6. Click en **I understand, transfer this repository**

7. GitHub enviará un email al cliente para aceptar la transferencia

8. **El cliente** debe:
   - Revisar su email
   - Click en el enlace de confirmación
   - Aceptar la transferencia

9. **Listo!** El repositorio ahora está en `https://github.com/erikamichi/rikamichie`

### Opción B: Fork y configuración manual (alternativa)

**Ventajas:**
- Tú mantienes una copia del original
- Más control sobre qué se transfiere

**Desventajas:**
- Pierde el historial de commits
- Hay que reconfigurar GitHub Pages y Actions
- Más trabajo manual

**Pasos:**

1. **El cliente** hace fork del repositorio:
   - Ir a https://github.com/meowrhino/rikamichie
   - Click en **Fork** (arriba a la derecha)
   - Seleccionar su cuenta como destino
   - Click en **Create fork**

2. **El cliente** activa GitHub Pages:
   - Ir a Settings → Pages
   - Source: Deploy from a branch
   - Branch: `main` / `root`
   - Click en **Save**

3. **El cliente** verifica que GitHub Actions esté activado:
   - Ir a Actions
   - Si está desactivado, click en **I understand my workflows, go ahead and enable them**

---

## ⚙️ Paso 3: Configurar GitHub Actions

El repositorio tiene un workflow que actualiza automáticamente el feed de Substack cada 6 horas.

### 3.1. Verificar que el workflow está activo

1. **El cliente** va a:
   - https://github.com/erikamichi/rikamichie/actions

2. Debería ver el workflow **Update Substack Feed**

3. Si no está activo:
   - Click en el workflow
   - Click en **Enable workflow**

### 3.2. Entender el workflow

El archivo `.github/workflows/update-feed.yml` hace lo siguiente:

```yaml
# Se ejecuta cada 6 horas
schedule:
  - cron: '0 */6 * * *'

# También se puede ejecutar manualmente
workflow_dispatch:

# Pasos:
1. Clona el repositorio
2. Instala Node.js
3. Ejecuta el scrapeador (index.js)
4. Guarda el resultado en feed.json
5. Hace commit y push automático
```

### 3.3. Ejecutar manualmente (para probar)

1. Ir a Actions → Update Substack Feed
2. Click en **Run workflow**
3. Seleccionar branch `main`
4. Click en **Run workflow**
5. Esperar 1-2 minutos
6. Verificar que se creó/actualizó `feed.json` en el repositorio

---

## 🚀 Paso 4: Crear cuenta de Render

Render es la plataforma donde se aloja el backend (el scrapeador).

### 4.1. Registrarse en Render

1. El cliente va a https://render.com/
2. Click en **Get Started** o **Sign Up**
3. Opciones de registro:
   - **Recomendado:** Sign up with GitHub (más fácil para conectar repos)
   - Alternativa: Email y contraseña

4. Si usa GitHub:
   - Autorizar a Render a acceder a la cuenta de GitHub
   - Seleccionar qué repositorios puede ver Render (todos o solo seleccionados)

5. Completar el perfil:
   - Nombre
   - Tipo de cuenta: Individual
   - Uso: Personal project

### 4.2. Plan de Render

**Render tiene un plan gratuito** que es suficiente para este proyecto:

- ✅ 750 horas de ejecución al mes (suficiente)
- ✅ Builds ilimitados
- ✅ SSL gratuito
- ⚠️ El servicio se "duerme" después de 15 minutos de inactividad (tarda 30s en despertar)

**No hace falta pagar nada** para que funcione.

---

## 🔧 Paso 5: Desplegar el backend en Render

### 5.1. Crear nuevo Web Service

1. **El cliente** va al dashboard de Render:
   - https://dashboard.render.com/

2. Click en **New +** (arriba a la derecha)

3. Seleccionar **Web Service**

4. Conectar el repositorio:
   - Si usó GitHub para registrarse, verá la lista de repos
   - Buscar `rikamichie`
   - Click en **Connect**

5. Configurar el servicio:

   **Name:** `rikamichie-backend` (o el que prefiera)
   
   **Region:** Frankfurt (EU Central) - más cerca de Barcelona
   
   **Branch:** `main`
   
   **Root Directory:** (dejar vacío)
   
   **Runtime:** Node
   
   **Build Command:**
   ```bash
   npm install
   ```
   
   **Start Command:**
   ```bash
   node index.js
   ```
   
   **Instance Type:** Free
   
   **Environment Variables:** (ninguna necesaria por ahora)

6. Click en **Create Web Service**

7. Render empezará a hacer el deploy (tarda 2-3 minutos)

### 5.2. Obtener la URL del backend

Una vez desplegado, Render asignará una URL como:

```
https://rikamichie-backend.onrender.com
```

**Guardar esta URL**, la necesitaremos en el siguiente paso.

### 5.3. Verificar que funciona

1. Abrir en el navegador:
   ```
   https://rikamichie-backend.onrender.com/feed
   ```

2. Deberías ver un JSON con los posts de Substack

3. Si ves un error, revisar los logs en Render:
   - Dashboard → rikamichie-backend → Logs

---

## 🔗 Paso 6: Actualizar la URL del feed

Ahora hay que decirle al frontend (la web) que use el nuevo backend.

### 6.1. Actualizar el workflow de GitHub Actions

1. **El cliente** va al repositorio:
   - https://github.com/erikamichi/rikamichie

2. Ir a `.github/workflows/update-feed.yml`

3. Click en el icono del lápiz (Edit)

4. Buscar la línea que dice:
   ```yaml
   BACKEND_URL: 'https://rikamichie-backend-OLD.onrender.com/feed'
   ```

5. Cambiarla por la nueva URL:
   ```yaml
   BACKEND_URL: 'https://rikamichie-backend.onrender.com/feed'
   ```

6. Scroll abajo → **Commit changes**

7. Mensaje del commit: `chore: actualizar URL del backend`

8. Click en **Commit changes**

### 6.2. Ejecutar el workflow manualmente

1. Ir a Actions → Update Substack Feed

2. Click en **Run workflow**

3. Esperar a que termine (1-2 minutos)

4. Verificar que `feed.json` se actualizó correctamente

---

## ✅ Paso 7: Verificación final

### 7.1. Checklist de verificación

- [ ] El repositorio está en la cuenta del cliente
- [ ] GitHub Pages está activo y la web se ve correctamente
- [ ] GitHub Actions se ejecuta sin errores
- [ ] El backend en Render responde correctamente
- [ ] El workflow actualiza el feed.json
- [ ] La web muestra los posts de Substack

### 7.2. URLs finales

**Frontend (web):**
```
https://erikamichi.github.io/rikamichie/
```

**Backend (API):**
```
https://rikamichie-backend.onrender.com/feed
```

**Repositorio:**
```
https://github.com/erikamichi/rikamichie
```

### 7.3. Probar todo el flujo

1. Publicar un nuevo post en Substack

2. Esperar 6 horas (o ejecutar el workflow manualmente)

3. Verificar que el nuevo post aparece en la web

---

## 🔧 Troubleshooting

### Problema 1: GitHub Pages no se activa

**Síntoma:** La web no se ve en `https://erikamichi.github.io/rikamichie/`

**Solución:**
1. Ir a Settings → Pages
2. Verificar que Source esté en `main` / `root`
3. Esperar 2-3 minutos
4. Refrescar la página

### Problema 2: GitHub Actions falla

**Síntoma:** El workflow muestra un error rojo

**Solución:**
1. Ir a Actions → Click en el workflow fallido
2. Leer el error en los logs
3. Errores comunes:
   - **Permission denied:** Ir a Settings → Actions → General → Workflow permissions → Marcar "Read and write permissions"
   - **Backend URL incorrecta:** Verificar que la URL del backend sea correcta
   - **Rate limit:** Esperar 1 hora y volver a intentar

### Problema 3: Render no despliega

**Síntoma:** El deploy en Render falla

**Solución:**
1. Ir a Logs en Render
2. Errores comunes:
   - **Module not found:** Verificar que `package.json` esté en el repositorio
   - **Port error:** Verificar que `index.js` use `process.env.PORT`
   - **Build failed:** Verificar que el Build Command sea `npm install`

### Problema 4: El backend responde 503

**Síntoma:** Al abrir la URL del backend sale error 503

**Causa:** El servicio gratuito de Render se "duerme" después de 15 minutos de inactividad

**Solución:**
- Esperar 30 segundos y refrescar (el servicio se está "despertando")
- Es normal en el plan gratuito
- Si es crítico que responda rápido, considerar upgrade a plan de pago ($7/mes)

### Problema 5: Los posts no se actualizan

**Síntoma:** La web muestra posts antiguos

**Solución:**
1. Verificar que el workflow se ejecutó:
   - Actions → Ver último run
2. Verificar que `feed.json` se actualizó:
   - Ver el archivo en el repositorio
   - Ver la fecha del último commit
3. Limpiar caché del navegador:
   - Ctrl + Shift + R (Windows/Linux)
   - Cmd + Shift + R (Mac)

---

## 🔄 Mantenimiento futuro

### Tareas del cliente

#### Cada mes

- [ ] Verificar que el workflow de GitHub Actions se ejecuta correctamente
- [ ] Verificar que la web muestra los posts recientes

#### Cuando sea necesario

- [ ] Actualizar precios en `data.json`
- [ ] Añadir nuevos discos al carrusel
- [ ] Cambiar imágenes

### Cómo editar data.json

1. Ir al repositorio en GitHub
2. Click en `data.json`
3. Click en el icono del lápiz (Edit)
4. Hacer cambios
5. Scroll abajo → Commit changes
6. Esperar 2-3 minutos
7. Refrescar la web

### Cómo añadir un nuevo disco

1. Subir la imagen a la carpeta `img/`
2. Editar `data.json` → sección `abajo.discos`
3. Añadir:
   ```json
   {
     "image": "./img/nuevo_disco.jpg",
     "caption": "Nombre del disco",
     "bgColor": "#000",
     "btnColor": "#f00",
     "link": "https://enlace-al-disco.com"
   }
   ```

### Cómo cambiar precios

1. Editar `data.json` → sección `derecha.precios`
2. Cambiar los valores de `precio`
3. Commit changes

---

## 📞 Contacto y soporte

### Si algo no funciona

1. **Revisar esta guía** - La mayoría de problemas están en Troubleshooting
2. **Revisar los logs:**
   - GitHub Actions: Actions → Click en el workflow → Logs
   - Render: Dashboard → rikamichie-backend → Logs
3. **Contactar al desarrollador** (tú) con:
   - Descripción del problema
   - Screenshots de los errores
   - URLs relevantes

### Recursos útiles

- **Documentación de GitHub Pages:** https://docs.github.com/en/pages
- **Documentación de GitHub Actions:** https://docs.github.com/en/actions
- **Documentación de Render:** https://render.com/docs
- **Comunidad de Render:** https://community.render.com/

---

## 🎓 Glosario

**GitHub:** Plataforma para alojar código y colaborar en proyectos

**GitHub Pages:** Servicio gratuito de GitHub para alojar sitios web estáticos

**GitHub Actions:** Sistema de automatización de GitHub (como cron jobs)

**Render:** Plataforma para alojar aplicaciones web (alternativa a Heroku)

**Backend:** Servidor que procesa datos (en este caso, scrapea Substack)

**Frontend:** La web que ve el usuario (HTML, CSS, JavaScript)

**Scrapeador:** Programa que extrae información de una web

**Feed:** Lista de posts en formato JSON

**Workflow:** Secuencia de tareas automatizadas

**Deploy:** Publicar/subir una aplicación a un servidor

**Commit:** Guardar cambios en el código con un mensaje descriptivo

**Push:** Subir commits al repositorio remoto

**Branch:** Rama de desarrollo (main es la principal)

---

## 📝 Checklist final de traspaso

### Antes del traspaso

- [ ] Hacer backup del repositorio actual
- [ ] Documentar todas las URLs actuales
- [ ] Verificar que todo funciona correctamente
- [ ] Preparar credenciales de acceso

### Durante el traspaso

- [ ] Cliente crea cuenta de GitHub
- [ ] Transferir repositorio
- [ ] Cliente crea cuenta de Render
- [ ] Desplegar backend en Render
- [ ] Actualizar URL del backend en el workflow
- [ ] Verificar que todo funciona

### Después del traspaso

- [ ] Verificar que la web se ve correctamente
- [ ] Verificar que los posts se actualizan
- [ ] Enviar al cliente esta guía
- [ ] Ofrecer 1 mes de soporte por si hay dudas
- [ ] Opcional: Sesión de 30 minutos explicando cómo editar data.json

---

## 🎉 ¡Listo!

Con esto, el cliente tiene **autonomía completa** sobre su web y backend. Puede:

- ✅ Editar contenido
- ✅ Cambiar precios
- ✅ Añadir discos
- ✅ Actualizar imágenes
- ✅ Ver estadísticas de GitHub
- ✅ Controlar el backend

**Todo sin depender de ti** para cambios básicos.

---

**Última actualización:** 22 de enero de 2026  
**Versión:** 1.0  
**Autor:** meowrhino  
**Contacto:** [Tu email o forma de contacto]
