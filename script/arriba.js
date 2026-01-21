// Vista de arriba - Timeline de eventos
// Carga configuración desde data.json

let itemsArriba = [];

/**
 * Carga los datos de la timeline desde data.json
 */
async function loadTimelineData() {
  try {
    const response = await fetch('./data.json');
    if (!response.ok) throw new Error('Error al cargar data.json');
    const data = await response.json();
    itemsArriba = data.arriba.links;
    return itemsArriba;
  } catch (error) {
    console.error('Error cargando datos de la timeline:', error);
    return [];
  }
}

/**
 * Genera la vista de la timeline con los eventos
 */
export async function generarVistaArriba() {
  const timelineDiv = document.querySelector(".arriba-timeline");
  if (!timelineDiv) {
    console.error('Elemento .arriba-timeline no encontrado');
    return;
  }

  // Cargar datos si aún no están disponibles
  if (itemsArriba.length === 0) {
    await loadTimelineData();
  }

  // Limpiar contenido previo
  timelineDiv.innerHTML = '';

  // Ordenar por fecha (más reciente primero)
  const eventosOrdenados = itemsArriba
    .slice()
    .sort((a, b) => b.fecha.localeCompare(a.fecha));

  // Generar elementos de eventos
  eventosOrdenados.forEach(item => {
    const evento = document.createElement("div");
    evento.className = "evento";
    evento.innerHTML = `
      <sup>${item.fecha}</sup> 
      <a href="${item.link}" target="_blank">${item.titulo}</a>
    `;
    timelineDiv.appendChild(evento);
  });
}

// Exportar para compatibilidad
export { itemsArriba };
