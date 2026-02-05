# Propuesta Actualizada - Nueva Derecha con Precios

**Fecha:** 22 enero 2026, 06:15 GMT+1

---

## 🎯 Resumen

Esta propuesta actualiza el diseño de la sección derecha basándose en tus aclaraciones:

1. **Colores hardcoded**: El crimson no será configurable en data.json (solo lo modificable)
2. **Orden de precios**: Siempre poeta cabanyes primero, luego a domicilio
3. **Posicionamiento**: Bloque alineado abajo a la derecha en desktop y móvil
4. **Transiciones**: Muy suaves para cuando "emerge" y "se hunde"

---

## 📊 Nueva estructura de data.json

```json
{
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
}
```

**Cambios respecto a la estructura actual:**
- ✅ Eliminado `imagen.alt` (se generará automáticamente)
- ✅ Eliminado objeto `colores` (crimson hardcoded en CSS)
- ✅ Reestructurado para dos tablas de precios
- ✅ Añadidos tipos de masaje con descripciones
- ✅ Todo editable desde JSON

---

## 🎨 HTML propuesto (paginas/derecha.html)

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
      <!-- Generado dinámicamente desde data.json -->
    </div>
    
    <div class="der_tipos" id="tiposMasajes">
      <h3 class="der_tipos_titulo">tipos de masaje:</h3>
      <div class="der_tipos_lista">
        <!-- Generado dinámicamente desde data.json -->
      </div>
    </div>
  </div>
</div>
```

**Notas:**
- Sin etiqueta `<body>` (corrige problema del INFORME.txt)
- Estructura semántica con headings apropiados
- IDs para manipulación con JavaScript

---

## 💅 CSS propuesto (añadir a style.css)

```css
/* ============================================
   SECCIÓN DERECHA - MASAJES
   ============================================ */

