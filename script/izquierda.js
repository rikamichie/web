// Vista de izquierda - Texto introductorio
// Carga configuración desde data.json

import { getSeccion } from './data.js';

let dataIzquierda = null;

/**
 * Genera la vista de la sección izquierda
 */
export async function generarVistaIzquierda() {
  // Cargar datos si aún no están disponibles
  if (!dataIzquierda) {
    dataIzquierda = await getSeccion('izquierda');
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
  
  // Los colores ahora están definidos directamente en el CSS
}

// Exportar para compatibilidad
export { dataIzquierda };
