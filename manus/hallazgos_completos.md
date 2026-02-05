# Hallazgos Completos y Recomendaciones - Rikamichie

**Fecha:** 22 enero 2026, 05:45 GMT+1

---

## 🎯 Resumen ejecutivo

He realizado una revisión exhaustiva de todo el código de rikamichie, incluyendo HTML, CSS, JavaScript, backend y configuración. Este documento presenta todos los hallazgos (los del INFORME.txt más nuevos que he encontrado), explicados con cariño y organizados por prioridad.

---

## 📊 Backend del scrapeador (index.js)

### ✅ Estado actual

¡Perfecto! He encontrado el backend en `index.js` y está muy bien hecho. Es un servidor Express simple y limpio que:

**Tecnología:**
- Express.js (servidor web)
- rss-parser (para parsear el feed RSS de Substack)
- CORS habilitado (permite requests desde GitHub Pages)

**Funcionamiento:**
```javascript
// Endpoint único: /feed
// Parsea https://rikamichie.substack.com/feed
// Devuelve el feed en formato JSON
```

**Dependencias (package.json):**
- express: ^4.18.2
- rss-parser: ^3.13.0
- cors: ^2.8.5

**Script de inicio:** `node index.js`

**Puerto:** 3000 por defecto, o el que defina la variable de entorno `PORT` (Render usa su propio puerto)

### 💡 Recomendaciones para el backend

**1. Añadir validación básica**

El código actual es muy simple, lo cual está bien, pero podría beneficiarse de una validación mínima:

```javascript
app.get("/feed", async (req, res) => {
  try {
    const feed = await parser.parseURL("https://rikamichie.substack.com/feed");
    
    // Validar que el feed tiene items
    if (!feed || !feed.items || feed.items.length === 0) {
      console.warn("Feed vacío o sin items");
      return res.json({ items: [] }); // Devolver estructura válida pero vacía
    }
    
    res.json(feed);
  } catch (err) {
    console.error("Error al parsear feed:", err);
    res.status(500).json({ error: "No se pudo obtener el feed" });
  }
});
```

**2. Añadir caché (opcional pero recomendado)**

Para reducir requests a Substack y mejorar el rendimiento:

```javascript
let cachedFeed = null;
let cacheTime = null;
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutos

app.get("/feed", async (req, res) => {
  try {
    // Si hay caché válida, devolverla
    if (cachedFeed && cacheTime && (Date.now() - cacheTime < CACHE_DURATION)) {
      return res.json(cachedFeed);
    }
    
    // Si no, obtener feed fresco
    const feed = await parser.parseURL("https://rikamichie.substack.com/feed");
    
    // Actualizar caché
    cachedFeed = feed;
    cacheTime = Date.now();
    
    res.json(feed);
  } catch (err) {
    // Si hay error pero tenemos caché, devolver caché aunque esté expirada
    if (cachedFeed) {
      console.warn("Error al obtener feed, usando caché:", err);
      return res.json(cachedFeed);
    }
    
    console.error("Error al parsear feed:", err);
    res.status(500).json({ error: "No se pudo obtener el feed" });
  }
});
```

**3. Añadir endpoint de health check**

Para que Render (o cualquier servicio de monitoring) pueda verificar que el servicio está vivo:

```javascript
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});
```

**4. Documentación para migración**

El backend está listo para migrar. Solo necesitas:
1. Subir el código (index.js + package.json) a un nuevo repositorio o directamente a Render
2. Configurar en Render:
   - Build Command: `npm install`
   - Start Command: `npm start` (o `node index.js`)
   - Environment: Node.js
3. Actualizar la URL en el workflow de GitHub Actions

---

## 🔍 Verificación de dvh/dvw en CSS

### ✅ Uso actual de viewport units

He revisado todo el archivo `style.css` y aquí está el estado actual:

