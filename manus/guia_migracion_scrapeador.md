# Guía de Migración del Scrapeador de Substack

**Fecha:** 22 enero 2026, 05:28 GMT+1

---

## 🎯 Objetivo

Esta guía te ayudará a migrar el sistema de scraping de Substack desde la configuración actual (cuenta de GitHub meowrhino y Render actual) a una nueva cuenta de GitHub y una nueva cuenta de Render.

---

## 📊 Arquitectura actual

El sistema de scraping funciona con dos componentes:

### 1. Backend en Render
- **URL actual:** `https://rikamichie.onrender.com/feed`
- **Función:** Scrapea el feed de Substack de Erika Michi y lo devuelve en formato JSON
- **Tecnología:** Probablemente Node.js o Python (necesitas verificar en tu cuenta de Render)

### 2. GitHub Actions (Frontend)
- **Archivo:** `.github/workflows/update-feed.yml`
- **Función:** Se ejecuta cada domingo a las 12:00 UTC y descarga el feed desde Render
- **Proceso:** Descarga → Valida → Commitea si hay cambios

---

## 🔧 Proceso de migración paso a paso

### PASO 1: Exportar el código del backend desde Render

#### 1.1. Acceder a tu cuenta de Render actual

1. Ve a [https://render.com](https://render.com)
2. Inicia sesión con la cuenta que tiene el servicio `rikamichie`
3. Localiza el servicio en el dashboard

#### 1.2. Identificar el origen del código

Render puede estar conectado a:
- Un repositorio de GitHub
- Un repositorio de GitLab
- Código subido manualmente

**Acción:** Verifica en la configuración del servicio de dónde viene el código.

#### 1.3. Exportar el código

**Si está conectado a un repositorio:**
1. Anota la URL del repositorio
2. Clona el repositorio localmente:
   ```bash
   git clone URL_DEL_REPOSITORIO
   ```

**Si el código fue subido manualmente:**
1. Necesitarás recrear el código o contactar con quien lo creó originalmente
2. Puedes intentar hacer ingeniería inversa probando la API en `/feed`

#### 1.4. Anotar las variables de entorno

En la configuración del servicio de Render, ve a la sección "Environment":
1. Anota todas las variables de entorno configuradas
2. Guarda los valores de forma segura (pueden incluir API keys)

**Variables comunes en scrapers de Substack:**
- `SUBSTACK_URL`: URL del blog de Substack
- `API_KEY`: Si usa alguna API
- `PORT`: Puerto del servidor (usualmente 10000 en Render)

---

### PASO 2: Crear el nuevo servicio en Render

#### 2.1. Crear una nueva cuenta de Render

1. Ve a [https://render.com/signup](https://render.com/signup)
2. Crea una nueva cuenta con el email de la nueva organización
3. Verifica el email

#### 2.2. Preparar el repositorio (si aplica)

**Opción A: Si tienes el código en un nuevo repositorio de GitHub:**
1. Sube el código al nuevo repositorio de GitHub
2. Asegúrate de que incluye todos los archivos necesarios:
   - `package.json` (si es Node.js)
   - `requirements.txt` (si es Python)
   - Archivo principal del servidor (ej: `index.js`, `app.py`)

**Opción B: Si subes el código manualmente:**
1. Ten el código preparado en tu máquina local
2. Asegúrate de que funciona localmente antes de subirlo

#### 2.3. Crear el Web Service en Render

1. En el dashboard de Render, haz clic en "New +"
2. Selecciona "Web Service"
3. Conecta tu repositorio o selecciona "Public Git repository"
4. Configura el servicio:
   - **Name:** `rikamichie-scraper` (o el nombre que prefieras)
   - **Region:** Frankfurt (o la más cercana a Barcelona)
   - **Branch:** `main` o `master`
   - **Runtime:** Node / Python (según tu código)
   - **Build Command:** 
     - Node.js: `npm install`
     - Python: `pip install -r requirements.txt`
   - **Start Command:**
     - Node.js: `node index.js` (o el archivo principal)
     - Python: `python app.py` (o el archivo principal)
   - **Plan:** Free (si es suficiente)

5. Añade las variables de entorno que anotaste en el paso 1.4

6. Haz clic en "Create Web Service"

#### 2.4. Verificar el despliegue

1. Espera a que Render termine de construir y desplegar (puede tardar 5-10 minutos)
2. Una vez desplegado, copia la URL del servicio (ej: `https://rikamichie-scraper-abc123.onrender.com`)
3. Prueba el endpoint en tu navegador:
   ```
   https://TU-NUEVA-URL.onrender.com/feed
   ```
4. Verifica que devuelve JSON válido

---

### PASO 3: Migrar el repositorio de GitHub

#### 3.1. Crear el nuevo repositorio

1. Inicia sesión en la nueva cuenta de GitHub
2. Crea un nuevo repositorio:
   - **Name:** `rikamichie` (o el nombre que prefieras)
   - **Visibility:** Private (recomendado)
   - **Initialize:** Con README si es nuevo, sin él si vas a clonar

#### 3.2. Clonar el repositorio actual (si no lo has hecho ya)

```bash
# Clonar el repo actual
git clone https://github.com/meowrhino/rikamichie.git rikamichie-backup

# Entrar al directorio
cd rikamichie-backup

# Ver los remotes actuales
git remote -v
```

#### 3.3. Cambiar el remote al nuevo repositorio

```bash
# Eliminar el remote actual
git remote remove origin

# Añadir el nuevo remote
git remote add origin https://github.com/NUEVA-CUENTA/rikamichie.git

# Verificar
git remote -v
```

#### 3.4. Subir el código al nuevo repositorio

```bash
# Push de todas las ramas
git push -u origin main

# Si tienes otras ramas
git push --all origin

# Push de los tags (si los hay)
git push --tags origin
```

---

### PASO 4: Actualizar el workflow de GitHub Actions

#### 4.1. Editar el archivo del workflow

Abre el archivo `.github/workflows/update-feed.yml` en tu editor y actualiza la línea 18:

**Antes:**
```yaml
curl -s https://rikamichie.onrender.com/feed > feed.json
```

**Después:**
```yaml
curl -s https://TU-NUEVA-URL.onrender.com/feed > feed.json
```

#### 4.2. Mejorar la validación (RECOMENDADO)

Aprovecha la migración para implementar la mejora sugerida en el INFORME.txt. Reemplaza el paso "Descargar feed HTML desde Render" con:

```yaml
- name: Descargar y validar feed desde Render
  run: |
    echo "Descargando feed desde Render..."
    curl -fS --retry 3 https://TU-NUEVA-URL.onrender.com/feed -o feed_temp.json
    
    echo "Validando que el feed es JSON válido..."
    if jq -e . feed_temp.json > /dev/null 2>&1; then
      mv feed_temp.json feed.json
      echo "✅ Feed válido descargado correctamente"
    else
      echo "❌ Error: El feed descargado no es JSON válido"
      cat feed_temp.json
      exit 1
    fi
```

**Ventajas de esta mejora:**
- Valida que el contenido descargado es JSON válido antes de commitear
- Si hay un error, el workflow falla y no corrompe feed.json
- Usa reintentos automáticos si hay problemas de red
- Muestra el contenido del error para debugging

#### 4.3. Opcional: Actualizar el mensaje de commit

Si quieres que el mensaje de commit sea más descriptivo, actualiza la línea 25:

**Antes:**
```yaml
git diff --cached --quiet || git commit -m "Actualizar feed diario"
```

**Después:**
```yaml
git diff --cached --quiet || git commit -m "🔄 Actualizar feed de Substack ($(date +'%Y-%m-%d %H:%M UTC'))"
```

#### 4.4. Commitear los cambios

```bash
git add .github/workflows/update-feed.yml
git commit -m "Actualizar workflow con nueva URL de Render y validación mejorada"
git push origin main
```

---

### PASO 5: Probar el sistema completo

#### 5.1. Ejecutar el workflow manualmente

1. Ve a tu nuevo repositorio en GitHub
2. Haz clic en la pestaña "Actions"
3. Selecciona el workflow "Actualizar feed JSON domingo a las 12 UTC"
4. Haz clic en "Run workflow"
5. Selecciona la rama `main`
6. Haz clic en "Run workflow"

#### 5.2. Verificar la ejecución

1. Espera a que el workflow termine (debería tardar menos de 1 minuto)
2. Verifica que el estado es ✅ (verde)
3. Haz clic en el workflow para ver los logs
4. Verifica que no hay errores

#### 5.3. Verificar el archivo feed.json

1. Ve a la raíz del repositorio
2. Abre el archivo `feed.json`
3. Verifica que contiene datos válidos del feed de Substack
4. Comprueba que la fecha del último commit es reciente

#### 5.4. Probar la web

1. Abre la web de rikamichie (si está desplegada en GitHub Pages)
2. Navega a la sección que consume el feed
3. Verifica que los datos se muestran correctamente

---

## 🔍 Troubleshooting

### Problema: El workflow falla con "curl: (6) Could not resolve host"

**Causa:** La URL de Render es incorrecta o el servicio no está desplegado.

**Solución:**
1. Verifica que la URL en el workflow es correcta
2. Prueba la URL manualmente en tu navegador
3. Verifica que el servicio en Render está activo (no en "Suspended")

### Problema: El workflow falla con "jq: parse error"

**Causa:** El endpoint de Render está devolviendo HTML o texto plano en lugar de JSON.

**Solución:**
1. Prueba la URL manualmente: `curl https://TU-URL.onrender.com/feed`
2. Verifica que el backend está funcionando correctamente
3. Revisa los logs del servicio en Render para ver si hay errores

### Problema: El servicio de Render se suspende (Free tier)

**Causa:** Los servicios gratuitos de Render se suspenden después de 15 minutos de inactividad.

**Solución:**
1. El primer request después de la suspensión puede tardar 30-60 segundos
2. Considera añadir un servicio de "keep-alive" que haga ping cada 10 minutos
3. O actualiza a un plan de pago si necesitas disponibilidad 24/7

### Problema: El feed.json no se actualiza en la web

**Causa:** El navegador está cacheando el archivo.

**Solución:**
1. Añade un query parameter con timestamp: `feed.json?t=${Date.now()}`
2. Configura headers de cache en GitHub Pages
3. Haz hard refresh en el navegador (Ctrl+Shift+R)

---

## 📋 Checklist de migración

### Preparación
- [ ] Acceder a la cuenta de Render actual
- [ ] Identificar el origen del código del backend
- [ ] Exportar el código del backend
- [ ] Anotar todas las variables de entorno
- [ ] Clonar el repositorio actual de GitHub

### Render
- [ ] Crear nueva cuenta de Render
- [ ] Subir código al nuevo repositorio (si aplica)
- [ ] Crear nuevo Web Service
- [ ] Configurar variables de entorno
- [ ] Verificar que el servicio está activo
- [ ] Probar el endpoint /feed

### GitHub
- [ ] Crear nuevo repositorio en la nueva cuenta
- [ ] Cambiar el remote del repositorio local
- [ ] Subir el código al nuevo repositorio
- [ ] Actualizar la URL en update-feed.yml
- [ ] Implementar validación mejorada (recomendado)
- [ ] Commitear y pushear los cambios

### Pruebas
- [ ] Ejecutar el workflow manualmente
- [ ] Verificar que no hay errores en los logs
- [ ] Verificar que feed.json se actualiza
- [ ] Probar la web completa
- [ ] Verificar que el cron funciona el domingo siguiente

### Limpieza (opcional)
- [ ] Desactivar el servicio antiguo de Render
- [ ] Archivar el repositorio antiguo de GitHub
- [ ] Documentar la nueva configuración

---

## 📝 Notas importantes

### Sobre el código del backend

Si no tienes acceso al código del backend, aquí hay un ejemplo básico de cómo podría ser (Node.js + Express):

```javascript
const express = require('express');
const axios = require('axios');
const app = express();

const SUBSTACK_URL = process.env.SUBSTACK_URL || 'https://erikamichi.substack.com';

app.get('/feed', async (req, res) => {
  try {
    // Obtener el feed RSS de Substack
    const response = await axios.get(`${SUBSTACK_URL}/feed`);
    
    // Aquí iría la lógica de parsing y transformación
    // Por simplicidad, devolvemos el feed tal cual
    res.json(response.data);
  } catch (error) {
    console.error('Error al obtener el feed:', error);
    res.status(500).json({ error: 'Error al obtener el feed' });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
```

### Sobre los costos

**Render Free Tier:**
- 750 horas/mes de tiempo de ejecución
- El servicio se suspende después de 15 minutos de inactividad
- Suficiente para un scraper que se ejecuta una vez por semana

**GitHub Actions:**
- 2000 minutos/mes en repositorios privados (gratis)
- Ilimitado en repositorios públicos
- El workflow actual usa menos de 1 minuto por ejecución

### Sobre la seguridad

**Recomendaciones:**
- Usa repositorios privados si el feed contiene información sensible
- No commitees API keys o secrets en el código
- Usa GitHub Secrets para variables sensibles en el workflow
- Añade `rel="noopener noreferrer"` a enlaces externos (ya mencionado en INFORME.txt)

---

## 🚀 Próximos pasos después de la migración

1. **Monitorear el primer mes:**
   - Verifica que el cron se ejecuta correctamente cada domingo
   - Revisa los logs de Render para detectar errores
   - Asegúrate de que el servicio no se queda suspendido

2. **Optimizaciones opcionales:**
   - Implementar caché en el backend para reducir requests a Substack
   - Añadir notificaciones si el workflow falla (GitHub Actions + email)
   - Implementar un sistema de backup del feed

3. **Documentación:**
   - Actualizar el README.md con la nueva configuración
   - Documentar las variables de entorno necesarias
   - Crear una guía de troubleshooting específica para tu caso

---

## 📞 ¿Necesitas ayuda?

Si encuentras algún problema durante la migración o necesitas ayuda con algún paso específico, no dudes en preguntar. Puedo ayudarte con:

- Debugging del backend
- Configuración de GitHub Actions
- Problemas con Render
- Optimización del sistema

---

**Fin de la guía** - 22 de enero de 2026, 05:35h GMT+1

