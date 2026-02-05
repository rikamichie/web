# Propuesta de Cambios - Rikamichie

**Fecha:** 22 enero 2026, 05:18 GMT+1

---

## 🎯 Resumen ejecutivo

Este documento presenta una propuesta detallada para los cambios solicitados en el proyecto rikamichie, incluyendo la simplificación del código, el rediseño de la sección derecha con un nuevo sistema de precios y tipos de masaje, y la documentación para reconectar el scrapeador de Substack a nuevas cuentas.

---

## 📋 Cambios propuestos

### 1. Eliminación de GRID_EXAMPLES.md

**Justificación:** Este archivo fue útil durante el desarrollo del gridWebGenerator, pero rikamichie ya no es ese proyecto. Es una web específica para Erika Michi y no necesita ejemplos de diferentes configuraciones de grid.

**Acción:** Eliminar el archivo `GRID_EXAMPLES.md` del repositorio.

**Impacto:** Ninguno en la funcionalidad. Solo simplifica el proyecto.

---

### 2. Simplificación de data.json

#### 2.1. Sección derecha

**Estado actual:**
```json
"derecha": {
  "imagen": {
    "url": "img/derecha_2.webp",
    "alt": "Imagen de fondo"
  },
  "colores": {
    "themeColor": "crimson",
    "btnColor": "crimson",
    "textoColor": "white",
    "fondoTexto": "crimson"
  },
  "contenido": {
    "linkPrincipal": {
      "texto": "masajes",
      "url": "https://www.instagram.com/erikamichi/"
    },
    "tipos": [
      "descontracturante",
      "relajante",
      "deportivo"
    ],
    "precio": "55€/h"
  }
}
```

**Propuesta de nueva estructura:**
```json
"derecha": {
  "imagen": "img/derecha_2.webp",
  "titulo": {
    "texto": "masajes",
    "url": "https://www.instagram.com/erikamichi/"
  },
  "precios": {
    "poetaCabanyes": {
      "titulo": "carrer poeta cabanyes",
      "opciones": [
        { "duracion": "1h", "precio": "44€" },
        { "duracion": "2h", "precio": "77€" },
        { "duracion": "3h", "precio": "111€" }
      ]
    },
    "domicilio": {
      "titulo": "a domicilio",
      "opciones": [
        { "duracion": "1h", "precio": "55€" },
        { "duracion": "2h", "precio": "99€" },
        { "duracion": "3h", "precio": "144€" }
      ]
    }
  },
  "tiposMasaje": {
    "titulo": "tipos de masaje:",
    "tipos": [
      {
        "nombre": "descontracturante",
        "descripcion": "para dolores profundos"
      },
      {
        "nombre": "relajante",
        "descripcion": "para calmar tu mente y tu cuerpo"
      },
      {
        "nombre": "deportivo",
        "descripcion": "para cuerpos trabajados"
      },
      {
        "nombre": "neurosedante",
        "descripcion": "para la zona craneal"
      },
      {
        "nombre": "drenaje linfático",
        "descripcion": "para retención de líquidos"
      },
      {
        "nombre": "reflexología podal",
        "descripcion": ""
      }
    ]
  }
}
```

**Cambios realizados:**
- ✅ Eliminado `imagen.alt` (se generará automáticamente en el código)
- ✅ Eliminado objeto `colores` (crimson será hardcoded en CSS)
- ✅ Reestructurado `contenido` para reflejar la nueva estructura de dos tablas de precios
- ✅ Añadida estructura para tipos de masaje con descripciones
- ✅ Todo el contenido es editable desde JSON

#### 2.2. Sección izquierda

**Pregunta para el usuario:** Mencionaste "quitar la selección de colores de la izquierda". ¿Te refieres a:
- A) Eliminar el objeto `colores` de la sección izquierda (dejando los colores hardcoded)
- B) Era un error y te referías a la sección derecha (ya contemplado arriba)

---

### 3. Rediseño de la sección derecha

#### 3.1. Estructura HTML propuesta

**Archivo:** `paginas/derecha.html`