**Unidades dvh/dvw (correctas):**
- ✅ `#content`: `width: 100dvw; height: 100dvh;` (líneas 37-38)
- ✅ `.boton-nav`: `font-size: clamp(1rem, 2dvw, 2rem);` (línea 70)
- ✅ `.btn_arriba`: `top: 3dvh;` (línea 83)
- ✅ `.btn_abajo`: `bottom: 3dvh;` (línea 90)
- ✅ `.btn_derecha`: `right: 1dvw;` (línea 97)
- ✅ `.btn_izquierda`: `left: 1dvw;` (línea 104)
- ✅ `.centro h1`: `font-size: clamp(1.5rem, 5dvw, 3rem);` (línea 122)
- ✅ `.inguma img`: `max-width: clamp(50px, 30dvw, 400px);` (línea 135)
- ✅ `.izq_1`: `top: 10dvh; left: 10dvw; gap: 1dvh;` (líneas 191-193)
- ✅ `.izq_2`: `bottom: 2.5dvh;` (línea 198)
- ✅ `.izq_3`: `left: 10dvw; bottom: 10dvh;` (líneas 205-206)
- ✅ `.lista_libros`: `height: 40dvh; gap: 1dvw; width: 80dvw;` (líneas 226-230)
- ✅ `.der_1_layout`: `width: 100dvw; height: 100dvh;` (líneas 347-348)
- ✅ `.der_1_img span`: `bottom: 2dvh;` (línea 393)
- ✅ `.footer-abajo`: `bottom: 2dvh;` (línea 471)
- ✅ `.contacto-abajo`: `width: 100dvw; height: 100dvh;` (líneas 489-490)
- ✅ `.contacto-abajo img`: `height: 60dvh; max-width: 90dvw; max-height: 90dvh;` (líneas 497-499)
- ✅ `.arriba-timeline`: `width: 100dvw; height: 85dvh;` (líneas 518-519)

**Unidades vw/vh (DEBEN CAMBIARSE a dvw/dvh):**
- ❌ `.izq_2`: `width: 100vw;` (línea 200) → debería ser `100dvw`

**Unidades mixtas (revisar):**
- ⚠️ `.izquierda`: `font-size: clamp(1.2rem, 1dvw, 2rem);` (línea 168) - usa dvw ✅
- ⚠️ `.arriba-timeline`: `font-size: clamp(1rem, 1dvw, 2rem);` (línea 522) - usa dvw ✅

### 🔧 Cambio necesario

Solo hay **UN cambio** necesario en style.css:

**Línea 200:**
```css
/* ANTES */
width: 100vw;

/* DESPUÉS */
width: 100dvw;
```

**Razón:** Para mantener consistencia con el resto del código y evitar problemas con las barras de navegación del navegador en móviles.

---

## 🆕 Nuevos hallazgos (además del INFORME.txt)

### 1. Problema CRÍTICO: Mezcla de rutas relativas inconsistentes

**Ubicación:** Múltiples archivos en `paginas/`

**Problema:** Hay una mezcla inconsistente de rutas relativas que puede causar problemas:

- `abajo.html` línea 3: `src="../img/disco1.jpg"` (usa `../`)
- `abajo_abajo.html` línea 3: `src="./img/inguma.png"` (usa `./`)
- `centro.html` línea 4: `src="./img/inguma.png"` (usa `./`)

**Impacto:** En GitHub Pages, las rutas con `../` pueden romperse dependiendo de la configuración del sitio.

**Solución:** Usar siempre `./img/` para rutas relativas desde la raíz del proyecto.

**Archivos a cambiar:**
- `abajo.html` línea 3: cambiar `../img/disco1.jpg` por `./img/disco1.jpg`

### 2. Problema MEDIO: Falta de meta tags para SEO

**Ubicación:** `index.html`

**Problema:** El HTML solo tiene meta tags básicos. Faltan meta tags importantes para SEO y redes sociales.

**Meta tags actuales:**
```html
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="theme-color" content="#000000" id="themeColor">
<title>rikamichie</title>
```

**Meta tags que faltan:**
- Description (para Google)
- Keywords (opcional pero útil)
- Open Graph (para Facebook, WhatsApp)
- Twitter Card (para Twitter)
- Canonical URL
- Language alternates (si hay versiones en otros idiomas)

**Solución propuesta:** Ver sección de SEO más abajo.

### 3. Problema BAJO: Inconsistencia en el uso de comillas

**Ubicación:** Múltiples archivos JavaScript

**Problema:** Hay mezcla de comillas dobles `"` y comillas simples `'` en el código JavaScript.

**Ejemplos:**
- `script.js` usa mayormente comillas dobles
- `index.js` usa comillas dobles
- Pero en algunos lugares hay comillas simples mezcladas

