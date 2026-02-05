// ============================================
// VISTA DE DERECHA - INFORMACIÓN DE MASAJES
// ============================================

import { getSeccion } from './data.js';

let dataDerecha = null;
let eventListenersAdded = false; // Flag para evitar duplicar listeners

/**
 * Genera una tabla de precios
 */
function generarTablaPrecios(datos) {
  if (!datos || !datos.opciones || !Array.isArray(datos.opciones)) {
    console.warn("⚠️ Datos de precios inválidos:", datos);
    return "";
  }
  
  const items = datos.opciones
    .map(opcion => `
      <div class="der_precio_item">
        <span class="der_precio_texto">${opcion.duracion}: ${opcion.precio}</span>
      </div>
    `)
    .join("");
  
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
    console.warn("⚠️ Datos de tipos de masaje inválidos:", datos);
    return "";
  }
  
  const tipos = datos.tipos
    .map(tipo => {
      const descripcion = tipo.descripcion
        ? `<span class="der_tipo_descripcion">${tipo.descripcion}</span>`
        : "";
      const nombre = tipo.descripcion ? `${tipo.nombre}:` : tipo.nombre;
      return `
        <div class="der_tipo_item">
          <span class="der_tipo_nombre">${nombre}</span>${descripcion}
        </div>
      `;
    })
    .join("");
  
  return tipos;
}

/**
 * Configura la interactividad del contenedor (solo se ejecuta una vez)
 */
function configurarInteractividad() {
  // Si ya se añadieron los listeners, no hacer nada
  if (eventListenersAdded) {
    return;
  }
  
  const contenedor = document.getElementById("contenedorMasajes");
  if (!contenedor) {
    console.warn("⚠️ No se encontró el contenedor de masajes");
    return;
  }
  
  const bloque = contenedor.closest(".der_bloque");
  
  // Función para expandir/contraer
  function toggleExpansion() {
    contenedor.classList.toggle("expandido");
    if (bloque) {
      bloque.classList.toggle("expandido");
    }
  }
  
  // Detectar si es móvil o desktop
  function checkDevice() {
    return window.innerWidth < 768;
  }
  
  // Móvil: click para toggle
  contenedor.addEventListener("click", (e) => {
    if (checkDevice()) {
      toggleExpansion();
    }
  });
  
  // Desktop: hover para expandir/contraer
  contenedor.addEventListener("mouseenter", () => {
    if (!checkDevice()) {
      contenedor.classList.add("expandido");
      if (bloque) {
        bloque.classList.add("expandido");
      }
    }
  });
  
  contenedor.addEventListener("mouseleave", () => {
    if (!checkDevice()) {
      contenedor.classList.remove("expandido");
      if (bloque) {
        bloque.classList.remove("expandido");
      }
    }
  });
  
  // Marcar que ya se añadieron los listeners
  eventListenersAdded = true;
  
  console.log("✅ Interactividad configurada");
}

/**
 * Genera la vista de la sección derecha
 */
export async function generarVistaDerecha() {
  // Cargar datos si aún no están disponibles
  if (!dataDerecha) {
    dataDerecha = await getSeccion('derecha');
  }
  
  if (!dataDerecha) {
    console.error("❌ No se pudieron cargar los datos de la sección derecha");
    return;
  }
  
  // Actualizar imagen de fondo
  const imagenDiv = document.querySelector(".der_imagen");
  if (imagenDiv && dataDerecha.imagen) {
    imagenDiv.style.backgroundImage = `url("${dataDerecha.imagen}")`;
  } else {
    console.warn("⚠️ No se pudo actualizar la imagen de fondo");
  }
  
  // Actualizar título
  const tituloLink = document.getElementById("tituloMasajes");
  if (tituloLink && dataDerecha.titulo) {
    tituloLink.textContent = dataDerecha.titulo.texto;
    tituloLink.href = dataDerecha.titulo.url;
  }
  
  // Generar tablas de precios
  const preciosDiv = document.getElementById("preciosMasajes");
  if (preciosDiv && dataDerecha.precios) {
    // ORDEN CORRECTO: poeta cabanyes primero, domicilio después
    const tablaPoeta = generarTablaPrecios(dataDerecha.precios.poetaCabanyes);
    const tablaDomicilio = generarTablaPrecios(dataDerecha.precios.domicilio);
    
    preciosDiv.innerHTML = tablaPoeta + tablaDomicilio;
  } else {
    console.warn("⚠️ No se pudieron generar las tablas de precios");
  }
  
  // Generar tipos de masaje
  const tiposDiv = document.querySelector(".der_tipos_lista");
  if (tiposDiv && dataDerecha.tiposMasaje) {
    tiposDiv.innerHTML = generarTiposMasaje(dataDerecha.tiposMasaje);
  } else {
    console.warn("⚠️ No se pudieron generar los tipos de masaje");
  }
  
  // Configurar interactividad (solo una vez)
  configurarInteractividad();
  
  console.log("✅ Vista de derecha generada");
}

// Exportar para compatibilidad
export { dataDerecha };