```html
<div class="der_layout">
  <div class="der_imagen">
    <!-- Imagen de fondo aplicada por CSS -->
  </div>
  
  <div class="der_contenedor" id="contenedorMasajes">
    <h2 class="der_titulo">
      <a href="#" id="tituloMasajes">masajes</a>
    </h2>
    
    <div class="der_precios" id="preciosMasajes">
      <!-- Tabla 1: Carrer poeta cabanyes -->
      <div class="der_tabla_precios">
        <h3 class="der_tabla_titulo">carrer poeta cabanyes</h3>
        <div class="der_tabla_items">
          <!-- Generado dinámicamente -->
        </div>
      </div>
      
      <!-- Tabla 2: A domicilio -->
      <div class="der_tabla_precios">
        <h3 class="der_tabla_titulo">a domicilio</h3>
        <div class="der_tabla_items">
          <!-- Generado dinámicamente -->
        </div>
      </div>
    </div>
    
    <div class="der_tipos" id="tiposMasajes">
      <h3 class="der_tipos_titulo">tipos de masaje:</h3>
      <div class="der_tipos_lista">
        <!-- Generado dinámicamente -->
      </div>
    </div>
  </div>
</div>
```

**Notas:**
- Se elimina la etiqueta `<body>` (problema identificado en INFORME.txt)
- Estructura semántica con headings apropiados
- IDs para manipulación con JavaScript

#### 3.2. Estilos CSS propuestos

**Archivo:** `style.css` (añadir al final)

```css
/* ============================================
   SECCIÓN DERECHA - MASAJES
   ============================================ */

.der_layout {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.der_imagen {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.der_contenedor {
  position: absolute;
  right: 0;
  bottom: 0;
  background-color: crimson;
  color: white;
  padding: 2rem;
  font-family: serif;
  transition: all 0.4s ease;
  max-height: 35vh;
  overflow: hidden;
}

.der_contenedor.expandido {
  max-height: 80vh;
  overflow-y: auto;
}

/* Título principal */
.der_titulo {
  margin: 0 0 1.5rem 0;
  font-size: 2.5rem;
  font-weight: normal;
  text-align: center;
}

.der_titulo a {
  color: white;
  text-decoration: none;
}

/* Tablas de precios */
.der_precios {
  display: flex;
  gap: 3rem;
  margin-bottom: 1.5rem;
}

.der_tabla_precios {
  flex: 1;
}

.der_tabla_titulo {
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
  font-weight: bold;
  text-align: center;
}

.der_tabla_items {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.der_precio_item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.1rem;
}

.der_precio_item::before {
  content: '';
  flex: 1;
  margin: 0 0.5rem;
  border-bottom: 1px dotted rgba(255, 255, 255, 0.5);
}

/* Tipos de masaje */
.der_tipos {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 2px solid rgba(255, 255, 255, 0.3);
}

.der_tipos_titulo {
  margin: 0 0 1rem 0;
  font-size: 1.3rem;
  font-weight: bold;
}

.der_tipos_lista {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.der_tipo_item {
  line-height: 1.4;
}

.der_tipo_nombre {
  font-weight: bold;
  font-size: 1.1rem;
}

.der_tipo_descripcion {
  font-size: 0.95rem;
  opacity: 0.9;
}

/* Responsive: Desktop */
@media (min-width: 768px) {
  .der_contenedor {
    width: 50%;
    max-width: 600px;
  }
  
  .der_contenedor:hover {
    max-height: 80vh;
  }
  
  .der_precios {
    flex-direction: row;
  }
}

/* Responsive: Móvil */
@media (max-width: 767px) {
  .der_contenedor {
    right: auto;
    left: 20dvw;
    top: 60dvh;
    bottom: auto;
    width: calc(80dvw - 4rem);
    max-height: 30vh;
  }
  
  .der_contenedor.expandido {
    max-height: calc(40dvh - 4rem);
  }
  
  .der_precios {
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .der_titulo {
    font-size: 2rem;
  }
}
```

**Características:**
- Contenedor crimson posicionado a la derecha (desktop) o con márgenes específicos (móvil)
- Transición suave entre estados cerrado/expandido
- Hover en desktop, click en móvil (manejado por JS)
- Layout responsive: horizontal en desktop, vertical en móvil
- Tipografía serif como en las referencias
- Colores hardcoded (crimson y blanco)

#### 3.3. JavaScript propuesto

**Archivo:** `script/derecha.js` (reescribir completamente)