**Impacto:** Ninguno funcional, pero afecta la legibilidad y consistencia del código.

**Solución:** Estandarizar a comillas dobles (como ya está la mayoría del código).

### 4. Problema BAJO: Archivo test.html en producción

**Ubicación:** `paginas/test.html`

**Problema:** Hay un archivo de testing en la carpeta de páginas que no debería estar en producción.

**Contenido:** Es un HTML de prueba para el feed de Render con estilos inline y un script de testing.

**Solución:** Eliminar `paginas/test.html` o moverlo a una carpeta de testing fuera de producción.

### 5. Problema BAJO: Propiedades CSS inválidas (del INFORME.txt)

**Ubicación:** `style.css`

**Problemas identificados:**

**Línea 176:** `margin: none;`
```css
/* INCORRECTO */
margin: none;

/* CORRECTO */
margin: 0;
```

**Línea 240:** `align-items: right;`
```css
/* INCORRECTO */
align-items: right;

/* CORRECTO */
align-items: flex-end;  /* o center, flex-start según lo que quieras */
```

### 6. Problema BAJO: Falta de favicon alternativo

**Ubicación:** `index.html` línea 10

**Problema:** Solo hay un favicon en formato `.ico`. Los navegadores modernos prefieren PNG o SVG.

**Solución:** Añadir favicons en múltiples formatos:

```html
<link rel="icon" type="image/x-icon" href="img/inguma.ico">
<link rel="icon" type="image/png" sizes="32x32" href="img/inguma-32.png">
<link rel="icon" type="image/png" sizes="16x16" href="img/inguma-16.png">
<link rel="apple-touch-icon" sizes="180x180" href="img/inguma-180.png">
```

### 7. Problema BAJO: Falta de atributo lang en algunos textos

**Ubicación:** Múltiples archivos

**Problema:** Aunque el HTML tiene `lang="es"`, algunos textos en inglés (como en comentarios del código) no están marcados.

**Impacto:** Muy bajo, solo afecta a lectores de pantalla.

**Solución:** No es crítico, pero si hay textos en inglés dentro del contenido, marcarlos con `<span lang="en">`.

### 8. Oportunidad: Lazy loading de imágenes

**Ubicación:** Todas las imágenes

**Oportunidad:** Las imágenes no usan lazy loading, lo que podría mejorar el rendimiento inicial.

**Solución:** Añadir `loading="lazy"` a las imágenes que no están en el viewport inicial:

```html
<img src="./img/inguma.png" alt="inguma" loading="lazy">
```

**Nota:** NO usar lazy loading en imágenes críticas como el logo principal.

### 9. Oportunidad: Preload de fuentes

**Ubicación:** `index.html`

**Oportunidad:** Las fuentes de Google Fonts se cargan desde el CSS, pero podrían precargarse para mejorar el rendimiento.

**Solución:** Añadir preload en el `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
```

**Nota:** Esto ya mejora el rendimiento sin necesidad de precargar los archivos de fuente específicos.

### 10. Oportunidad: Service Worker para PWA

**Ubicación:** No existe

**Oportunidad:** La web podría funcionar como PWA (Progressive Web App) con un service worker básico.

**Beneficios:**
- Funciona offline
- Se puede "instalar" en el móvil
- Mejor rendimiento con caché

**Complejidad:** Media-alta. Solo recomendado si quieres que la web funcione offline.

---

## 📋 Resumen de todos los problemas por prioridad

### 🔴 CRÍTICOS (arreglar YA)

1. **Rutas relativas inconsistentes** - `abajo.html` usa `../img/` que puede romperse en GitHub Pages

### 🟡 MEDIOS (arreglar pronto)

2. **Validación del feed JSON** (INFORME.txt) - El workflow puede commitear feed.json corrupto
3. **Falta de validaciones en data.json** (INFORME.txt) - Si faltan datos, la web rompe
4. **Riesgo de XSS** (INFORME.txt) - Se inyecta HTML sin sanitizar
5. **Reordenamiento por fecha** (INFORME.txt) - arriba.js reordena y puede dar orden incorrecto
6. **Falta de meta tags para SEO** - La web no aparecerá bien en Google ni redes sociales

### 🟢 BAJOS (mejorar cuando puedas)

