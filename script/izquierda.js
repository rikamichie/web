// Vista de izquierda - Texto introductorio
// Carga configuración desde data.json

let dataIzquierda = null;

/**
 * Carga los datos de la sección izquierda desde data.json
 */
async function loadIzquierdaData() {
  try {
    const response = await fetch('./data.json');
    if (!response.ok) throw new Error('Error al cargar data.json');
    const data = await response.json();
    dataIzquierda = data.izquierda;
    return dataIzquierda;
  } catch (error) {
    console.error('Error cargando datos de la sección izquierda:', error);
    return null;
  }
}

/**
 * Genera la vista de la sección izquierda
 */
export async function generarVistaIzquierda() {
  // Cargar datos si aún no están disponibles
  if (!dataIzquierda) {
    await loadIzquierdaData();
  }

  if (!dataIzquierda) {
    console.error('No se pudieron cargar los datos de la sección izquierda');
    return;
  }

  // Actualizar texto introductorio
  const izq1Div = document.querySelector('.izq_1');
  if (izq1Div && dataIzquierda.texto) {
    const parrafos = Object.values(dataIzquierda.texto);
    izq1Div.innerHTML = parrafos
      .map(texto => `<p>${texto}</p>`)
      .join('');
  }

  // Aplicar colores personalizados
  const celdaIzquierda = document.querySelector('.celda.izquierda');
  if (celdaIzquierda && dataIzquierda.colores) {
    celdaIzquierda.style.setProperty('--bg-color', dataIzquierda.colores.bgColor);
    celdaIzquierda.style.setProperty('--text-color', dataIzquierda.colores.textColor);
    celdaIzquierda.style.setProperty('--theme-color', dataIzquierda.colores.themeColor);
    celdaIzquierda.style.setProperty('--text2-color', dataIzquierda.colores.text2Color);
    celdaIzquierda.style.setProperty('--btn-color', dataIzquierda.colores.btnColor);
  }
}

// Exportar para compatibilidad
export { dataIzquierda };