```javascript
// ============================================
// VISTA DE DERECHA - INFORMACIÓN DE MASAJES
// ============================================

let dataDerecha = null;

/**
 * Carga los datos de la sección derecha desde data.json
 */
async function loadDerechaData() {
  try {
    const response = await fetch('./data.json');
    if (!response.ok) {
      throw new Error('Error al cargar data.json');
    }
    const data = await response.json();
    
    // Validación: verificar que existe la sección derecha
    if (!data.derecha) {
      console.error('No se encontró la sección "derecha" en data.json');
      return null;
    }
    
    dataDerecha = data.derecha;
    return dataDerecha;
  } catch (error) {
    console.error('Error cargando datos de la sección derecha:', error);
    return null;
  }
}

/**
 * Genera una tabla de precios
 */
function generarTablaPrecios(datos) {
  const items = datos.opciones
    .map(opcion => `
      <div class="der_precio_item">
        <span class="der_precio_duracion">${opcion.duracion}</span>
        <span class="der_precio_valor">${opcion.precio}</span>
      </div>
    `)
    .join('');
  
  return `
    <div class="der_tabla_precios">
      <h3 class="der_tabla_titulo">${datos.titulo}</h3>
      <div class="der_tabla_items">
        ${items}
      </div>
    </div>
  `;
}

/**
 * Genera la lista de tipos de masaje
 */
function generarTiposMasaje(datos) {
  const tipos = datos.tipos
    .map(tipo => {
      const descripcion = tipo.descripcion 
        ? `<span class="der_tipo_descripcion">: ${tipo.descripcion}</span>` 
        : '';
      return `
        <div class="der_tipo_item">
          <span class="der_tipo_nombre">${tipo.nombre}</span>${descripcion}
        </div>
      `;
    })
    .join('');
  
  return tipos;
}

/**
 * Configura la interactividad del contenedor
 */
function configurarInteractividad() {
  const contenedor = document.getElementById('contenedorMasajes');
  if (!contenedor) return;
  
  // Desktop: hover
  if (window.innerWidth >= 768) {
    contenedor.addEventListener('mouseenter', () => {
      contenedor.classList.add('expandido');
    });
    
    contenedor.addEventListener('mouseleave', () => {
      contenedor.classList.remove('expandido');
    });
  } 
  // Móvil: click
  else {
    contenedor.addEventListener('click', () => {
      contenedor.classList.toggle('expandido');
    });
  }
}

/**
 * Genera la vista de la sección derecha
 */
export async function generarVistaDerecha() {
  // Cargar datos si aún no están disponibles
  if (!dataDerecha) {
    await loadDerechaData();
  }
  
  if (!dataDerecha) {
    console.error('No se pudieron cargar los datos de la sección derecha');
    return;
  }
  
  // Actualizar imagen de fondo
  const imagenDiv = document.querySelector('.der_imagen');
  if (imagenDiv && dataDerecha.imagen) {
    imagenDiv.style.backgroundImage = `url("${dataDerecha.imagen}")`;
  }
  
  // Actualizar título
  const tituloLink = document.getElementById('tituloMasajes');
  if (tituloLink && dataDerecha.titulo) {
    tituloLink.textContent = dataDerecha.titulo.texto;
    tituloLink.href = dataDerecha.titulo.url;
  }
  
  // Generar tablas de precios
  const preciosDiv = document.getElementById('preciosMasajes');
  if (preciosDiv && dataDerecha.precios) {
    const tablaPoeta = generarTablaPrecios(dataDerecha.precios.poetaCabanyes);
    const tablaDomicilio = generarTablaPrecios(dataDerecha.precios.domicilio);
    
    // En desktop: poeta primero, domicilio después
    // En móvil: poeta primero, domicilio después (igual)
    preciosDiv.innerHTML = tablaPoeta + tablaDomicilio;
  }
  
  // Generar tipos de masaje
  const tiposDiv = document.querySelector('.der_tipos_lista');
  if (tiposDiv && dataDerecha.tiposMasaje) {
    tiposDiv.innerHTML = generarTiposMasaje(dataDerecha.tiposMasaje);
  }
  
  // Configurar interactividad
  configurarInteractividad();
  
  // Reconfigurar al cambiar tamaño de ventana
  window.addEventListener('resize', configurarInteractividad);
}

// Exportar para compatibilidad
export { dataDerecha };
```

**Características:**
- Validación de datos (mejora del INFORME.txt)
- Generación dinámica de contenido desde JSON
- Funciones modulares y bien comentadas
- Manejo de interactividad responsive
- Código legible y mantenible

---

### 4. Reconexión del scrapeador de Substack

#### 4.1. Arquitectura actual

**Backend (Render):**
- URL: `https://rikamichie.onrender.com/feed`
- Función: Scrapea el feed de Substack y lo devuelve en JSON

**Frontend (GitHub Actions):**
- Workflow: `.github/workflows/update-feed.yml`
- Función: Descarga el feed cada domingo y lo commitea al repo

#### 4.2. Proceso de migración

**Paso 1: Preparar el nuevo repositorio de GitHub**