7. **DOM inválido en parciales** (INFORME.txt) - Todos los HTML en `paginas/` tienen `<body>`
8. **Accesibilidad de controles** (INFORME.txt) - Los controles del carrusel son `<span>` en lugar de `<button>`
9. **Propiedades CSS inválidas** (INFORME.txt) - `margin: none` y `align-items: right`
10. **Atributos HTML inválidos** (INFORME.txt) - `target` en `<img>` y falta `rel="noopener noreferrer"`
11. **Unidad vw en lugar de dvw** - Una línea en style.css usa `vw` en lugar de `dvw`
12. **Archivo test.html en producción** - Debería eliminarse o moverse
13. **Inconsistencia en comillas** - Mezcla de comillas dobles y simples
14. **Falta de favicons alternativos** - Solo hay .ico, faltan PNG para móviles

### 💡 OPORTUNIDADES (nice to have)

15. **Lazy loading de imágenes** - Mejoraría el rendimiento inicial
16. **Preload de fuentes** - Mejoraría el tiempo de carga
17. **Caché en el backend** - Reduciría requests a Substack
18. **Health check endpoint** - Para monitoring del backend
19. **Service Worker / PWA** - Para funcionar offline

---

## 🎨 Explicación cariñosa de los cambios del INFORME.txt

Voy a explicarte cada problema del INFORME.txt de forma que se entienda bien por qué es importante y cómo solucionarlo:

### 1. 💾 Validación del feed JSON (MEDIO)

**¿Qué pasa ahora?**

Cada domingo a las 12:00 UTC, GitHub Actions ejecuta un script que descarga el feed desde tu backend en Render con este comando:

```bash
curl -s https://rikamichie.onrender.com/feed > feed.json
```

El problema es que `curl -s` (silent mode) descarga CUALQUIER COSA que devuelva el servidor, aunque sea un error HTML o texto plano. Si Render está caído, devuelve una página de error HTML, y eso se guarda en `feed.json`. Luego el workflow hace commit de ese archivo corrupto, y tu web deja de funcionar.

**¿Por qué es importante?**

Porque si el feed se corrompe, la sección izquierda de tu web (donde se muestran los posts de Substack) dejará de funcionar, y el archivo corrupto quedará commiteado en el repositorio. Tendrías que arreglarlo manualmente.

**¿Cómo se soluciona?**

Añadiendo validación antes de commitear. El comando mejorado sería:

```bash
# Descargar a un archivo temporal
curl -fS --retry 3 https://rikamichie.onrender.com/feed -o feed_temp.json

# Validar que es JSON válido con jq
if jq -e . feed_temp.json > /dev/null 2>&1; then
  # Si es válido, reemplazar el feed.json
  mv feed_temp.json feed.json
  echo "✅ Feed válido descargado"
else
  # Si no es válido, mostrar error y no commitear
  echo "❌ Error: El feed no es JSON válido"
  cat feed_temp.json
  exit 1
fi
```

**Explicación de las flags:**
- `-f`: Falla si el servidor devuelve error HTTP (404, 500, etc.)
- `-S`: Muestra errores aunque esté en silent mode
- `--retry 3`: Reintenta 3 veces si falla
- `jq -e .`: Valida que el contenido es JSON válido

### 2. 🛡️ Falta de validaciones en data.json (MEDIO)

**¿Qué pasa ahora?**

Los scripts que cargan contenido desde `data.json` (arriba.js, carrusel.js, derecha.js, izquierda.js) asumen que los datos existen y tienen la estructura correcta. Si alguien edita `data.json` y borra una clave o pone un valor incorrecto, la web rompe con un error JavaScript.

Por ejemplo, en `carrusel.js` línea 113:

```javascript
const discos = data.abajo.discos;
discos.forEach(disco => {
  // Si data.abajo no existe o discos no es un array, esto rompe
});
```

**¿Por qué es importante?**

Porque la persona que va a mantener la web (que no eres tú) podría editar `data.json` y cometer un error sin darse cuenta. Sin validaciones, la web simplemente dejará de funcionar sin un mensaje de error claro.

**¿Cómo se soluciona?**

Añadiendo validaciones defensivas en cada script:

