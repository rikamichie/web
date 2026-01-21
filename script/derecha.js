// Vista de derecha - Información de servicios
// Carga configuración desde data.json

let dataDerecha = null;

/**
 * Carga los datos de la sección derecha desde data.json
 */
async function loadDerechaData() {
  try {
    const response = await fetch('./data.json');
    if (!response.ok) throw new Error('Error al cargar data.json');
    const data = await response.json();
    dataDerecha = data.derecha;
    return dataDerecha;
  } catch (error) {
    console.error('Error cargando datos de la sección derecha:', error);
    return null;
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
  const imgDiv = document.querySelector('.der_1_img');
  if (imgDiv) {
    imgDiv.style.backgroundImage = `url("${dataDerecha.imagen.url}")`;
  }

  // Actualizar link principal
  const linkPrincipal = document.querySelector('.der_1_img a');
  if (linkPrincipal) {
    linkPrincipal.textContent = dataDerecha.contenido.linkPrincipal.texto;
    linkPrincipal.href = dataDerecha.contenido.linkPrincipal.url;
  }

  // Actualizar tipos de servicio
  const tiposDiv = document.querySelector('.der_tipos');
  if (tiposDiv && dataDerecha.contenido.tipos) {
    tiposDiv.innerHTML = dataDerecha.contenido.tipos
      .map(tipo => `<p>${tipo}</p>`)
      .join('');
  }

  // Actualizar precio
  const precioDiv = document.querySelector('.der_1_texto p');
  if (precioDiv) {
    precioDiv.textContent = dataDerecha.contenido.precio;
  }

  // Aplicar colores personalizados
  const celdaDerecha = document.querySelector('.celda.derecha');
  if (celdaDerecha) {
    celdaDerecha.style.setProperty('--theme-color', dataDerecha.colores.themeColor);
    celdaDerecha.style.setProperty('--btn-color', dataDerecha.colores.btnColor);
  }

  const textoDiv = document.querySelector('.der_1_texto');
  if (textoDiv) {
    textoDiv.style.color = dataDerecha.colores.textoColor;
    textoDiv.style.backgroundColor = dataDerecha.colores.fondoTexto;
  }
}

// Exportar para compatibilidad
export { dataDerecha };