1. Crear un nuevo repositorio en la cuenta destino
2. Clonar el repositorio actual o crear uno nuevo
3. Copiar el archivo `.github/workflows/update-feed.yml`
4. Actualizar la URL en el workflow (línea 18) con la nueva URL de Render

**Paso 2: Migrar el backend a nueva cuenta de Render**

1. Acceder a la cuenta de Render actual y localizar el servicio
2. Exportar/copiar el código del backend (si está disponible)
3. Crear un nuevo Web Service en la nueva cuenta de Render
4. Configurar las variables de entorno necesarias
5. Desplegar el servicio y obtener la nueva URL

**Paso 3: Actualizar el workflow**

Editar `.github/workflows/update-feed.yml` línea 18:
```yaml
curl -s https://NUEVA-URL.onrender.com/feed > feed.json
```

**Paso 4: Mejorar la validación (recomendado)**

Implementar la mejora sugerida en el INFORME.txt:

```yaml
- name: Descargar y validar feed desde Render
  run: |
    curl -fS --retry 3 https://NUEVA-URL.onrender.com/feed -o feed_temp.json
    if jq -e . feed_temp.json > /dev/null 2>&1; then
      mv feed_temp.json feed.json
      echo "Feed válido descargado"
    else
      echo "Error: El feed descargado no es JSON válido"
      exit 1
    fi
```

**Paso 5: Probar el sistema**

1. Ejecutar el workflow manualmente con `workflow_dispatch`
2. Verificar que feed.json se actualiza correctamente
3. Comprobar que no hay errores en los logs

#### 4.3. Documentación del backend

**Nota:** No tengo acceso al código del backend actual en Render. Para documentar completamente el proceso de migración, necesitaría:

1. Acceso al código fuente del backend
2. Variables de entorno configuradas
3. Dependencias y configuración del proyecto

**Pregunta para el usuario:** ¿Tienes acceso al código del backend en Render? Si es así, puedo ayudarte a documentarlo y migrarlo.

---

## 🎨 Visualización de los cambios

### Estado actual vs. Estado propuesto

| Aspecto | Actual | Propuesto |
|---------|--------|-----------|
| **GRID_EXAMPLES.md** | Existe | Eliminado |
| **data.json derecha** | Estructura simple con tipos array | Estructura completa con dos tablas de precios y tipos con descripciones |
| **derecha.html** | Layout simple con un precio | Layout con dos tablas + tipos expandibles |
| **derecha.js** | Script básico | Script completo con validaciones e interactividad |
| **style.css** | Estilos básicos | Estilos completos con responsive y estados |
| **Scrapeador** | Cuenta actual | Documentado para migración |

---

## ✅ Checklist de implementación

### Fase 1: Simplificación
- [ ] Eliminar GRID_EXAMPLES.md
- [ ] Clarificar con el usuario sobre colores de la izquierda
- [ ] Actualizar data.json con nueva estructura de derecha

### Fase 2: Rediseño
- [ ] Actualizar paginas/derecha.html
- [ ] Reescribir script/derecha.js
- [ ] Añadir estilos a style.css
- [ ] Probar en desktop y móvil
- [ ] Verificar estados cerrado/expandido

### Fase 3: Mejoras opcionales del INFORME.txt
- [ ] Quitar `<body>` de todos los parciales en paginas/
- [ ] Añadir validación del feed en el workflow
- [ ] Corregir propiedades CSS inválidas
- [ ] Mejorar accesibilidad de controles

### Fase 4: Documentación
- [ ] Crear guía de migración del scrapeador
- [ ] Actualizar README.md si es necesario
- [ ] Documentar cambios en proceso.md

---

## 🤔 Preguntas para el usuario

1. **Colores de la izquierda:** ¿Quieres eliminar el objeto `colores` de la sección izquierda en data.json, o era un error y te referías a la derecha?

2. **Backend del scrapeador:** ¿Tienes acceso al código fuente del backend en Render? Si es así, puedo ayudarte a documentarlo completamente para la migración.

3. **Prioridad de implementación:** ¿Quieres que implemente primero el rediseño de la derecha, o prefieres que empiece por las mejoras del INFORME.txt?

4. **Orden de las tablas:** En las referencias visuales veo que en ordenador_derecha_1.png aparece "a domicilio" a la izquierda y "carrer poeta cabanyes" a la derecha, pero en ordenador_derecha_2.png está al revés. ¿Cuál es el orden correcto?

---

**Fin de la propuesta** - 22 de enero de 2026, 05:25h GMT+1