/* Layout principal */
.der_layout {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

/* Imagen de fondo */
.der_imagen {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

/* Contenedor crimson */
.der_contenedor {
  position: absolute;
  right: 2dvw;
  bottom: 2dvh;
  background-color: crimson;
  color: white;
  padding: 1.5rem 2rem;
  font-family: serif;
  
  /* Transición muy suave */
  transition: max-height 0.6s cubic-bezier(0.4, 0, 0.2, 1),
              padding 0.6s cubic-bezier(0.4, 0, 0.2, 1),
              box-shadow 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  
  /* Estado inicial: cerrado */
  max-height: 35dvh;
  overflow: hidden;
  
  /* Sombra sutil */
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  
  /* Esquinas redondeadas suaves */
  border-radius: 8px;
}

/* Estado expandido */
.der_contenedor.expandido {
  max-height: 75dvh;
  overflow-y: auto;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
}

/* Scrollbar personalizada (opcional pero bonita) */
.der_contenedor::-webkit-scrollbar {
  width: 6px;
}

.der_contenedor::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.der_contenedor::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

.der_contenedor::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

/* Título principal */
.der_titulo {
  margin: 0 0 1.5rem 0;
  font-size: 2.5rem;
  font-weight: normal;
  text-align: center;
  letter-spacing: 0.05em;
}

.der_titulo a {
  color: white;
  text-decoration: none;
  transition: opacity 0.3s ease;
}

.der_titulo a:hover {
  opacity: 0.8;
}

/* Contenedor de tablas de precios */
.der_precios {
  display: flex;
  gap: 2rem;
  margin-bottom: 1.5rem;
  flex-direction: row; /* Desktop: lado a lado */
}

/* Cada tabla de precios */
.der_tabla_precios {
  flex: 1;
  min-width: 0; /* Permite que flex funcione bien */
}

/* Título de cada tabla */
.der_tabla_titulo {
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  font-weight: bold;
  text-align: center;
  text-transform: lowercase;
  opacity: 0.95;
}

/* Items de precios */
.der_tabla_items {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

/* Cada fila de precio */
.der_precio_item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1rem;
  padding: 0.3rem 0;
}

/* Separador entre duración y precio */
.der_precio_item::after {
  content: '';
  flex: 1;
  margin: 0 0.5rem;
  border-bottom: 1px dotted rgba(255, 255, 255, 0.4);
  min-width: 10px;
}

.der_precio_duracion {
  white-space: nowrap;
}

.der_precio_valor {
  white-space: nowrap;
  font-weight: 500;
}

/* Sección de tipos de masaje */
.der_tipos {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 2px solid rgba(255, 255, 255, 0.3);
  
  /* Animación de aparición suave */
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

/* Cuando el contenedor está expandido, mostrar tipos */
.der_contenedor.expandido .der_tipos {
  opacity: 1;
  transform: translateY(0);
}

/* Título de tipos */
.der_tipos_titulo {
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
  font-weight: bold;
  text-transform: lowercase;
}

/* Lista de tipos */
.der_tipos_lista {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}

/* Cada tipo de masaje */
.der_tipo_item {
  line-height: 1.5;
  font-size: 0.95rem;
}

.der_tipo_nombre {
  font-weight: bold;
  text-transform: lowercase;
}

.der_tipo_descripcion {
  opacity: 0.9;
  margin-left: 0.3rem;
}

/* ============================================
   RESPONSIVE: DESKTOP
   ============================================ */

@media (min-width: 768px) {
  .der_contenedor {
    /* Aumentar márgenes en desktop */
    right: 3dvw;
    bottom: 3dvh;
    min-width: 450px;
    max-width: 550px;
  }
  
  /* Hover en desktop */
  .der_contenedor:hover {
    max-height: 75dvh;
    cursor: pointer;
  }
  
  .der_contenedor:hover .der_tipos {
    opacity: 1;
    transform: translateY(0);
  }
  
  /* Precios lado a lado en desktop */
  .der_precios {
    flex-direction: row;
  }
}

/* ============================================
   RESPONSIVE: MÓVIL
   ============================================ */

@media (max-width: 767px) {
  .der_contenedor {
    /* Posicionamiento móvil según tus specs */
    right: auto;
    left: 20dvw;
    bottom: auto;
    top: 60dvh;
    
    /* Ancho adaptativo */
    width: calc(75dvw - 3rem);
    max-width: none;
    
    /* Altura inicial más pequeña en móvil */
    max-height: 25dvh;
  }
  
  .der_contenedor.expandido {
    max-height: 35dvh;
  }
  
  /* Precios uno bajo otro en móvil */
  .der_precios {
    flex-direction: column;
    gap: 1.5rem;
  }
  
  /* Ajustar tamaños de fuente en móvil */
  .der_titulo {
    font-size: 2rem;
    margin-bottom: 1rem;
  }
  
  .der_tabla_titulo {
    font-size: 1rem;
  }
  
  .der_precio_item {
    font-size: 0.9rem;
  }
  
  .der_tipos_titulo {
    font-size: 1.1rem;
  }
  
  .der_tipo_item {
    font-size: 0.85rem;
  }
}

/* ============================================
   RESPONSIVE: MÓVIL PEQUEÑO
   ============================================ */

@media (max-width: 480px) {
  .der_contenedor {
    left: 15dvw;
    top: 55dvh;
    width: calc(80dvw - 2rem);
    padding: 1rem 1.5rem;
  }
  
  .der_titulo {
    font-size: 1.8rem;
  }
}
```

**Características del CSS:**

1. **Transiciones muy suaves**: Uso de `cubic-bezier(0.4, 0, 0.2, 1)` para animaciones naturales
2. **Posicionamiento correcto**: Abajo a la derecha en desktop y móvil (con márgenes ajustados)
3. **Orden de precios**: poeta cabanyes siempre primero (se controla en el JS)
4. **Estados claros**: Cerrado (solo precios) y expandido (con tipos de masaje)
5. **Responsive**: Desktop (lado a lado) y móvil (uno bajo otro)
6. **Scrollbar personalizada**: Para cuando el contenido es muy largo
7. **Animación de aparición**: Los tipos de masaje "emergen" suavemente

---

## ⚙️ JavaScript propuesto (script/derecha.js)

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
      console.error('❌ No se encontró la sección "derecha" en data.json');
      return null;
    }
    
    dataDerecha = data.derecha;
    return dataDerecha;
  } catch (error) {
    console.error('❌ Error cargando datos de la sección derecha:', error);
    return null;
  }
}

/**
 * Genera una tabla de precios
 */
function generarTablaPrecios(datos) {
  if (!datos || !datos.opciones || !Array.isArray(datos.opciones)) {
    console.warn('⚠️ Datos de precios inválidos:', datos);
    return '';
  }
  
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
  if (!datos || !datos.tipos || !Array.isArray(datos.tipos)) {
    console.warn('⚠️ Datos de tipos de masaje inválidos:', datos);
    return '';
  }
  
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
  if (!contenedor) {
    console.warn('⚠️ No se encontró el contenedor de masajes');
    return;
  }
  
  // Detectar si es móvil o desktop
  const esMobile = window.innerWidth < 768;
  
  if (esMobile) {
    // Móvil: toggle con click
    contenedor.addEventListener('click', () => {
      contenedor.classList.toggle('expandido');
    });
  } else {
    // Desktop: hover
    contenedor.addEventListener('mouseenter', () => {
      contenedor.classList.add('expandido');
    });
    
    contenedor.addEventListener('mouseleave', () => {
      contenedor.classList.remove('expandido');
    });
  }
}

/**
 * Reconfigura la interactividad al cambiar el tamaño de ventana
 */
function reconfigurarInteractividad() {
  const contenedor = document.getElementById('contenedorMasajes');
  if (!contenedor) return;
  
  // Limpiar eventos anteriores
  const nuevoContenedor = contenedor.cloneNode(true);
  contenedor.parentNode.replaceChild(nuevoContenedor, contenedor);
  
  // Reconfigurar
  configurarInteractividad();
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
    console.error('❌ No se pudieron cargar los datos de la sección derecha');
    return;
  }
  
  // Actualizar imagen de fondo
  const imagenDiv = document.querySelector('.der_imagen');
  if (imagenDiv && dataDerecha.imagen) {
    imagenDiv.style.backgroundImage = `url("${dataDerecha.imagen}")`;
  } else {
    console.warn('⚠️ No se pudo actualizar la imagen de fondo');
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
    // ORDEN CORRECTO: poeta cabanyes primero, domicilio después
    const tablaPoeta = generarTablaPrecios(dataDerecha.precios.poetaCabanyes);
    const tablaDomicilio = generarTablaPrecios(dataDerecha.precios.domicilio);
    
    preciosDiv.innerHTML = tablaPoeta + tablaDomicilio;
  } else {
    console.warn('⚠️ No se pudieron generar las tablas de precios');
  }
  
  // Generar tipos de masaje
  const tiposDiv = document.querySelector('.der_tipos_lista');
  if (tiposDiv && dataDerecha.tiposMasaje) {
    tiposDiv.innerHTML = generarTiposMasaje(dataDerecha.tiposMasaje);
  } else {
    console.warn('⚠️ No se pudieron generar los tipos de masaje');
  }
  
  // Configurar interactividad
  configurarInteractividad();
  
  // Reconfigurar al cambiar tamaño de ventana
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(reconfigurarInteractividad, 250);
  });
}

// Exportar para compatibilidad
export { dataDerecha };
```

**Características del JavaScript:**

1. **Validaciones completas**: Verifica que existan todos los datos antes de usarlos
2. **Orden correcto**: poeta cabanyes siempre primero
3. **Interactividad responsive**: Click en móvil, hover en desktop
4. **Reconfigura al resize**: Si cambias el tamaño de la ventana, ajusta el comportamiento
5. **Mensajes de error claros**: Con emojis para fácil identificación
6. **Código modular**: Funciones separadas y bien comentadas

---

## 🎯 Diferencias clave con la propuesta anterior

| Aspecto | Propuesta anterior | Propuesta actualizada |
|---------|-------------------|----------------------|
| **Colores en data.json** | Configurables | Eliminados (hardcoded) |
| **Posicionamiento desktop** | Derecha | Abajo a la derecha |
| **Posicionamiento móvil** | 20dvw, 60dvh | 20dvw, 60dvh (confirmado) |
| **Orden de precios** | Ambiguo | Siempre poeta cabanyes primero |
| **Transiciones** | Estándar (0.4s) | Muy suaves (0.6s cubic-bezier) |
| **Márgenes desktop** | 2dvw, 2dvh | 3dvw, 3dvh (aumentados) |
| **Animación tipos** | Simple opacity | Opacity + translateY (emerge) |
| **Scrollbar** | Default | Personalizada (bonita) |

---

## ✅ Checklist de implementación

### Preparación
- [ ] Hacer backup del código actual
- [ ] Revisar que tienes todos los archivos necesarios

### data.json
- [ ] Actualizar estructura de la sección derecha
- [ ] Eliminar objeto `colores`
- [ ] Eliminar campo `imagen.alt`
- [ ] Añadir estructura de dos tablas de precios
- [ ] Añadir tipos de masaje con descripciones
- [ ] Verificar que el JSON es válido

### HTML
- [ ] Actualizar `paginas/derecha.html` con nueva estructura
- [ ] Eliminar etiqueta `<body>`
- [ ] Verificar IDs correctos

### CSS
- [ ] Añadir nuevos estilos a `style.css`
- [ ] Verificar que no hay conflictos con estilos existentes
- [ ] Probar transiciones en navegador

### JavaScript
- [ ] Reescribir `script/derecha.js` completamente
- [ ] Verificar que se importa correctamente desde `script.js`
- [ ] Probar en consola del navegador

### Testing
- [ ] Probar en desktop (Chrome, Firefox, Safari)
- [ ] Probar hover en desktop
- [ ] Probar en móvil (o con DevTools)
- [ ] Probar click en móvil
- [ ] Verificar transiciones suaves
- [ ] Verificar orden de precios
- [ ] Verificar responsive (cambiar tamaño de ventana)
- [ ] Verificar que todo es editable desde data.json

### Refinamiento
- [ ] Ajustar márgenes si es necesario
- [ ] Ajustar tamaños de fuente si es necesario
- [ ] Ajustar velocidad de transiciones si es necesario

---

## 💡 Notas finales

**Sobre las transiciones:**

He usado `cubic-bezier(0.4, 0, 0.2, 1)` que es la curva "ease-out" de Material Design. Es muy suave y natural. Si quieres que sea aún más suave, puedes cambiar a:

```css
transition: max-height 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
```

**Sobre los márgenes:**

He aumentado los márgenes en desktop a 3dvw y 3dvh para que el bloque no esté pegado al borde. Si quieres más separación, puedes aumentarlos más.

**Sobre el scroll:**

He añadido una scrollbar personalizada bonita. Si prefieres la scrollbar por defecto del navegador, simplemente elimina las reglas `.der_contenedor::-webkit-scrollbar-*`.

**Sobre la animación de "emerge":**

Los tipos de masaje tienen una animación de `translateY(10px)` que hace que "emerjan" desde abajo cuando se expande el contenedor. Si quieres que sea más dramático, aumenta el valor (ej: `translateY(20px)`).

---

**Fin de la propuesta actualizada** - 22 de enero de 2026, 06:30h GMT+1