```javascript
// ANTES (sin validación)
const discos = data.abajo.discos;
discos.forEach(disco => { /* ... */ });

// DESPUÉS (con validación)
const discos = data?.abajo?.discos;

if (!Array.isArray(discos) || discos.length === 0) {
  console.warn('⚠️ No hay discos configurados en data.json');
  contenedor.innerHTML = '<p>No hay contenido disponible</p>';
  return;
}

discos.forEach(disco => { /* ... */ });
```

**Beneficios:**
- Si faltan datos, muestra un mensaje claro en lugar de romper
- Los errores se ven en la consola del navegador
- La web sigue funcionando (aunque sin ese contenido)

### 3. 🔒 Riesgo de XSS (MEDIO)

**¿Qué pasa ahora?**

En varios lugares del código se inyecta HTML directamente desde fuentes externas (feed de Substack, data.json) sin sanitizar:

```javascript
// script.js línea 168 - PELIGROSO
cont.innerHTML = items.map(post => `
  <div class="post_content">
    ${post["content:encoded"]}  // ← HTML sin sanitizar
  </div>
`).join("");
```

**¿Por qué es peligroso?**

Si alguien compromete tu feed de Substack o inyecta código malicioso en `data.json`, ese código se ejecutaría en tu web. Por ejemplo, podrían inyectar:

```html
<script>
  // Código malicioso que roba cookies o redirige a otra web
  window.location = "https://sitio-malicioso.com";
</script>
```

**¿Cómo se soluciona?**

Hay dos enfoques:

**Opción 1: Sanitizar el HTML (permite formato)**

Usar una librería como DOMPurify para limpiar el HTML:

```javascript
import DOMPurify from 'dompurify';

cont.innerHTML = items.map(post => `
  <div class="post_content">
    ${DOMPurify.sanitize(post["content:encoded"])}
  </div>
`).join("");
```

**Opción 2: Usar solo texto (más seguro pero sin formato)**

```javascript
cont.innerHTML = items.map(post => {
  const div = document.createElement('div');
  div.className = 'post_content';
  div.textContent = post["content:encoded"];  // ← Solo texto, no HTML
  return div.outerHTML;
}).join("");
```

**Recomendación:** Opción 1 con DOMPurify, porque permite mantener el formato (negritas, enlaces, etc.) pero de forma segura.

### 4. 📅 Reordenamiento por fecha en arriba.js (MEDIO)

**¿Qué pasa ahora?**

En `arriba.js` línea 40, los eventos se reordenan automáticamente por fecha:

```javascript
links.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
```

**Problemas:**

1. **No respeta el orden del data.json**: Si pones los eventos en un orden específico en el JSON, el script los reordena automáticamente.

2. **Formato de fecha inconsistente**: Si la fecha no está en formato ISO (YYYY-MM-DD o YYYY-MM), el ordenamiento puede ser incorrecto. Por ejemplo:
   - ✅ "2024-10-15" funciona bien
   - ❌ "2024-10" puede dar resultados inesperados
   - ❌ "octubre 2024" no funciona

**¿Cómo se soluciona?**

**Opción 1: Quitar el sort (respetar orden del JSON)**

```javascript
// Simplemente comentar o eliminar la línea de sort
// links.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
```

**Opción 2: Hacer el sort opcional**

Añadir una configuración en `data.json`:

```json
{
  "arriba": {
    "ordenarPorFecha": true,  // ← Nueva opción
    "links": [...]
  }
}
```

Y en el script:

```javascript
if (data.arriba.ordenarPorFecha) {
  links.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
}
```

**Opción 3: Validar formato de fecha**

```javascript
// Validar que todas las fechas son ISO antes de ordenar
const todasFechasValidas = links.every(link => {
  const fecha = new Date(link.fecha);
  return !isNaN(fecha.getTime());
});

if (todasFechasValidas) {
  links.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
} else {
  console.warn('⚠️ Algunas fechas no son válidas, no se ordenará');
}
```

**Recomendación:** Opción 1 (quitar el sort) si quieres control manual, u Opción 2 si quieres flexibilidad.

### 5. 📄 DOM inválido en parciales (BAJO)

**¿Qué pasa ahora?**

Todos los archivos HTML en `paginas/` tienen esta estructura:

```html
<body>
  <div class="contenido">
    <!-- ... -->
  </div>
</body>
```

Pero estos archivos se cargan con `fetch()` y se inyectan dentro de un `<div>` en el HTML principal:

```javascript
wrapper.innerHTML = html;  // ← Inyecta el HTML dentro de un div
```

El resultado es un DOM inválido:

```html
<div class="contenido">
  <body>  <!-- ← body dentro de un div, INVÁLIDO -->
    <div class="contenido">
      <!-- ... -->
    </div>
  </body>
</div>
```

**¿Por qué es un problema?**

- Los navegadores intentan "arreglar" el DOM inválido, lo que puede causar márgenes inesperados
- Puede afectar al CSS (los selectores pueden no funcionar como esperas)
- Es técnicamente incorrecto según el estándar HTML

**¿Cómo se soluciona?**

Simplemente quitar la etiqueta `<body>` de todos los parciales:

```html
<!-- ANTES -->
<body>
  <div class="contenido">
    <!-- ... -->
  </div>
</body>

<!-- DESPUÉS -->
<div class="contenido">
  <!-- ... -->
</div>
```

**Archivos a cambiar:**
- abajo.html
- abajo_abajo.html
- arriba.html
- centro.html
- derecha.html
- izquierda.html

### 6. ♿ Accesibilidad de controles (BAJO)

**¿Qué pasa ahora?**

Los controles del carrusel en `abajo.html` son `<span>`:

```html
<span id="prev-btn">&lt;</span>
<span id="next-btn">&gt;</span>
```

**Problemas:**

1. **No son accesibles por teclado**: Los usuarios que navegan con teclado (Tab) no pueden llegar a estos controles
2. **No son semánticos**: Los lectores de pantalla no los identifican como botones
3. **No tienen estados**: No se puede saber visualmente si están deshabilitados

**¿Cómo se soluciona?**

Cambiar a `<button>`:

```html
<button id="prev-btn" aria-label="Disco anterior">&lt;</button>
<button id="next-btn" aria-label="Disco siguiente">&gt;</button>
```

Y actualizar el CSS (línea 314):

```css
/* ANTES */
.buttons span {
  /* ... */
}

/* DESPUÉS */
.buttons button {
  /* ... */
}
```

**Beneficios:**
- Accesibles por teclado (Tab + Enter)
- Lectores de pantalla los identifican correctamente
- Pueden tener estados `:disabled`, `:focus`, etc.

### 7. 🎨 Propiedades CSS inválidas (BAJO)

Ya explicado arriba en los nuevos hallazgos. Resumen:

- `margin: none;` → `margin: 0;`
- `align-items: right;` → `align-items: flex-end;`

### 8. 🔗 Atributos HTML inválidos (BAJO)

**Problemas encontrados:**

**1. `target` en `<img>` (inválido)**

```html
<!-- abajo_abajo.html línea 3 - INCORRECTO -->
<img src="./img/inguma.png" target="_blank" alt="inguma">

<!-- CORRECTO (target solo en <a>) -->
<a href="https://www.instagram.com/rikamichie/" target="_blank" rel="noopener noreferrer">
  <img src="./img/inguma.png" alt="inguma">
</a>
```

**2. Falta `rel="noopener noreferrer"` en enlaces externos**

```html
<!-- ANTES (inseguro) -->
<a href="https://ejemplo.com" target="_blank">enlace</a>

<!-- DESPUÉS (seguro) -->
<a href="https://ejemplo.com" target="_blank" rel="noopener noreferrer">enlace</a>
```

**¿Por qué es importante el `rel="noopener noreferrer"`?**

Cuando abres un enlace con `target="_blank"`, la página nueva tiene acceso a `window.opener`, lo que permite:
- Cambiar la URL de tu página (phishing)
- Acceder a información de tu página
- Consumir recursos de tu página

`rel="noopener noreferrer"` previene esto.

---

## 🚀 Consejos de SEO para rikamichie

### 1. Meta tags básicos (CRÍTICO)

Añadir en el `<head>` de `index.html`:

```html
<!-- Descripción para Google -->
<meta name="description" content="Erika Michi - Masajista profesional en Barcelona. Masajes descontracturantes, relajantes, deportivos y más. Carrer Poeta Cabanyes y a domicilio.">

<!-- Keywords (opcional pero útil) -->
<meta name="keywords" content="masajes barcelona, masajista, descontracturante, relajante, deportivo, neurosedante, drenaje linfático, reflexología podal, poeta cabanyes">

<!-- Autor -->
<meta name="author" content="Erika Michi">

<!-- Idioma -->
<meta http-equiv="content-language" content="es">
```

### 2. Open Graph para redes sociales (IMPORTANTE)

```html
<!-- Open Graph (Facebook, WhatsApp, LinkedIn) -->
<meta property="og:title" content="Erika Michi - Masajista en Barcelona">
<meta property="og:description" content="Masajes descontracturantes, relajantes, deportivos y más. Carrer Poeta Cabanyes y a domicilio.">
<meta property="og:image" content="https://meowrhino.github.io/rikamichie/img/derecha_2.webp">
<meta property="og:url" content="https://meowrhino.github.io/rikamichie/">
<meta property="og:type" content="website">
<meta property="og:locale" content="es_ES">
<meta property="og:site_name" content="Erika Michi">
```

### 3. Twitter Card (IMPORTANTE)

```html
<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Erika Michi - Masajista en Barcelona">
<meta name="twitter:description" content="Masajes descontracturantes, relajantes, deportivos y más. Carrer Poeta Cabanyes y a domicilio.">
<meta name="twitter:image" content="https://meowrhino.github.io/rikamichie/img/derecha_2.webp">
```

### 4. Canonical URL (IMPORTANTE)

```html
<!-- URL canónica (evita contenido duplicado) -->
<link rel="canonical" href="https://meowrhino.github.io/rikamichie/">
```

### 5. Structured Data (JSON-LD) (MUY IMPORTANTE)

Añadir antes del cierre de `</head>`:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Erika Michi - Masajista",
  "image": "https://meowrhino.github.io/rikamichie/img/derecha_2.webp",
  "description": "Masajista profesional en Barcelona. Masajes descontracturantes, relajantes, deportivos, neurosedante, drenaje linfático y reflexología podal.",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Carrer Poeta Cabanyes",
    "addressLocality": "Barcelona",
    "addressCountry": "ES"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "41.3851",
    "longitude": "2.1734"
  },
  "url": "https://meowrhino.github.io/rikamichie/",
  "telephone": "+34-XXX-XXX-XXX",
  "priceRange": "44€-144€",
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday"
      ],
      "opens": "09:00",
      "closes": "20:00"
    }
  ],
  "sameAs": [
    "https://www.instagram.com/erikamichi/",
    "https://rikamichie.substack.com/"
  ],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Servicios de masaje",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Masaje descontracturante",
          "description": "Para dolores profundos"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Masaje relajante",
          "description": "Para calmar tu mente y tu cuerpo"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Masaje deportivo",
          "description": "Para cuerpos trabajados"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Masaje neurosedante",
          "description": "Para la zona craneal"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Drenaje linfático",
          "description": "Para retención de líquidos"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Reflexología podal",
          "description": "Masaje de pies"
        }
      }
    ]
  }
}
</script>
```

**Nota:** Necesitarás completar:
- Coordenadas exactas (latitude/longitude)
- Número de teléfono
- Horarios de atención

### 6. Robots.txt (IMPORTANTE)

Crear un archivo `robots.txt` en la raíz del proyecto:

```
User-agent: *
Allow: /

Sitemap: https://meowrhino.github.io/rikamichie/sitemap.xml
```

### 7. Sitemap.xml (IMPORTANTE)

Crear un archivo `sitemap.xml` en la raíz:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://meowrhino.github.io/rikamichie/</loc>
    <lastmod>2026-01-22</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

### 8. Título optimizado (IMPORTANTE)

Cambiar el título en `index.html`:

```html
<!-- ANTES -->
<title>rikamichie</title>

<!-- DESPUÉS -->
<title>Erika Michi - Masajista en Barcelona | Poeta Cabanyes y a domicilio</title>
```

### 9. Alt text en imágenes (CRÍTICO)

Todas las imágenes deben tener `alt` descriptivo:

```html
<!-- BIEN -->
<img src="./img/inguma.png" alt="Logo de Erika Michi con figura de Inguma">

<!-- MAL -->
<img src="./img/inguma.png" alt="inguma">
```

### 10. Performance (IMPORTANTE)

**Optimizar imágenes:**
- Convertir JPG/PNG a WebP (ya tienes derecha_2.webp ✅)
- Comprimir imágenes (usar TinyPNG o similar)
- Usar `loading="lazy"` en imágenes no críticas

**Minimizar CSS/JS:**
- Considerar minimizar style.css y script.js en producción
- Usar herramientas como cssnano y terser

**Preload de recursos críticos:**

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
```

### 11. Google Search Console (CRÍTICO)

**Pasos:**

1. Ir a [Google Search Console](https://search.google.com/search-console)
2. Añadir la propiedad (la URL de tu web)
3. Verificar la propiedad (con meta tag o archivo HTML)
4. Subir el sitemap.xml
5. Solicitar indexación de la página principal

### 12. Google My Business (MUY IMPORTANTE para negocio local)

Si Erika tiene un local físico en Poeta Cabanyes:

1. Crear perfil en [Google My Business](https://www.google.com/business/)
2. Verificar la dirección (Google envía una postal)
3. Añadir fotos, horarios, servicios
4. Enlazar la web

**Beneficios:**
- Aparece en Google Maps
- Aparece en búsquedas locales ("masajista cerca de mí")
- Permite reseñas de clientes

### 13. Contenido SEO-friendly

**Recomendaciones:**

1. **Añadir una sección "Sobre mí"** con texto descriptivo (100-300 palabras)
2. **Añadir una sección "Servicios"** con descripción de cada tipo de masaje
3. **Añadir una sección "Preguntas frecuentes"** (FAQ)
4. **Blog/Substack**: Seguir publicando en Substack (ya lo haces ✅)

**Palabras clave a incluir:**
- Masajista Barcelona
- Masajes Poble Sec (si es el barrio)
- Masajes Poeta Cabanyes
- Masajes a domicilio Barcelona
- Cada tipo de masaje + Barcelona

### 14. Enlaces externos (Link building)

**Estrategias:**

1. **Directorios locales**: Registrarse en directorios de negocios de Barcelona
2. **Redes sociales**: Instagram (ya tienes ✅), Facebook, TikTok
3. **Colaboraciones**: Intercambio de enlaces con otros profesionales (fisioterapeutas, yoga, etc.)
4. **Reseñas**: Pedir a clientes que dejen reseñas en Google My Business

### 15. Analytics (IMPORTANTE)

Añadir Google Analytics 4 para medir tráfico:

```html
<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

**Nota:** Necesitarás crear una cuenta en Google Analytics y obtener tu ID.

---

## 📊 Checklist de implementación

### 🔴 CRÍTICOS (hacer primero)

- [ ] Cambiar `../img/` por `./img/` en abajo.html
- [ ] Añadir meta tags básicos (description, keywords)
- [ ] Añadir Open Graph y Twitter Card
- [ ] Añadir Structured Data (JSON-LD)
- [ ] Optimizar título de la página
- [ ] Crear robots.txt y sitemap.xml
- [ ] Registrar en Google Search Console

### 🟡 MEDIOS (hacer pronto)

- [ ] Implementar validación del feed en el workflow
- [ ] Añadir validaciones en todos los scripts JS
- [ ] Sanitizar HTML con DOMPurify
- [ ] Revisar el reordenamiento por fecha en arriba.js
- [ ] Añadir Google Analytics

### 🟢 BAJOS (hacer cuando puedas)

- [ ] Quitar `<body>` de todos los parciales
- [ ] Cambiar controles del carrusel a `<button>`
- [ ] Corregir propiedades CSS inválidas
- [ ] Añadir `rel="noopener noreferrer"` a enlaces externos
- [ ] Cambiar `100vw` por `100dvw` en línea 200 de style.css
- [ ] Eliminar test.html
- [ ] Estandarizar comillas en JavaScript
- [ ] Añadir favicons alternativos
- [ ] Optimizar alt text de imágenes

### 💡 OPORTUNIDADES (nice to have)

- [ ] Añadir lazy loading a imágenes
- [ ] Añadir preload de fuentes
- [ ] Implementar caché en el backend
- [ ] Añadir health check endpoint
- [ ] Crear Google My Business
- [ ] Añadir sección "Sobre mí"
- [ ] Añadir FAQ
- [ ] Considerar PWA con service worker

---

**Fin del documento** - 22 de enero de 2026, 06:10h GMT+1

